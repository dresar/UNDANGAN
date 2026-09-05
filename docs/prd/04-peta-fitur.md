# 04 — Peta Fitur (Feature Map)

Dokumen ini mengenumerasi seluruh fitur platform dengan ID untuk dirujuk roadmap dan acceptance criteria. Prioritas: **P0** = wajib MVP, **P1** = penting pasca-MVP, **P2** = lanjutan, **P3** = masa depan.

## 1. Fitur User (pengguna akhir)

| ID | Fitur | Deskripsi | Prioritas | Fase |
|----|-------|-----------|-----------|------|
| U-01 | Autentikasi | Daftar/login email+password & Google; sesi aman; reset password; 2FA opsional | P0 | 0–1 |
| U-02 | Profil & pengaturan akun | Profil, ganti password, hapus akun (dengan policy data), sesi aktif | P0 | 1 |
| U-03 | Dashboard | Daftar undangan (status draft/published, update terakhir, RSVP count, visitor count), shortcut editor | P0 | 1 |
| U-04 | Buat undangan | Wizard ringkas: data pasangan, tanggal, lokasi, tone bahasa | P0 | 1 |
| U-05 | Template & theme picker | Galeri template × theme dengan preview & compatibility | P0 | 1 |
| U-06 | Editor visual | Edit section, konten, urutan, foto, warna (batas theme), tipografi, animasi, musik — tanpa koding | P0 | 2 |
| U-07 | Preview | Preview mobile/desktop real-time; tautan preview aman untuk dibagikan | P0 | 1 |
| U-08 | Publish & unpublish | Publish = snapshot tervalidasi; unpublish; rollback versi | P0 | 1 |
| U-09 | URL publik & slug | `/w/slug`; kustomisasi slug (cek konflik); tautan tamu personal `?to=Nama` | P0 | 1 |
| U-10 | Media manager | Upload foto/video/musik, metadata, alt text, galeri, status optimasi, hapus | P0 | 2 |
| U-11 | RSVP | Form kehadiran (field kustomisable owner), anti-spam, dashboard hasil, filter, export | P0 | 1 |
| U-12 | Guest management | Guest list, tautan personal per tamu, status terkirim/RSVP, import CSV | P1 | 2 |
| U-13 | Guestbook | Ucapan tamu dengan moderasi owner | P1 | 2 |
| U-14 | Wedding gift | Info rekening/alamat kado (field terenkripsi-opsional), link e-wallet/gift | P1 | 2 |
| U-15 | Musik & video | Musik latar (upload/pustaka), embed video (ringan) | P1 | 2 |
| U-16 | Analytics undangan | View, unique visitor approx, RSVP conversion, interaksi (map/gallery/gift/share/music) | P1 | 2 |
| U-17 | AI content assistant | Bantu tulis opening/story/pesan/quote/closing/RSVP text dengan tone | P1 | 2 |
| U-18 | AI builder (onboarding generatif) | Dari data dasar → AI susun struktur + konten + theme saran | P1 | 3 |
| U-19 | AI copilot editor | Perintah bahasa alami → diff proposal ("lebih elegan", "hero cinematic", "animasi lembut") | P1 | 3 |
| U-20 | AI rekomendasi kualitas | Saran urutan section, kontras, keterbacaan, mobile, SEO, performa — optional, dengan alasan | P2 | 3 |
| U-21 | Domain kustom (add-on) | Hubungkan domain sendiri: verifikasi DNS, status, SSL | P2 | 4 |
| U-22 | Subscription & billing | Lihat plan, batas, kuota AI, upgrade/downgrade, riwayat invoice | P1 | 3 |
| U-23 | Notifikasi | Email RSVP baru, publish sukses, kuota hampir habis | P1 | 2 |
| U-24 | Duplikasi undangan | Clone konfigurasi untuk acara lain/iterasi | P2 | 3 |

## 2. Fitur Rendering & Experience (hasil akhir yang dilihat tamu)

| ID | Fitur | Prioritas | Fase |
|----|-------|-----------|------|
| R-01 | Rendering engine JSON-driven + component registry | P0 | 1 |
| R-02 | Opening experience (cover + nama tamu personal) | P0 | 1 |
| R-03 | Section inti: hero pasangan, quote, story timeline, detail acara, countdown, galeri, peta, RSVP, closing/footer | P0 | 1 |
| R-04 | Section tambahan: guestbook, gift, musik, video, decorative/divider | P1 | 2 |
| R-05 | Animasi preset (subtle/elegant/cinematic/romantic/luxury/playful/none) + mobile-safe + reduced-motion | P0 | 1 |
| R-06 | SEO + Open Graph + share preview + favicon | P0 | 1 |
| R-07 | Performa: SSR, image optimization, lazy loading, code splitting, CDN caching | P0 | 1 |
| R-08 | Aksesibilitas: kontras, fokus, ukuran font, navigasi keyboard, alt text | P0 | 1 |
| R-09 | Multi-bahasa konten undangan (ID default; EN opsional per undangan) | P3 | 5+ |
| R-10 | Live countdown akurat lintas zona waktu tamu | P0 | 1 |

## 3. Fitur Theme & Component System (katalog)

