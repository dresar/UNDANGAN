# 08 — Model Data & Arsitektur Database

Prinsip: PostgreSQL relational, **bukan satu tabel raksasa**, entity terpisah per domain, FK + unique + index eksplisit, ownership jelas, soft-delete untuk data yang perlu dipulihkan, versioning untuk entity yang berevolusi (invitation/theme/component/template), dan strategi retensi per kelas data. Dokumen ini adalah *blueprint logis* — DDL fisik dibuat via Prisma migration pada fase implementasi.

Konvensi umum semua tabel: primary key `id UUID (uuidv7)`, `created_at`, `updated_at`, dan `deleted_at` (soft delete) kecuali tabel append-only/log.

---

## 1. Domain Auth, User, RBAC

### `accounts`
Identitas login (satu per orang). `id`, `email (unique)`, `email_verified_at`, `password_hash (nullable — null bila OAuth-only)`, `status (active|suspended|deleted)`, `last_login_at`, `failed_login_count`, `locked_until`, `two_factor_secret (encrypted, nullable)`, `two_factor_enabled`.

### `sessions`
`id`, `account_id → accounts`, `session_token_hash`, `ip`, `user_agent`, `expires_at`, `revoked_at`. (Session database → revokasi instan.)

### `oauth_accounts`
`id`, `account_id → accounts`, `provider (google|…)`, `provider_account_id`, unique(`provider`,`provider_account_id`).

### `auth_events` (append-only)
`id`, `account_id (nullable)`, `event (login_success|login_failed|logout|password_reset|mfa_challenge|…)`, `ip`, `user_agent`, `created_at`. Untuk security monitoring.

### `users` / `profiles`
`users`: `id`, `account_id → accounts (1–1)`, `display_name`, `role_id` (default USER), `default_language ('id')`, `onboarding_state`. `profiles`: data tambalan (avatar media id, nomor WA opsional, dsb.).

### `roles`, `permissions`, `role_assignments`
`roles`: `id`, `code (USER|EDITOR|SUPPORT|ADMIN|SUPER_ADMIN)`, `name`, `description`. `permissions`: `id`, `code (mis. invitation.publish, theme.publish, ai.approve_medium, admin.settings.write)`, `resource`, `action`. `role_assignments`: `role_id`, `permission_id` (matrix role–permission). Pemeriksaan permission selalu server-side per request + resource ownership check di service.

## 2. Domain Undangan (inti)

### `invitations`
Agregat utama. `id`, `owner_account_id → accounts` (**ownership**), `title internal`, `slug_id → slugs`, `status (draft|published|unpublished|archived)`, `current_published_version_id (nullable → invitation_versions)`, `active_draft_id (→ invitation_drafts)`, `theme_version_id → theme_versions`, `template_version_id → template_versions (nullable)`, `published_at`, `expires_at (retensi)`, timestamps, soft delete.

### `invitation_drafts`
Working copy. `id`, `invitation_id`, `revision (int, naik per simpan)`, `document JSONB` (dokumen undangan — bentuk di dokumen 09), `schema_version`, `validation_state (valid|invalid|stale)`, `validation_errors JSONB`, `updated_by_account_id`, `updated_at`. **Editor hanya menulis baris ini.**

### `invitation_versions` (snapshot published, **immutable**)
`id`, `invitation_id`, `version_number`, `document JSONB`, `schema_version`, `theme_version_id`, `component_pins JSONB` (versi komponen terpin saat publish — dokumen 09 §5), `published_by`, `published_at`, `rendered_checksum`, unique(`invitation_id`,`version_number`). Rollback = update `current_published_version_id`.

### `slugs`
`id`, `slug (unique, lowercase, charset aman)`, `invitation_id`, `status (reserved|active|released)`, `created_at`. Konflik slug dicek atomik; slug bebas kembali dipakai setelah `released` + masa karantina.

### `couples`
`id`, `invitation_id`, `partner_a JSONB (nama panggilan, nama lengkap, ortu, foto media_id, akun sosial)`, `partner_b JSONB`, `pronouns/style notes`. (Dipecah dari dokumen JSON untuk query & AI context ringkas; tetap tersinkronisasi ke draft saat publish.)

