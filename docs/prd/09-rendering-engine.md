# 09 — Rendering Engine: JSON-Driven Configuration & Component Registry

Renderer adalah jantung produk: mengubah *dokumen undangan JSON* + *theme* + *component registry* menjadi halaman web publik. Prinsip: **JSON tanpa schema adalah dosa** — setiap dokumen divalidasi sebelum disimpan dan sebelum dirender; render gagal validasi → fallback aman, bukan crash.

---

## 1. Bentuk dokumen undangan (Invitation Document JSON)

Ilustrasi logis (bukan kode final; bentuk persis ditetapkan Zod schema v1 pada fase implementasi):

```jsonc
{
  "schemaVersion": 1,
  "meta": {
    "title": "Pernikahan Dinda & Bima",
    "language": "id",
    "timezone": "Asia/Jakarta",
    "seo": { "description": "...", "ogImageMediaId": "..." }
  },
  "couple": {
    "partnerA": { "nickname": "Dinda", "fullName": "...", "parents": "...", "photoMediaId": "..." },
    "partnerB": { "...": "..." }
  },
  "experience": {
    "opening": { "enabled": true, "guestGreeting": true, "musicAutoplayHint": true },
    "sections": [
      {
        "id": "sec-hero-1",            // id stabil utk diff & binding
        "type": "hero",                 // harus terdaftar di component registry
        "variant": "split-photo",       // variant komponen
        "data": { /* konten sesuai content_schema komponen */ },
        "settings": { /* opsional: override terbatas sesuai props_schema */ },
        "animation": { "preset": "elegant", "intensity": "medium" },
        "responsive": { "mobile": { "variant": "stacked" } },
        "visibility": { "from": "2026-08-01" }
      },
      { "type": "countdown", "data": { "targetEventId": "evt-akad" } },
      { "type": "gallery", "variant": "grid", "data": { "mediaIds": ["..."] } }
    ],
    "closing": { "message": "...", "signature": "Dinda & Bima" }
  },
  "events": [ { "id": "evt-akad", "kind": "akad", "startsAt": "...", "venue": "..." } ],
  "features": { "rsvp": true, "guestbook": true, "gift": { "mode": "rekening" }, "music": { "trackMediaId": "..." } },
  "styling": { "themeVersionId": "...", "tokenOverrides": { "color.primary": "#..." } }  // override terbatas & tervalidasi
}
```

Aturan bentuk:

1. `schemaVersion` wajib; migrasi dokumen lama lewat transformer (§6).
2. Setiap section: `id` stabil (untuk diff AI, binding analytics, urutan), `type` terdaftar di registry, `variant` + `data` + `settings` divalidasi terhadap schema versi komponen yang dipin.
3. `data` hanya **konten & referensi** (mediaIds, eventIds) — bukan markup, bukan kode, bukan gaya bebas.
4. Override gaya (`tokenOverrides`) hanya pada token yang theme izinkan (whitelist); tidak ada CSS bebas dari sisi dokumen.
5. Dokumen **tidak menyimpan** data yang berubah cepat (RSVP/guestbook) — renderer mengambil terpisah agar snapshot published tetap immutable.

## 2. Arsitektur renderer

```
                     ┌──────────────────────────────────────────────┐
 request /w/:slug ──>│ Public Render Pipeline                       │
                     │ 1. resolve slug → invitation + published ver │
                     │ 2. load snapshot (document + theme def +     │
                     │    component pins) — cacheable bundle        │
                     │ 3. compatibility gate (§4)                   │
                     │ 4. validate document (Zod, sesuai schemaVer) │
                     │ 5. resolve component implementations         │
                     │    dari registry (versi terpin)              │
                     │ 6. SSR: JSON → React tree per section        │
                     │ 7. hydrate ringan: observer animasi,         │
                     │    countdown, music, form RSVP               │
                     │ 8. emit metadata SEO/OG + JSON-LD Event      │
                     └──────────────────────────────────────────────┘
```

- **Deterministik & pure**: input sama → output sama (memudahkan cache edge, visual regression, dan preview = production).
- **Isolasi**: paket `renderer/` tidak mengimpor dashboard/editor (dokumen 05).
- **Gagal-aman**: section yang gagal validasi saat render dirender sebagai placeholder aman (atau dilewati) + telemetri error — halaman tetap tampil.
- **Preview & production memakai pipeline sama**; hanya sumber data berbeda (draft vs snapshot) sehingga "preview seperti aslinya" terjamin.

