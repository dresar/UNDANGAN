# 01 — Ringkasan Eksekutif

## 1. Produk dalam satu paragraf

Kami membangun **Wedding Experience Platform** — platform SaaS yang memungkinkan siapa pun membuat website undangan pernikahan premium, interaktif, dan emosional dengan pekerjaan manual seminimal mungkin. Platform bukan sekadar template undangan statis: sebuah **rendering engine berbasis JSON** menggabungkan *data undangan + template (struktur pengalaman) + theme (identitas visual) + component registry + konfigurasi animasi* menjadi website undangan yang unik untuk setiap pasangan, tanpa hardcode halaman per client. Lapisan **AI operating system** (planner, designer, content generator, theme generator, reviewer, tester, maintenance assistant) mengotomatisasi perancangan, penulisan, pengujian, dan perawatan — baik untuk membantu pengguna akhir di dalam editor, maupun membantu tim pengembangan membangun dan merawat platform itu sendiri.

## 2. Masalah yang diselesaikan

1. **Bagi pasangan (pengguna akhir):** undangan digital yang ada umumnya terbatas pada template mati, sulit dikustomisasi, terlihat sama antar pengguna, dan proses pembuatannya manual (pilih template → isi form → minta revisi ke vendor → tunggu). Kami menggantinya dengan editor visual + AI copilot yang menghasilkan undangan terasa custom-desain dalam hitungan menit.
2. **Bagi perusahaan (penyedia undangan):** vendor undangan digital saat ini membuat "satu website per client" secara manual — tidak scalable, margin habis oleh pekerjaan tangan. Kami membangun *engine*, bukan *halaman*: satu engine menghasilkan ribuan variasi undangan dari kombinasi data + template + theme + component.
3. **Bagi tim pengembangan internal:** proyek sekelas ini biasanya lambat karena semua pekerjaan (desain tema baru, komponen baru, konten, pengujian) dilakukan manual. Kami membangun dari hari pertama sistem di mana AI adalah *tenaga engineering tambahan* yang terkontrol — dengan schema, validator, guardrail, dan approval policy.

## 3. Proposisi nilai inti

| Untuk siapa | Nilai |
|---|---|
| Pasangan/pengguna akhir | Undangan yang terasa seperti karya desainer profesional: storytelling, animasi elegan, RSVP, guestbook, kado digital, galeri, musik, hitung mundur — dibuat dalam menit, diedit tanpa koding, dibantu AI copilot berbahasa Indonesia. |
| Pemilik bisnis | Satu engine + banyak output. Penambahan tema/komponen/fitur bersifat *konfigurasi & generasi terkontrol*, bukan proyek baru. Biaya AI dikendalikan oleh kuota & caching. |
| Pengembang/AI dev system | Proyek dengan arsitektur modular, standar ketat, ADR, knowledge base, checkpoint, dan task orchestration — AI dapat bekerja panjang, terhenti, dan melanjutkan tanpa kehilangan konteks. |

## 4. Ringkasan arsitektur (gambar besar)

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PLATFORM WEDDING EXPERIENCE                    │
│                                                                        │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐  │
│  │  Aplikasi    │   │  Website     │   │  Admin Panel             │  │
│  │  User        │   │  Undangan    │   │  (operasional perusahaan)│  │
│  │  (dashboard, │   │  Publik      │   │                          │  │
│  │  editor,     │   │  (SSR, JSON- │   │                          │  │
│  │  media, RSVP │   │   driven)    │   │                          │  │
│  │  mgmt)       │   │              │   │                          │  │
│  └──────┬───────┘   └──────┬───────┘   └────────────┬─────────────┘  │
│         │                  │                        │                │
│  ═══════╪══════════════════╪════════════════════════╪══════════════  │
│         │          MODULAR MONOLITH (serverless-first)               │
│  ┌──────┴──────────────────┴────────────────────────┴─────────────┐  │
│  │  Modul Domain: auth · user · invitation · theme · component ·  │  │
│  │  template · media · guest/rsvp · analytics · subscription ·    │  │
│  │  domain · ai · task · admin · audit · notification             │  │
│  └──────┬───────────────────────────────────────────┬─────────────┘  │
│         │                                           │                │
│  ┌──────┴───────────┐                    ┌──────────┴─────────────┐  │
│  │  AI GATEWAY      │                    │  INFRASTRUKTUR         │  │
│  │  (provider-      │                    │  PostgreSQL (Neon)     │  │
│  │  agnostic;       │                    │  Object storage + CDN  │  │
│  │  default: Gemini │                    │  Queue/cron (Inngest)  │  │
│  │  free tier)      │                    │  Redis (rate/cache)    │  │
│  └──────────────────┘                    └────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

