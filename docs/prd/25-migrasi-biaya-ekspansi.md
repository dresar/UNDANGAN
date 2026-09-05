# 25 — Strategi Migrasi, Kendali Biaya, & Ekspansi Jangka Panjang

## Bagian A — Strategi migrasi (schema, data, platform)

### 1. Migrasi schema undangan (ringkas dari dokumen 09 §6)

- `schemaVersion` dalam dokumen; breaking change → bump + transformer `v(n)→v(n+1)` (fungsi murni + golden test).
- Snapshot published **immutable**: dokumen lama tidak ditulis ulang — transformasi lazy saat render + hasil cache; publish baru selalu naik ke versi terbaru.
- Rantai transformer diuji CI dengan corpus lintas versi (dokumen 21 §3).

### 2. Migrasi database (perubahan DDL)

- Disiplin: expand → backfill (job idempoten, batch, terukur) → contract (drop/ubah) di rilis berikutnya setelah tidak ada pembaca lama.
- Dilarang: migration destruktif pada rilis yang sama dengan kode baru; menulis data besar dalam migration; `db push` ke staging/produksi.
- Setiap migration ter-review dalam PR; status tercermin di `project_state`.

### 3. Migrasi platform/infrastruktur (jalan keluar vendor)

| Dari → ke tujuan | Pemicu (bukan spekulasi) | Persiapan yang sudah ada |
|---|---|---|
| Vercel → Cloudflare/containers | tagihan > ambang (mis. > 2× est. bulanan dua bulan berturut) ATAU kebutuhan runtime lama | logika dalam konvensi Next standar; worker berat sudah terpisah (Inngest); cache strategi terdokumentasi |
| Inngest → QStash/self-host queue | limit harga/perubahan kebijakan | DB = source of truth; driver eksekusi tertukar; state machine milik sendiri |
| Neon → Postgres lain (RDS/dedicated) | koneksi/kinerja puncak melebihi | Prisma + URL konektivitas standar; pooling eksternal |
| R2 → S3/lain | kebijakan harga berubah | antarmuka `StorageProvider`; kunci objek portabel |

Prinsip: **setiap vendor dipilih dengan pintu keluar yang tertulis**; evaluasi tahunan vendor kecil (Inngest/Upstash/Resend) oleh maintenance loop.

## Bagian B — Kendali biaya (AI & media & compute)

### 1. Anggaran AI terkendali

| Mekanisme | Keterangan |
|---|---|
| Default provider gratis | Gemini free untuk seluruh kapabilitas; fallback sadar-biaya hanya task kritikal & saat flag aktif |
| Kuota per plan | harian + bulanan; concurrency kecil; kalau habis → UX jelas, bukan error |
| Budget per task | `budget_tokens`; task besar dipecah step dengan budget per step |
| Cache | key = checksum(capaibility + versi skill/prompt + konteks + parameter); hasil sama tidak dibayar ulang |
| Prompt compression & projection | kirim ringkasan konteks yang relevan saja (dokumen 13 §7) |
| Batching | pekerjaan serupa jadi batch multi-step |
| Checkpoint (bukan ulang) | melanjutkan dari checkpoint meniadakan biaya pengulangan |
| Observabilitas biaya | `ai_provider_calls` + `ai_usage` → dashboard admin per fitur/user/provider; alert saat tren tak wajar |
| Anti-loop | maks retry & maks step; scheduler tidak menjalankan ulang `waiting_for_input` |

### 2. Biaya media & bandwidth

- Optimasi otomatis (variants, AVIF/WebP, ukuran tepat) → storage & bandwidth kecil per tampilan; CDN + egress $0 (R2).
- Cleanup job: orphan asset (tidak dirujuk dokumen/manapun setelah N hari), variant sisa hapus, media akun terhapus setelah masa pending; retensi undangan kadaluarsa.
- Kuota per plan + indikator mendekati batas (mendorong upgrade, bukan kejutan).

### 3. Biaya compute & database

- Cache edge per versi untuk halaman publik (mayoritas trafik tak menyentuh origin).
- Rollup & retensi analytics menjaga DB ramping; partition bulanan event.
- Scale-to-zero saat kecil; autoscale saat ramai; review bulanan tagihan oleh admin (checklist runbook).

### 4. Prinsip higiene biaya

1. Tidak ada sumber biaya berulang tanpa dashboard & alert.
2. Tidak ada panggilan provider AI tanpa `task_id` (biaya selalu dapat diatribusikan).
3. Job sampling berkala: menemukan generasi duplikat/berlebihan → kandidat perbaikan prompt/caching.

## Bagian C — Ekspansi jangka panjang (setelah core matang)

### 1. Ekspansi produk (diurutkan dari data, bukan asumsi)

1. **Varian acara lain** (aqiqah, khitan, ulang tahun, korporat): engine & registry sama; yang bertambah: kategori template/theme + vocabularies konten; schema undangan diperluas bertahap (schemaVersion baru + transformer). Prasyarat: core pernikahan stabil (G1–G7 tercapai berturut-turut).
2. **Marketplace theme kontributor**: pipeline publish tema pihak ketiga (validator sama + revenue share); moderasi & quality score.
3. **Tools WO/business**: multi-client dashboard, brand kit, laporan agregat, API publik terbatas.
4. **Kolaborasi editor** (multi-editor, komentar) setelah arsitektur revisi teruji lama.
5. **Mobile app tamu** (opsional, PWA dulu).

### 2. Ekspansi teknis (trigger → tindakan, selaras dokumen 07 §3)

| Trigger | Tindakan |
|---|---|
| Antrean AI penuh berhari-hari / biaya function eksekusi besar | ekstrak AI worker ke container terjadwal (state sudah di DB) |
| Ingestion analytics > ribuan event/dtk | pisahkan endpoint ingestion + rollup stream |
| Custom domain ratusan aktif | otomatisasi penuh verifikasi+SSL (service kecil) |
| Trafik regional baru signifikan | region tambahan / CDN tuning |

### 3. Prinsip ekspansi

- Semua ekspansi **melewati ADR** dan tidak boleh memaksa rewrite engine inti — jika terasa begitu, arsitektur boundary yang harus diperbaiki dulu.
- Kriteria membuka ekspansi: SLO tercapai 3 bulan berturut, backlog kesehatan rendah, maintenance loop menutup siklus (dokumen 22 §5) dengan bukti.
- "Tidak perlu dibangun sekarang" tetap valid: mikro-frontends, kubernetes, data warehouse penuh, ML self-hosted — hingga trigger data mendukung.
