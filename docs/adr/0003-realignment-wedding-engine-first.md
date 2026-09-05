# ADR-0003 — Realignment Prioritas Utama: Wedding Engine First & Lean Foundation

**Status:** Accepted (2026-08-18)  
**Konteks:**  
Berdasarkan evaluasi strategis produk, risiko teknis dan bisnis terbesar dari platform SaaS undangan pernikahan digital bukanlah admin panel besar, marketplace, sistem pembayaran, ataupun custom domain DNS, melainkan **Wedding Engine**: kapabilitas sistem dalam menyimpan, mengatur, mengedit, merender, mem-preview, dan mempublikasikan berbagai variasi website undangan pernikahan berbasis arsitektur terstruktur (JSON-Driven Engine) yang fleksibel dan skalabel hingga ratusan tema tanpa duplikasi kode sumber.

Oleh karena itu, prioritas proyek dialihkan secara tegas ke pembangunan **Core Wedding Engine**, sementara admin panel besar dan fitur operasional enterprise ditunda ke fase lanjutan.

---

## Keputusan Arsitektur

1. **Prioritas Mutlak: Wedding Engine sebagai Core Foundation**
   - Undangan tidak direpresentasikan sebagai halaman React statis/hardcoded, melainkan sebagai dokumen **JSON Configuration** terstruktur yang tervalidasi skema Zod secara ketat.
   - Pemisahan tegas antara 6 konsep fundamental:
     1. **Component:** Modul UI reusable terdaftar dalam Component Registry.
     2. **Template:** Struktur hierarki, urutan section, dan komposisi layout.
     3. **Theme:** Sistem token visual (warna, tipografi, radius, shadow, background, animasi).
     4. **Content:** Data dinamis milik pasangan pengantin.
     5. **Invitation Configuration:** Gabungan data dan spesifikasi konfigurasi yang dibaca oleh renderer.
     6. **Renderer:** Mesin modular yang memproses configuration menjadi website undangan publik yang cepat dan responsif.
   - Skema konfigurasi memiliki versi (*Schema Versioning*) dengan strategi migrasi otomatis untuk menjamin *backward-compatibility*.

2. **Autentikasi & Ownership sebagai Fondasi Minimal**
   - Autentikasi tetap dibangun di awal sebagai fondasi kepemilikan (*multi-tenant ownership*): setiap undangan wajib dimiliki oleh pengguna terdaftar (`user_id`).
   - Sesi database kustom yang aman, ringan, dan mendukung `assertOwnership` pada seluruh domain services.

3. **Antarmuka Pengguna & Admin Tahap Awal yang Sederhana (Lean System Interface)**
   - Area antarmuka pengguna pasca-login difokuskan pada 6 fungsi inti:
     1. Dashboard Ringkas
     2. Undangan Saya (Daftar Undangan)
     3. Buat Undangan (Create Invitation Flow)
     4. Tema (Katalog Tema)
     5. Media (Galeri Aset)
     6. Pengaturan Akun
   - Fitur admin panel enterprise (User Management masif, Audit Center komprehensif, System Health Diagnostics, Feature Flag Matrix, Knowledge System, Skill Center, Billing/Payment) ditunda ke fase lanjutan setelah Wedding Engine tervalidasi.

4. **Sistem Publikasi & Slug Sederhana (Tanpa Custom Domain & DNS)**
   - Publikasi menggunakan URL berbasis slug unik pada domain utama platform: `domainplatform.com/{slug}`.
   - Slug bersifat unik, human-readable, URL-safe, divalidasi dan dijamin keunikannya oleh database constraint (bukan hanya frontend).
   - Custom domain, DNS mapping, dan automated SSL dicatat sebagai *future feature* dan sama sekali bukan dependensi Wedding Engine.

5. **AI Wedding Builder di Atas Engine**
   - AI diletakkan **di atas** Wedding Engine sebagai generator/mutator JSON Configuration, bukan sebagai generator kode React langsung.
   - Setiap output AI wajib divalidasi dengan skema Zod sebelum disimpan atau dirender.
   - Menggunakan layer abstraksi provider AI (Google Gemini sebagai implementasi awal).

6. **Roadmap Baru 14 Fase**
   - Fase 1: Authentication + Invitation Domain Foundation
   - Fase 2: Invitation JSON Schema + Versioning
   - Fase 3: Component Registry
   - Fase 4: Template Engine
   - Fase 5: Theme Engine
   - Fase 6: Wedding Renderer
   - Fase 7: Create Invitation Flow
   - Fase 8: Editor Foundation
   - Fase 9: Preview + Publish + Slug
   - Fase 10: AI Wedding Builder
   - Fase 11: Media + RSVP + Additional Wedding Features
   - Fase 12: Admin System
   - Fase 13: Advanced AI + Automation
   - Fase 14: Analytics + Growth Features

---

## Konsekuensi & Keuntungan

- **Mitigasi Risiko Teknis Utama:** Menguji dan membuktikan kelayakan *JSON-to-Visual rendering pipeline* sejak dini.
- **Skalabilitas Tema Tanpa Batas:** Menambah 100 tema baru hanya membutuhkan penambahan token konfigurasi JSON dan varian komponen, tanpa merekayasa ulang kode sumber aplikasi.
- **Pengembangan Cepat & Terfokus:** Menghindari *scope creep* dan pemborosan waktu pada dashboard admin yang belum memiliki konten inti untuk dikelola.
- **Keamanan & Konsistensi Data:** Kontrak skema Zod terpusat mencegah kebocoran data antar tenant dan menjamin validitas dokumen undangan.
