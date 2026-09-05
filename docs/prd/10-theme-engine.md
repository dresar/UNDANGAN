# 10 — Theme Engine & AI Theme Generator

Theme = identitas visual; Template = struktur pengalaman (dokumen 11 §6 singgung; template detail di sini §7). Theme **bukan** kode CSS bebas — theme adalah *structured theme definition* (design token + aturan) yang divalidasi Theme Validator dan dikonsumsi renderer melalui design-token contract.

---

## 1. Prinsip theme system

1. **Theme mendefinisikan nilai, bukan implementasi.** Komponen satu kode dipakai semua theme; theme mengubah tampilan lewat token & aturan styling yang dikonsumsi kontrak komponen.
2. **Menambah theme baru tidak boleh menyentuh kode komponen inti.** Ini acceptance criteria tetap (dokumen 23).
3. **Theme berversi** (`theme_versions`, immutable per versi) dengan `compatibility` eksplisit terhadap renderer & komponen.
4. **AI theme generator menghasilkan structured definition, bukan source code bebas.**

## 2. Anatomi Theme Definition

Kategori konten `definition JSONB` (ilustrasi logis):

| Blok | Isi (contoh) |
|---|---|
| `palette` | skema warna lengkap: primary, secondary, accent, surface levels (1–4), text (on-surface), border, overlay, mode terang/gelap (bila didukung), warna status |
| `typography` | pairing font (display + body + aksen), skala ukuran, ketebalan, letter-spacing, line-height, sumber font (self-host wajib, lisensi tercatat) |
| `spacing & layout` | spacing scale, container width, section padding scale, grid rules |
| `shape` | border-radius rules (tombol, kartu, input, foto), ring/border style |
| `elevation` | shadow levels (0–3), kapan dipakai |
| `imagery` | image treatment (radius, rasio aspek preferensi, filter ringan, overlay treatment, hover), placeholder style |
| `decoration` | elemen dekoratif (ornameen, divider, frame, tekstur background) — referensi asset registry atau dekorasi prosedural (SVG parametrik) |
| `background` | surface halaman (warna/gradasi halus/tekstur), aturan per section kind |
| `buttons` | gaya default tombol (solid/outline/ghost), padding, radius, efek hover/focus |
| `cards` | style kartu (info acara, galeri, guestbook) |
| `forms` | style input RSVP/guestbook, error & focus state |
| `icons` | gaya ikon (garis/solid/warna), set yang dipakai |
| `music` | gaya tombol musik mengambang |
| `animation` | **personality animasi**: kurva easing, durasi dasar, arah reveal, intensitas default, efek dekoratif (parallax ringan, shimmer halus), aturan mobile-safe |
| `interaction` | hover/tap feedback, focus-visible, aturan transisi |
| `hierarchy` | bobot visual judul vs body, aturan whitespace, max lebar teks |
| `mobile` | penyesuaian khusus mobile (ukuran font min, padding, dekorasi yang disederhanakan) |
| `accessibility` | kontras minimum yang dijanjikan, aturan ukuran font minimum, requirement alt pattern |
| `componentStyles` | **override terbatas per section-type** hanya pada slot yang kontrak komponen sediakan (mis. `hero.overlayOpacity`) |
| `metadata` | mood/tags (elegan, garden, cinematic, luxury, tradisional-modern), rekomendasi penggunaan, preview assets |

Setiap token punya nama baku dari **Design Token Contract** (kamus token resmi, satu sumber kebenaran lintas komponen). Theme Validator menolak token di luar kontrak (mencegah komponen diam-diam bergantung pada token tak resmi).

## 3. Lifecycle theme

```
draft → testing (validator + render uji + visual regression) → staging
      → published (tersedia di picker user) → deprecated (masih dirender utk undangan terpin)
      → archived (tidak bisa dipilih baru; undangan lama tetap aman via pin)
```

- Publikasi theme = aksi admin/AI-pipeline dengan risk level sedang (review manusia default, bisa diotomatisasi untuk perubahan minor bila seluruh gerbang lolos — dokumen 13 §9).
- Setiap versi menyimpan `validation_report` (hasil validator saat itu) + `origin` (manusia / ai task).
- Deprekasi tidak pernah merusak undangan published (version pinning — dokumen 09 §5).

## 4. Theme Validator (gerbang wajib)

Urutan pemeriksaan:

