# 02 — Visi Produk, Problem, Target Pengguna, Persona, Goals & Non-Goals

## 1. Visi produk

Menjadi **Wedding Experience Platform** terdepan di Indonesia: engine yang mengubah data pernikahan menjadi pengalaman digital yang emosional dan elegan — bukan sekadar halaman berisi nama, tanggal, foto, dan lokasi. Setiap undangan yang dihasilkan memiliki storytelling, opening & closing experience, animasi halus, galeri interaktif, countdown, RSVP, guestbook, kado digital, musik, video, peta, share preview, sapaan tamu personal, dan timeline kisah pasangan.

Pilar visi:

1. **Engine, bukan halaman.** Satu engine menghasilkan sangat banyak jenis website undangan dari kombinasi *data + template + theme + component + animation + configuration*. Tidak ada hardcode per client.
2. **AI sebagai tenaga kerja, bukan gimmick.** AI merancang tema, menyusun struktur, menulis konten, menguji, memperbaiki, dan mengoptimalkan — dalam batas schema, validator, guardrail, permission, dan approval yang ketat.
3. **Software engineering-first.** AI memperkuat arsitektur yang baik, bukan menggantinya. Tidak ada output AI yang bebas merubah production tanpa validasi.
4. **Produk jangka panjang.** Fondasi yang dapat tumbuh menjadi perusahaan teknologi: ribuan pengguna, ratusan tema, billing, domain, analytics, versioning, audit, keamanan — tanpa rewrite total.

## 2. Problem statement

### 2.1 Problem pengguna akhir (pasangan & keluarga)

| # | Problem | Dampak |
|---|---|---|
| P1 | Undangan digital berbentuk template mati; semua pengguna terlihat sama | Undangan terasa murahan, tidak mencerminkan kepribadian pasangan |
| P2 | Kustomisasi butuh vendor/middleware; revisi lambat dan berbiaya | Proses bertele-tele menjelang hari besar (waktu paling sensitif) |
| P3 | Fitur interaktif (RSVP, guestbook, kado digital) tersebar di banyak layanan terpisah | Pengalaman tamu terfragmentasi; pengukuran tidak ada |
| P4 | Tamu membuka via smartphone dengan jaringan tidak stabil; banyak undangan berat | Halaman lambat, gagal dibuka, kesan buruk |
| P5 | Bahasa produk yang tersedia umumnya teknis/Inggris | Pengguna non-teknis Indonesia kesulitan |

### 2.2 Problem bisnis (penyedia/platform undangan)

| # | Problem | Dampak |
|---|---|---|
| B1 | Model "satu website per client" tidak scalable | Pertumbuhan = penambahan tenaga manual, margin menurun |
| B2 | Penambahan desain baru = proyek coding baru | Katalog desain tumbuh lambat, mahal |
| B3 | Tidak ada sistem billing/kuota/analytics yang matang | Sulit monetisasi terukur |
| B4 | Kualitas tidak konsisten antar client | Reputasi & retensi buruk |

### 2.3 Problem pengembangan (internal)

| # | Problem | Dampak |
|---|---|---|
| D1 | Pekerjaan desain/konten/uji manual berulang | Kecepatan pengembangan rendah |
| D2 | AI chatbot lupa konteks setiap sesi berakhir | Pekerjaan panjang tidak bisa didelegasikan ke AI |
| D3 | Output AI tidak tervalidasi berisiko merusak sistem | Kepercayaan pada otomatisasi rendah |
| D4 | Provider AI gratis punya batas output/rate/timeout | Otomatisasi berhenti di tengah jalan |

Platform ini dirancang eksplisit untuk menjawab P1–P5, B1–B4, dan D1–D4.

## 3. Target pasar & positioning

- **Pasar awal:** Indonesia, bahasa Indonesia, pernikahan (scope sengaja tidak diperluas di awal).
- **Segmen:** pasangan muda digital-native (23–35), keluarga yang mengurus pernikahan anak, wedding organizer yang mengelola banyak client (potensi plan bisnis).
- **Positioning:** "undangan premium yang dibuat menit, terasa custom-desain" — di antara (a) template murah massal dan (b) jasa custom mahal & lambat.

## 4. Persona

### Persona 1 — Dinda, calon pengantin (primary user)
- 27 th, pekerja kantoran, fasih smartphone tapi tidak bisa koding.
- Kebutuhan: undangan cantik, cepat jadi, bisa ganti isi sendiri sampai H-1, bisa lihat siapa yang akan datang (RSVP).
- Perilaku: membuka semuanya dari ponsel; frustrasi kalau istilah teknis; ingin hasil "kayak bikinan desainer".
- Sukses: publish undangan pertamanya < 30 menit tanpa minta bantuan teknis.

