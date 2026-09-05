# 23 — Roadmap Implementasi, Milestone & Acceptance Criteria

Urutan berdasarkan **dependency dan risiko** (bukan popularitas fitur). Setiap fase memiliki acceptance criteria yang dapat diuji; fase tidak dinyatakan selesai sebelum seluruh kriteria lolos. Prinsip: jangan bangun semua sekaligus; MVP dulu yang membuktikan engine, lalu bertumbuh.

---

## Fase 0 — Fondasi Engineering (pra-MVP)

**Fokus:** repo, standar, pipeline, infra dasar, dan sistem konteks AI (project state/ADR) — fondasi agar semua pekerjaan berikutnya terkendali.

Isi: inisialisasi repo & konvensi (dokumen 05); CI/CD pipeline penuh (dokumen 20); environment & secret; skema DB inti (auth/user/rbac/audit); Auth.js berjalan; `PROJECT_STATE` + folder ADR + knowledge base kosong terstruktur; health endpoint & Sentry; seed lokal.

**Acceptance criteria F0:**
1. PR apa pun melewati lint+typecheck+test+build otomatis; PR gagal gerbang tidak dapat merge.
2. Daftar→login→logout→reset bekerja E2E di staging; sesi dapat direvokasi server-side.
3. Endpoint `/health/ready` melaporkan status DB & dependensi.
4. `PROJECT_STATE.md` + ≥ 5 ADR awal (stack, DB, rendering, AI gateway, deployment) terdokumentasi & dibaca otomatis sebagai konteks.
5. Seeding lokal ≤ 15 menit untuk developer/AI baru; test lintas-tenant negatif pertama ada (auth).

## Fase 1 — MVP: Engine Undangan End-to-End

**Fokus:** membuktikan jalur inti: undangan dari database → dirender dari JSON → dipublish → dibuka tamu → RSVP.

Isi (ID merujuk dokumen 04): invitation CRUD + draft/versi/slug (U-04/08/09); JSON schema v1 + renderer + compatibility + migrasi (R-01/T-09); komponen inti fase-1 (R-02/03); theme system + validator + **3 theme rilis awal** (T-01/02); animasi preset + reduced-motion (R-05); publish/snapshot/rollback; halaman publik mobile-first + SEO/OG (R-06/07/08); RSVP dasar + anti-spam (U-11); dashboard sederhana (U-03); preview (U-07); rate limiting inti (S-08); error handling terpusat + logging + correlation id (S-09/10).

**Acceptance criteria F1 (dapat diuji):**
1. Undangan dibuat dari database (bukan hardcode), dirender dari JSON divalidasi, dipublish, dan dibuka di ponsel — alur E2E hijau (dokumen 21 §2.2–2.4).
2. Tamu dapat submit RSVP; owner melihat hasil + export CSV; spam sederhana (rate limit) diblokir.
3. Edit draft setelah publish **tidak** mengubah halaman publik; publish ulang & rollback bekerja (E2E 2.5/2.6).
4. Halaman publik memenuhi anggaran: Lighthouse mobile ≥ 90 performa pada template sampel; JS pihak pertama ≤ 90 kB gz; LCP < 2,5 dtk di profil 4G CI.
5. Menambah theme ke-4 (uji cerita pengguna) **tanpa** mengubah kode komponen inti — hanya definisi theme baru lolos validator (membuktikan G3).
6. Semua output publik berbahasa Indonesia; halaman tamu lolos axe-core tanpa violation kritis.
7. Test lintas-tenant negatif mencakup seluruh endpoint resource fase ini.
8. Renderer fallback: dokumen rusak menghasilkan halaman aman + `rendering_error`, bukan crash.

## Fase 2 — Editor & Operasional

**Fokus:** editor visual penuh + media + fitur interaksi + admin panel dasar + AI content pertama.

Isi: editor visual + revisi/undo (U-06); media manager + pipeline optimasi + cleanup (U-10/A-15); guestbook/gift/musik/video (U-13/14/15); guest management + tautan personal (U-12); admin panel dasar (A-01..A-04, A-08..A-12); feature flags (A-09/S-07); AI gateway + task system + scheduler (S-01/S-02) dengan mock+real; AI content assistant (U-17); analytics dasar (U-16/A-13 sebagian); notifikasi email (U-23); backup/restore & data export/delete (S-11); skill system inti + task_dev orkestrasi (S-03/S-06).

