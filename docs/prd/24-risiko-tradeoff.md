# 24 — Risk Register & Analisis Trade-off Utama

## Bagian A — Risk Register

Skala dampak/probabilitas: L/M/H/CRIT. Setiap risiko punya pemilik (peran), pemicu deteksi, dan mitigasi.

### Risiko teknis

| ID | Risiko | D | P | Deteksi dini | Mitigasi |
|---|---|---|---|---|---|
| R-T1 | Gemini free tier berubah (limit/kebijakan) mengganggu fitur AI | H | M | kuota > 80%, error rate `rate_limited` naik | gateway provider-agnostic; fallback provider siap; fitur manual tetap penuh; kuota menahan lonjakan |
| R-T2 | Output AI sering gagal validasi → UX lambat | M | M | metrik `invalid_output` | structured output + retry terarah; iterasi skill; golden set evaluasi |
| R-T3 | Renderer custom = kompleksitas tinggi / bug render | H | M | telemetry `rendering_error` | schema gate, fallback aman, corpus uji, visual regression, pinning versi |
| R-T4 | Editor besar jadi lambat (dokumen banyak section/media) | M | M | profiling sesi uji | virtualisasi, autosave debounced, batch operasi, anggaran respons |
| R-T5 | Cold start serverless memperburuk latensi API | M | M | P75 latency | bundle hemat, Node runtime (bukan edge berat), connection pooling, cache |
| R-T6 | Visual regression false-positive (font/anti-alias) memperlambat CI | L | M | flaky report | normalisasi screenshot (viewport/font pin), ambang diff terkelola, jalur update golden eksplisit |
| R-T7 | Ketergantungan vendor kecil (Inngest/Neon/Upstash) berubah | M | L | berita/status layanan | abstraksi + DB source of truth; rencana substitusi (QStash/Postgres/RDS) tertulis |
| R-T8 | Biaya Vercel melonjak saat trafik besar | H | M | tagihan/invocations monitoring | cache edge kuat; trigger evaluasi migrasi (dokumen 25 §3) |

### Risiko produk & bisnis

| ID | Risiko | D | P | Mitigasi |
|---|---|---|---|---|
| R-B1 | Scope creep (permintaan fitur menyebar dari pernikahan) | H | H | non-goals tegas (dokumen 02 §7); perubahan scope = keputusan tertulis |
| R-B2 | Kualitas desain bervariasi → brand lemah | M | M | Theme Validator + quality score; kurasi katalog; feedback loop |
| R-B3 | Monetisasi lambat / konversi rendah | M | M | trial, funnel analytics, uji harga; fitur free tetap bernilai (akuisisi) |
| R-B4 | Saingan template murah menekan harga | M | H | diferensiasi: engine + AI + kualitas + data (RSVP/analytics) — bukan hanya tampilan |
| R-B5 | Musiman (peak musim kawin) menstreskan sistem | M | H | load test profil musim (F4); antrean; cache; autoscale |
| R-B6 | Konten user melanggar hukum/etika (undangan palsu dsb.) | M | L | laporan + moderasi admin + unpublish; terms jelas |

### Risiko keamanan & data

| ID | Risiko | D | P | Mitigasi |
|---|---|---|---|---|
| R-S1 | Akses lintas tenant karena endpoint lupa ownership check | CRIT | M | helper tunggal; test negatif otomatis untuk seluruh route; review wajib endpoint baru |
| R-S2 | Abuse endpoint publik (RSVP spam, scraping) | M | H | rate limit + honeypot + challenge adaptif + flag moderasi |
| R-S3 | Prompt injection lewat konten tamu ke AI | M | M | konten eksternal = data tidak tepercaya; proyeksi konteks terbatas; output tetap divalidasi schema |
| R-S4 | Kebocoran secret/log | CRIT | L | scan CI; larangan logging secret; review logging; rotasi |
| R-S5 | Kehilangan data media (bucket bermasalah) | H | L | versioning bucket + metadata DB + backup rutin + uji restore |
| R-S6 | Perbaikan darurat by-pass pipeline saat panik | H | M | proses hotfix resmi tetap lewat CI jalur cepat + audit + retrospective |

### Risiko organisasi/eksekusi

| ID | Risiko | D | P | Mitigasi |
|---|---|---|---|---|
| R-O1 | Tim kecil / bus factor | H | H | dokumentasi hidup; ADR; standar ketat; AI dev system menurunkan ketergantungan satu orang |
| R-O2 | Otonomi AI berjalan liar (biaya/perubahan tak diinginkan) | H | M | risk gate + budget + maks retry + kill switch + audit (dokumen 13/15) |
| R-O3 | Dokumentasi usang setelah cepat berubah | M | H | docs = definition of done; maintenance loop memperbarui; KB terindeks |

## Bagian B — Analisis trade-off keputusan utama (rekapan sadar)

| # | Trade-off | Dipilih | Diterima | Mengapa menang |
|---|---|---|---|---|
| 1 | Modular monolith vs microservices | Monolith modular | disiplin boundary manual | kecepatan & biaya awal; path ekstraksi disiapkan (dokumen 07 §3) |
| 2 | Serverless vs VPS/containers | Serverless (Vercel dkk.) | biaya tak linear di skala sangat besar, cold start | zero-ops, preview per-PR, cocok fase merintis; trigger migrasi ditetapkan |
| 3 | Renderer JSON custom vs template statis | Renderer custom | investasi awal besar | inti keunggulan: 1 engine → ribuan variasi; non-negotiable product premise |
| 4 | Animasi sistem internal vs library | Internal ringan | menulis/melihara sendiri | berat halaman tamu adalah risiko produk terbesar; kontrol reduced-motion penuh |
| 5 | Gemini free vs provider bayar sejak awal | Gemini free + gateway | rate limit & fluktuasi | biaya Rp0 saat validasi produk; arsitektur resumable menyerap limit; ganti provider = konfigurasi |
| 6 | Prisma vs Drizzle | Prisma | cold-start & abstraksi lebih tebal | migrasi terkelola & DX terbaik untuk tim pemula; adapter serverless menutup celah |
| 7 | Session DB vs JWT stateless | Session DB | 1 query per request (cacheable) | revokasi instan = keamanan; sesi disimpan & dapat diaudit |
| 8 | Analytics internal vs pihak ke-3 | Internal (rollup) | membangun sendiri | privasi, biaya nol, data funnel milik sendiri; volume terkendali via antrean |
| 9 | Pin versi saat publish vs selalu terbaru | Pin versi | undangan lama tidak otomatis dapat pembaruan visual | stabilitas kepercayaan user; update = tindakan eksplisit dengan diff |
| 10 | Full autonomy vs approval gate | Risk-tiered autonomy | pekerjaan HIGH lebih lambat | keseimbangan mandat: sangat otomatis namun terkendali & dapat diaudit |
| 11 | Bahasa UI Indonesia vs bilingual awal | Indonesia saja (kerangka i18n siap) | kerja terjemahan ditunda | fokus pasar & persona; kerangka tetap ada sehingga menambah bahasa murah |
| 12 | Semua fitur AI sejak awal vs bertahap | Bertahap (content → theme → component) | nilai AI datang bertahap | dependency: tanpa validator/registry/pipeline yang matang, AI generator hanya menciptakan risiko |
