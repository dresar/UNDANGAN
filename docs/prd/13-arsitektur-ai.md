# 13 — Arsitektur AI: Gateway, Task System, Checkpoint, & Scheduler

Dokumen ini mendefinisikan sistem AI yang (a) provider-agnostic dengan default Gemini free tier, (b) selalu structured-output, (c) resumable via checkpoint, (d) terkendali kuota/biaya/retry, dan (e) punya permission boundary per agen. Prinsip: AI terasa seperti *pekerja engineering jangka panjang* yang melanjutkan pekerjaan berdasarkan state project — bukan chatbot yang lupa setelah output habis.

---

## 1. Lapisan arsitektur AI

```
┌────────────────────────────────────────────────────────────────────┐
│ AI CAPABILITIES (fitur produk & internal)                          │
│  user-facing: content assistant · theme generator · builder/copilot │
│  internal:    planner · reviewer · tester · debugger · optimizer    │
│               docs · migration · quality checker · release assist   │
│               maintenance assistant                                 │
├────────────────────────────────────────────────────────────────────┤
│ AI TASK ORCHESTRATOR                                                │
│  task registry (ai_tasks) · state machine · dependency antar task   │
│  checkpoint store (ai_checkpoints) · artifact store (ai_artifacts)  │
│  risk gate & approval queue · scheduler/cron continuation           │
├────────────────────────────────────────────────────────────────────┤
│ AI GATEWAY (satu-satunya pintu ke provider)                         │
│  provider abstraction (Vercel AI SDK) · prompt builder + cache      │
│  structured output (Zod registry) · kuota & budget check            │
│  retry/backoff/fallback provider · usage logging (ai_provider_calls)│
├────────────────────────────────────────────────────────────────────┤
│ PROVIDERS: Gemini (default, free tier) │ fallback: Groq/OpenAI/...  │
└────────────────────────────────────────────────────────────────────┘
```

Aturan mutlak: **tidak ada pemanggilan provider di luar AI Gateway**; semua request membawa `task_id` (atau marker internal) untuk traceability; semua output divalidasi Zod sebelum dipakai.

## 2. AI Gateway

### 2.1 Tanggung jawab

1. **Abstraksi provider** — business logic hanya tahu `capability` (mis. `text.writing`, `structure.propose`, `vision.review`), bukan model/provider. Konfigurasi mapping capability → provider/model via `system_settings` (bisa diganti admin tanpa deploy).
2. **Structured output** — registry Zod schema per task type (`schema_ref`); gateway memakai `generateObject`/tool-call sesuai dukungan provider; output gagal schema → `invalid_output` → retry dengan pesan error schema (≤ 2x) → gagal → `failed` + laporan.
3. **Kuota & budget** — cek `usage_counters` & `ai_tasks.budget_tokens` sebelum kirim; tolak dengan `quota_exceeded` yang jelas; concurrency limit global & per-account (semaphore di Redis).
4. **Cache** — key = checksum(capaibility + versi prompt/skill + versi konteks + parameter); hasil identik tidak dibayar dua kali (hemat kuota free tier).
5. **Retry & fallback** — kebijakan per error: `rate_limited` (backoff panjang + reschedule), `timeout` (retry), `server_error` (retry lalu fallback provider), `invalid_output` (retry dengan koreksi), `quota_exceeded` (fallback provider atau pause + resume terjadwal).
6. **Observabilitas** — setiap panggilan → baris `ai_provider_calls` (provider, model, token, latency, status, retry) + log terstruktur dengan correlation id.

### 2.2 Provider-agnostic (mandat)

- Antarmuka `AIProvider` internal: `generate(input) → output|error` + metadata. Implementasi: `google-gemini`, `groq`, `openai`, (masa depan: `anthropic`, dsb.).
- Penambahan provider = registrasi implementasi + kredensial + aturan routing capability; **tanpa mengubah business logic**.
- Pemetaan default fase awal: semua capability → Gemini free tier; fallback provider aktif hanya untuk task kritikal (job maintenance, review) bila kuota habis — dikendalikan flag & budget.

## 3. Task state machine (sumber kebenaran: database)

