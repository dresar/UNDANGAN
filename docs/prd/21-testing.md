# 21 — Strategi Testing

Piramida pengujian sehat + gerbang khusus domain (renderer/theme/component) + suite untuk perilaku AI. CI menjalankan sesuai dampak perubahan agar cepat (dokumen 20 §3).

## 1. Peta jenis test

| Lapisan | Alat | Cakupan | Kapan wajib |
|---|---|---|---|
| Unit | Vitest | logika murni: validasi schema, transformer migrasi, util, patch diff, policy | setiap PR |
| Integration | Vitest + DB ephemeral | service + repository: siklus invitation, publish, RSVP, kuota, task state | setiap PR (suite inti) |
| Komponen/React | Testing Library | form editor, komponen registry (render kosong/berisi/ekstrem), a11y dasar | setiap PR yang menyentuh UI |
| E2E | Playwright | alur kritis end-to-end di preview deploy | PR besar + rilis |
| Visual regression | Playwright screenshots | theme × komponen × viewport (mobile 375, desktop 1280) | PR yang menyentuh renderer/theme/component |
| A11y | axe-core (dalam Playwright) | halaman publik sampel + editor | PR yang menyentuh halaman publik |
| Performa | Lighthouse CI + bundle check | anggaran dokumen 17 | PR yang menyentuh halaman publik |
| API kontrak | skema Zod → tipe terbagi + test konsumer | stabilitas bentuk API internal | setiap PR yang mengubah schema |
| Uji AI | harness deterministik (provider mock) + evaluasi golden | lihat §7 | setiap PR pada modul ai/skill |

## 2. E2E alur kritis (daftar minimum tetap)

1. Daftar → login → logout → reset password.
2. Buat undangan dari template/theme → isi data → upload foto → preview.
3. Publish → buka halaman publik sebagai tamu (mobile viewport) → semua section inti tampil.
4. Tamu submit RSVP → muncul di dashboard owner → export.
5. Edit draft setelah publish → halaman publik **tidak berubah** → publish ulang → berubah.
6. Rollback ke versi published sebelumnya.
7. Admin: login 2FA → lihat audit log → toggle feature flag → kill switch fitur AI.
8. Negatif lintas tenant: akun B mencoba buka undangan akun A via URL langsung → 403/404 (bukan isi).

## 3. Test domain undangan (renderer)

- **Corpus dokumen uji**: kumpulan dokumen JSON lintas schemaVersion (v1, v2, …), lintas kombinasi theme/template, termasuk dokumen aneh (section kosong, media hilang, event tanpa tanggal). Corpus dipakai unit (validasi), render test, dan migrasi.
- Render test: dokumen → string HTML → asersi konten penting + tidak ada penanda error; test fallback (komponen tidak dikenal → placeholder aman, bukan crash).
- Test transformer migrasi: golden input → output per versi, termasuk rantai v(n)→v(n+1)→v(n+2).
- Snapshot HTML per kombinasi inti (bagian dari visual regression).

## 4. Test theme & component (visual regression)

- Matriks dasar: setiap theme published × komponen inti × 2 viewport; golden screenshot disimpan per rilis theme/komponen.
- Ambang diff piksel ketat untuk perubahan yang tidak seharusnya mengubah visual; proses update golden eksplisit (bukan auto-bless).
- CI gagal bila variant lama berubah tampilan tanpa PR yang menyatakannya (mencegah "variant baru merusak yang lama" — acceptance criteria G3).
- Komponen baru wajib menyertakan fixture (dokumen 11 §2.10) — fixture tanpa visual test = registry publish ditolak.

## 5. Test keamanan otomatis

- Suite lintas-tenant negatif (dokumen §2.8) untuk setiap resource endpoint (dibangkitkan dari daftar route).
- Test rate limit (hitung 429) untuk kelas endpoint sensitif.
- Test validasi upload (MIME palsu, ukuran lebih).
- Dependency audit + scan secret di CI.
- (Fase lanjut) fuzzing ringan pada input publik (RSVP form).

## 6. Test migration & data

- Setiap migration diuji pada salinan data staging ter-anonim; waktu eksekusi diukur (timeout guard).
- Backfill job punya test idempoten (jalankan dua kali = hasil sama).
- Test restore backup kuartalan (job terjadwal, hasil dilaporkan ke admin — bukan asumsi).

## 7. Test perilaku AI (deterministik sedapat mungkin)

1. **Provider mock/stub** di CI: gateway diuji terhadap stub (sukses, invalid_output, rate_limited, timeout) → memastikan retry/fallback/checkpoint benar tanpa memanggil provider asli.
2. **Golden structured output**: untuk setiap task type, contoh output valid & tak valid → validator harus lulus/gagal sesuai harapan.
3. **Test resumability**: task disimulasikan terputus pada step k (via stub) → scheduler resume → hasil akhir sama dengan tanpa putus.
4. **Evaluasi kualitas** (di luar CI, terjadwal): sampel prompt golden per kapabilitas → skor (schema pass, kualitas heuristic/manual ringkas) → dipakai pembaruan skill (dokumen 14 §6).
5. Test kuota: pemanggilan melebihi kuota → 429 jelas + tidak ada pemanggilan provider.

## 8. Kebijakan suite cepat vs lengkap

- PR biasa: unit + integration inti + terkait-dampak (ubah-apa-uji-apa via path filter).
- PR menyentuh `renderer/`, theme, component: + visual regression matriks terdampak.
- Rilis: seluruh suite + E2E penuh + LHCI.
- Nightly: E2E penuh staging + evaluasi AI + uji restore (ringkas).

## 9. Data uji & hygiene

- Factory data uji (bukan dump produksi); anonymizer untuk salinan staging.
- Seed lokal: 1 akun, 2 undangan (draft & published), 3 theme, media sampel — cukup untuk dev & demo.
- Test tidak pernah memanggil provider AI asli atau mengirim email nyata (stub transport).
