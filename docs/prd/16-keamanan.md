# 16 — Arsitektur Keamanan

Keamanan adalah bagian arsitektur sejak hari pertama, bukan lapisan tambahan. Dokumen ini menetapkan kontrol wajib; detail operasional insiden ada di dokumen 22.

---

## 1. Model ancaman ringkas (apa yang dilindungi, dari siapa)

| Aset | Ancaman utama | Kontrol kunci |
|---|---|---|
| Data undangan & media milik user | Akses lintas tenant (ubah ID di URL) | Ownership check server-side per resource |
| Akun | Kredensial bocor, brute force, session hijack | Hash modern, rate limit, session DB revocable, 2FA admin |
| Halaman publik tamu | Spam RSVP/guestbook, scraping, abuse AI | Rate limit, anti-spam, kuota, captcha adaptif |
| Infrastruktur & secret | Kebocoran secret, injeksi, SSRF | Secret manager, validasi input, allowlist egress |
| Katalog & sistem | Perubahan tak sah theme/komponen/setting | RBAC + pipeline + audit + approval |
| Data pembayaran (masa depan) | Penyalahgunaan endpoint billing | Verifikasi webhook signature, idempotency |

## 2. Autentikasi & sesi

1. Password: hash argon2id; kebijakan panjang minimum; pengecekan password bocor (k-daftar umum ditolak).
2. Login: rate limit per IP+email; lockout progresif (`failed_login_count`, `locked_until`); semua percobaan tercatat di `auth_events`.
3. Session: strategy database (bukan JWT stateless) → logout/revoke instan seluruh sesi; cookie `HttpOnly`, `Secure`, `SameSite=Lax`; rotasi token sesi saat eskalasi (login ulang untuk aksi sensitif).
4. 2FA: TOTP wajib untuk role ADMIN/SUPER_ADMIN, opsional untuk user.
5. Reset password & verifikasi email: token sekali pakai, berumur pendek, hash di DB.
6. OAuth (Google): hanya provider terpilih; akun tertaut unik per provider (`oauth_accounts` unique constraint).

## 3. Otorisasi & ownership (pencegah akses lintas tenant)

- **Setiap** endpoint/server action yang menyentuh resource milik user wajib: (a) sesi valid; (b) permission role cukup; (c) `assertOwnership(resource, session.accountId)`. Tidak ada pengecualian; helper tunggal di `shared/` dipakai semua service (mudah diaudit).
- Permission didefinisikan matriks `roles × permissions`; verifikasi di server; UI hanya menyembunyikan demi kenyamanan.
- Aksi admin berbahaya (ubah role, ubah setting sistem, akses data user) → permission khusus + audit + (untuk kritis) konfirmasi ulang.

## 4. Validasi & injeksi

- Semua input eksternal (API, form, upload, webhook, **output AI**) divalidasi Zod di batas sistem; kegagalan → error validasi standar tanpa detail internal.
- Query database hanya via Prisma repository (parameterized) — dilarang string SQL mentah kecuali tercatat & direview.
- XSS: React escaping default; **tidak ada** `dangerouslySetInnerHTML` pada konten user/AI; rich text terbatas (Markdown subset aman → render ter-whitelist).
- SSRF: fetch eksternal (OG image, webhook, dsb.) hanya ke allowlist domain; tidak mengikuti redirect ke IP privat.
- CSRF: SameSite cookie + token sinkron untuk form mutatif + verifikasi origin pada mutasi (mengikuti pola Auth.js).

## 5. Upload & media

- Whitelist MIME + magic-number check (bukan sekadar ekstensi); batas ukuran per jenis; batas dimensi gambar; durasi video/musik dibatasi.
- Nama file disanitasi; storage key internal (UUID) — nama asli hanya metadata.
- Konten publik disajikan dari domain storage/CDN terpisah (isolasi origin); header `Content-Disposition`/`X-Content-Type-Options` aman; tanpa eksekusi.
- Pemindaian malware bila layanan tersedia (opsional fase lanjut; heuristik dasar lebih dulu).

## 6. Rate limiting & abuse control

| Endpoint kelas | Kebijakan default (dapat diatur via system settings) |
|---|---|
| Login / reset / register | 5–10/menit/IP + per-email; lockout progresif |
| Submit RSVP / guestbook | 3–5/menit/IP; honeypot; batas per undangan per jam; challenge adaptif bila mencurigakan |
| Upload | 10–20/menit/user + kuota penyimpanan |
| AI generation | Kuota harian/bulanan per plan + concurrency kecil |
| API publik render | Cache edge menyerap; sisa dibatasi per IP |

Implementasi: Upstash Redis (fixed/sliding window); kunci gabungan (endpoint, IP/user, resource); respons 429 dengan `Retry-After` dan pesan Indonesia yang jelas. Anti-spam RSVP tambahan: honeypot field, waktu-isi-minimum, rate per guest-link, `flagged` untuk moderasi owner.

## 7. Keamanan AI (spesifik mandat PRD)

1. **Input AI divalidasi** (panjang, bentuk, konteks terproyeksi — bukan dump mentah); instruksi user tidak pernah digabung sebagai system prompt.
2. **Permission boundary per agen** (dokumen 13 §6): AI hanya beroperasi lewat operasi service yang diizinkan untuk task-nya; tidak ada akses shell/DB bebas; tidak ada kredensial provider di konteks prompt.
3. **Prompt-injection resilience**: konten eksternal (mis. nama tamu, pesan guestbook yang diringkas AI) diperlakukan sebagai data tidak tepercaya (dibungkus, dibatasi panjang, diabaikan sebagai instruksi).
4. Output AI → schema gate; artefak direview sesuai risiko; tidak ada jalur output AI langsung ke production.
5. Webhook/callback eksternal: verifikasi signature (provider pembayaran, layanan media); replay protection; idempotensi.

## 8. Secret & konfigurasi

- Secret hanya di environment platform/secret manager; dilarang di repo, log, artefak AI, pesan error.
- Rotasi kunci dijadwalkan (dokumen 22 runbook); akses secret terbatas environment produksi.
- Pemindaian kebocoran di CI (pattern secret pada diff).

## 9. Header & kebijakan browser

- CSP ketat untuk halaman aplikasi (script-self, no-inline kecuali nonce terkelola); halaman undangan publik: CSP lebih longgar untuk embed peta/video namun tetap tanpa `unsafe-eval`.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal, HSTS di produksi, `frame-ancestors` dibatasi (embed share terkontrol).

## 10. Audit & kejuruan data

- Audit log (dokumen 08 §`audit_logs`) untuk: create/update/delete penting, publish/unpublish, permission & role change, theme/component publish, setting change, approval AI, operasi deployment terkait, data deletion/restoration — menyimpan actor, target, action, timestamp, source, result, context (tanpa secret).
- PII minimal: simpan `ip_hash` (salted) untuk keamanan/anti-spam, bukan IP mentah jangka panjang; data rekening gift terenkripsi at-rest; kepatuhan ekspor/hapus akun (dokumen 08 §8.2).

## 11. Checklist rilis keamanan (gerbang per rilis)

1. Dependency audit & lockfile dipin.
2. Tidak ada endpoint resource tanpa `assertOwnership` (uji otomatis lintas tenant negatif — dokumen 21 §5).
3. Tidak ada secret baru di repo; CI scan bersih.
4. Rate limit aktif untuk endpoint baru yang masuk kelas §6.
5. Aksi admin baru terdaftar permission + audit.
6. Review keamanan (`security-review` skill) untuk perubahan auth/billing/upload.