1. **Schema** — definition sesuai Zod schema theme; semua token dikenal kontrak.
2. **Kelengkapan kontras** — semua pasangan foreground/background memenuhi WCAG AA (teks normal ≥ 4.5:1, teks besar ≥ 3:1; tombol/interaktif ≥ 3:1 untuk non-teks). Laporan per pasangan yang gagal.
3. **Tipografi** — font terdaftar di asset registry, self-host, lisensi tercatat, file woff2 tersedia; skala memenuhi ukuran minimum mobile.
4. **Kompatibilitas komponen** — `componentStyles` hanya menyentuh slot kontrak komponen `supported_components`; tidak ada referensi komponen tak ada.
5. **Animation safety** — durasi/easing dalam rentang aman; tidak ada animasi layout-thrashing (properti terbatas: opacity/transform); parallax & efek berat otomatis dinonaktifkan pada mobile/reduced-motion; tidak ada autoplay berkedip cepat (aksesibilitas fotosensitif).
6. **Render uji** — theme dirender pada template sampel semua section inti; tidak boleh ada error render (placeholder kecil dianggap gagal untuk tema baru).
7. **Visual regression** — screenshot basis disimpan sebagai golden untuk theme tsb.

Hasil: `validation_report` + `quality_score` (0–100 komposit: kontras, konsistensi, kompleksitas asset, ukuran font tambahan, dsb.). Skor di bawah ambang tidak dapat published.

## 5. Hubungan theme ↔ template ↔ komponen

- **Template** (struktur): urutan & konfigurasi awal section (`structure JSONB`) — mis. "cinematic" (opening dramatis → hero layar penuh → story → …), "editorial" (grid majalah), "classic", "romantic", "minimal", "story-driven".
- **Compatibility rules** pada template: daftar theme `mood/category` yang cocok & daftar section-type wajib/opsional; theme pula menyatakan section yang didukung penuh.
- Picker user hanya menampilkan kombinasi valid; saran AI juga dibatasi kombinasi valid.
- Template tidak menentukan warna; theme tidak menentukan urutan. Campuran keduanya + data user = undangan.

## 6. AI Theme Generator (pipeline)

Permintaan bahasa alami ("buat tema elegan putih-emas nuansa editorial modern") → proses:

```
[1] Parsing intent → atribut terstruktur (mood, palet arah, tipografi arah, personality animasi)
[2] Prompt disusun dari Prompt Engineering Engine (dokumen §8) + konteks kontrak token
[3] AI Gateway → provider (Gemini) → structured output = kandidat theme definition (Zod: themeDraftSchema)
[4] Theme Validator (§4) — feedback error dikirim balik ke AI utk perbaikan (loop ≤ N, N kecil)
[5] Lolos → theme draft tersimpan (status: draft) + preview dirender pada template sampel
[6] User melihat preview + penjelasan (mood, saran pemakaian) → Terima (jadi theme pribadi undangan)
    / Tolak / Minta variasi (loop ulang dengan feedback)
[7] Admin dapat mempromosikan theme user pilihan menjadi katalog publik (pipeline §3, dengan review)
```

Kendali biaya & kualitas: cache berdasarkan checksum input; kuota per akun; hasil yang sering ditolak dipelajari maintenance loop untuk memperbaiki skill `theme-generation`.

## 7. Asset visual theme & Prompt Engineering Engine

- Kebutuhan dekorasi/tekstur dapat dipenuhi: (a) **dekorasi prosedural parametrik** (SVG generatif internal — tanpa biaya, tanpa lisensi masalah) — jalur default; (b) **asset hasil generator gambar eksternal** via pipeline asset (fase 3+): prompt dibangun dari style system theme agar konsisten; spesifikasi transparent/WebP, dimensi, penamaan, metadata, versi; review kualitas (manusia di awal, heuristik otomatis: ukuran, rasio, alpha coverage); background removal bila perlu.
- Semua asset masuk `media_assets` (source=ai_generated) dan terkait ke theme_version — dapat digunakan ulang, tidak digenerate dua kali untuk kebutuhan sama (cache by prompt-hash).
- Anti-pemboroskan: generasi asset hanya bila theme benar-benar dipakai/dipromosikan; asset uji dibersihkan bila tema ditolak (cleanup job).

## 8. Design Token Contract (kamus bersama)

- Satu file kontrak (TS types + Zod) mendefinisikan seluruh token resmi + slot styling komponen; renderer mengekspor token → CSS variables pada root render context.
- Komponen hanya membaca CSS variables/slot — dilarang hardcode warna/angka styling di komponen (ditegakkan lint khusus renderer).
- Perubahan kontrak = perubahan renderer-version + ADR + cek kompatibilitas semua theme published (job konsistensi).
