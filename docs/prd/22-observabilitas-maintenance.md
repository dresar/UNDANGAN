# 22 — Observabilitas, Error Handling, & AI Maintenance Loop

## Bagian A — Observabilitas & Error Handling

### 1. Error taxonomy tunggal (kode & makna baku)

| Kode kelas | Makna | Contoh | Respons HTTP khas |
|---|---|---|---|
| `VALIDATION_ERROR` | input tidak valid | form salah, schema gagal | 400/422 |
| `AUTH_ERROR` | belum login / sesi mati | token kedaluwarsa | 401 |
| `FORBIDDEN` | tanpa izin / bukan pemilik | akses lintas tenant | 403 |
| `NOT_FOUND` | resource tak ada | slug salah | 404 |
| `CONFLICT` | bentrok state | slug dipakai, revisi kuno | 409 |
| `RATE_LIMIT` | kena batas | login ke-6/menit | 429 |
| `PROVIDER_ERROR` | layanan eksternal gagal | storage, email | 502 (aman) |
| `AI_PROVIDER_ERROR` | provider AI gagal | rate limit Gemini | 202/503 + status task |
| `QUOTA_EXCEEDED` | kuota habis | AI/bulan habis | 402/429 + pesan upgrade |
| `DB_ERROR` | database | constraint, timeout | 500 |
| `RENDER_ERROR` | render undangan bermasalah | komponen tak dikenal | halaman fallback (publik) |
| `MEDIA_ERROR` | upload/optimasi gagal | MIME ditolak | 400/500 |
| `INTERNAL_ERROR` | tak terduga | bug | 500 |

Aturan pesan: pengguna menerima pesan **Bahasa Indonesia yang bisa ditindaklanjuti** tanpa SQL/stack/secret/internal path; detail teknis hanya ke log (dengan correlation id yang boleh ditampilkan ke user untuk lapor).

### 2. Logging terstruktur

- Format JSON: `ts, level, msg, correlationId, requestId, userId?, route, module, khusus (taskId, providerCallId, …)`.
- Correlation id dibangkitkan per request & diteruskan ke job/antrean/provider-call — satu masalah bisa ditelusuri ujung ke ujung.
- Level di produksi: `warn+` default; `debug` hanya sesi diagnosa terbatas; log tidak pernah berisi secret/isi dokumen penuh (hanya id/checksum).

### 3. Monitoring & health

- **Health endpoint** `/health`: cek aplikasi hidup; `/health/ready`: DB, Redis, storage head, provider AI (ping murah), antrean.
- **Halaman diagnostics admin** (A-12): latensi komponen, error rate per kelas, panjang antrean, penggunaan kuota AI per hari, status feature flag, versi deploy aktif.
- **Sentry**: exception + release tagging; issue baru → notifikasi; issue berulang menjadi kandidat maintenance loop.
- **Alert ambang** (via platform/Slack/email admin): error rate > X%/5mnt, latency P75 > target, antrean AI > SLA, kuota provider > 80%, pembayaran gagal beruntun, uji restore gagal.

### 4. Admin observability khusus AI

Tampilan admin (A-05/A-06): daftar task per status (dengan filter type/risiko), timeline checkpoint per task, riwayap provider call (model/token/latency/status/retry), grafik penggunaan & biaya, antrean approval. Mendiagnosis AI gagal tidak perlu masuk database manual.

## Bagian B — AI Maintenance Loop & Bug Learning

### 5. Siklus kualitas (plan → … → learn — mandat PRD)

```
monitoring & issue reports (Sentry, telemetri render, laporan user, kegagalan AI task,
  hasil uji, umpan balik saran AI ditolak)
   → [1] INGEST & CLUSTER: kelompokkan temuan (fingerprint sederhana: kelas error+modul+konteks)
   → [2] PRIORITAS: severity (P1..P4) × dampak user × frekuensi
   → [3] ANALISIS: maintenance assistant usulkan root cause + bukti (log, repro)
   → [4] REMEDIASI: buat dev_task (patch bila sesuai) → pipeline CI → risk gate
        (LOW otomatis bila test lulus; MEDIUM review; HIGH/CRITICAL approval)
   → [5] REGRESI: regression test wajib untuk setiap bug yang diperbaiki
   → [6] PEMBELAJARAN: lesson masuk knowledge base; bila pola berulang → usulan update skill
        (workflow approval dokumen 14 §6) → changelog
```

### 6. Sumber temuan yang direkam otomatis

| Sumber | Rekaman |
|---|---|
| Exception produksi | Sentry issue → sync ke backlog internal (`dev_tasks` type bug) |
| `rendering_error` telemetry | per undangan/komponen |
| AI task gagal/loop retry | `ai_tasks.last_error` + klaster |
| Usulan AI ditolak user | event kualitas per kapabilitas (dokumen 18 §2) |
| Test gagal nightly | laporan suite |
| Laporan user/support | form internal admin → issue dengan konteks terstruktur |

### 7. Aturan main maintenance loop

1. AI **tidak** melakukan self-modifying production changes — semua via PR + CI + risk gate (mandat).
2. Setiap perbaikan bug membawa regression test (definition of done) — bug yang sama tidak boleh kembali tanpa terdeteksi.
3. Pelajaran (bug lessons) tersimpan terstruktur di knowledge base (gejala, akar, perbaikan, pencegahan) dan dirujuk skill terkait.
4. Insiden besar → postmortem (dokumen runbook): timeline, dampak, akar, tindakan, pencegahan; ditulis dalam Bahasa Indonesia; masuk KB.
5. Metrik kesehatan loop: waktu deteksi, waktu pulih, % bug berulang, rasio patch LOW yang lolos otomatis.
