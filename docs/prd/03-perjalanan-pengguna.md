# 03 — Perjalanan Pengguna (User / Admin / AI / System Journey)

Dokumen ini mendeskripsikan perjalanan kunci dari empat sudut pandang. Perjalanan ini menjadi dasar peta fitur (dokumen 04) dan acceptance criteria (dokumen 23).

---

## 1. Core User Journey — Dinda membuat undangan pertama

### 1.1 Alur baku (happy path)

```
Daftar akun → Buat undangan → Isi data dasar → Pilih konsep/template
   → Pilih theme → Unggah foto → AI menyusun struktur → Preview
   → Edit manual bila perlu (dibantu AI copilot) → Publish → Bagikan tautan
```

1. **Daftar akun.** Dinda mendaftar dengan Google atau email. Verifikasi minimal. Onboarding singkat (≤ 3 langkah) menjelaskan alur besar.
2. **Buat undangan.** Dashboard menampilkan tombol jelas "Buat Undangan". Tiga jalur tersedia: *dari template*, *dari theme*, atau *mintalah AI membuat konsep*.
3. **Isi data dasar.** Nama pasangan, tanggal, lokasi, nama orang tua (opsional), gaya bahasa (formal/hangat/romantis/dll.). Form ringkas — detail bisa disempurnakan nanti di editor.
4. **Pilih konsep & theme.** Galeri theme dengan preview nyata (bukan gambar statis). AI dapat menyarankan theme berdasarkan data & foto. Kombinasi template × theme divalidasi compatibility rules.
5. **Unggah foto.** Upload → sistem mengoptimasi otomatis (resize, WebP/AVIF, kompresi) → media masuk galeri milik undangan.
6. **AI menyusun struktur.** AI mengusulkan urutan section, menulis draft konten (opening, story, pesan, closing) dengan tone terpilih, dan menyetel animasi sesuai theme. Semua usulan berbentuk structured diff yang bisa diterima/ditolak per bagian.
7. **Preview.** Dinda melihat hasil persis seperti tamu: mode mobile & desktop, tautan preview aman untuk dibagikan sebelum publish.
8. **Edit manual (opsional).** Editor visual: isi konten, ganti foto, atur urutan section, warna, tipografi (dalam batas theme), animasi preset, musik, dsb. AI copilot menerima perintah bahasa alami: *"buat lebih elegan"*, *"ganti hero jadi cinematic"*, *"animasi lebih lembut"*.
9. **Publish.** Sistem memvalidasi seluruh konfigurasi (schema + theme + component + media) → membuat snapshot versi published → undangan live di `/w/slug-anda`. Draft tetap terpisah untuk editan berikutnya.
10. **Bagikan.** Tombol share WhatsApp dengan Open Graph preview cantik; opsi tautan dengan nama tamu personal (`?to=Nama+Tamu`) untuk sapaan personal.
11. **Pantau.** Dashboard: jumlah kunjungan, RSVP masuk, pesan guestbook — realtime-cukup (menit).

### 1.2 Keadaan penting yang harus ditangani

| Keadaan | Penanganan wajib |
|---|---|
| AI sedang sibuk / kena rate limit | Job masuk antrean dengan status terlihat ("AI sedang menyusun…"); hasil datang belakangan; tidak ada blocking UX |
| Output AI tidak lolos validasi | User tidak pernah melihat hasil mentah; sistem retry lalu fallback ke saran manual |
| User edit draft setelah publish | Published tidak berubah sampai "Publish Ulang"; diff draft vs published ditunjukkan |
| Foto terlalu besar/format aneh | Kompresi & konversi otomatis; tolak MIME berbahaya; batas ukuran jelas di UI |
| User ingin membatalkan semua | Draft dapat di-reset ke versi published terakhir |

---

## 2. Guest Journey — tamu membuka undangan (pengalaman produk sesungguhnya)

1. Tamu menerima tautan WhatsApp → membuka di ponsel → **opening experience** (cover dengan nama tamu, tombol "Buka Undangan") → musik opsional mulai → konten terbuka dengan animasi halus.
2. Menjelajah: hero pasangan → quote → story timeline → detail acara + countdown → galeri → peta → RSVP → guestbook → info kado digital → closing & terima kasih.
3. Mengisi RSVP: nama (prefilled bila tautan personal), kehadiran, jumlah tamu, pesan. Perlindungan anti-spam bekerja di belakang tanpa mengganggu.
4. Interaksi tercatat sebagai event analytics anonim (view, map click, gallery open, gift click) — privat, tanpa data pribadi berlebih.

**Kewajiban pengalaman tamu:** halaman harus indah & cepat di Android kelas bawah dengan jaringan tidak stabil; animasi dimatikan otomatis bila perangkat lambat atau `prefers-reduced-motion`; musik tidak autoplay paksa tanpa interaksi (kebijakan browser & etika).

---

## 3. Admin Journey — Sarah mengoperasikan platform

