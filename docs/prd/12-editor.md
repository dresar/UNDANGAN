# 12 — Editor Visual & AI Copilot

Editor adalah ruang kerja utama pengguna non-teknis. Tujuan: semua yang dilihat tamu dapat diatur tanpa koding — struktur section, konten, foto, warna (dalam batas theme), tipografi, animasi, musik, RSVP, guestbook, gift, peta. AI Copilot hadir sebagai asisten bahasa alami; kontrol manual penuh selalu tersedia dan tidak pernah dikunci.

---

## 1. Prinsip editor

1. **WYSIWYG setia**: preview memakai pipeline renderer yang sama dengan production (dokumen 09) — apa yang terlihat = apa yang didapat tamu.
2. **Autosave + riwayat**: setiap perubahan tersimpan sebagai revisi draft; pengguna dapat melihat & memulihkan revisi sebelumnya (batas retensi mis. 50 revisi terakhir).
3. **Draft suci**: editor tidak pernah menyentuh versi published; tombol Publish selalu menampilkan diff ringkas vs published.
4. **Undo/redo konsisten**: satu alur undo lintas panel (struktur, konten, styling).
5. **Ramah pemula + cukup untuk power user**: mode terbimbing (checklist "lengkapi undanganmu") + mode bebas.
6. **Performa editor**: dokumen besar (banyak section/foto) tetap responsif — virtualisasi daftar section, thumbnail malas, operasi batch.

## 2. Struktur UI (konsep)

```
┌───────────────────────────────────────────────────────────────┐
│  Topbar: nama undangan · status (Draft/Published) · Simpan    │
│          otomatis · Preview · Publish                          │
├───────────┬───────────────────────────────────┬───────────────┤
│ Panel     │  Kanvas (preview device:          │ Panel Inspektur│
│ Struktur  │  mobile ⇄ desktop)                │  (konteks      │
│ (daftar   │  - drag & drop urutan section     │   seleksi:     │
│ section,  │  - klik section → pilih           │   konten,      │
│ tambah,   │  - inline edit teks langsung      │   varian,      │
│ sembunyi) │  - hover tools (naik/turun/hapus) │   animasi,     │
│           │                                   │   lanjutan)    │
├───────────┴───────────────────────────────────┴───────────────┤
│  Copilot Bar (bawah): input bahasa alami + saran & riwayat AI │
└───────────────────────────────────────────────────────────────┘
```

Panel & fitur:

- **Struktur**: daftar section (ikon + nama + status), tambah section (katalog komponen + saran AI), geser urutan, duplikat, sembunyikan tanpa hapus.
- **Inspektur konten**: form sesuai `content_schema` komponen (field teks, pemilih media, pemilih event, tautan peta) — label & bantuan berbahasa Indonesia.
- **Inspektur varian**: pilih variant + pengaturan props yang diizinkan; tampilan adaptif sesuai schema (bukan form generik mentah).
- **Styling undangan**: pemilih theme (ganti theme aman: konten dipetakan otomatis ke komponen setara; laporan bila ada section tidak tersedia di theme baru), override warna terbatas (whelist token), tipografi dalam batas theme, preset animasi global + per-section.
- **Fitur**: toggle & pengaturan RSVP (form builder sederhana), guestbook (moderasi), gift (isi & enkripsi), musik (upload/pustaka), pengaturan SEO & berbagi (OG image otomatis dari foto terpilih), slug.
- **Checklist kesiapan** (bukan blocker, hanya bimbingan): foto hero ada, tanggal acara terisi, RSVP aktif, konten story terisi, dsb.

## 3. Media manager (terintegrasi editor)

- Upload multi-file dengan progress; kompresi & konversi otomatis (serverless pipeline `sharp` → variants); indikator status optimasi.
- Galeri per undangan + pustaka akun; pencarian; alt text editor (diingatkan demi aksesibilitas).
- Batas per plan (kuota GB & jumlah file); pesan jelas saat mendekati batas.
- Hapus media yang dipakai → peringatan daftar section terdampak (usage relation dari `media_assets.usage_count` + pemindaian dokumen).

