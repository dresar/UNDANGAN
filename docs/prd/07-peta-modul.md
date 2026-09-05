# 07 — Peta Modul & Dependency

Modular monolith: satu deployment, modul domain dengan boundary keras di `src/modules/<domain>`. Setiap modul punya `api/ service/ repository/ schema/` (lihat dokumen 05 §2.1). Dokumen ini menetapkan daftar modul, tanggung jawab, dan **dependency yang diizinkan** — pelanggaran dependency ditolak CI/review.

---

## 1. Daftar modul domain

| Modul | Tanggung jawab utama | Tabel utama (dok. 08) |
|---|---|---|
| `auth` | Login, sesi, OAuth, verifikasi email, reset, 2FA admin | `accounts`, `sessions`, `oauth_accounts`, `auth_events` |
| `user` | Profil, pengaturan, notifikasi preference, penghapusan akun | `users`, `profiles`, `notification_prefs` |
| `rbac` | Role, permission, pemberian role, verifikasi server-side | `roles`, `permissions`, `role_assignments` |
| `invitation` | Siklus hidup undangan: draft, versi, publish, rollback, slug | `invitations`, `invitation_drafts`, `invitation_versions`, `slugs` |
| `couple` | Data pasangan, orang tua, story timeline (bagian dari domain undangan, dipecah agar payload JSON draft tidak menelan semua) | `couples` |
| `wedding_event` | Acara (akad/resepsi), tanggal, lokasi, peta | `wedding_events` |
| `template` | Definisi struktur pengalaman + versi + kompatibilitas | `templates`, `template_versions` |
| `theme` | Definisi theme (token dll.) + versi + status + validator | `themes`, `theme_versions` |
| `component` | Registry komponen + versi + lifecycle + props schema | `components`, `component_versions` |
| `media` | Upload, metadata, optimasi, penyimpanan, cleanup | `media_assets`, `media_variants` |
| `guest` | Guest list, tautan personal, status | `guests`, `guest_links` |
| `rsvp` | Form definisi, submit tamu, anti-spam, hasil, export | `rsvp_forms`, `rsvp_responses` |
| `guestbook` | Ucapan & moderasi | `guestbook_messages` |
| `gift` | Info kado/rekening, tampilan, klik | `gift_settings` |
| `analytics` | Ingest event, rollup, kueri dashboard | `analytics_events`, `analytics_rollups_daily` |
| `subscription` | Plan, entitlement, kuota AI, status berlangganan | `plans`, `subscriptions`, `entitlements`, `usage_counters` |
| `billing` | Payment provider abstraction, payment, invoice, coupon | `payments`, `invoices`, `coupons`, `coupon_redemptions` |
| `domain_custom` | Domain kustom, verifikasi DNS, SSL, status | `custom_domains`, `domain_verifications` |
| `ai` | AI gateway, task state machine, checkpoint, usage, artefak | `ai_tasks`, `ai_checkpoints`, `ai_artifacts`, `ai_usage`, `ai_provider_calls` |
| `skill` | Registry skill, versi, seleksi, usulan update | `skills`, `skill_versions`, `skill_update_proposals` |
| `task_dev` | Task orchestration pengembangan otonom, evidence | `dev_tasks`, `dev_task_events`, `project_state` |
| `feature_flag` | Flag, rollout, targeting, kill switch | `feature_flags`, `feature_flag_overrides` |
| `audit` | Audit log semua aksi penting | `audit_logs` |
| `notification` | Email/notif in-app, template pesan | `notifications`, `notification_templates` |
| `admin` | Agregasi endpoint admin (baca lintas modul, tanpa logika baru berat) | — (agregator) |
| `system` | System settings, health, maintenance mode | `system_settings`, `health_checks` |
| `renderer` | **Bukan modul service** — paket engine render publik (`src/renderer`), dipakai routing publik | — |

## 2. Dependency graph (panah = "boleh bergantung ke")

```
                                ┌────────────┐
                                │   audit    │ (dipakai semua modul utk mencatat; audit tak bergantung siapa pun)
                                └────────────┘
 rbac ──> auth ──> user ─────────────┐
                     │               │
                     v               v
   invitation ──> couple, wedding_event, template, theme, media
       │  │
       │  └──────> guest ──> rsvp, guestbook, gift
       v
   analytics (menerima event dari semua sisi publik via kontrak event, bukan import langsung)

 theme ──> component (validasi kompatibilitas)      component ──> (tidak bergantung modul lain; pure)
 template ──> theme, component (kompatibilitas struktur)

 subscription ──> billing, user        ai ──> subscription (cek kuota), skill (pilih skill), media (artefak)
 task_dev ──> ai, audit, project_state

 notification ──> user                 domain_custom ──> invitation
 feature_flag, system ──> (dipakai semua; tidak bergantung modul bisnis)
```

Aturan dependency:

1. Panah satu arah; **dilarang circular dependency** antar modul.
2. Modul `component` dan `renderer` bersifat **pure** (tidak import service modul lain) — agar dapat diuji & dipakai lintas konteks.
3. Komunikasi lintas modul yang longgar (event analytics, notifikasi) melalui **kontrak event/publisher sederhana** di `shared/` (bukan event-bus kompleks).
4. Modul `admin` hanya membaca lewat service query modul lain — tidak memiliki logika domain sendiri.

## 3. Boundary yang disiapkan untuk ekstraksi service (masa depan)

Tanpa microservice hari ini, boundary berikut didesain "ekstrakabel" (antarmuka service jelas, state milik modul sendiri, komunikasi lewat kontrak):

| Calon ekstraksi | Pemicu (dok. 25) | Bentuk akhir |
|---|---|---|
| AI worker (gateway + task executor) | Beban antrean tinggi / biaya serverless function tak efisien | Worker terpisah (container) membaca `ai_tasks` |
| Analytics ingestion | Volume event tinggi mengganggu DB utama | Endpoint terpisah + rollup batch |
| Media processing | Pipeline optimasi memakan waktu/CPU | Job worker khusus media |
| Domain service | Banyak custom domain aktif | Service verifikasi + SSL otomatis |

## 4. Struktur folder level atas (ilustrasi logis, bukan scaffolding)

```
src/
  app/                 routing Next.js (tipis)
  modules/<domain>/    modul domain (lihat §1)
  renderer/            engine undangan publik (terisolasi)
  components/          design system dashboard/editor
  shared/              util, kontrak event, konstanta
docs/
  prd/                 dokumen ini
  adr/                 architecture decision records (mulai fase 0)
  skills/              AI skill system (mulai fase 2)
  runbook/             operasional & incident response
```
