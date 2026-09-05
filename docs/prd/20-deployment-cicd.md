# 20 — Deployment, CI/CD, Environment & Backup

## 1. Topologi deployment (serverless-first)

| Komponen | Tempat | Catatan |
|---|---|---|
| Aplikasi (SSR publik + dashboard + API) | Vercel (functions Node runtime) | Region utama terdekat pengguna (SG/ID) |
| Durable jobs & scheduler | Inngest (functions mengarah ke app) | driver eksekusi; DB tetap source of truth |
| Database | Neon PostgreSQL | PITR + branching |
| Object storage/CDN media | Cloudflare R2 + CDN | egress $0 |
| Rate limit/cache ringan | Upstash Redis | |
| Email | Resend | |
| Monitoring error | Sentry | |

Tidak ada server yang dikelola sendiri di fase awal (mandat serverless-first, biaya operasional minimal).

## 2. Environment

| Env | Tujuan | Data |
|---|---|---|
| `local` | pengembangan | DB branch lokal/seed; provider AI stub/mock untuk test deterministik |
| `preview` | per-PR otomatis | DB branch Neon; seed; URL sementara |
| `staging` | uji pra-produksi | data anonim/seed; cermin konfigurasi produksi |
| `production` | live | secret terkelola; akses terbatas |

Aturan: staging & preview tidak pernah menunjuk data produksi; secret produksi tidak pernah bocor ke preview (prefix & scope ketat).

## 3. Pipeline CI/CD (gatekeeper mutu)

```
PR dibuka (manusia atau agen AI — perlakuan sama)
 → [1] lint (ESLint + aturan khusus renderer/boundary modul)
 → [2] typecheck (tsc strict)
 → [3] unit test (Vitest)
 → [4] integration test (DB branch/ephemeral)
 → [5] build (Next) + bundle-size budget check (halaman publik)
 → [6] E2E ringkas (Playwright, suite smoke) di preview deploy
 → [7] visual regression (bila menyentuh renderer/theme/component)
 → [8] a11y & LHCI budget (bila menyentuh halaman publik)
 → review & risk gate (LOW auto / MEDIUM review / HIGH+ approval)
merge ke main
 → deploy staging otomatis → smoke suite staging
 → promote ke production (tag rilis; dapat dijadwalkan)
 → post-deploy: smoke production + health check + Sentry release
```

- Setiap PR wajib melewati gerbang — **pipeline adalah gatekeeper** (mandat PRD); agent AI tidak dapat bypass.
- Merge ke main selalu deployable (trunk-based, branch umur pendek); feature flag menutup fitur yang belum siap.
- Rilis produksi tercatat: versi, commit, migrasi terapan, changelog otomatis (daftar PR), siapa/bot yang promote.

## 4. Strategi rollback

1. **Aplikasi**: redeploy rilis sebelumnya (immutable per-deploy di platform) — target < 5 menit.
2. **Database**: migration additive-first membuat mayoritas rilis aman mundur tanpa migrasi balik; bila diperlukan, restore snapshot/PITR sesuai runbook (RTO dokumen 17 §3).
3. **Data berbahaya (destruktif)**: hanya lewat rencana bertahap (expand→backfill→contract) dengan titik henti & pemulihan terdefinisi.
4. **Fitur bermasalah**: kill switch feature flag — lebih cepat daripada rollback deploy.
5. Runbook rollback diperbarui setiap rilis berisiko (bagian definition of done).

## 5. Database migration discipline

- Semua perubahan lewat Prisma Migrate (file ter-review di PR); larangan `db push` ke staging/produksi.
- Aturan: satu migration = satu maksud; larangan menulis data besar dalam migration (pakai backfill job); larangan DROP pada rilis yang sama dengan kode yang masih membaca kolom lama.
- Status migrasi tercermin di `project_state.db_migration_status` (dokumen 15 §4) — AI/humans tahu kondisi tanpa menebak.

## 6. Backup & pemulihan

| Objek | Strategi |
|---|---|
| Database | Snapshot otomatis harian + PITR (Neon); uji restore kuartalan terjadwalkan (job maintenance) |
| Media | Bucket R2 dengan versioning aktif; lifecycle ke storage murah untuk usia tua; daftar kritis = metadata DB |
| Secret & IaC | Terekam di secret manager + repo konfigurasi (non-rahasia) |
| Runbook | `docs/runbook/`: restore DB, rotasi secret, insiden domain, kebocoran |

Retention: snapshot 30 hari; ekspor metadata bulanan disimpan terpisah.

## 7. Maintenance window & perubahan terkoordinasi

- Perubahan berisiko (migrasi besar, pergantian provider AI, perubahan domain) dijadwalkan di luar jam ramai tamu (biasanya dini hari WIB) + pengumuman internal.
- `system.maintenance_mode` (setting) untuk membekukan editor saat aksi besar (halaman published tetap hidup — tamu tidak terdampak).
