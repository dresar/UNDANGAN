# 06 — Pemilihan Teknologi & Analisis Trade-off

Setiap pilihan di bawah: **rekomendasi utama + alternatif yang dipertimbangkan + alasan + risiko/lock-in + jalan keluar**. Prinsip: sedikit library, alasan tertulis, tidak ikut tren.

---

## 1. Ringkasan stack terpilih

| Lapisan | Pilihan | Alternatif serius yang ditolak |
|---|---|---|
| Bahasa | TypeScript (strict) | JavaScript biasa; Go/Elixir backend terpisah |
| Framework app | **Next.js (App Router)** | Remix, Nuxt, SvelteKit, SPA+API terpisah |
| Database | **PostgreSQL — Neon** | Supabase (bundel), RDS/Cloud SQL, MongoDB |
| ORM | **Prisma** | Drizzle, Kysely, raw SQL |
| Validasi/schema | **Zod** | Valibot, Yup, AJV |
| Auth | **Auth.js v5 + adapter Prisma** | Clerk, Supabase Auth, buatan sendiri |
| UI dashboard/editor | **Tailwind CSS + shadcn/ui** | MUI, Chakra, Ant Design |
| State editor | **Zustand** | Redux Toolkit, Jotai, Context murni |
| Server state | **TanStack Query** | SWR, Redux Query |
| Animasi publik | **Sistem animasi internal (CSS/WAAPI + IntersectionObserver)** | Framer Motion, GSAP di halaman publik |
| Queue & durable job | **Inngest** | QStash + state machine buatan, BullMQ + VPS |
| Cache & rate limit | **Upstash Redis** | Redis VPS, tabel DB rate limit |
| AI SDK | **Vercel AI SDK** (provider default: **Google Gemini free tier**) | SDK provider langsung, LangChain |
| Object storage | **Cloudflare R2 + CDN** | S3+CloudFront, Cloudinary, UploadThing |
| Email | **Resend** | SES, Mailgun |
| Error/monitoring | **Sentry** | GlitchTip, tanpa monitoring |
| Testing | **Vitest + Playwright + Testing Library** (+ axe, Lighthouse CI) | Jest, Cypress |
| Hosting | **Vercel** | Cloudflare Pages/Workers, VPS + Docker |
| Pembayaran (pasca-MVP) | Abstraksi `PaymentProvider` → kandidat **Midtrans** | Xendit, Stripe (kurang cocok domestik ID) |

## 2. Analisis pilihan penting

### 2.1 Framework: Next.js (App Router)

- **Alasan:** satu framework untuk (a) SSR halaman undangan publik — krusial untuk SEO/OG share & kecepatan first paint; (b) route handlers API serverless; (c) tooling matang; (d) dokumentasi & ekosistem terbesar → paling ramah developer pemula & paling dikenal AI coding assistant.
- **Alternatif ditolak:** SPA+API terpisah (SEO & kompleksitas deploy dua app); SvelteKit/Nuxt (ekosistem lebih kecil untuk kebutuhan kompleks ini); Remix (kandidat kuat, namun ekosistem & tenaga kerja lebih kecil di pasar ID).
- **Risiko & jalan keluar:** evolusi API cepat (perlu disiplin versi Next); abstraksi routing tetap di lapisan `app/` yang tipis sehingga migrasi framework masa depan tidak menyentuh business logic.

### 2.2 Database: PostgreSQL di Neon

- **Alasan:** kebutuhan relational ketat (FK, unique, transaksi, index) sesuai model data; **serverless-first** (scale-to-zero, branching DB untuk preview/CI); Postgres standar industri → pintu keluar mudah (hindari lock-in); mendukung JSONB untuk konfigurasi undangan.
- **Alternatif ditolak:** Supabase (menarik karena auth+storage bundled, tapi mengunci arsitektur auth & storage ke satu vendor dan kontrol migration lebih rumit — dipilih komponen terbaik per lapisan); MongoDB (relasi & integrity lemah untuk domain ini); RDS/CloudSQL (opsional di kemudian saat skala besar, biaya tetap sejak awal).
- **Catatan:** semua akses hanya lewat Prisma + repository layer → pindah provider Postgres lain relatif murah.

### 2.3 ORM: Prisma

