# 05 — Prinsip Arsitektur, Aturan Desain, & Coding Standard

Dokumen ini adalah konstitusi teknis project. Jika dokumen lain bertentangan dengan dokumen ini, dokumen ini yang menang. Setiap keputusan besar implementasi wajib bisa dipetakan ke prinsip di sini (atau membuat ADR baru yang mengubahnya secara eksplisit).

---

## 1. Sepuluh prinsip fundamental

1. **Engine, bukan halaman.** Semua website undangan dihasilkan satu rendering engine dari data terstruktur. Tidak ada halaman per client yang di-hardcode.
2. **Pemisahan lima lapis.** Data undangan · struktur halaman (template) · identitas visual (theme) · definisi komponen (registry) · konfigurasi sistem — masing-masing berversi dan dapat berubah independen lewat compatibility contract.
3. **AI-first, engineering-first.** AI adalah executor & asisten dalam pipa engineering: schema → validasi → test → preview → approval. AI tidak pernah menjadi sumber kebenaran tanpa validasi.
4. **Serverless-first, modular monolith.** Satu deployment, banyak modul dengan boundary keras. Ekstraksi service hanya bila terbukti perlu (dokumen 25).
5. **Resumable by design.** Semua pekerjaan panjang (AI generation, pipeline asset, pengembangan otonom) berbasis task state machine + checkpoint; kegagalan parsial bukan kegagalan total.
6. **Draft/published terpisah absolut.** Halaman publik hanya membaca snapshot published tervalidasi; editor hanya menulis draft.
7. **Keamanan & ownership di server.** UI menyembunyikan tombol hanya demi kenyamanan; kebenaran akses ditentukan server untuk setiap request/resource.
8. **Bahasa Indonesia untuk manusia.** Semua yang menghadap pengguna (UI, error, onboarding, dok, output AI) berbahasa Indonesia; identifier teknis tetap Inggris.
9. **Batas biaya eksplisit.** Setiap sumber biaya (AI, storage, bandwidth, compute) punya kuota, cache, cleanup, dan dashboard pemantauan.
10. **Dapat diaudit.** Tindakan penting (publish, role change, setting change, AI approval, deletion) menghasilkan audit log.

## 2. Aturan desain arsitektur

### 2.1 Struktur internal aplikasi (layering)

```
app/ (routing & entry — TIPIS, tanpa business logic)
 └─ modules/<domain>/            ← batas modular
     ├─ api/        route handlers (validasi input, authz, panggil service)
     ├─ service/    business logic (satu tanggung jawab, testable)
     ├─ repository/ akses DB satu-satunya (query hanya di sini)
     ├─ schema/     Zod schema (input, output, entity)
     └─ types/      tipe domain
 shared/            ← lintas modul: util, konstanta, tipe umum
 components/         ← UI reusable dashboard/editor (design system)
 renderer/           ← engine undangan publik (terisolasi dari app dashboard)
```

Aturan ketergantungan satu arah: `app → modules → shared`. Modul boleh memanggil service modul lain **hanya lewat antarmuka service** (bukan repository-nya langsung), dan ketergantungan antar modul harus tercatat di peta modul (dokumen 07).

### 2.2 Isolasi renderer publik

- Renderer undangan publik (`renderer/`) tidak boleh mengimpor kode dashboard/editor (agar bundel publik kecil dan aman).
- Renderer menerima: `invitation published JSON + theme definition + component implementations (registry) + renderer config` — semua tervalidasi sebelum render.
- Renderer bersifat **deterministik & pure** terhadap input yang sama (memudahkan visual regression & caching).

### 2.3 Versioning lima sumbu

| Sumbu | Versi di | Perubahan dikendalikan oleh |
|---|---|---|
| Schema undangan (JSON) | `schemaVersion` dalam JSON | Migration transformer (dokumen 09) |
| Renderer | versi paket/registry renderer | Compatibility check saat render |
| Theme | `theme_versions` | Validator + pipeline publish |
| Component | `component_versions` | Pipeline registry (dokumen 11) |
| Template | `template_versions` | Validator struktur |

Aturan kompatibilitas: render hanya berjalan bila **semua** versi dinyatakan kompatibel; jika tidak, sistem mencoba migration transformer; jika tetap tidak kompatibel, halaman fallback aman + alert admin (tidak pernah crash putih).

### 2.4 Penanganan konfigurasi

- Environment/secret hanya via environment variables platform (dan secret manager bila tersedia) — tidak pernah di repo, tidak pernah di log, tidak pernah di output AI.
- Konfigurasi runtime non-rahasia (limit upload, preset animasi) di `system_settings` (DB) yang dapat diubah admin + tercatat audit.
- Feature flag (dokumen 04 A-09) mengendalikan fitur besar — tidak ada fitur besar tanpa flag & kill switch.

