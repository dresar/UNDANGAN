# 15 — Pengembangan Otonom: Task Orchestration, Project State, ADR, Knowledge Base

Sistem pengembangan internal yang membuat AI dapat bekerja dalam batch panjang, berhenti karena batas provider, dan **melanjutkan tanpa kehilangan konteks** — dengan guardrail agar otomatisasi tetap terkendali, dapat diaudit, dan dapat dihentikan.

---

## 1. Komponen sistem

```
┌─────────────┐   baca konteks    ┌────────────────────────────────────┐
│  ROADMAP    │──────────────────>│ PROJECT STATE (+ ADR + KNOWLEDGE   │
│ (fase/docs23)│                   │  BASE + SKILL REGISTRY)            │
└─────────────┘                   └───────────────┬────────────────────┘
                                                  │ dipakai planner
                                                  v
┌────────────────────────────────────────────────────────────────────┐
│ TASK ORCHESTRATOR (modul task_dev)                                  │
│  dev_tasks (dependency graph) · task runner · risk gate · evidence  │
│  checkpoint per task · retry policy · escalation notes              │
└───────────────┬─────────────────────────────────────┬──────────────┘
                v eksekusi (AI executor via modul ai)  │ hasil
┌───────────────────────────────┐            ┌────────v───────────────┐
│ Pipeline CI (gatekeeper)      │            │ EVIDENCE STORE          │
│ lint·typecheck·test·build·    │───────────>│ file berubah, tes lulus, │
│ preview·visual                │  lulus?    │ build, screenshot, ringkasan│
└───────────────────────────────┘            └─────────────────────────┘
```

## 2. Siklus kerja otonom

1. **Perencanaan**: planner membaca project state + roadmap fase aktif + ADR → menyusun/melengkapi `dev_tasks` (pecahan kecil, berdependensi, masing-masing punya acceptance criteria & risk).
2. **Pemilihan task**: runner memilih task berstatus `ready` (semua dependency `completed`, skill tersedia, tidak ada blocker).
3. **Eksekusi**: executor (agen dengan skill terpilih) mengerjakan dalam step; setiap step → checkpoint (menggunakan infrastruktur `ai_tasks` dokumen 13); artefak disimpan.
4. **Gerbang mutu**: PR dibuka → CI lint/typecheck/test/build (+preview/visual bila relevan). Pipeline = gatekeeper; AI boleh membuat perubahan, CI yang memutuskan.
5. **Risk gate**: LOW → merge otomatis bila hijau; MEDIUM → review manusia; HIGH/CRITICAL → approval eksplisit (dokumen 13 §9).
6. **Penutupan**: evidence dilampirkan; project state diperbarui; changelog/progress event ditulis; bila ada pelajaran → usulan knowledge base/skill update.

## 3. Anatomi dev_task (selaras mandat PRD)

`dev_tasks` menyimpan: `code` (ID stabil, mis. `F1-RND-07`), `title`, `description`, `priority`, `risk_level`, `depends_on` (array code), `owner_agent_type`, `required_skills`, `expected_artifacts`, `acceptance_criteria` (list dapat diuji), `status`, `retry_count/max`, `checkpoint_ref`, `evidence JSONB` (file berubah, tes lulus, hasil build, ringkasan), `created/updated_at`, `phase` (fase roadmap).

Status task: `draft → ready → in_progress → in_review → completed | blocked | failed | canceled`. Aturan transisi:
- Gagal karena masalah **sementara** (rate limit, flaky test) → retry dengan backoff (maks ditentukan).
- Gagal karena **arsitektur** (kontradiksi ADR, dependency hilang, keputusan tak bisa diambil) → `blocked` + `escalation_note` (dibaca manusia/planner).
- Butuh **input manusia** → `waiting_for_input` — tidak diulang otomatis tanpa alasan baru.
- `completed` hanya bila acceptance criteria terbukti dari evidence (bukan klaim).

## 4. Project State (sumber konteks utama)

Dipersist dua arah: tabel `project_state` (queryable) + file `PROJECT_STATE.md` (dibaca manusia & AI session baru). Isi baku:

- `architecture_version`, `renderer_version`, `schema_version` aktif;
- `roadmap_phase` aktif + milestone selesai;
- `active_tasks` / `blocked_tasks` (ringkasan + tautan);
- `open_issues` & `known_bugs` ringkas;
- `architecture_decisions` (daftar ADR aktif + tautan);
- `active_skills` + versi;
- `dependency_versions` penting;
- `db_migration_status` (terapan terakhir, menunggu);
- `test_status` & `deployment_status` ringkas (diperbarui CI);
- `pending_ai_jobs` ringkas.

Aturan wajib: **AI membaca project state sebelum bekerja** (tidak mengulangi pekerjaan selesai, tidak merusak yang ada) dan **memperbarui state setelah selesai** secara terstruktur. Setiap perubahan menghasilkan progress event/checkpoint → pekerjaan panjang dapat dilanjutkan kapan pun.

## 5. ADR (Architecture Decision Record)

- Lokasi `docs/adr/ADR-<n>-<judul>.md`; format: konteks → keputusan → alternatif → konsekuensi → status (proposed/accepted/superseded).
- Keputusan yang wajib ADR: framework, database, pendekatan rendering, strategi JSON schema, theme system, component registry, arsitektur AI provider, payment abstraction, deployment — plus setiap perubahan besar sesudahnya.
- **AI wajib membaca ADR sebelum menyarankan perubahan yang menyentuh area keputusan.** Bila ingin mengubah keputusan: buat `architecture_change_proposal` (ADR baru status proposed + analisis dampak + rencana migrasi) → approval sesuai risiko → baru dikerjakan. Ini menjaga konsistensi jangka panjang lintas sesi AI (tidak berubah arah setiap ganti sesi).

## 6. Knowledge Base internal

- Menyimpan: keputusan arsitektur (ringkas+tautan ADR), konvensi kode, pola komponen, aturan theme, pelajaran bug (bug lessons), isu yang diketahui, aturan deployment, keterbatasan provider AI, kebijakan sistem, requirement produk.
- **Chunking per modul/topik** dengan metadata (modul, topik, versi, tag) dan indeks pencarian — bukan satu dokumen raksasa, bukan dump source code.
- Digunakan oleh AI sebagai konteks sebelum merencanakan pekerjaan (retrieval berbasis metadata + skor relevansi sederhana; dapat ditingkatkan ke vector search saat volume membesar — fase lanjut, bukan kebutuhan awal).
- Pembaruan terstruktur: setelah perubahan arsitektur/fitur signifikan atau insiden, task dokumentasi memperbarui KB — dokumentasi tidak boleh menua (mandat PRD).
- Retensi & kebersihan: entri usang (menunjuk versi lama) ditandai & diarsipkan saat ADR supersede.

## 7. Jendela eksekusi & continuation (mandat "jangan minta user tekan lanjut")

- Scheduler (dokumen 13 §5) juga menggerakkan `dev_tasks`: memindai task `in_progress` yang executor-nya mati (lock kadaluarsa) → resume dari checkpoint; memindai `ready` → menawarkan ke antrean eksekusi hingga kuota window (mis. N task paralel, M token/jendela) tercapai.
- Checkpoint granular per contoh mandat: `analysis complete → files planned → group 1 implemented → tests group 1 pass → group 2 implemented → integration complete → docs updated` — masing-masing dapat berhenti & dilanjutkan.
- Tindakan yang **selalu** butuh approval manusia walau task otonom: schema destruktif, kebijakan keamanan, logika autentikasi, logika billing, sistem domain produksi, operasi hapus (mandat PRD) — ditegakkan lewat risk gate + protected files di pipeline.

## 8. Guardrail keseluruhan

1. Tidak ada infinite autonomous coding: setiap task punya maks step, maks retry, budget token, dan umur maksimum.
2. Tidak ada self-modification aturan inti (risk policy, security, approval) oleh AI tanpa approval SUPER_ADMIN.
3. Semua merge ke branch utama melalui CI; perubahan HIGH/CRITICAL butuh manusia.
4. Audit lengkap: siapa/apa/kenapa/kapan untuk setiap transisi penting.
5. Kill switch: admin dapat menghentikan scheduler, membatalkan batch task, menurunkan paralelisme ke nol.