- **Alasan:** schema deklaratif mudah dibaca pemula; **migration tooling terbaik kelasnya** (sesuai kebutuhan migration aman & terlacak); client fully-typed; dokumentasi pusat & lengkap.
- **Alternatif ditolak:** Drizzle (lebih ringan cold-start, SQL-first — kuat, tapi menuntut pemahaman SQL lebih dalam & migration tooling lebih muda untuk tim pemula); Kysely (query builder saja, tanpa migrasi).
- **Risiko & jalan keluar:** cold start serverless & ukuran engine → gunakan driver adapter serverless resmi; kinerja query panas diperiksa maintenance loop, hot path dapat dioptimasi raw SQL melalui repository tetap.

### 2.4 Validasi: Zod (satu sumber kebenaran bentuk data)

- Zod dipakai di: form editor, API input, JSON undangan, output AI terstruktur, environment config. Ini menyatukan validasi lintas client/server/AI — komponen kunci dari seluruh arsitektur AI (dokumen 13).

### 2.5 Auth: Auth.js v5

- **Alasan:** standar de-facto Next.js; mendukung Google OAuth + credentials + magic link; session strategy database (bukan JWT stateless) agar revokasi sesi langsung (keamanan); adapter Prisma resmi.
- **Alternatif ditolak:** Clerk (fitur lengkap, tapi vendor lock-in + biaya per MAU yang cepat membesar — bertentangan dengan cost-control); auth buatan sendiri (risiko keamanan tinggi, dilarang).
- **Syarat keamanan tambahan:** rate limit login, lockout sementara, 2FA TOTP untuk admin (dokumen 16).

### 2.6 Animasi halaman publik: sistem internal ringan

- **Alasan:** halaman tamu adalah produk sesungguhnya dan harus super ringan di ponsel murah. Framer Motion (~30–50 kB gz) & GSAP (~60–70 kB gz) terlalu berat untuk kebutuhan preset animasi terbatas (reveal, parallax ringan, fade/slide/scale, stagger). Sistem internal: CSS transitions/keyframes + Web Animations API + IntersectionObserver, terkontrol preset (dokumen 10 §animasi).
- **Alternatif ditolak untuk publik:** Framer Motion/GSAP — namun **diperbolehkan di dashboard/editor** (bukan halaman publik) jika menyederhanakan UX editor.
- **Trade-off diterima:** menulis & merawat sistem animasi sendiri (~beberapa ratus baris) — imbalan bundel publik minimal & kontrol penuh atas reduced-motion.

### 2.7 Queue & pekerjaan tahan-lama: Inngest

- **Alasan:** kebutuhan inti arsitektur AI = pekerjaan panjang yang dapat **berhenti & dilanjutkan** (checkpoint), retry dengan backoff, cron/scheduler, dan step yang idempoten. Inngest dirancang persis untuk ini di atas serverless (step functions durable), gratis di tier awal, tanpa mengelola Redis/BullMQ/VPS.
- **Alternatif ditolak:** QStash (queue HTTP saja — state machine & checkpoint harus dibangun sendiri; jadi fallback plan bila Inngest bermasalah); BullMQ (butuh VPS/worker aktif — melanggar serverless-first).
- **Prinsip penting:** **DB tetap source of truth** (`ai_tasks`, `ai_checkpoints`); Inngest hanya *driver eksekusi*. Jika suatu saat harus ganti driver, state di DB utuh dan dapat dijalankan ulang (dokumen 13 §8).

### 2.8 AI: Vercel AI SDK dengan provider default Gemini (free tier)

- **Alasan:** AI SDK abstraksi provider (Google/OpenAI/Anthropic/Groq/dll.) → **provider-agnostic** sesuai mandat; `generateObject` dengan Zod = structured output native sesuai kebutuhan validasi; logging usage/token per call mudah dihubungkan gateway internal.
- **Gemini free tier** = biaya Rp0 di awal dengan kualitas memadai untuk konten/tema terstruktur; batas (rate limit, output, quota) ditangani arsitektur resumable (dokumen 13).
- **Alternatif ditolak:** LangChain (abstraksi berlapis, terlalu berat & abstrak untuk kasus ini, sering menghalangi debugging); SDK provider langsung (mengunci provider, melanggar mandat agnostik).
- **Riska & jalan keluar:** perubahan kebijakan free tier → tambah provider fallback di gateway (Groq/OpenAI) tanpa mengubah business logic; pemantauan biaya di admin.