1. Login admin (wajib 2FA) → dashboard operasional: kesehatan sistem, pengguna baru, undangan aktif, tugas AI (berjalan/gagal/menunggu approval), penggunaan kuota AI, subscription status.
2. **Moderasi & dukungan:** cari user/undangan, lihat detail, nonaktifkan konten melanggar, jawab ticket (fase lanjut).
3. **Katalog:** publish/deprecate theme & component (melalui pipeline, bukan tombol sembarangan), atur template & rekomendasi.
4. **Tugas AI:** pantau antrean, lihat checkpoint, retry/gagalkan tugas, setujui/tolak usulan berisiko menengah-tinggi.
5. **Billing:** status subscription, payment, coupon, refund manual dengan alasan tercatat.
6. **Keamanan & audit:** baca audit log (siapa melakukan apa kapan), security events, kill switch feature flag.
7. **Diagnosis:** halaman kesehatan (DB, queue, provider AI, storage), error rate, latency; tombol eskalasi insiden.

Semua aksi admin terekam audit log dengan actor, target, action, timestamp, source, result, context — tanpa menyimpan secret.

---

## 4. AI Journey — bagaimana pekerjaan AI berjalan (untuk fitur user)

Contoh: user meminta *"buatkan tema elegan putih-emas nuansa editorial modern"*.

```
[1] Permintaan user
      ↓
[2] Task dibuat (ai_tasks) — status: pending
      ↓ validasi input, cek kuota & budget, pilih skill relevan
[3] queued → running
      ↓ AI Gateway → provider (Gemini) → structured output (Zod-validated)
[4] Validator theme: schema, contrast, tipografi, kompatibilitas registry, mobile-safe animasi
      ↓ gagal? → retry dengan feedback error (maks N) → masih gagal? → failed + laporan
[5] Artefak tersimpan (theme definition draft) — status theme: draft
      ↓
[6] Preview dibuat (render tema pada template sampel)
      ↓
[7] Output ke user: preview + penjelasan + tombol Terima/Tolak
      ↓
[8] Jika panjang/terpotong rate limit → checkpoint disimpan → status: checkpointed
      → scheduler melanjutkan otomatis di window berikutnya (tanpa user mengulang permintaan)
```

Aturan main AI journey (berlaku semua fitur AI):
- Output AI **selalu** structured + divalidasi; tidak pernah teks/kode bebas yang langsung dipakai.
- Perubahan pada undangan user berbentuk **diff proposal**; tidak ada perubahan diam-diam.
- Tugas berisiko (publish theme/component ke registry publik, ubah setting sistem) wajib approval.
- Setiap pemanggilan provider dicatat (model, token, latency, status, retry) untuk kuota & biaya.

---

## 5. System Journey — siklus hidup undangan dari sudut pandang sistem

### 5.1 Siklus hidup data undangan

```
[draft v0] --edit--> [draft v1..n] --publish(validasi)--> [published snapshot v1]
                                                                │
                          [draft v2] --publish ulang----------> [published v2]
                                                                │
                          rollback <--------------------------- repoint ke v1
                                                                │
                          archive/unpublish --------------------> [archived]
```

- Editor hanya menulis ke draft.
- Published snapshot immutable; rollback = memindahkan pointer versi aktif.
- Renderer publik hanya membaca versi published tervalidasi (cache-friendly).

### 5.2 Siklus hidup request render publik

```
Tamu buka /w/slug
  → cek cache edge (hit? selesai)
  → ambil published snapshot + theme version + component versions
  → compatibility check (schema/renderer/theme/component)
  → render SSR (JSON → React tree) + hydrasi animasi ringan
  → cache edge dengan invalidation berbasis versi
```

### 5.3 Siklus hidup pekerjaan latar (background job)

```
trigger (user action / cron / webhook)
  → masuk queue (Inngest) + catat di task registry (DB = source of truth)
  → worker mengeksekusi per step; tiap step = checkpoint
  → sukses: completed + evidence + update project state
  → error sementara: retry + backoff (maks ditentukan policy)
  → error permanen/arsitektural: blocked/failed + eskalasi note
  → butuh manusia: waiting-for-input (tidak diulang otomatis tanpa alasan)
```

### 5.4 Siklus hidup pengembangan otonom (internal)

```
Roadmap fase → task graph (dependencies)
  → task runner pilih task siap (dependency terpenuhi)
  → AI kerjakan dengan skill relevan + baca ADR + project state
  → hasil: artifact + evidence (test, lint, build)
  → pipeline CI sebagai gatekeeper
  → risiko LOW: otomatis; MEDIUM: review; HIGH/CRITICAL: approval eksplisit
  → selesai: update project state + changelog + (bila perlu) update knowledge base/skill
```

---

## 6. Peta empati lintas journey (ringkasan kebutuhan)

| Aktor | Paling takut | Paling ingin |
|---|---|---|
| Dinda | Hasil jelek, susah, telat | Cepat jadi, cantik, gampang diubah |
| Tamu (guest) | Lambat, kuota habis, ribet | Cepat terbuka, indah, jelas |
| Bu Ratna | Salah klik merusak | Aman, preview, bahasa jelas |
| Rizky (WO) | Kerja berulang per client | Duplikasi, data terkumpul |
| Sarah (admin) | Kaget ada kerusakan | Terlihat, terkendali, ada jejak |
| AI assistant | Konteks hilang, dilarang semua | State jelas, boundary jelas, checkpoint |