### `wedding_events`
`id`, `invitation_id`, `kind (akad|resepsi|lainnya)`, `title`, `starts_at (timestamptz)`, `ends_at`, `timezone`, `venue_name`, `address`, `maps_url`, `maps_lat`, `maps_lng`, `dress_code`, `sort_order`.

### `stories` (timeline kisah — dipakai section story)
`id`, `invitation_id`, `happened_on (date, nullable)`, `title`, `body`, `media_id`, `sort_order`.

## 3. Domain Katalog (template, theme, component)

### `templates` / `template_versions`
`templates`: `id`, `slug`, `name`, `description`, `status`, `thumbnail_media_id`. `template_versions`: `id`, `template_id`, `version`, `structure JSONB` (urutan & konfigurasi section standar), `allowed_section_types JSONB`, `compatibility JSONB` (range renderer/schema/theme/component), `changelog`, `published_at`. Immutable per version.

### `themes` / `theme_versions`
`themes`: `id`, `slug`, `name`, `category`, `status (draft|testing|staging|published|deprecated|archived)`, `quality_score (nullable)`, `preview_media_id`, `created_by (account|ai_task)`. `theme_versions`: `id`, `theme_id`, `version`, `definition JSONB` (dokumen 10), `definition_checksum`, `supported_components JSONB`, `compatibility JSONB`, `validation_report JSONB`, `origin (human|ai:<task_id>)`, `published_at`.

### `components` / `component_versions`
`components`: `id`, `slug (mis. hero, gallery, rsvp-form)`, `name`, `section_type`, `status (draft|testing|staging|published|deprecated|archived)`, `owner_team`, `visibility (core|optional)`. `component_versions`: `id`, `component_id`, `version (semver)`, `props_schema JSONB (JSON Schema)`, `content_schema JSONB`, `variants JSONB` (daftar + deskripsi + default), `animation_contracts JSONB`, `responsive_rules JSONB`, `accessibility_notes`, `implementation_ref` (paket/entry bundel renderer), `compatibility JSONB`, `origin`, `published_at`, `deprecated_at`.

## 4. Domain Media

### `media_assets`
`id`, `owner_account_id`, `invitation_id (nullable)`, `folder`, `kind (image|video|audio|document|generated_asset)`, `file_name`, `mime`, `size_bytes`, `width`, `height`, `duration_seconds`, `storage_provider`, `storage_key`, `checksum (sha-256)`, `alt_text`, `optimization_state (pending|processing|done|failed)`, `status (active|orphan|deleted)`, `usage_count (denormalisasi)`, `source (upload|ai_generated)`, `origin_task_id (nullable → ai_tasks)`, timestamps, soft delete. **Binary tidak pernah di DB.**

### `media_variants`
`id`, `media_id`, `variant (thumb|sm|md|lg|og|webp|avif…)`, `storage_key`, `width`, `height`, `size_bytes`, `checksum`. Dihasilkan pipeline optimasi; cleanup bersama induk.

## 5. Domain Tamu & Interaksi

### `guests`
`id`, `invitation_id`, `display_name`, `phone/email (nullable)`, `group/kategori`, `notes`, `status (pending|sent|responded|declined)`. Import CSV → job batch.

### `guest_links`
`id`, `guest_id`, `invitation_id`, `token (unique)`, `channel (wa|manual)`, `sent_at`, `opened_at`, `expires_at`. Tautan personal `?g=<token>` → prefilled nama + analytics terkait.

### `rsvp_forms`
`id`, `invitation_id (1–1)`, `fields JSONB` (definisi field kustom owner — tervalidasi schema form-builder), `settings JSONB` (buka/tutup, batas tamu, pesan sukses), `spam_rules JSONB`.

### `rsvp_responses`
`id`, `invitation_id`, `guest_id (nullable)`, `guest_link_id (nullable)`, `name`, `attendance (hadir|tidak|masih_ragu)`, `party_size`, `answers JSONB`, `message`, `ip_hash (sha-256 salted — anti spam, bukan identifikasi)`, `user_agent_hash`, `submitted_at`, `status (new|confirmed|archived)`, `flagged (bool)`. Index kuat pada (`invitation_id`,`submitted_at`).

### `guestbook_messages`
`id`, `invitation_id`, `guest_id (nullable)`, `display_name`, `message`, `status (pending|approved|hidden)` (moderasi owner; default approved bila owner menonaktifkan moderasi), `submitted_at`, `ip_hash`.

