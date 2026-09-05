# 17 — Persyaratan Non-Fungsional (NFR)

Target awal realistis untuk serverless; arsitektur harus memungkinkan scale-up tanpa rewrite (dokumen 25). Setiap NFR punya cara pengukuran & titik gerbang (CI atau monitoring).

## 1. Performance

### 1.1 Halaman undangan publik (prioritas tertinggi — pengalaman tamu)

| Metrik | Target | Diukur |
|---|---|---|
| LCP (4G, ponsel menengah) | < 2,5 dtk (P75) | Lighthouse CI + RUM ringan |
| INP | < 200 ms (P75) | RUM |
| CLS | < 0,1 | Lighthouse CI |
| JS pihak pertama per halaman standar | ≤ 90 kB gz (di luar media & embed) | bundle check CI |
| TTFB dari CDN | < 300 ms (P75) region ID/SG | monitoring |
| Ukuran halaman teks (tanpa media user) | ≤ 500 kB | CI |

Taktik baku: SSR + edge cache per versi; font self-host subset (woff2, `font-display: swap`, preload 2 font kunci); gambar responsif `srcset` multi-variant (AVIF/WebP), lazy-load di bawah lipatan, hero `fetchpriority=high`; video/oembed malas; animasi hanya opacity/transform; hydrasi minimal.

### 1.2 Aplikasi dashboard/editor

- Interaksi editor < 100 ms umpan balik lokal; autosave tidak memblok UI; kanvas 30+ section tetap mulus (virtualisasi).
- API dashboard P75 < 400 ms untuk query umum (rollup, bukan scan).

## 2. Scalability

- **Target awal (tahun-1 realistis):** ratusan undangan aktif, puluhan ribu kunjungan tamu/bulan, burst musiman (musim kawin) 5–10× rata-rata.
- Semua komponen stateless (serverless) → horizontal otomatis; DB Neon autoscale; antrean menyerap beban AI; cache edge menyerap mayoritas trafik publik.
- Batas yang diawasi & rencana eskalasi (trigger dokumen 25): koneksi DB (pooler), invocations & durasi function, antrean AI melebihi SLA, storage media.

## 3. Reliability & ketersediaan

| Aspek | Target |
|---|---|
| Uptime halaman published | ≥ 99,9%/bulan |
| Uptime editor/dashboard | ≥ 99,5% (lebih longgar dari halaman tamu) |
| RPO backup | ≤ 24 jam snapshot otomatis + PITR bila provider mendukung (dokumen 20 §6) |
| RTO | ≤ 4 jam untuk pulih penuh (runbook) |
| Draft tidak hilang | autosave + revisi; kegagalan simpan tidak pernah senyap (indikator jelas) |
| Halaman tamu | tidak pernah error putih (fallback renderer, dokumen 09 §4) |

Kegagalan dependensi: AI down → fitur manual tetap penuh; storage down → undangan tanpa media baru tetap tampil; queue down → tugas pending dengan status jelas.

## 4. Accessibility (a11y)

- Standar: WCAG 2.1 AA untuk halaman publik & editor.
- Wajib: kontras tema tervalidasi (Theme Validator), semantic HTML per komponen, navigasi keyboard, focus-visible jelas, target sentuh ≥ 44px, `prefers-reduced-motion` menghasilkan mode animasi none, alt text didorong (bukan blokir) + pola dekoratif `aria-hidden`, lang attribute benar (`id`), tidak bergantung warna semata.
- Uji otomatis axe-core di CI untuk halaman publik sampel + editor; audit manual per komponen baru (checklist dokumen 11 §7).

## 5. Observability (ringkas — detail dokumen 22)

- 100% request punya correlation ID; log terstruktur JSON; error taxonomy tunggal; Sentry untuk exception; metrik inti (latensi, error rate, antrean, kuota AI) terpantau admin dengan ambang alert.

## 6. Maintainability & developer experience

- Standar dokumen 05 ditegakkan CI (strict TS, ≤500 baris, layering, tanpa `any`).
- Modular monolith dengan peta dependensi eksplisit (dokumen 07); pelanggaran boundary ditolak review.
- Onboarding developer baru / sesi AI baru: baca README → PROJECT_STATE → ADR → skill terkait; setup lokal ≤ 30 menit (script env + seed data).
- Dokumentasi hidup: setiap perubahan signifikan menyertakan task docs (ategak via definition of done task).

## 7. Cost efficiency (anggaran operasional awal)

| Sumber biaya | Kendali |
|---|---|
| AI (Gemini free default) | kuota per plan, cache checksum, prompt compression, batching, fallback sadar-biaya |
| Serverless/hosting | tier gratis→pro sesuai pertumbuhan; anggaran invocations diawasi (dokumen 25 trigger) |
| Database | Neon scale-to-zero; rollup & retensi menjaga ukuran |
| Storage/bandwidth media | R2 egress $0; optimasi variant; cleanup orphan |
| Email/monitoring | tier gratis dengan ambang alert sebelum melewati |

Prinsip: **setiap rupiah berulang harus punya dashboard pemantauan & kill switch/limit**.

## 8. Data privacy

- Pengumpulan minimal: analytics tanpa PII (hash sesi/IP); tidak ada cookie iklan; cookie hanya fungsional.
- Hak pengguna: ekspor data akun (JSON), penghapusan akun dengan jadwal & jejak audit (dokumen 08 §8.2).
- Data rekening gift terenkripsi at-rest; tampil hanya di halaman dengan fitur aktif.
- Kebijakan retensi per kelas data diposting di halaman privasi produk (Bahasa Indonesia).

## 9. Lokalisasi & bahasa

- UI/error/onboarding/docs: Bahasa Indonesia; format tanggal Indonesia; zona waktu akun (default Asia/Jakarta) pada input editor.
- Kerangka i18n tetap disiapkan sejak awal (kamus pesan terpusat) meskipun hanya `id` di fase awal — biaya menambah bahasa nanti murah.
- Konten undangan multi-bahasa = fitur fase lanjut (R-09), bukan NFR.

## 10. Kompatibilitas

- Browser tamu: 2 versi terakhir Chrome/Android, Safari iOS, Firefox, Samsung Internet; degrade anggun di browser lama (tanpa crash, animasi off).
- Perangkat: prioritas Android kelas bawah (RAM kecil, jaringan lambat) — diuji dengan throttling profil bawaan CI.
- Resolusi: 320px s/d desktop lebar; orientasi terkunci tidak dianggap; mode gelap OS tidak mengubah tema undangan (warna milik theme) namun UI dashboard mengikuti OS.
