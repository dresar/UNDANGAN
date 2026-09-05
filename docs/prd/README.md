# PRD & Blueprint Arsitektur — Platform Undangan Pernikahan AI

> **Status dokumen:** DRAFT v1.0 — menunggu review & ACC dari pemilik produk.
> **Tanggal:** 2026-08-17
> **Bahasa:** Bahasa Indonesia (bahasa resmi seluruh produk, dokumentasi, UI, dan output AI yang menghadap pengguna)
> **Sifat:** Dokumen ini adalah kontrak kerja pengembangan. Tidak ada satu baris kode implementasi boleh ditulis sebelum dokumen ini disetujui (ACC).

---

## Apa dokumen ini

Dokumen ini adalah PRD (Product Requirements Document) dan blueprint arsitektur lengkap untuk membangun **Wedding Experience Platform** — platform SaaS pembuat website undangan pernikahan digital interaktif yang digerakkan oleh engine berbasis JSON dan diperkuat otomatisasi AI tingkat tinggi.

Dokumen ini ditujukan untuk dibaca oleh:

1. **Pemilik produk** — untuk memahami visi, memvalidasi arah, dan memberikan ACC.
2. **AI developer assistant** — sebagai konteks utama sebelum merencanakan dan mengerjakan task apa pun pada fase implementasi.
3. **Insinyur manusia** — sebagai referensi arsitektur, keputusan, dan batasan.

## Prinsip pembacaan

- Dokumen disusun modular, satu aspek per dokumen, agar mudah dirujuk dan tidak menjadi "satu dokumen raksasa usang".
- Setiap keputusan penting disertai **alasan** dan **alternatif yang dipertimbangkan**.
- Dokumen ini sengaja tidak memuat kode implementasi. Contoh struktur JSON/schema hanya berupa *ilustrasi bentuk data*, bukan kode final.
- Nomor keputusan arsitektur akan dimigrasi menjadi ADR (Architecture Decision Record) resmi saat fase implementasi dimulai.

## Peta dokumen

| # | Dokumen | Isi utama |
|---|---------|-----------|
| 01 | [Ringkasan Eksekutif](01-ringkasan-eksekutif.md) | Gambaran produk, proposisi nilai, ringkasan arsitektur, ringkasan roadmap |
| 02 | [Visi, Problem, & Pengguna](02-visi-problem-pengguna.md) | Visi produk, problem statement, target pasar, persona, goals & non-goals |
| 03 | [Perjalanan Pengguna](03-perjalanan-pengguna.md) | Core user journey, admin journey, AI journey, system journey |
| 04 | [Peta Fitur](04-peta-fitur.md) | Feature map lengkap dengan ID fitur, prioritas, dan dependensi |
| 05 | [Prinsip Arsitektur](05-prinsip-arsitektur.md) | Prinsip fundamental, aturan desain, coding standard, arsitektur data & sistem |
| 06 | [Pemilihan Teknologi](06-pemilihan-teknologi.md) | Stack terpilih + evaluasi alternatif + trade-off + vendor lock-in analysis |
| 07 | [Peta Modul](07-peta-modul.md) | Module map, boundary, dependency graph antar modul |
| 08 | [Model Data](08-model-data.md) | Entity, relasi, indeks, strategi versi, ownership, soft delete, retensi |
| 09 | [Rendering Engine](09-rendering-engine.md) | JSON-driven renderer, validasi, compatibility, migrasi schema |
| 10 | [Theme Engine](10-theme-engine.md) | Theme definition, design token, validator, AI theme generator pipeline |
| 11 | [Component Engine](11-component-engine.md) | Component registry, variant, props schema, pipeline generasi & publikasi |
| 12 | [Editor](12-editor.md) | Visual editor, AI copilot, rekomendasi, kontrol manual penuh |
| 13 | [Arsitektur AI](13-arsitektur-ai.md) | AI gateway, provider abstraction, task state machine, checkpoint, scheduler |
| 14 | [Skill System](14-skill-system.md) | AI skill system, versi, seleksi otomatis, update workflow |
| 15 | [Pengembangan Otonom](15-pengembangan-otonom.md) | Task orchestration, project state, ADR, knowledge base, continuation |
| 16 | [Keamanan](16-keamanan.md) | AuthN/AuthZ, ownership, rate limit, upload, secret, audit, CSP |
| 17 | [Persyaratan Non-Fungsional](17-nfr.md) | Performance, scalability, reliability, accessibility, privasi |
| 18 | [Analytics](18-analytics.md) | Event model, batching, rollup, dashboard, privasi |
| 19 | [Monetisasi & Domain](19-monetisasi-domain.md) | Plan, entitlement, kuota AI, payment abstraction, custom domain |
| 20 | [Deployment & CI/CD](20-deployment-cicd.md) | Serverless-first, environment, pipeline, rollback, backup |
| 21 | [Strategi Testing](21-testing.md) | Unit, integration, E2E, visual regression, a11y, performance, kontrak |
| 22 | [Observabilitas & Maintenance](22-observabilitas-maintenance.md) | Logging, monitoring, error taxonomy, AI quality loop, bug learning |
| 23 | [Roadmap & Acceptance Criteria](23-roadmap.md) | Fase, milestone, kriteria lolos per fase, MVP scope |
| 24 | [Risk Register & Trade-off](24-risiko-tradeoff.md) | Risiko teknis & bisnis, mitigasi, analisis trade-off utama |
| 25 | [Migrasi, Biaya, & Ekspansi](25-migrasi-biaya-ekspansi.md) | Strategi migrasi data/schema, cost control, ekspansi jangka panjang |

## Aturan mutlak selama fase PRD

1. **Tidak ada implementasi.** Tidak ada kode, scaffolding project, dependency, atau migration sebelum ACC.
2. **Satu sumber kebenaran.** Jika ada konflik antar bagian, urutan prioritas: dokumen 05 (prinsip) → dokumen spesifik domain → contoh ilustrasi.
3. **Perubahan terkontrol.** Revisi PRD setelah ACC dicatat sebagai changelog di dokumen terkait, bukan diam-diam diubah.