### 2.9 Storage media: Cloudflare R2

- **Alasan:** kompatibel API S3; **egress gratis** (krusial: undangan = banyak foto dibuka ribuan tamu); murah untuk storage; pasangan sempurna CDN.
- **Alternatif ditolak:** S3+CloudFront (bagus tapi egress berbayar); Cloudinary (transformasi image built-in bagus, tapi biaya tumbuh cepat & lock-in — dicadangkan sebagai fallback transformasi); UploadThing (DX enak, tapi abstraksi menutup kontrol pipeline optimasi).
- **Pipeline optimasi gambar sendiri:** resize/WebP/AVIF via `sharp` pada fungsi serverless, hasil di-cache di storage/CDN; dibelakang antarmuka `StorageProvider` agar vendor dapat diganti.

### 2.10 Hosting: Vercel

- **Alasan:** serverless-first native untuk Next.js; preview deployment per PR (penting untuk gate review & visual test); zero-ops di awal.
- **Risiko:** biaya di trafik sangat besar & lock-in fitur platform. **Jalan keluar wajib dirancang:** (a) logika app tidak memakai API proprietary di luar konvensi Next.js; (b) worker berat (AI/pipeline) via Inngest dapat diarahkan ke runtime lain; (c) evaluasi migrasi ke Cloudflare/containers saat tagihan melampaui ambang (dokumen 25 menetapkan trigger & rencana).

### 2.11 Observability: Sentry + structured logging

- Sentry (error + performance, free tier memadai awal) + JSON log terstruktur dengan `requestId`/`correlationId` (dokumen 22). Health endpoint & halaman diagnostics admin. Menolak stack observability berat (Datadog dkk.) sebelum butuh.

### 2.12 Testing: Vitest + Playwright (+ axe-core, Lighthouse CI)

- Vitest (cepat, kompatibel ekosistem TS), Playwright untuk E2E + **visual regression berbasis screenshot** (menggantikan Chromatic berbayar), axe-core untuk a11y, Lighthouse CI dengan anggaran performa per PR. Detail di dokumen 21.

### 2.13 Pembayaran: abstraksi `PaymentProvider`, kandidat Midtrans (pasca-MVP)

- Pasar Indonesia → Midtrans Snap (SDK & dokumentasi lokal, channel QRIS/VA/e-wallet lengkap). Dilarang memanggil SDK provider langsung dari business logic; wajib lewat antarmuka `PaymentProvider` agar Xendit/dll. dapat ditambah.

## 3. Yang sengaja TIDAK dipakai (dan alasannya)

| Teknologi | Alasan tidak dipakai |
|---|---|
| Microservices / k8s | Overkill awal; modular monolith cukup (mandat PRD) |
| GraphQL | Satu klien utama (aplikasi sendiri); REST + Zod lebih sederhana |
| Tailwind + CSS-in-JS campuran | Pilih satu (Tailwind + CSS variables untuk token theme) |
| Redux | Overkill; Zustand + TanStack Query menutup kebutuhan |
| Framer Motion di halaman publik | Berat untuk tamu mobile; hanya untuk dashboard/editor |
| LangChain/LlamaIndex | Abstraksi berlebih untuk kasus terstruktur ini |
| Monorepo multi-paket awal | Satu app dulu; batas modul via folder & aturan impor (boleh diekstrak nanti) |
| Self-hosted analytics (Plausible/Matomo) di awal | Analytics internal sendiri lebih terkontrol & gratis (dokumen 18) |

## 4. Kriteria umum menambah dependensi baru (checklist wajib)

1. Masalah nyata apa yang diselesaikan? Tidak ada solusi ≤ 50 baris internal?
2. Ukuran dampak bundle (untuk kode publik) & lisensi (MIT/Apache preferensi).
3. Kualitas dokumentasi & pemeliharaan (commit terakhir, issue terbuka).
4. Rencana bila library mati (seberapa mudah diganti/di-fork)?
5. Tercatat di ADR ringkas / deskripsi PR.
