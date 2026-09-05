# PROJECT STATE

> Sumber konteks utama untuk sesi AI/manusia berikutnya. WAJIB dibaca sebelum bekerja, WAJIB diperbarui setelah menyelesaikan pekerjaan.
> Terakhir diperbarui: 2026-08-17

## Kondisi saat ini

| Aspek | Nilai |
|---|---|
| Arsitektur | Modular monolith, Next.js 15 App Router, serverless-first |
| Skema dokumen undangan | **v1** (`src/renderer/document.ts`) |
| Database | Neon PostgreSQL — migrasi `drizzle/0000_init.sql` terapan |
| Provider AI | Gemini `gemini-flash-latest` (terverifikasi bekerja, structured output OK) |
| Media | ImageKit (`ik.imagekit.io/gwcapfcum`) |
| Email | Resend (`onboarding@resend.dev` — GANTI dengan domain sendiri di produksi) |
| Cache/limit | Upstash Redis (terverifikasi ping OK) |
| Build | ✅ `next build` lulus; ✅ typecheck lulus; ✅ 21 unit test lulus |
| Deploy | Belum dideploy ke Vercel (siap: `vercel.json` cron sudah ada) |

## Milestone selesai

- [x] F0: fondasi, config, DB, auth, seed, renderer, service
- [x] F1 (MVP): undangan dari DB → render JSON → publish → halaman publik → RSVP (E2E diuji via HTTP nyata)
- [x] F2 (sebagian besar): editor visual, media manager, guestbook/gift/musik, admin panel, AI gateway + copilot + theme generator, analytics, cron continuation, email

## Yang sudah diverifikasi nyata (bukan klaim)

- `GET /w/dinda-bima` → 200 (SSR, Bahasa Indonesia, tema elegan-emas)
- `POST /api/rsvp` → tersimpan ke Neon; `POST /api/guestbook` → tampil di GET
- `POST /api/analytics/collect` → 2 event tersimpan; cron → rollup berjalan
- `POST /api/admin/ai-test` (sesi admin) → 3 variasi konten Indonesia dari Gemini; task + provider call + kuota tercatat
- Cron tanpa secret → 401; `/dashboard` tanpa sesi → redirect /masuk; slug tak dikenal → 404
- Kontras WCAG tema bawaan diuji unit (temuan nyata: token sage lama gagal AA → diperbaiki)

## Task tertunda / diketahui

- E2E Playwright suite (sekarang: unit + smoke manual HTTP)
- Kolaborasi & revisi draft bertingkat; guest management (guest list + tautan personal per tamu)
- Custom domain (fase 4 PRD); payment (sengaja ditunda sesuai instruksi)
- Visual regression otomatis (golden screenshot) untuk registry

## Aturan penting jangka panjang

1. Baca `docs/adr/` sebelum mengubah keputusan; perubahan besar → ADR baru.
2. Semua output AI wajib lewat Zod schema (`modules/ai/schemas.ts`) — tanpa kecuali.
3. Draft ↔ published tetap terpisah; jangan pernah menulis ke `invitation_versions` di luar `publishInvitation()`.
4. File ≤ 500 baris; TS strict tanpa `any`.
5. UI selalu Bahasa Indonesia.