## 3. Coding standard (wajib, ditegakkan CI)

### 3.1 Bahasa & tipe

- TypeScript **strict**, `noUncheckedIndexedAccess`, tanpa `any` (boleh `unknown` + narrowing). ESLint + Prettier + TypeScript strict sebagai gate PR.
- Semua batas data eksternal (API request/response, output AI, JSON undangan, form) melalui **Zod schema**; hasil parse ber-tipe, bukan asumsi.

### 3.2 Ukuran & struktur file

- **Maksimal 500 baris per file source.** Komponen idealnya < 200 baris; satu tanggung jawab utama per file.
- Dilarang "giant component"; pecah berdasarkan tanggung jawab (data fetch vs presentasi vs orkestrasi).
- Fungsi ≤ 50 baris sebagai panduan keras; kompleksitas kognitif dijaga rendah (diperiksa review, bukan alat).

### 3.3 Pemisahan tanggung jawab

- **Page/route component tipis**: hanya menyusun layout, memanggil service/server action, menampilkan hasil.
- **Business logic di service**; **query DB hanya di repository**; dilarang query DB tersebar di komponen/route.
- **Tidak ada duplikasi utilitas**: utilitas umum hanya di `shared/`; sebelum menambah utilitas, cari yang sudah ada (ditegakkan review + AI code reviewer).

### 3.4 Konvensi penamaan & bahasa

- Identifier kode (variabel, fungsi, file): Inggris; pesan UI & dokumen: Indonesia.
- File komponen React `PascalCase.tsx`; service `xxx.service.ts`; repository `xxx.repository.ts`; schema `xxx.schema.ts`.
- Branch: `feature/<id-task>-deskripsi-ringkas`; commit conventional (`feat:`, `fix:`, `chore:` …) dalam Bahasa Indonesia opsional pada body.

### 3.5 Dependensi

- Setiap dependency baru wajib punya **alasan tertulis** (di ADR ringkas atau deskripsi PR): masalah apa, alternatif apa yang ditolak, dampak bundle/keamanan.
- Tidak menambah library hanya karena populer. Prioritas: maintainability, performance, security, compatibility, dokumentasi, ramah developer pemula.
- Review dependensi berkala (audit + versi) oleh maintenance loop.

### 3.6 Testing & mutu (ringkas — detail dokumen 21)

- Logika murni & schema: unit test wajib.
- Service + repository: integration test terhadap DB uji.
- Alur kritis (login, buat undangan, publish, RSVP): E2E wajib.
- Component registry: render test + visual regression sebelum publish.
- PR tanpa lulus lint/typecheck/test tidak dapat merge (pipeline = gatekeeper).

### 3.7 Batas output AI

- AI tidak menulis langsung ke production. Artefak AI (kode komponen, theme, konten) masuk **pipeline** dengan status draft → validasi → test → preview → approval.
- Semua keluaran AI berbentuk structured output sesuai Zod schema task tersebut.

## 4. Prinsip data (dirinci di dokumen 08)

- Relational (PostgreSQL), bukan satu tabel raksasa; entity terpisah sesuai domain.
- Semua tabel penting: UUID primary key, `created_at`/`updated_at`, soft delete (`deleted_at`) untuk data yang perlu dipulihkan, ownership eksplisit (`user_id`/`invitation_id`).
- Retensi & cleanup didefinisikan per kelas data (analytics, job, media orphan).
- Migration selalu additive-first; perubahan destruktif bertahap (expand → migrate → contract) dengan rencana rollback.

## 5. Prinsip pengalaman (UX engineering)

- Mobile-first sungguhan: desain & uji di viewport kecil dulu, jaringan lambat disimulasikan.
- Animasi elegan, bukan ramai: durasi & easing terkendali preset; otomatis `none` untuk `prefers-reduced-motion` dan perangkat lemah (deteksi save-data/memori rendah).
- Musuh utama publik: berat & lambat → anggaran performa ketat per halaman publik (dokumen 17).
- Semua aksi destruktif (hapus, unpublish) meminta konfirmasi + dapat dibatalkan dalam batas waktu bila mungkin.

## 6. Anti-pattern yang dilarang (daftar hitam)

1. Halaman undangan hardcode per client.
2. `any`, non-null assertion (`!`) tanpa justifikasi, `as` untuk menipu tipe.
3. Query SQL/ORM di komponen UI.
4. Menyimpan binary besar di database.
5. Secret di repo/log/output AI.
5. Authorization hanya di frontend.
6. Migration destruktif langsung ke production.
7. AI menulis langsung ke production / mengubah aturan inti tanpa approval.
8. JSON undangan tanpa validasi schema saat render.
9. Library baru tanpa alasan tertulis.
10. File > 500 baris (pecah dulu).
