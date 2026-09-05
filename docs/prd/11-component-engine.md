# 11 — Component Engine: Registry, Variant, & Pipeline Generasi

Komponen adalah blok bangunan pengalaman undangan. Registry mengelola definisi + implementasi + versi + lifecycle. Pipeline generasi (manusia atau AI) sama-sama melewati gerbang mutu — komponen baru tidak pernah langsung tersedia ke semua pengguna.

---

## 1. Daftar komponen inti (section types) — katalog awal

| Type | Tanggung jawab | Variant contoh | Fase |
|---|---|---|---|
| `opening` | Cover pembuka + sapaan tamu + tombol buka | `classic-cover`, `envelope`, `curtain` | 1 |
| `hero` | Identitas pasangan layar pembuka | `split-photo`, `full-bleed`, `editorial-type` | 1 |
| `quote` | Kutipan/ayat/ucapan pembuka | `centered`, `aside` | 1 |
| `couple` | Profil kedua mempelai + orang tua | `side-by-side`, `stacked` | 1 |
| `story` | Timeline kisah | `timeline-v`, `timeline-alternate`, `chapters` | 1 |
| `event-info` | Detail acara (akad/resepsi) + tombol peta | `cards`, `list`, `editorial` | 1 |
| `countdown` | Hitung mundur | `pill`, `typographic`, `flip` | 1 |
| `gallery` | Galeri foto | `grid`, `masonry`, `carousel`, `polaroid` | 1 |
| `map` | Peta lokasi + petunjuk arah | `embed`, `static-plus-link` | 1 |
| `rsvp-form` | Form kehadiran | `compact`, `stepped` | 1 |
| `guestbook` | Ucapan tamu | `list`, `cards` | 2 |
| `gift` | Info kado digital | `account-cards`, `discreet`, `link-out` | 2 |
| `music-control` | Tombol musik mengambang | `disc`, `minimal` | 2 |
| `video` | Embed video ringan | `inline`, `lightbox` | 2 |
| `closing` | Penutup & terima kasih | `centered`, `signature` | 1 |
| `divider` | Pemisah dekoratif | `ornament`, `line`, `floral` | 1 |
| `message` | Blok teks bebas terformat terbatas | `plain`, `letter` | 1 |
| `dresscode`/`addons` | Lain-lain (fase lanjut) | — | 3+ |

Semua komponen wajib: mobile-first, reduced-motion aware, membaca token theme (dilarang hardcode style), mendukung skeleton/placeholder data kosong, dan bisa dirender SSR.

## 2. Kontrak komponen (apa yang membuat komponen "terdaftar")

Setiap `component_versions` menyimpan:

1. **props_schema** (JSON Schema/Zod): input presentasional yang boleh diatur dokumen (`settings`) — mis. `overlayOpacity`, `align`.
2. **content_schema**: bentuk konten (`data`) — teks, mediaIds, eventIds.
3. **variants**: daftar variant + deskripsi + default props per variant.
4. **animation_contracts**: animasi apa yang dikonsumsi dari theme (reveal, stagger, parallax level) — komponen mendeklarasikan, bukan mengarang sendiri efek bebas.
5. **responsive_rules**: perilaku per breakpoint, variant mobile bila ada.
6. **accessibility_notes**: semantik, peran, fokus, alt pattern yang diharapkan.
7. **dependency_requirements**: font/asset kontrak yang dibutuhkan dari theme (mis. `decoration.frame` opsional).
8. **implementation_ref**: entry bundel renderer (dynamic import).
9. **compatibility**: rentang renderer & kontrak token yang didukung.
10. **preview requirement**: fixture data untuk preview & visual test (wajib disertakan saat mendaftar).

## 3. Lifecycle registry

```
draft → testing (CI: typecheck, lint, unit, render test, a11y test, visual)
      → staging (preview internal; dipakai template eksperimental)
      → published (dapat dipakai dokumen baru; versi terpin undangan lama tetap aman)
      → deprecated (tidak bisa dipilih baru; existing render tetap jalan; migrasi disarankan)
      → archived (implementasi dihapus hanya setelah 0 undangan published memakai versi tsb)
```

- Versi mengikuti **semver**: patch = perbaikan tanpa perubahan kontrak; minor = variant/props baru (backward compatible); major = breaking kontrak (butuh migrasi dokumen → transformer).
- Variant baru tidak boleh merusak variant lama — divergence dicegah lewat visual regression seluruh varian terdaftar (dokumen 21 §6).
- Reusable props & composition mencegah duplikasi: variant = konfigurasi, bukan salinan komponen.

## 4. Pipeline pembuatan komponen (manusia atau AI — gerbang sama)

```
[1] Specification  — masalah, konteks, UX, aksesibilitas, performa target
[2] Schema design  — props/content/animation contract + fixture preview
[3] Design review  — kesesuaian kontrak token, konsistensi sistem
[4] Implementation — kode + unit test + fixture (AI dibantu skill component-generation)
[5] Static gates   — lint (termasuk aturan renderer), typecheck, bundle-size check
[6] Tests          — unit, render (kosong/berisi/ekstrem), a11y (axe), visual regression
[7] Preview        — staging registry; dipratinjau di template sampel × beberapa theme
[8] Approval       — risk sedang: review manusia; risk rendah (variant minor): otomatis bila semua gerbang hijau
[9] Registry publish — version bump, changelog, update compatibility matrix, notifikasi
```

- Output AI selalu PR/draft dalam pipeline — **tidak pernah menulis langsung ke registry published** (mandat PRD).
- Evidence (hasil gerbang, screenshot diff) tersimpan sebagai `evidence` di task/artefak — audit & regresi.

## 5. AI Component Generator (fase 4)

- Input: spesifikasi natural ("hero dengan efek reveal seperti kertas terbuka lalu nama pasangan muncul").
- AI menyusun **spec & schema dulu** (langkah 1–2 pipeline) untuk direview — baru implementasi dijalankan oleh agen dengan skill `component-generation` + `frontend`.
- Pembatasan keras: hanya boleh menghasilkan kode dalam kerangka kontrak (token theme, sistem animasi internal, tanpa dependency baru tanpa approval); PR disertai penjelasan & test; gate CI menolak yang gagal.
- Loop perbaikan mandiri dibatasi (≤ N iterasi per gerbang); melewati batas → blocked + eskalasi manusia.

## 6. Template system (rekap dari dokumen 10 §5)

- `templates` + `template_versions`: `structure JSONB` (urutan section default + konfigurasi awal + section wajib/opsional), `compatibility` (renderer, schema, kategori theme, komponen minimal), `changelog`.
- Template dipilih saat pembuatan undangan; setelah itu dokumen undangan bebas dimodifikasi (template hanya titik awal, bukan kurungan).
- Template baru lolos validator struktur + render uji lintas theme representatif + visual regression.

## 7. Aturan mutu komponen (checklist reviewer & AI)

1. Satu tanggung jawab; ≤ 200 baris idealnya (maks 500 mutlak).
2. Tidak ada fetch data liar — data via props atau loader terdaftar.
3. Semua teks dari konten (bisa diedit user) — dilarang copy hardcode di komponen.
4. Bundle: tidak menambah dependency pihak ketiga tanpa approval; ikut anggaran JS publik.
5. Animasi hanya via kontrak animasi theme; wajib aman reduced-motion.
6. Aksesibilitas: semantic HTML, focus-visible, kontras mengikuti theme, alt pattern, target sentuh ≥ 44px.
7. Fixture preview + golden screenshot disertakan.