## 3. Component registry & resolusi

- Registry = daftar `component_versions` published dengan `implementation_ref` (entry bundel) + `props_schema` + `content_schema` + `variants` + `compatibility`.
- Renderer me-resolve `type + variant` → implementasi; fallback: variant default bila variant tak dikenal.
- Komponen menerima props hasil merge: `data` (konten) + `resolved tokens` (dari theme) + `animation config` + `responsive config`. Komponen **tidak** mengambil data sendiri (kecuali widget interaktif seperti RSVP yang fetch terkontrol).
- Detail lifecycle & pipeline publikasi komponen: dokumen 11.

## 4. Compatibility gate

Sebelum render, sistem memeriksa matriks versi:

| Cek | Sumber | Bila gagal |
|---|---|---|
| `schemaVersion` dokumen vs renderer | dokumen | jalankan migration transformer (§6) |
| theme_version vs renderer & komponen | theme_versions.compatibility | coba theme versi kompatibel terdekat; jika mustahil → theme fallback bawaan + alert |
| component_pins vs implementasi tersedia | invitation_versions.component_pins | pakai versi terpin yang masih ada; jika hilang → placeholder aman + alert |
| template_version (bila ada) | template_versions.compatibility | sama seperti theme |

Aturan emas: **halaman tamu tidak pernah putih/crash** — selalu ada strategi degradasi, dan setiap degradasi menghasilkan event `rendering_error` untuk observabilitas.

## 5. Version pinning saat publish

Saat user menekan Publish:

1. Dokumen draft divalidasi penuh (schema + tema + komponen + media tersedia + kontras aksesibilitas dasar).
2. Sistem **mem-pin** versi: theme_version_id, daftar component_versions, schemaVersion → disalin ke `invitation_versions.component_pins`.
3. Snapshot immutable tersimpan; `current_published_version_id` dipindah (atomik).
4. Cache edge di-invalidasi berdasarkan versi baru.

Akibat: upgrade theme/komponen di platform **tidak** mengubah undangan published secara mendadak; undangan lama tetap dirender dengan versi terpin sampai pemilik memilih "perbarui tampilan" (dengan diff pratinjau). Ini melindungi kepercayaan pengguna terhadap stabilitas undangan yang sudah disebar.

## 6. Strategi migrasi schema dokumen

- Setiap breaking change schema → bump `schemaVersion` + sediakan **migration transformer** `v(n) → v(n+1)` (fungsi murni + unit test golden samples).
- Rantai transformer dapat dijalankan bertingkat (v1→v2→v3).
- Kapan transformasi dijalankan: (a) saat publish baru (selalu ke versi terbaru), (b) lazy saat render untuk dokumen lama bila diperlukan, dengan hasil di-cache (bukan ditulis balik ke snapshot immutable).
- Setiap transformer punya tabel pemetaan "fitur lama → fitru baru" dan fallback default yang aman.
- Kompabilitas diuji CI: corpus dokumen uji lintas versi dirender otomatis setiap perubahan renderer (dokumen 21 §6).

## 7. Performa & caching render

- SSR + cache edge ber-per-versi (key: slug + version id) — tamu berikutnya langsung dari CDN.
- Image: hanya referensi `mediaId` → resolver menghasilkan `srcset` multi-lebar (variants) + lazy loading + `fetchpriority` untuk hero.
- Code splitting per komponen registry (dynamic import), hydrasi minimal (animasi via IntersectionObserver, bukan JS penuh).
- Anggaran ketat halaman publik (dokumen 17): JS pihak pertama ≤ 90 kB gz untuk halaman standar (di luar foto/video embed).
- Music/video: preload none sampai interaksi; tombol musik mengambang tidak menghalangi konten.

## 8. SEO & berbagi

- SSR menghasilkan meta lengkap: title, description, canonical, OG image (variant `og` dari media), Twitter card, JSON-LD `Event` + `Person` opsional.
- URL tamu personal (`?to=...`) tidak membuat duplikat SEO (canonical ke slug bersih).
- Sitemap publik per undangan aktif (opsional per user, default on) + robots yang benar untuk preview vs published.

## 9. Widget interaktif di halaman publik

RSVP, guestbook, dan gift adalah "server-aware sections": render awal SSR ringan, lalu fetch data kecil ke endpoint publik terbatas (rate-limited, anti-spam — dokumen 16 §7). Endpoint publik tidak pernah mengekspos data privat; jawaban RSVP tamu lain tidak ditampilkan tanpa izin owner.