| ID | Fitur | Prioritas | Fase |
|----|-------|-----------|------|
| T-01 | Theme system (design token, variant, personality animasi) + 3 theme rilis awal | P0 | 1 |
| T-02 | Theme validator (schema, kontras, tipografi, kompatibilitas, mobile-safe) | P0 | 1 |
| T-03 | Template system (struktur pengalaman: cinematic/classic/editorial/romantic/minimal/story-driven) | P1 | 2–3 |
| T-04 | Component registry + lifecycle (draft/testing/staging/published/deprecated/archived) + variant + props schema | P0 | 1 |
| T-05 | AI theme generator (prompt natural → theme definition tervalidasi) | P1 | 3 |
| T-06 | AI component generator (spec → schema → pipeline → registry) | P2 | 4 |
| T-07 | Prompt engineering engine untuk asset visual (ilustrasi, dekorasi, background, ikon) | P2 | 3 |
| T-08 | Asset pipeline (transparent/WebP, kompresi, dimensi, penamaan, versi, review) | P2 | 3 |
| T-09 | Compatibility matrix template × theme × component × renderer + migrasi schema undangan lama | P0 | 1 |

## 4. Fitur Admin (operasional perusahaan)

| ID | Fitur | Prioritas | Fase |
|----|-------|-----------|------|
| A-01 | Admin dashboard (statistik, kesehatan sistem, ringkasan operasional) | P0 | 2 |
| A-02 | CRUD user (cari, suspend, ubah role, reset) dengan audit | P0 | 2 |
| A-03 | Kelola undangan (lihat, unpublish, hapus sesuai policy) | P0 | 2 |
| A-04 | Kelola katalog theme/component/template (pipeline publish/deprecate) | P1 | 2–3 |
| A-05 | Monitor tugas AI: antrean, checkpoint, retry, cancel, approval usulan | P1 | 3 |
| A-06 | AI usage & biaya per user/fitur/provider | P1 | 3 |
| A-07 | Subscription, payment status, coupon, refund manual | P1 | 3 |
| A-08 | Audit log viewer + security events | P0 | 2 |
| A-09 | Feature flags (environment, rollout %, targeting, kill switch, audit) | P0 | 2 |
| A-10 | System settings & konten sistem (announcement, FAQ, terms) | P1 | 2 |
| A-11 | Background jobs monitor (berjalan, gagal, retry) | P1 | 2 |
| A-12 | Health & diagnostics page (DB, queue, provider AI, storage, latency, error rate) | P0 | 2 |
| A-13 | Analytics agregat platform (DAU, publish rate, funnel onboarding, retensi) | P2 | 4 |

## 5. Fitur Platform / AI System (internal)

| ID | Fitur | Prioritas | Fase |
|----|-------|-----------|------|
| S-01 | AI gateway provider-agnostic (default Gemini free; logging token/latency/status; retry; fallback) | P0 | 2 |
| S-02 | Task state machine + checkpoint + resumable job + scheduler continuation | P0 | 2 |
| S-03 | AI skill system (versi, seleksi otomatis, update workflow) | P1 | 2 |
| S-04 | Project state system + progress event | P0 | 0 |
| S-05 | ADR system + knowledge base (chunked, terindeks, berversi) | P0 | 0 |
| S-06 | Task orchestration pengembangan (dependency graph, evidence, risk gate) | P1 | 2 |
| S-07 | Feature flag engine | P0 | 2 |
| S-08 | Rate limiting global (login, AI, RSVP, upload, form publik) | P0 | 1 |
| S-09 | Centralized error handling + error taxonomy + correlation ID | P0 | 1 |
| S-10 | Structured logging + monitoring + alert | P0 | 1–2 |
| S-11 | Backup, export, deletion & recovery policy + audit trail | P1 | 2 |
| S-12 | AI maintenance loop (klasifikasi bug, root cause, regression test, skill update) | P2 | 4 |
| S-13 | CI/CD pipeline (lint, typecheck, test, build, preview deploy, gate merge) | P0 | 0 |
| S-14 | Visual regression system (theme × component × viewport) | P1 | 2–3 |
| S-15 | Cleanup jobs (orphan media, tugas selesai, retensi analytics) | P1 | 2 |

## 6. Ketergantungan fitur kunci (dependency utama)

```
Auth (U-01) ──> Undangan CRUD (U-04) ──> JSON schema & renderer (R-01, T-09)
                                              │
              ┌───────────────────────────────┼────────────────────────────┐
              v                               v                            v
     Section inti (R-03)               Theme system (T-01/02)        Publish (U-08)
              │                               │                            │
              v                               v                            v
        Preview (U-07) <──────────────────────────────> URL publik (U-09)
              │                                                            │
              v                                                            v
        Editor visual (U-06) <── Media (U-10)                        RSVP (U-11)
              │
              v
   AI copilot/builder (U-18/19) ──> AI gateway (S-01) ──> Task system (S-02)
                                            │
                                            v
                              Skill system (S-03) + Admin AI monitor (A-05)
```

Kolom "Fase" merujuk pada roadmap di dokumen 23; setiap ID fitur muncul di acceptance criteria fase terkait.