### Persona 2 — Bu Ratna, keluarga pengantin (secondary user)
- 52 th, mengurus pernikahan anak, cukup fasih WhatsApp/FP, hati-hati dengan pembayaran online.
- Kebutuhan: alur sangat sederhana, bahasa Indonesia yang jelas, undangan bisa dibagikan via WhatsApp dengan preview cantik.
- Perilaku: takut merusak; butuh preview jelas sebelum menyimpan.
- Sukses: mengisi data acara & membagikan tautan tanpa salah-langkah fatal.

### Persona 3 — Rizky, wedding organizer (power user, fase lanjut)
- 31 th, mengelola 10–30 client per musim.
- Kebutuhan: banyak undangan dalam satu akun, duplikasi konfigurasi, data RSVP terexport, brand konsisten.
- Sukses: membuat undangan ke-N dari duplikat < 10 menit.

### Persona 4 — Sarah, admin platform (internal)
- Operator perusahaan; mengelola pengguna, tema, tugas AI, subscription, incident.
- Kebutuhan: dashboard operasional, audit log, kill switch fitur, monitor tugas AI gagal.
- Sukses: bisa mendiagnosis & memulihkan masalah tanpa menyentuh server.

### Persona 5 — AI Developer Assistant (persona non-manusia, wajib dirancang)
- "Karyawan" AI: planner, designer, content generator, reviewer, tester, maintenance worker.
- Kebutuhan: project state yang selalu mutakhir, skill yang relevan, task registry dengan dependency, batasan permission jelas, checkpoint yang persisten.
- Sukses: menyelesaikan task sesuai acceptance criteria & evidence, tanpa melanggar policy.

## 5. Value proposition per persona

- **Dinda/Bu Ratna:** hasil premium tanpa koding; AI copilot Bahasa Indonesia; kontrol manual penuh tetap tersedia; halaman cepat di ponsel semua kalangan tamu.
- **Rizky:** efisiensi multi-undangan, data tamu terpusat, export.
- **Sarah:** satu pusat kendali operasional dengan audit & kill switch.
- **Pemilik bisnis:** engine yang membuat katalog desain tumbuh via generasi terkontrol (theme/component), bukan via proyek manual baru.

## 6. Product goals (tujuan terukur)

| ID | Goal | Metrik |
|---|---|---|
| G1 | Time-to-publish cepat untuk pengguna baru | Median undangan pertama published ≤ 30 menit sejak daftar |
| G2 | Kualitas visual konsisten lintas perangkat | LCP undangan publik < 2,5 dtk (4G, ponsel menengah); CLS < 0,1 |
| G3 | Engine yang scalable secara desain | Menambah theme baru tanpa mengubah kode komponen inti (diuji per rilis theme) |
| G4 | AI bermanfaat & terukur | ≥ 60% saran AI content/theme diterima pengguna; < 2% output AI lolos validasi ulang gagal schema |
| G5 | Keandalan | Uptime halaman undangan published ≥ 99,9%; draft rusak tidak pernah memengaruhi published |
| G6 | Biaya terkendali | Biaya AI & media per undangan aktif dapat dipantau di admin dan dibatasi kuota |
| G7 | Keamanan | 0 insiden akses lintas-tenant; 100% endpoint sensitif terverifikasi server-side |

## 7. Non-goals (scope yang sengaja DIBATALKAN untuk tahap awal)

1. **Bukan** platform multi-jenis acara (ulang tahun, seminar, aqiqah, dsb.) — fokus pernikahan sampai core matang. Ekspansi dibahas hanya sebagai strategi masa depan (dokumen 25).
2. **Bukan** aplikasi native iOS/Android — web mobile-first cukup.
3. **Bukan** editor kode bebas bagi pengguna akhir — kustomisasi lewat editor visual + konfigurasi + AI; kode bebas merusak keamanan & konsistensi.
4. **Bukan** microservices / event-driven kompleks di hari pertama — modular monolith serverless-first.
5. **Bukan** kolaborasi real-time multi-user dalam editor (seperti Figma) pada tahap awal — satu editor aktif per undangan; sharing read-only preview saja.
6. **Bukan** marketplace theme kontributor eksternal pada tahap awal — katalog dikelola internal dulu.
7. **Bukan** AI yang boleh mengubah production tanpa approval — selamanya, sesuai risk policy.

## 8. Prinsip produk

1. **User tetap bos.** AI menyarankan, user menyetujui. Semua saran bersifat optional dengan penjelasan.
2. **Mobile-first untuk tamu, desktop-cukup untuk pembuat.** Prioritas performa halaman publik di atas segalanya.
3. **Bahasa Indonesia sebagai bahasa utama** seluruh UI, error, onboarding, dokumentasi, dan output AI yang menghadap pengguna. Istilah teknis internal (nama library/API) tetap apa adanya.
4. **Draft suci, published suci.** Editor tidak pernah menyentuh versi published; publish = snapshot baru yang tervalidasi.
5. **Kemudahan tidak mengunci keahlian.** Alur cepat onboarding tersedia, tetapi editor manual penuh selalu bisa dipakai tanpa AI.