Prinsip utama arsitektur (detail di dokumen 05):

1. **Modular monolith, serverless-first** — bukan microservice di hari pertama; boundary modul jelas sehingga worker AI, analytics ingestion, atau media processing dapat diekstrak menjadi service terpisah nanti tanpa rewrite total.
2. **JSON-driven rendering** — undangan = data terstruktur tervalidasi schema, bukan halaman hardcode. Draft dan published dipisah; published = snapshot immutable yang bisa di-rollback.
3. **Template ≠ Theme** — template menentukan *struktur pengalaman* (urutan section), theme menentukan *identitas visual* (token, tipografi, dekorasi, personalitas animasi). Keduanya dikombinasikan lewat compatibility rules.
4. **AI-first tetapi engineering-first** — semua output AI berbentuk structured output tervalidasi schema; AI tidak pernah menyentuh production tanpa validasi, preview, testing, dan approval sesuai tingkat risiko.
5. **Pekerjaan AI bersifat resumable** — task state machine + checkpoint + scheduler, sehingga batas output/rate limit provider gratis tidak membatalkan pekerjaan, hanya *menjeda*-nya.

## 5. Ringkasan roadmap

| Fase | Fokus | Hasil kunci |
|---|---|---|
| Fase 0 | Fondasi engineering | Repo, CI/CD, standar kode, auth, skema DB inti, project state & ADR |
| Fase 1 (MVP) | Engine undangan end-to-end | Invitation CRUD, JSON schema v1, renderer, komponen inti, theme dasar, preview, publish, RSVP dasar |
| Fase 2 | Editor & operasional | Editor visual, media manager, guestbook/gift/musik, AI content assistant, analytics dasar, admin panel |
| Fase 3 | Generatif skala | AI theme generator, AI builder/copilot editor, template system penuh, pipeline komponen AI, subscription |
| Fase 4 | Infrastruktur bisnis | Custom domain, analytics lanjutan, observability mendalam, AI maintenance loop, visual regression skala penuh |
| Fase 5+ | Ekspansi | Marketplace tema, varian acara lain (ditunda sengaja), dsb. |

Kriteria lolos per fase dijabarkan di dokumen 23.

## 6. Keputusan paling berisiko (pra-ringkas)

1. **Gemini free tier sebagai provider AI default** — biaya nol di awal, tetapi rate limit & batas output. Mitigasi: AI gateway provider-agnostic + task resumable + kuota.
2. **Serverless-first (Vercel + Neon)** — beban operasional minimal, tetapi ada risiko biaya di skala sangat besar. Mitigasi: abstraksi infrastruktur & rencana ekstraksi worker (dokumen 25).
3. **Renderer buatan sendiri berbasis JSON** — investasi awal lebih besar daripada pakai template statis, tetapi inilah inti keunggulan produk jangka panjang.

## 7. Definisi sukses produk

- Pengguna non-teknis dapat menghasilkan undangan published yang layak pakai dalam **satu sesi ≤ 30 menit** tanpa menyentuh kode.
- Menambah **satu theme baru** tidak membutuhkan perubahan besar pada kode komponen yang ada.
- Menambah **satu variant komponen baru** tidak merusak variant/theme yang lama (diverifikasi visual regression).
- Tamu undangan mendapat halaman yang cepat (LCP < 2,5 dtk di 4G) dan indah di ponsel kelas bawah.
- Pekerjaan pengembangan yang dibantu AI dapat berjalan panjang, terputus, dan dilanjutkan tanpa kehilangan konteks — terukur dari task registry.