## 4. AI Copilot (bahasa alami → diff proposal)

Kemampuan (contoh permintaan → tindakan):

| Permintaan user | Aksi AI (structured output) |
|---|---|
| "ubah undangan ini supaya lebih elegan" | Analisis konfigurasi → usulan: theme alternatif/preset animasi `elegant` + penyesuaian typografi + penyederhanaan dekorasi — dalam bentuk diff bertingkat dengan alasan |
| "buat warna lebih hangat" | Usulan `tokenOverrides` (whitelist) dengan preview swatch sebelum/sesudah |
| "ganti hero jadi lebih cinematic" | Ubah variant hero + setting overlay + animasi |
| "tambahkan section perjalanan cinta setelah foto pasangan" | Sisip section `story` pada posisi itu + draft konten dari data pasangan |
| "animasinya lebih lembut" | Ubah intensity/preset animasi global & section |
| "buat halaman terasa mewah tapi tidak ramai" | Paket usulan: palet, spacing, dekorasi, tipografi |

Perilaku wajib copilot:

1. **Memahami konteks aktif**: membaca dokumen draft + theme + data acara (versi ringkas/ter-summarize, bukan seluruh JSON mentah, untuk hemat token — dokumen 13 §7).
2. **Hanya mengubah yang perlu**: output = *structured patch* (RFC-style JSON patch terbatas pada schema dokumen) — bukan regenerasi seluruh dokumen.
3. **Diff + pratinjau**: user melihat ringkasan perubahan ("3 bagian berubah: Hero, Animasi, Tipografi") + pratinjau visual; terima per bagian atau semua.
4. **Tidak merusak**: patch divalidasi schema + compatibility sebelum bisa diterapkan; perubahan yang menghapus konten user ditandai merah & butuh konfirmasi.
5. **Jejak**: setiap usulan (diterima/ditolak) dicatat untuk learning kualitas AI (dokumen 22 §5).
6. **Kuota & antrean**: permintaan berat (susun struktur penuh) jadi tugas AI dengan status terlihat; copilot ringan (teks) sinkron dengan fallback antrean.

## 5. AI Builder (onboarding generatif — dokumen 04 U-18)

- Dari data dasar (nama, tanggal, tone, foto sampel) → AI menyusun: pilihan template+theme kompatibel, struktur section, draft konten lengkap, setting animasi & musik saran.
- Hasil disajikan sebagai **3 konsep berbeda** (bukan satu hasil mentah) → user memilih satu → masuk editor dengan draft siap lanjut.
- Semua konsep = dokumen draft tervalidasi (bukan mockup gambar) sehingga melanjutkan edit langsung mulus.

## 6. Sistem rekomendasi (non-intrusif)

- Sumber saran: analisis statis (kontras, panjang teks, urutan lazim, ukuran foto, kelengkapan SEO) + pola platform (section populer, kombinasi theme/template favorit).
- Disajikan sebagai kartu saran opsional dengan alasan & tombol Terima/Tolak/Tutup; tidak pernah auto-apply; tidak mengganggu alur utama.
- Kategori: struktur, visual (kontras/keterbacaan), mobile, performa (foto terlalu berat), SEO/berbagi.

## 7. Interaksi teknis editor (kontrak implementasi)

- State editor: Zustand store dengan bentuk dokumen = sumber kebenaran kanvas; semua mutasi melalui *action tervalidasi* (schema) sehingga autosave selalu menyimpan dokumen valid atau menandai `validation_state=invalid` dengan pesan jelas.
- Simpan: debounced + on-blur; revisi dibuat per checkpoint waktu (bukan per ketikan).
- Kolaborasi: satu editor aktif per undangan pada fase awal (soft-lock dengan indikator); deteksi konflik multi-tab via revisi id.
- Aksesibilitas editor: keyboard navigation penuh, fokus jelas, kontras AA — editor juga harus bisa dipakai orang dengan keterbatasan.