```
            ┌──────────┐
            │ pending  │ (dibuat; menunggu validasi input/kuota)
            └────┬─────┘
       valid & kuota ok │
            ┌────v─────┐     trigger eksekusi
            │  queued  │────────────────────────┐
            └──────────┘                        │
                                                v
   ┌─────────────┐  selesai step   ┌───────────┐│
   │ checkpointed│<────────────────│  running  │┘ (locked_by executor, heartbeat)
   └──────┬──────┘                 └─────┬─────┘
          │ scheduler/trigger lanjut      │ error sementara
          └──────────> queued             v
                                     ┌─────────┐  masih bisa retry
      human input diperlukan         │retrying │──────────> queued
      ┌──────────────────┐           └────┬────┘
      │ waiting_for_input│<──── blocked    │ retry habis / fatal
      └──────────────────┘   (butuh       v
      (tidak diulang otomatis)  perbaikan  ┌────────┐
            ^                    arsitek) │ failed │
            │                            └────────┘
            │ approval utk risiko high      │
            │                                │
      ┌─────┴──────┐  sukses penuh           │ usulan remediasi
      │  approved  │                          v
      └─────┬──────┘                    [maintenance loop]
            v
      ┌───────────┐        ┌──────────┐
      │ completed │───────>│ archived │ (retensi selesai)
      └───────────┘        └──────────┘
   (canceled dapat terjadi dari hampir semua state oleh owner/admin)
   (paused: ditunda sengaja oleh admin/kebijakan — scheduler tidak menyentuh)
```

Definisi status (selaras mandat PRD): `pending`, `queued`, `running`, `checkpointed`, `paused`, `retrying`, `blocked`, `waiting_for_input`, `completed`, `failed`, `canceled`, `archived`.

Transisi hanya via fungsi transisi tunggal di modul `ai` (dengan validasi legalitas transisi + event log) — dilarang update status manual dari tempat lain.

## 4. Checkpoint & resumable execution

1. Task dipecah menjadi **step eksplisit** (`plan → generate → validate → refine → assemble → review` sesuai jenis); setiap step selesai → tulis `ai_checkpoints` (snapshot state ringkas + referensi artefak) → status `checkpointed`.
2. Executor (driver: Inngest step-functions; DB tetap sumber kebenaran) menjalankan step idempoten: bila dijalankan ulang, step yang sudah ada checkpoint-nya **tidak diulang**, lanjut dari `current_step`.
3. Terputus karena rate limit/output limit/timeout → status `checkpointed` + `resume_hint` (mis. "tunggu X menit") → scheduler (§5) meneruskan pada window berikutnya **tanpa meminta user mengulang instruksi**.
4. Artefak intermediate disimpan di `ai_artifacts` — pekerjaan kompleks dapat dikerjakan lintas banyak sesi AI tanpa kehilangan konteks (mandat PRD).
5. Guardrail continuation: maksimum total step & durasi per task; maksimum retry per step (mis. 3) & per task (mis. 5); budget token absolut per task; task berbahaya (definisi §9) tidak pernah di-resume otomatis; `waiting_for_input` tidak diulang tanpa input baru — mencegah loop tanpa akhir & biaya tak terkendali.

## 5. Scheduler & continuation cron

- Cron berkala (via Inngest scheduled function / cron platform) setiap beberapa menit memindai:
  - `checkpointed` yang `resume_hint`-nya sudah lewat → `queued`;
  - `queued` kadaluarsa (executor mati, `locked_until` lewat) → lepas lock → `queued` ulang;
  - `retrying` yang backoff-nya tiba → `queued`;
  - `pending` yang prasyaratnya (dependency task) selesai → `queued`.
- Antrean prioritas: interaktif user (copilot) > batch latar > maintenance.
- Kill switch admin: pause seluruh scheduler / per task type (insiden biaya/penyalahgunaan).
- Semua aksi scheduler menulis event — tidak ada continuation tanpa jejak.

## 6. Agen AI & permission boundary

| Agen | Tugas | Boleh | Tidak boleh |
|---|---|---|---|
| Planner | memecah pekerjaan → task graph | baca project state/ADR/KB; tulis usulan rencana | menyentuh kode/data produksi |
| Content generator | teks undangan | baca konteks undangan; tulis artefak konten | publish; mengubah struktur |
| Theme designer | theme definition | baca kontrak token; tulis theme draft + aset | publish theme; ubah komponen |
| Component engineer | kode komponen | buka PR draft + test | merge sendiri; dependency baru |
| Layout/structure | susun section | tulis struktur draft usulan | apply tanpa persetujuan user |
| Reviewer | review kode/konfigurasi | baca semua artefak; tulis laporan | memodifikasi |
| Tester | buat/jalankan test | menjalankan suite CI; tulis laporan | mengubah environment production |
| Debugger/Optimizer | diagnosis & tuning | baca log/telemetri; usulkan patch | deploy |
| Docs/Migration | dokumentasi & transformer | tulis docs/PR migrasi | eksekusi migrasi destruktif |
| Quality/Release | cek mutu & bantu rilis | gate otomatis; siapkan changelog | rilis tanpa approval berisiko tinggi |
| Maintenance | analisis insiden & bug | cluster bug; usulkan remediasi; patch LOW risk via PR | self-modify production |