**Acceptance criteria F2:**
1. User non-teknis (uji persona) mengedit konten, foto, urutan, animasi, dan musik tanpa bantuan teknis — semua perubahan via editor, tanpa kode.
2. Upload foto 8 MP diproses (resize/WebP/variants) < 60 dtk; galeri halaman tetap dalam anggaran performa.
3. Task AI terputus (simulasi rate limit) di tengah → status `checkpointed` → scheduler melanjutkan → selesai tanpa input ulang (uji S-02; lihat dokumen 13 §10.2).
4. Output AI content **selalu** valid schema (0 hasil mentah ke UI); kuota habis menampilkan pesan jelas, bukan 500.
5. Admin dapat: menemukan user/undangan, melihat audit log, toggle feature flag (kill switch AI terbukti mematikan fitur AI tanpa deploy), memantau antrean & kegagalan job.
6. Hapus akun → data dianonimkan terjadwaldan tercatat audit; export akun tersedia.
7. Visual regression matriks theme×komponen aktif di CI dengan golden terkelola.

## Fase 3 — Generatif Skala & Monetisasi

**Fokus:** AI sebagai pembeda produk + template system penuh + pembayaran aktif.

Isi: AI builder onboarding 3 konsep (U-18); AI copilot patch (U-19); AI rekomendasi (U-20); AI theme generator (T-05) + prompt engine + asset pipeline (T-07/T-08); template system penuh (T-03); pipeline komponen penuh + AI component generator beta (T-06/§5 dokumen 11); subscription + payment provider aktif (U-22/A-07, Part A dokumen 19); duplikasi undangan (U-24); admin monitor AI lengkap (A-05/A-06).

**Acceptance criteria F3:**
1. Permintaan tema natural ("elegan putih-emas editorial") menghasilkan theme definition yang **lolos Theme Validator** (kontras, kontrak token, mobile-safe animasi) dan dipratinjau dalam pipeline yang sama; iterasi feedback berfungsi.
2. Copilot mengubah **hanya** bagian yang diminta (patch terbatas); diff ditampilkan; pembatalan mengembalikan keadaan; dokumen tetap valid setelah tiap penerapan.
3. Menambah komponen/variant baru melalui pipeline (spec→…→publish) tidak merusak variant lama — dibuktikan visual regression hijau penuh.
4. Pembayaran end-to-end (sandbox → produksi): berlangganan, upgrade prorate, downgrade akhir periode, webhook terverifikasi & idempoten, coupon bekerja.
5. Entitlement menggermbar fitur & kuota AI per plan dengan benar (uji batas free vs pro).
6. ≥ 60% saran AI diterima pengguna pada metrik periode (G4) — dipantau; bila belum, temuan masuk maintenance loop (bukan blocker rilis, tapi commitment iterasi).

## Fase 4 — Infrastruktur Bisnis & Otonomi

**Fokus:** skala & kemandirian operasional.

Isi: custom domain penuh (U-21, dokumen 19 B); subdomain wildcard; analytics lanjut + funnel platform (A-13 penuh); observability mendalam (dashboard latensi/error/antrean); AI maintenance loop aktif (S-12); AI component generator GA; keamanan lanjutan (challenge adaptif, audit ekspansi); performa skala (load test musim ramai).

**Acceptance criteria F4:**
1. Custom domain: verifikasi DNS → SSL aktif → undangan tampil di domain user; lepas domain mulus; konflik tertangani; cache/OG benar per host.
2. Maintenance loop menutup siklus penuh: issue produksi → cluster → dev_task → patch lewat CI → regression test → lesson KB (dibuktikan pada ≥ 3 insiden nyata).
3. Load test profil musim ramai (5–10× rata-rata) lolos SLO publik (LCP & uptime) tanpa perubahan arsitektur darurat.
4. Peringkat "pekerjaan otonom": ≥ 70% dev_task fase berjalan selesai tanpa intervensi manusia di luar approval berisiko (metrik kematangan S-06).

## Fase 5+ — Ekspansi (bukan komitmen awal)

Kandidat (diaktifkan hanya setelah core matang & ada data): marketplace theme kontributor; varian acara lain (aqiqah/khitan, ulang tahun, korporat) — reuses engine yang sama; API publik/WO tools; multi-bahasa konten; kolaborasi editor.

## Aturan perubahan roadmap

- Perubahan urutan/isi fase = keputusan produk tercatat (changelog PRD + ADR bila menyentuh arsitektur).
- Setiap fase menghasilkan retrospective singkat + update project state + update skill/knowledge base.
