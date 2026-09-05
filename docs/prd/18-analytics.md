# 18 — Analytics

Analytics harus cukup untuk pemilik undangan menilai performa undangan dan untuk platform memahami funnel produk — tanpa mengumpulkan data pribadi berlebihan dan tanpa membebani database utama.

## 1. Prinsip

1. **Privacy-first**: tanpa PII; identitas pengunjung hanya `session_hash` (salted, harian) untuk aproksimasi unik; tanpa fingerprinting agresif; tanpa cookie iklan.
2. **Jangan ganggu jalur utama**: event dikirim batch (non-blocking `navigator.sendBeacon`/fetch keepalive), tidak menunda render; kegagalan pengiriman tidak diulang agresif.
3. **DB utama terlindungi**: ingestion via antrean; dashboard membaca rollup harian, bukan event mentah (dokumen 08 §7).
4. **Naming convention baku**: `object_action` (snake_case) — daftar resmi di schema terpusat; event di luar daftar ditolak.

## 2. Katalog event inti

| Event | Pemicu | Metadata |
|---|---|---|
| `invitation_view` | halaman published terbuka (SSR beacon) | device_class, referrer_host, guest_link? |
| `invitation_open` | tamu menekan "buka undangan" (opening) | — |
| `music_play` / `music_pause` | kontrol musik | — |
| `gallery_open` / `gallery_navigate` | buka galeri / geser foto | index (agregat) |
| `story_scroll_reach` | menjangkau akhir story | section_id |
| `map_click` | tombol peta/arah | event_id |
| `rsvp_open` / `rsvp_submit` | buka form / submit sukses | attendance (agregat) |
| `guestbook_open` / `guestbook_submit` | ucapan | — |
| `gift_click` | buka info kado | mode |
| `share_click` | tombol bagikan | channel |
| `countdown_visible` | countdown terlihat | — |
| `link_open` (guest link) | tautan personal dibuka | guest_link_id |
| `rendering_error` | degradasi render (internal) | bagian, kode |

Platform-level (dashboard admin): `account_signup`, `invitation_created`, `theme_picked`, `ai_suggestion_shown/accepted/rejected`, `publish_clicked`, `subscription_*` — untuk funnel & kualitas AI.

## 3. Arsitektur ingestion

```
Halaman publik/dashboard ──(batch ≤ 10 event / 5 dtk / beacon unload)──> endpoint ingestion
  → validasi (nama terdaftar, ukuran, rate limit per undangan)
  → antrean (Inngest) → tulis `analytics_events` (partisi bulanan)
  → job rollup tengah malam → `analytics_rollups_daily`
  → retention job: event mentah > 12 bulan dihapus; rollup dipertahankan
```

## 4. Metrik dashboard pemilik undangan

- Total view & tren 14 hari; aproksimasi pengunjung unik; sumber utama (referrer host top).
- Funnel ringkas: dilihat → dibuka → RSVP dibuka → RSVP submit (persentase).
- Interaksi: galeri, peta, gift, musik, share (jumlah).
- RSVP: rekap hadir/tidak/ragu + jumlah tamu + pesan terbaru.
- Semua angka bergaya sederhana & Bahasa Indonesia; tanpa grafik menakut-nakuti pengguna awam.

## 5. Analytics platform (admin)

- Funnel produk: daftar → buat undangan → publish → berapa hari aktif.
- Kualitas AI: saran ditampilkan vs diterima per kapabilitas; task sukses/gagal/retry per provider.
- Pertumbuhan: undangan baru, publish, MAU, top theme/template.
- Kueri berat hanya atas rollup; eksplorasi ad-hoc lewat export terkontrol (bukan query live DB produksi).

## 6. Kualitas data & batasan

- Unik visitor = aproksimasi (session_hash + window) — diberi label "perkiraan" di UI (jujur, tidak mengklaim presisi).
- Ad-blocker menyebabkan undercount; itu diterima (tidak memaksa bypass).
- Event tidak pernah memuat konten user (pesan tamu dsb.) — hanya indikator tindakan.
