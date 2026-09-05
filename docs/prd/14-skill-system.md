# 14 — AI Skill System

Skill = **modul pengetahuan operasional** — bukan prompt biasa. Skill menjelaskan bagaimana AI harus bekerja untuk area tertentu: tujuan, proses, aturan, anti-pattern, contoh, dan kriteria selesai. Skill versioned, discoverable, measurable, dan diperbarui melalui workflow terkontrol agar sistem makin cerdas dari waktu ke waktu.

---

## 1. Prinsip

1. **Skill adalah aset perusahaan**, hidup di repo (`docs/skills/`) dan terindeks di registry DB — mudah direview, dibandingkan antar versi, dan diukur.
2. **Seleksi otomatis**: planner/orchestrator memilih skill berdasarkan konteks task (domain, modul terdampak, jenis pekerjaan) — bukan manual.
3. **Pembelajaran terkendali**: skill berubah lewat proposal → validasi → evaluasi → approval → publish (tidak pernah diam-diam, tidak pernah oleh AI tanpa review untuk aturan inti).
4. **Terukur**: setiap skill punya metrik kualitas (berapa kali dipakai, tingkat keberhasilan task, rasio revisi/retry) — skill jelek terdeteksi.

## 2. Anatomi skill

Satu skill = satu folder berisi `SKILL.md` (+ lampiran opsional: contoh, checklist, template). Front-matter metadata:

```
name: theme-generation
version: 1.4.0
status: active            # active | experimental | deprecated
domain: [theme, design]
taskTypes: [theme.generate, asset.generate]
risk: medium
requiresSkills: [design-tokens, accessibility-basics]
owner: tim-desain
lastReviewed: 2026-08-01
```

Isi `SKILL.md` (bagian baku): **Tujuan** · **Kapan dipakai** · **Proses langkah demi langkah** · **Aturan & batasan keras** (mis. "selalu gunakan token kontrak, jangan warna bebas") · **Anti-pattern** · **Contoh input/output (golden)** · **Kriteria selesai** · **Referensi ADR/knowledge base terkait**.

## 3. Katalog skill awal (bertumbuk bertahap)

| Kelompok | Skill |
|---|---|
| Engineering | `architecture`, `frontend`, `backend`, `database`, `api-design`, `code-review`, `testing`, `debugging`, `performance-audit`, `security-review`, `accessibility`, `release-management`, `migration`, `documentation`, `incident-analysis` |
| Produk/design | `ui-ux`, `animation`, `wedding-design`, `design-tokens`, `theme-generation`, `component-generation`, `image-prompt-engineering`, `media-optimization`, `seo` |
| Konten | `wedding-copywriting` (tone formal/hangat/elegan/romantis/minimal/modern/islami), `content-localization` |
| AI/meta | `ai-planning`, `prompt-compression`, `structured-output-discipline`, `skill-authoring` |

Fase 0–1 hanya perlu subset (architecture, frontend, backend, database, testing, code-review, wedding-design, wedding-copywriting, design-tokens); sisanya ditambahkan saat fiturnya aktif.

## 4. Registry & penyimpanan (DB)

- `skills`: `id`, `slug`, `name`, `description`, `domain JSONB`, `task_types JSONB`, `status`, `current_version`.
- `skill_versions`: `skill_id`, `version`, `content_ref` (path/commit), `checksum`, `changelog`, `validated (bool)`, `eval_result JSONB`, `published_by`, `published_at`.
- `skill_update_proposals`: `id`, `skill_id`, `proposed_version`, `motivation` (bug berulang / pola baru / perbaikan arsitektur / perubahan library), `diff`, `evaluation JSONB`, `status (proposed|validated|approved|rejected)`, `proposed_by (account|ai_task)`, `reviewed_by`.
- Sinkronisasi repo ↔ registry: skill di-load dari repo saat deploy; registry menyimpan versi terpasang & metadata evaluasi (repo = konten, DB = indeks & riwayat).

## 5. Seleksi skill oleh sistem

1. Task diciptakan dengan `task_type` + modul terdampak + `required_skills` (dari task definition).
2. Orchestrator menambah skill otomatis berdasarkan pemetaan `task_types`/`domain` aktif (status `active` saja; `experimental` hanya bila flag menyala).
3. Konflik dua skill → yang lebih spesifik menang (mis. `theme-generation` > `frontend`); aturan "batasan keras" semua skill terpilih tetap berlaku kumulatif.
4. Prompt akhir = instruksi tugas + skill terpilih (versi terpin) + konteks ringkas + input.

## 6. Workflow pembaruan skill (terkontrol, mandat PRD)

```
[pemicu] bug berulang / pola baru / perubahan library / temuan review / lesson insiden
   → usulan (skill_update_proposals) oleh maintenance loop / manusia
   → validasi otomatis: format anatomi, konsistensi dengan ADR aktif, uji pada kasus golden
   → evaluasi: jalankan task sampel memakai versi baru vs lama (skor keberhasilan/tarik-revisi)
   → approval: perubahan "batasan keras"/aturuan inti → MANUSIA wajib; tambahan contoh/klarifikasi → boleh otomatis bila evaluasi hijau
   → publish: versi baru aktif; versi lama deprecated (riwayat penuh); task berjalan tetap memakai versi terpin
   → catat di audit log & knowledge base
```

AI **tidak dapat** mengubah skill yang bertanda `core` (risk policy, security, approval rules) tanpa approval SUPER_ADMIN — perlindungan dari self-modification.

## 7. Pengukuran & kesehatan skill

- Metrik per skill versi: jumlah pemakaian, % task selesai tanpa retry, % output ditolak user/reviewer, rata-rata iterasi.
- Dashboard admin AI (A-05) menampilkan peringkat skill & kandidat perbaikan; maintenance loop membaca metrik ini untuk memicu usulan pembaruan.
- Skill tanpa pemakaian > 6 bulan → kandidat deprecated (mengurangi noise konteks).
