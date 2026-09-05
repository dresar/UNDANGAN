# ADR-0001 — Penyesuaian Stack Implementasi terhadap PRD

**Status:** Accepted (2026-08-17)
**Konteks:** Instruksi implementasi menetapkan stack konkret yang berbeda sebagian dari rekomendasi PRD (dokumen `docs/prd/06`).

## Keputusan (delta terhadap PRD)

| Aspek | PRD | Implementasi | Alasan |
|---|---|---|---|
| ORM | Prisma | **Drizzle ORM** | Instruksi implementasi eksplisit; lebih ringan untuk serverless; migration via drizzle-kit |
| Media | Cloudflare R2 | **ImageKit** | Kredensial tersedia; transformasi on-the-fly & CDN bawaan; antarmuka tetap terpusat di `modules/media` sehingga dapat diganti |
| Queue/durable job | Inngest | **Task state machine di Neon + Redis lock + cron Vercel** (`/api/cron/ai-tasks`) | Tanpa layanan tambahan; DB = source of truth; idempoten; sesuai mandat "serverless-compatible scheduler" |
| Auth | Auth.js v5 | **Sesi database buatan sendiri** (scrypt + cookie HttpOnly + tabel sessions) | Lebih sedikit dependensi; revokasi instan; AUTH_SECRET tetap dipakai untuk hashing IP; tetap memenuhi seluruh persyaratan keamanan PRD |
| RBAC | Tabel DB | **Matriks statis terpusat** (`src/lib/rbac.ts`) | Diverifikasi server-side per request; cukup untuk fase awal; migrasi ke tabel DB tinggal menambahkan tabel (bagian roadmap) |
| Animasi publik | Sistem internal tanpa library | **CSS/IntersectionObserver ringan** (Reveal) — tanpa Framer Motion di bundle publik | Lebih ringan dari mandat "Gunakan Motion"; Reveal + transisi CSS menutup kebutuhan; PRD melarang library animasi berat di halaman tamu |
| Model AI | Gemini generik | **gemini-flash-latest** (alias stabil) | `gemini-2.5-flash` sudah tidak tersedia bagi pengguna baru (diverifikasi 2026-08-16); alias mengikuti model stabil otomatis |

## Konsekuensi

- Semua prinsip arsitektur PRD lainnya (JSON-driven renderer, draft/published, checkpoint, risk gate, Bahasa Indonesia) tetap berlaku penuh.
- Pergantian ImageKit/Resend/Gemini di masa depan hanya menyentuh satu modul boundary (`modules/media`, `modules/email`, `modules/ai/provider+gemini`).
