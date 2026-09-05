# ADR-0002 — Realignment Prioritas Fase 1: System Foundation & Backend Architecture

**Status:** Accepted (2026-08-18)
**Konteks:** Implementasi awal sebelumnya telah dihapus karena kualitasnya belum mencerminkan fondasi sistem yang solid dan skalabel. Diperlukan penegasan arah pengembangan bahwa platform adalah SaaS undangan pernikahan kompleks yang memerlukan fondasi backend, data model, AI task system, security, dan operasional yang sangat kokoh sebelum membangun visual renderer dan editor interaktif.

## Keputusan Arsitektur

1. **Prioritas Mutlak Fase 1:**
   - Fokus penuh pada **System Foundation & Backend Architecture**:
     - Arsitektur Modular Monolith (Next.js 15 App Router + TypeScript strict).
     - Database relational Neon PostgreSQL dengan Drizzle ORM (schema lengkap, indexes, constraints, migrations).
     - Autentikasi sesi database kustom yang aman (scrypt hashing, HttpOnly secure cookies, instant revocation) dan Otorisasi RBAC berbasis permission + resource ownership validation.
     - Model data & lifecycle undangan (Draft vs Published snapshot immutable, slug locking, versioning).
     - AI Abstraction Layer (AI Provider Gateway agnostic, saat ini default Google Gemini `gemini-flash-latest`).
     - AI Task & Resumable Job System dengan 11 state machine, checkpointing, exponential backoff, concurrency control, dan Vercel Cron continuation dengan distributed locking via Upstash Redis.
     - Media Storage Abstraction (ImageKit client direct upload token & server registration).
     - Email Service Abstraction (Resend transactional provider).
     - Admin System Management Panel fungsional untuk operasional (Users, Invitations, AI Tasks, Media, Flags, Audit Logs, Health).
     - Standar security, centralized Zod validation, error taxonomy, structured logging, dan testing harness.

2. **Fitur yang Ditunda (Deferred) ke Fase 2 dan 3:**
   - Public Wedding Website rendering & live public experience (Fase 2).
   - Theme Visual Engine, CSS token generation, WCAG contrast validator (Fase 2).
   - Component Registry & 15 section visual implementations (Fase 2).
   - Visual Drag-and-Drop Editor & Interactive Canvas (Fase 3).
   - AI Wedding Builder / Copilot live patch generator (Fase 3).
   - Guest Personal Links, Interactive Guestbook, Gift Registry, Music Player (Fase 2-3).

3. **Fitur Future-Ready (Belum Diputuskan / Tanpa Dependency Langsung):**
   - Payment Gateway (Midtrans/Xendit/Stripe) sengaja tidak diintegrasikan di Fase 1, namun arsitektur `subscriptions`, `entitlements`, dan `usage_counters` dibuat future-ready.
   - Custom Domain & Automatic SSL provisioning (Fase 4).

## Konsekuensi & Keuntungan

- **Stabilitas Tinggi:** Mencegah *technical debt* dan *flaky architecture* karena fondasi data, task, dan keamanan sudah terbukti tangguh sebelum lapisan visual dibangun.
- **Pengembangan Bertahap & Terukur:** Setiap fase memiliki batasan deliverable dan acceptance criteria yang jelas tanpa saling tumpang tindih.
- **AI Developer Friendly:** Struktur modular, boundary yang jelas, dan aturan < 500 baris per berkas memudahkan pengembangan otonom dibantu AI tanpa halusinasi arsitektur.
