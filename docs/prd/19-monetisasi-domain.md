# 19 — Monetisasi (Subscription & Billing) dan Domain/Routing Publik

## Bagian A — Subscription & Monetisasi

### 1. Prinsip

1. Arsitektur monetisasi dirancang **sejak awal** (entitlement & kuota di model data), meski pembayaran **diaktifkan pasca-MVP** — menghindari retrofit mahal.
2. **Provider-agnostic**: semua lewat antarmuka `PaymentProvider`; tidak ada logika bisnis yang menyebut SDK provider.
3. Kuota AI adalah **entitlement kelas satu** — pembeda free/premium terukur.
4. Harga & limit = data (`plans`), bukan kode — dapat diubah admin tanpa deploy.

### 2. Struktur plan awal (ilustrasi — final ditetapkan bisnis)

| | Free | Pro | Business (WO) |
|---|---|---|---|
| Undangan aktif | 1 | 3 | 30 |
| Kuota media | 250 MB | 5 GB | 50 GB |
| Section & fitur | inti | + guestbook, gift, musik, preset premium | + duplikasi massal, export |
| AI calls/bulan | 20 | 300 | 2000 |
| Domain kustom | — | add-on | termasuk (2) |
| Analytics | dasar | penuh | penuh + export |
| Masa aktif undangan | 6 bulan | 3 tahun | 3 tahun |

Entitlement check runtime membaca `entitlements` (snapshot plan + override) — satu titik kebenaran untuk semua gerbang fitur/kuota; kelebihan kuota → pesan jelas + opsi upgrade (bukan error 500; dokumen 13 §10.5).

### 3. Siklus subscription & aturan

- Status: `trialing → active → past_due → canceled/expired`; masa tenggang (grace) terbatas; undangan published tidak langsung mati saat past_due (masa tampil berkurang + notifikasi) — menjaga kepercayaan tamu yang sudah menerima tautan.
- Upgrade: prorate sederhana; downgrade: berlaku akhir periode; pengaruh kuota dievaluasi saat turun (tidak ada penghapusan data mendadak — hanya pembekuan fitur).
- Trial plan Pro 7 hari (dapat diubah); coupon (persen/nominal, kuota, masa) dengan `coupon_redemptions` anti-double.
- Invoice & pembayaran: `payments` menyimpan status provider + referensi; **webhook provider diverifikasi signature** + idempoten (dokumen 16 §7).

### 4. PaymentProvider abstraction (aktif fase 3)

Antarmuka: `createPayment(invoice) → redirect/QR`, `verifyWebhook(headers, body) → event`, `queryStatus(ref)`. Implementasi pertama kandidat: **Midtrans Snap** (QRIS/VA/e-wallet — paling pas pasar ID); alternatif Xendit. Penambahan provider tidak menyentuh logika subscription.

## Bagian B — Routing Publik, Slug & Custom Domain

### 5. Arsitektur routing publik (bertumbuh bertahap)

```
Tahap 1 (MVP):   platform.id/w/<slug>                    ← slug unik global
Tahap 2:         <slug>.platform.id                      ← subdomain wildcard (opsional)
Tahap 3:         undangan.com milik user sendiri          ← custom domain
```

- `slugs` (dokumen 08 §2) mengatur kepemilikan & konflik: charset aman URL, lowercase, panjang 3–40, daftar kata terlarang (reserved, brand, sara); reservasi atomik saat undangan dibuat; rilis + karantina 30 hari sebelum dapat dipakai orang lain.
- Wildcard subdomain menggantung pada kemampuan platform (serverless: middleware host-header resolver → invitation) — dirancang sejak awal agar Tahap 2 hanya konfigurasi DNS + middleware, bukan rewrite.
- Tautan personal: `/w/<slug>?to=Nama+Tamu` (pratinjau aman, canonical bersih) atau `?g=<token>` versi guest-list (tercatat, `link_open`).

### 6. Custom domain (fase 4)

1. User mendaftarkan domain → sistem memberi instruksi DNS (TXT verifikasi kepemilikan + CNAME/A ke platform) dalam Bahasa Indonesia yang ringkas.
2. Verifikasi berkala (`domain_verifications` riwayat) → status `active` → provisioning SSL otomatis (platform menyediakan sertifikat edge; user tidak perlu mengurus).
3. Peta konflik: domain unik global; klaim kedua → verifikasi kepemilikan menang; domain yang lewat masa tidak-verifikasi otomatis lepas.
4. Siklus: `pending_verification → verifying → ssl_provisioning → active`; `failed` dengan alasan jelas; `detached` saat berhenti (undangan kembali ke URL platform).
5. Keamanan: domain hanya boleh menayangkan undangan milik pemilik terverifikasi; penghapusan domain kapan pun oleh owner; batas jumlah per plan.
6. Analytics/OG tetap berfungsi di domain kustom (tag meta dirender per-host dengan canonical domain kustom).

### 7. Cache & invalidasi lintas host

- Cache key mencakup host + slug + versi; publish ulang memicu invalidasi untuk host terkait (platform & kustom).
- Preview (draft) selalu di host platform dengan token akses terbatas — tidak pernah di domain kustom.