Pembagian akses ditegakkan oleh: token/identitas tugas (scope per task), layer service yang hanya mengekspresi operasi yang diizinkan, dan CI/approval gate — bukan sekadar "janji prompt".

## 7. Manajemen konteks & hemat token (cost-control)

- **Ringkasan konteks terstruktur**: alih-alih mengirim seluruh dokumen JSON, kirim *projection* yang relevan per kapabilitas (mis. copilot warna hanya butuh palet + nama section, bukan foto/guest list).
- **Prompt modular dari skill** (dokumen 14): instruksi = skill (versi tetap) + konteks ringkas + input user; checksum-nya = cache key.
- **Prompt compression**: batas ukuran input per kapabilitas; konten panjang (story semua section) diringkas dulu bila melebihi anggaran.
- **Task batching**: pekerjaan serupa (mis. validasi 10 theme) dijadikan batch satu task multi-step.
- Hasil pengerjaan & pembelajaran (apa yang sering ditolak user) masuk knowledge base → prompt berikutnya makin tepat.

## 8. Pemakaian AI di fitur produk (ringkas)

| Fitur | Task type | Output | Interaksi user |
|---|---|---|---|
| AI content assistant | `content.generate` | konten teks per bagian | langsung + bisa regenerasi |
| AI builder onboarding | `structure.propose` ×N | 3 konsep dokumen draft | pilih satu |
| AI copilot editor | `copilot.patch` | structured patch + penjelasan | diff per bagian |
| AI theme generator | `theme.generate` | theme definition + preview | preview, terima/ajukan variasi |
| AI rekomendasi | `recommend.compute` | daftar saran + alasan | kartu saran opsional |
| Asset visual (fase 3+) | `asset.generate` | prompt eksternal + pipeline aset | opsional saat theme dibuat |

## 9. Risk policy & approval (berlaku lintas sistem)

| Risiko | Contoh | Kebijakan |
|---|---|---|
| LOW | konten draft, theme pribadi user, test, docs | otomatis bila validasi & test lulus |
| MEDIUM | publish theme/component ke katalog, patch non-kritis, perubahan konfigurasi fitur | review manusia (default) — dapat diotomatisasi bila track record gerbang hijau & flag mengizinkan |
| HIGH | perubahan auth, security policy, billing, schema destruktif, domain produksi | approval eksplisit manusia, dua-tahap (usulan → pemeriksaan → ACC) |
| CRITICAL | penghapusan data massal, ubah aturan inti/risk policy itu sendiri | SUPER_ADMIN + jendela konfirmasi + audit penuh |

Setiap task membawa `risk_level` sejak dicipta planner; executor tidak dapat menurunkannya sendiri (menaikkan boleh). Semua keputusan approval tercatat di `audit_logs` + antrean approval admin (A-05).

## 10. Acceptance criteria arsitektur AI (dipakai dokumen 23)

1. Memanggil fitur AI apa pun **selalu** menghasilkan baris `ai_provider_calls` + `ai_usage`; admin dapat melihat model, token, latency, status, retry, fallback.
2. Task yang dihentikan di tengah (simulasi rate limit) dapat dilanjutkan scheduler dari checkpoint terakhir tanpa input ulang dari user.
3. Output AI yang tidak lolos schema tidak pernah sampai ke penyimpanan aplikatif (hanya artefak dengan `validation_state=valid`).
4. Tidak ada jalur kode yang memanggil provider di luar gateway (ditegakkan review + boundary modul).
5. Kuota habis → UX jelas ("kuota AI bulan ini habis; upgrade atau tunggu reset"), sistem tidak error 500.
6. Mengganti mapping capability → provider lain (mis. Gemini→Groq) hanya lewat konfigurasi, tanpa perubahan business logic.