### `gift_settings`
`id`, `invitation_id (1–1)`, `mode (rekening|alamat_kado|link_eksternal)`, `payload_encrypted` (nomor rekening dsb. — enkripsi at-rest, dekripsi hanya saat render halaman dengan mode gift aktif), `display_note`, `click_count (denormalisasi dari analytics).

## 6. Domain AI & Otonom (detail operasional dokumen 13–15)

### `ai_tasks`
`id`, `type (theme.generate|content.generate|structure.propose|asset.generate|review.run|test.run|maintenance.analyze|…)`, `status (pending|queued|running|checkpointed|paused|retrying|blocked|waiting_for_input|completed|failed|canceled|archived)`, `priority`, `risk_level (low|medium|high|critical)`, `requested_by (account|system|scheduler)`, `context JSONB` (input terstruktur), `input_checksum` (cache key), `schema_ref` (Zod registry key untuk output), `max_retries`, `retry_count`, `budget_tokens`, `used_tokens`, `current_step`, `total_steps`, `locked_by (executor id)`, `locked_until`, `last_error JSONB`, `result_ref → ai_artifacts`, `started_at`, `finished_at`, `heartbeat_at`.

### `ai_checkpoints`
`id`, `task_id`, `step_index`, `step_name`, `state_snapshot JSONB` (ringkas), `artifacts JSONB` (referensi), `created_at`, `resumable_from (bool)`. Ini yang membuat pekerjaan dapat dilanjutkan lintas sesi/window.

### `ai_artifacts`
`id`, `task_id`, `kind (theme_definition|content|structure_diff|asset|report|patch_proposal)`, `payload JSONB` (hasil tervalidasi), `validation_state`, `review_state (none|pending|approved|rejected)`, `applied (bool)`, `payload_checksum`.

### `ai_provider_calls` (append-only)
`id`, `task_id`, `provider`, `model`, `request_id`, `input_tokens`, `output_tokens`, `latency_ms`, `status (ok|error|rate_limited|timeout|invalid_output)`, `error_code`, `retried`, `created_at`. Dasar kuota, biaya, & diagnosis (mandat: model, provider, limit, error, token/usage, latency, status, retry, fallback diketahui sistem).

### `ai_usage`
Agregat per periode: `id`, `account_id`, `period (YYYY-MM)`, `feature`, `provider`, `calls`, `tokens_in`, `tokens_out`, `error_count`, `estimated_cost_usd`. Dipakai entitlement & dashboard.

### `skills`, `skill_versions`, `skill_update_proposals`
Dokumen 14 §4.

### `dev_tasks`, `dev_task_events`, `project_state`
Dokumen 15 §3–4. `dev_tasks`: id, code, title, description, priority, risk, dependencies (array id), owner_agent, required_skills, expected_artifacts, acceptance_criteria, status, retry_count, checkpoint_ref, evidence JSONB, timestamps. `dev_task_events`: append-only progress. `project_state`: tabel satu-baris-per-aspek yang juga diproksikan ke file `PROJECT_STATE.md` (dokumen 15).

## 7. Domain Bisnis & Sistem

### `plans` / `subscriptions` / `entitlements` / `usage_counters`
`plans`: `code (free|pro|business)`, `name`, `price_idr`, `billing_period`, `features JSONB`, `limits JSONB` (max invitations, media GB, AI calls/bulan, dsb.), `ai_entitlement JSONB`. `subscriptions`: `id`, `account_id`, `plan_id`, `status (trialing|active|past_due|canceled|expired)`, `current_period_start/end`, `trial_ends_at`. `entitlements`: snapshot efektif (plan + override manual) per account — sumber tunggal pengecekan kuota. `usage_counters`: `account_id`, `period`, `metric (ai_calls|ai_tokens|media_bytes|invitation_count)`, `value` (incr atomik).

### `payments` / `invoices` / `coupons` / `coupon_redemptions`
`payments`: `id`, `account_id`, `subscription_id`, `provider`, `provider_ref`, `amount_idr`, `status (pending|paid|failed|refunded)`, `payload JSONB` (sanitized), timestamps. `invoices`: referensi tagihan + nomor urut. `coupons`: kode, tipe (persen|nominal), masa berlaku, kuota, `applicable_plan_ids`.

### `custom_domains` / `domain_verifications`
`custom_domains`: `id`, `account_id`, `invitation_id`, `domain (unique)`, `status (pending_verification|verifying|active|ssl_provisioning|failed|detached)`, `verification_method (txt|cname)`, `ssl_state`, `last_checked_at`. `domain_verifications`: riwayat percobaan & hasil (append-only).

### `analytics_events` (append-only, partisi bulanan)
`id`, `invitation_id`, `event_name` (konvensi `object_action`, dokumen 18), `guest_link_id (nullable)`, `session_hash`, `device_class`, `referrer_host`, `metadata JSONB (kecil)`, `occurred_at`. **Tanpa PII.**

### `analytics_rollups_daily`
`invitation_id`, `date`, `metric`, `value` (unique(`invitation_id`,`date`,`metric`)). Dashboard membaca rollup, bukan event mentah.

### `feature_flags` / `feature_flag_overrides`
`feature_flags`: `key`, `name`, `description`, `enabled_global`, `rollout_percentage`, `environments JSONB`, `targeting_rules JSONB`, `kill_switch (bool)`, `updated_by`, `updated_at`. `feature_flag_overrides`: per-account/per-invitation on-off (untuk uji & dukungan).

### `audit_logs` (append-only)
`id`, `actor_account_id (nullable utk sistem)`, `actor_role`, `action` (mis. `invitation.publish`, `theme.publish`, `role.change`, `settings.change`, `ai.workflow.approve`, `data.delete`), `target_type`, `target_id`, `source (web|api|job|ai)`, `result (success|failure)`, `context JSONB` (ringkas, tanpa secret), `ip`, `created_at`. Index (`actor`,`created_at`), (`target_type`,`target_id`).

### `system_settings`
`key (unique)`, `value JSONB`, `description`, `updated_by`, `updated_at` (perubahan via admin + audit).

### `background_jobs` (mirror antrean eksternal; DB = source of truth)
`id`, `kind`, `ref_type/ref_id`, `status (queued|running|succeeded|failed|retrying|canceled)`, `attempts`, `last_error`, `scheduled_at`, `started_at`, `finished_at`, `payload_summary`.

### `notifications` / `notification_templates`
Antrean & riwayat notifikasi (email/in-app): `id`, `account_id`, `channel`, `template_code`, `payload JSONB`, `status (queued|sent|failed)`, `sent_at`, `error`.

## 8. Strategi lintas-belah (cross-cutting)

### 8.1 Ownership & isolasi tenant
Setiap resource milik user membawa `owner_account_id` (langsung atau via `invitation.owner_account_id`). Service wajib memanggil `assertOwnership(resource, session)` sebelum baca/tulis. Tidak ada endpoint yang menerima ID resource tanpa pemeriksaan ini (dokumen 16).

### 8.2 Soft delete & retensi
- Soft delete: undangan, media, tamu, theme/component (archived), user account.
- Hard delete terjadwal setelah masa pending (mis. 30 hari) oleh cleanup job — kecuali data yang regulasi minta lebih cepat.
- Retensi: `analytics_events` mentah 12 bulan (rollup permanen); `ai_provider_calls` 12 bulan; `auth_events` 6 bulan; `audit_logs` ≥ 24 bulan; snapshot published lama ≥ 3 versi terakhir per undangan.
- Penghapusan akun: anonymize (`account.deleted`, PII di-null), undangan published di-unpublish, media terjadwal hapus, audit log dipertahankan (actor dianonimkan).

### 8.3 Index & performa kueri (keputusan awal)
- Hot path publik: `slugs(slug)` unique; `invitations(slug_id)`; cache edge meminimalkan DB.
- Dashboard: (`owner_account_id`,`updated_at`) pada invitations; (`invitation_id`,`submitted_at`) pada rsvp.
- Admin/analitik: rollup harian, bukan scan event mentah.
- JSONB dipakai untuk dokumen konfigurasi, **bukan** untuk relasi; yang butuh join/Filter tetap kolom.

### 8.4 Migration aman
Semua lewat Prisma Migrate; aturan: expand → backfill batch → contract; larangan DROP kolom/tabel pada rilis yang sama dengan penulisan baru; setiap migration punya rencana rollback (revert deploy + forward-fix). Detail dokumen 25 §2.
