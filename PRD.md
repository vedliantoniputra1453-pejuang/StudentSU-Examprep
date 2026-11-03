# PRD — StudentSU Examprep

Spesifikasi produk Tahap 1. Mengikat stack, struktur repo, dan batas fitur. Turunan dari AGENTS.md; bila berbeda, AGENTS.md menang.

| Atribut | Nilai |
| --- | --- |
| Produk | StudentSU Examprep |
| Repo | github.com/vedli/StudentSU-Examprep |
| Tahap aktif | Tahap 1 — open source (MIT), local-first, role Student |
| Stack | Next.js 16 App Router, TypeScript strict, Tailwind CSS v4 |
| Benchmark desain | skylearn-DESIGN.md (root, tidak diubah) |
| Bahasa | Indonesia (default), English (later) |

## 1. Ringkasan Produk

**Yang dibangun.** Web app yang berjalan di localhost. Mahasiswa memasukkan materi kuliah (transcript Zoom, PPT/PDF, referensi buku), CPMK, dan rubrik penilaian. Aplikasi memakai API key milik user (BYOK) untuk memanggil provider AI langsung dari browser, menghasilkan soal latihan yang mengikuti CPMK yang diuji, menilai jawaban, menyimpan riwayat, dan menampilkan peta kekuatan per CPMK.

**Masalah.**
- Materi tersebar dalam banyak format dan tidak pernah menjadi latihan soal yang mengikuti CPMK.
- Soal yang beredar generik, tidak terhubung ke rubrik dosen, sehingga latihan tidak mengenai hal yang diuji.
- Mahasiswa tahu "belum paham" tetapi tidak tahu bagian mana, per CPMK.
- Soal tidak relate dengan konteks mahasiswa; hafalan cepat hilang.
- Persiapan UTS/UAS mendadak, tanpa data tren pemahaman.

**Tujuan.**
1. Mengubah materi + CPMK + rubrik menjadi set soal yang bisa dikerjakan dan dinilai dalam satu alur.
2. Menampilkan pemahaman per CPMK sebagai angka dan radar chart, bukan kesan subjektif.
3. Menjaga soal tetap di dalam cakupan materi yang diunggah.
4. Menjaga data dan API key tetap di perangkat user.
5. Menyiapkan domain model yang bisa naik ke Tahap 2 tanpa menulis ulang.

**Prinsip.**
- **Lokal dulu.** Tanpa backend, tanpa database, tanpa server milik kami. Semua state di localStorage; tidak ada endpoint yang menerima data user.
- **Open source dulu.** MIT, kontribusi lewat PR, tanpa ketergantungan layanan proprietary kami.
- **BYOK dulu.** User membawa key sendiri. Kami tidak menjual token dan tidak menjadi perantara request.
- **Materi sebagai sumber kebenaran.** AI tidak boleh menambah CPMK atau konsep di luar materi, CPMK, dan rubrik yang dikirim.
- **Jujur pada data kosong.** Lebih baik "belum ada data" daripada angka pemahaman karangan.

## 2. Persona & Role Matrix

**Persona utama — mahasiswa Manajemen (20 th).** UTS dengan 7 sesi materi, transcript Zoom panjang, rubrik studi kasus. Ingin tahu bagian mana yang lemah dan ingin soal memakai konteks yang ia pahami.

**Persona sekunder — mahasiswa Akuntansi (21 th).** Slide PDF berisi jurnal penyesuaian dan rumus. Butuh pilihan ganda untuk latihan cepat dan esai untuk argumentasi, dengan feedback yang menyebut langkah yang salah.

**Persona Tahap 2 — Super Admin.** Mengelola materi default, katalog mata kuliah, kuota, dan tiket. Tidak ada di Tahap 1.

| Kapabilitas | Student (Tahap 1) | Super Admin (Tahap 2) |
| --- | --- | --- |
| Login | Mock, pilih akun kampus | Auth nyata + RBAC |
| Jurusan | Manajemen / Akuntansi | Semua jurusan |
| Materi | Upload sendiri + materi default lokal | CRUD materi default global |
| CPMK & rubrik | Untuk mata kuliah sendiri | Menyediakan template |
| Generate soal | Key sendiri | Kredit platform |
| Riwayat & skill chart | Milik sendiri | Agregat anonim |
| Jurnal | Privat lokal | Tidak ada akses baca |
| Tiket | Membuat | Membaca, mengubah status |
| Kredit & pembayaran | Tidak ada | Ada (di luar PRD ini) |

Tahap 1 hanya membangun kolom Student. Kolom Tahap 2 hanya berupa type di `lib/types.ts`, tanpa route, UI, atau logika.

## 3. Batasan Tahap 1 (Non-Goals)

1. **Auth nyata.** Tidak ada OAuth Gmail/Microsoft, verifikasi domain kampus, atau session server. Login disimulasikan di klien.
2. **Database dan backend.** Tidak ada API route yang menyimpan data, Postgres, atau object storage. File diproses di browser.
3. **Pembayaran dan kredit.** Tidak ada provider pembayaran, kuota, paywall, atau rate limit komersial.
4. **Multi-user dan sinkronisasi.** Satu browser = satu user. Tidak ada kolaborasi atau cloud backup.
5. **Super Admin.** Tidak ada panel admin, katalog global, atau pengawasan tiket.
6. **OCR dan parsing layout kompleks.** PDF scan tanpa text layer dianggap gagal ekstrak; user diminta menempel teks.
7. **PWA offline penuh dan mobile native.** Hanya web responsif; data lokal tetap terbaca tanpa jaringan.
8. **Integrasi LMS kampus.** Tidak ada tarik nilai atau SIAKAD.
9. **Bahasa selain Indonesia.** Kamus disiapkan, terjemahan English belum diisi.
10. **Analitik, telemetry, dan dark mode.** Tidak ada tracking, error reporting, script pihak ketiga, atau tema gelap.

Yang dibangun: F1–F11 di Bagian 5, dengan data contoh di `lib/mock-data.ts`.

## 4. Alur Pengguna Utama

**Cold start.**
1. Buka `/`. Landing: satu paragraf penjelasan + tombol "Mulai".
2. **F1** Login mock: pilih akun kampus contoh, pilih jurusan, isi prompt personalisasi atau pilih kategori minat.
3. **F11** Pengaturan: tempel API key Gemini/OpenAI, pilih model, "Test koneksi".
4. **F2** Dashboard: level, streak, pemahaman per CPMK (kosong untuk user baru), gap list.

**Menyiapkan ujian.**
1. **F3** Pilih mata kuliah, lalu tempel transcript, upload PPT/PDF, atau pilih materi default.
2. **F4** Input CPMK dan rubrik per mata kuliah.
3. **F5** Pilih UTS/UAS, tentukan rentang sesi, opsional upload kisi-kisi. Tanpa kisi-kisi, cakupan diturunkan dari CPMK + rubrik dan ditampilkan untuk konfirmasi.
4. **F6** Pilih gaya personalisasi, bentuk soal, jumlah soal, lalu generate. Kerjakan, submit, lihat feedback per soal.
5. **F7/F8** Lihat skor, tren, radar per CPMK, insight karier.
6. **F9** Tulis jurnal. **F10** Kirim tiket bila ada kendala.

**Peta layar.**
- `/`, `localhost` onboarding — F1 — app-shell
- `/dashboard` — F2, F7, F8 — stat-card, skill-radar, course-progress, gap-list, insight-card
- `/materi` — F3; `/cpmk` — F4 — course-progress
- `/ujian` — F5, F6 — gap-list; `/latihan/[id]` — F6 — answer tile
- `/riwayat` — F7, F8 — skill-radar, insight-card; `/jurnal` — F9 — journal-card
- `/tiket` — F10; `/pengaturan` — F11, F1

Rute boleh disesuaikan saat implementasi selama fitur tetap terpetakan.

## 5. Requirement per Fitur

### F1 — Auth & Onboarding
- **Story.** Sebagai mahasiswa SU, saya ingin masuk, memilih jurusan dan minat, agar materi dan soal mengikuti konteks saya.
- **Alur.** Pilih akun kampus (mock) → konfirmasi nama/email → pilih jurusan → prompt bebas atau kategori minat → profil tersimpan.
- **AC.**
  - Given belum ada profil, when membuka `/dashboard`, then user diarahkan ke onboarding.
  - Given memilih Manajemen, when selesai, then `department = 'manajemen'` dan katalog hanya menampilkan mata kuliah Manajemen.
  - Given mengisi prompt bebas, when selesai, then prompt tersimpan utuh dan dipakai di F6.
  - Given profil sudah ada, when membuka `/`, then langsung ke dashboard tanpa wizard ulang.
- **Edge & error.** localStorage penuh → banner "Profil tidak bisa disimpan di browser ini" + tawaran sesi sementara; prompt melebihi batas karakter dipotong dengan penghitung terlihat; tombol back tidak mengulang wizard.

### F2 — Dashboard Belajar
- **Story.** Sebagai mahasiswa, saya ingin melihat level, pemahaman per CPMK, gap, dan streak dalam satu layar.
- **Alur.** Buka `/dashboard` → ringkasan level dan streak → kartu mata kuliah dengan progress → gap list → klik gap menuju latihan relevan.
- **AC.**
  - Given belum ada attempt, when dashboard dibuka, then persentase menampilkan "Belum ada data", bukan 0%.
  - Given ada attempt, when dashboard dibuka, then persentase CPMK sama dengan nilai di F8.
  - Given latihan selesai pada hari kalender berikutnya, when attempt disimpan, then streak bertambah satu; hari yang sama tidak menambah.
  - Given CPMK di bawah threshold, when dashboard dibuka, then CPMK muncul di gap list dengan alasan singkat.
- **Edge & error.** Attempt merujuk CPMK terhapus → CPMK diabaikan + catatan "1 CPMK tidak ditemukan"; streak memakai tanggal lokal browser; semua kosong → empty state dengan CTA ke F3.

### F3 — Input Materi
- **Story.** Sebagai mahasiswa, saya ingin memasukkan materi dari teks, PPT/PDF, atau materi default, agar soal dibuat dari sumber yang benar.
- **Alur.** Pilih mata kuliah → pilih sumber → ekstraksi teks di browser → preview + jumlah karakter → simpan sebagai Material pada sesi terkait.
- **AC.**
  - Given menempel transcript, when disimpan, then Material tersimpan dengan `charCount` benar dan muncul di daftar.
  - Given PDF bertext layer, when ekstraksi selesai, then teks tampil di preview sebelum disimpan.
  - Given PDF scan tanpa text layer, when hasil kosong, then muncul "File tidak berisi teks. Tempel teks atau pakai PDF lain" dan tombol simpan nonaktif.
  - Given memilih materi default, when dikonfirmasi, then tersalin sebagai milik user, bisa dihapus, dan berkas contoh tidak berubah.
- **Edge & error.** File melebihi batas ditolak di klien dengan batas tertera di UI (nilai: TBD); kuota localStorage tipis → simpan ringkasan + tawarkan hapus materi lama; format tidak didukung → sebut format yang didukung (PDF, PPTX), bukan "terjadi kesalahan".

### F4 — Input CPMK per Pembelajaran
- **Story.** Sebagai mahasiswa, saya ingin memasukkan CPMK dan rubrik, agar soal mengikuti kompetensi yang benar-benar diuji.
- **Alur.** Pilih mata kuliah → tambah CPMK (kode, deskripsi, sesi) → tambah rubrik (kriteria, bobot, deskriptor level) → simpan → validasi bobot.
- **AC.**
  - Given CPMK tanpa kode, when menyimpan, then error inline "Kode CPMK wajib diisi" dan data tidak tersimpan.
  - Given total bobot rubrik bukan 100, when menyimpan, then peringatan non-blocking menyebut total saat ini.
  - Given CPMK tertaut sesi 2, when F5 memilih 1–3, then CPMK itu termasuk cakupan.
  - Given CPMK dihapus, when ada attempt lama merujuknya, then attempt tetap ada dan CPMK ditandai "dihapus" di riwayat.
- **Edge & error.** CPMK tanpa rubrik diizinkan, F6 menandai soal tidak menilai level rubrik; teks CPMK terlalu panjang dibatasi dengan batas terlihat; semua CPMK terhapus → F5 menampilkan blocker menuju F4.

### F5 — Pilih UTS/UAS
- **Story.** Sebagai mahasiswa, saya ingin memilih UTS atau UAS dan rentang sesi, agar soal hanya mencakup materi yang diujikan.
- **Alur.** Pilih jenis ujian → rentang sesi → opsional kisi-kisi → tampil cakupan turunan (CPMK + rubrik + materi) → konfirmasi.
- **AC.**
  - Given UTS rentang 1–7, when konfirmasi, then Assessment menyimpan jenis, rentang, dan daftar CPMK tercakup.
  - Given kisi-kisi diunggah, when konfirmasi, then isinya dipakai sebagai prioritas topik pada prompt F6.
  - Given tanpa kisi-kisi, when konfirmasi, then cakupan turunan tampil dengan label "diturunkan dari CPMK dan rubrik".
  - Given rentang terbalik (7–1), when disimpan, then ditolak dengan "Sesi awal harus lebih kecil dari sesi akhir".
- **Edge & error.** Tidak ada materi pada rentang → peringatan bahwa soal hanya bersandar pada CPMK; mata kuliah tanpa sesi → empty state dengan CTA; rentang diubah setelah generate → set soal lama tetap merujuk assessment lama.

### F6 — Generate Soal
- **Story.** Sebagai mahasiswa, saya ingin memilih gaya personalisasi, bentuk soal, dan jumlah soal, lalu mengerjakan dan mendapat feedback.
- **Alur.** Pilih assessment → gaya personalisasi → bentuk (esai/PG) → jumlah → generate → kerjakan → submit → feedback.
- **AC.**
  - Given key valid dan materi tersedia, when generate, then soal muncul sesuai jumlah dan bentuk; 10 soal PG berarti tiap soal punya tepat satu kunci dan minimal tiga distraktor.
  - Given respons bukan JSON valid, when validasi gagal, then tidak ada soal tampil dan muncul "Coba lagi" dengan alasan.
  - Given key belum ada, when generate, then diarahkan ke F11; given generate berjalan, when ditekan lagi, then tombol nonaktif dan batas laju disebut di UI.
  - Given submit, when penilaian selesai, then Attempt tersimpan dan skor per CPMK diperbarui.
- **Edge & error.** 401/403 → "API key ditolak provider", key tidak dihapus; 429 → pesan batas laju + jeda; 5xx/network → satu retry lalu error; soal kurang dari jumlah diminta → tampilkan jumlah aktual + tawaran generate sisa; tab ditutup → jawaban tersimpan dipulihkan.

### F7 — Riwayat Latihan
- **Story.** Sebagai mahasiswa, saya ingin melihat tren pemahaman dan tahu ilmu ini berguna apa di dunia kerja.
- **Alur.** Buka `/riwayat` → daftar attempt → detail attempt → tren per CPMK → insight karier.
- **AC.**
  - Given tiga attempt pada CPMK sama, when riwayat dibuka, then tren menampilkan tiga titik berurutan waktu.
  - Given hanya satu attempt, when riwayat dibuka, then satu titik dan label "butuh minimal dua latihan untuk melihat tren".
  - Given detail attempt dibuka, when daftar jawaban tampil, then tiap jawaban menyertakan jawaban user, kunci, dan alasan penilaian.
  - Given attempt dihapus, when dikonfirmasi, then skor CPMK dan streak dihitung ulang.
- **Edge & error.** Insight karier diambil dari pemetaan lokal, bukan AI, agar konsisten; attempt banyak dipaginasi; entri rusak dilewati dan jumlahnya ditampilkan.

### F8 — Skill Chart
- **Story.** Sebagai mahasiswa, saya ingin radar per CPMK agar kekuatan dan kelemahan terlihat sebagai bentuk.
- **Alur.** Pilih scope (semua / satu mata kuliah / satu assessment) → radar SVG dirender → fokus sumbu menampilkan nilai → daftar nilai dalam teks.
- **AC.**
  - Given 5 CPMK punya skor, when radar dirender, then ada 5 sumbu berlabel kode CPMK dan poligon menutup.
  - Given attempt baru tersimpan, when radar dirender ulang, then bentuk berubah sesuai skor baru.
  - Given CPMK kurang dari 3, when radar diminta, then tampil bar chart sederhana dan alasan minimal 3 sumbu.
  - Given navigasi keyboard, when fokus pada sumbu, then nilai sumbu terbaca screen reader.
- **Edge & error.** Skor 0 tetap tampil di pusat, bukan dihilangkan; label panjang dipotong dengan tooltip teks penuh; semua skor sama → poligon menjadi lingkaran dengan keterangan.

### F9 — Jurnal
- **Story.** Sebagai mahasiswa, saya ingin mencatat perasaan, mood, dan harapan agar bisa merefleksikan proses belajar.
- **Alur.** Buka `/jurnal` → pilih mood → tulis catatan dan harapan → simpan → daftar entri berurutan tanggal.
- **AC.**
  - Given mood dipilih dan catatan diisi, when simpan, then entri tersimpan dengan tanggal lokal dan tampil di daftar.
  - Given dua entri di hari sama, when daftar dibuka, then keduanya tampil terpisah.
  - Given catatan diisi tanpa mood, when simpan, then validasi meminta mood dipilih.
  - Given entri dihapus, when dikonfirmasi, then hilang dari daftar dan ringkasan.
- **Edge & error.** Catatan panjang dibatasi dengan penghitung; jurnal tidak pernah dikirim ke provider AI — ringkasan AI baru butuh keputusan produk eksplisit; localStorage penuh → tawarkan ekspor entri ke file teks.

### F10 — Tiket
- **Story.** Sebagai mahasiswa, saya ingin mengirim laporan bug atau permintaan fitur ke developer.
- **Alur.** Buka `/tiket` → pilih jenis → judul dan deskripsi → konteks otomatis (versi, browser, jurusan) → kirim → salin tiket atau buka issue GitHub.
- **AC.**
  - Given judul dan deskripsi terisi, when kirim, then tiket tersimpan lokal berstatus `open`.
  - Given tiket dibuat, when layar sukses tampil, then ada "Salin tiket" dan "Buka issue GitHub" berisi tiket terformat.
  - Given judul kosong, when kirim, then tombol nonaktif dan pesan validasi tampil.
  - Given konteks disertakan, when tiket disalin, then tidak memuat API key atau isi jurnal.
- **Edge & error.** Tanpa jaringan → tiket tetap lokal, tombol GitHub nonaktif dengan alasan; deskripsi memuat data sensitif → peringatan sebelum disalin; ID tiket deterministik per tanggal agar tidak bertabrakan.

### F11 — API Key (BYOK) + Status Koneksi
- **Story.** Sebagai mahasiswa, saya ingin memasukkan API key sendiri dan melihat status koneksi.
- **Alur.** Buka `/pengaturan` → pilih provider → tempel key → simpan → "Test koneksi" → status → opsi hapus.
- **AC.**
  - Given key disimpan, when halaman dimuat ulang, then key masih ada dan ditampilkan tersamar.
  - Given test berhasil, when selesai, then status "Terhubung" dengan waktu pengujian.
  - Given key salah, when test, then status "Gagal" dengan kode error provider dan key tidak dihapus.
  - Given key dihapus, when dikonfirmasi, then hilang dari localStorage dan F6 memblokir generate.
- **Edge & error.** Key berisi spasi/newline hasil copy dipangkas; model tidak didukung → sebut daftar model valid; peringatan permanen di UI bahwa key tersimpan di localStorage dan dapat dibaca script lain di origin yang sama.

## 6. Domain Model

Semua type di `lib/types.ts`. Penyimpanan Tahap 1: localStorage namespace `sus.`, satu modul akses `lib/storage.ts`. Tahap 2: Postgres (Supabase), tabel snake_case, `user_id` + RLS.

| Entity | Field | Type | Catatan |
| --- | --- | --- | --- |
| Course | id | string | UUID lokal |
| | code | string | Contoh `MGT201`, unik |
| | name | string | Nama mata kuliah |
| | department | `'manajemen' \| 'akuntansi'` | Filter katalog |
| Session | id | string | - |
| | courseId | string | FK Course |
| | number | number | Nomor pertemuan, 1..n |
| | title | string | Topik |
| Material | id | string | - |
| | sessionId | string \| null | Null bila lintas sesi |
| | kind | `'transcript' \| 'slides' \| 'pdf' \| 'book' \| 'default'` | Sumber |
| | text | string | Hasil ekstraksi, bahan prompt |
| | charCount | number | Estimasi token |
| CPMK | id | string | - |
| | courseId | string | FK Course |
| | code | string | `CPMK-1`, unik per mata kuliah |
| | description | string | Rumusan kompetensi |
| | sessionIds | string[] | Sesi cakupan |
| Rubric | id | string | - |
| | cpmkId | string | Satu rubrik per CPMK |
| | criteria | RubricCriterion[] | `{ name, weight, levels[] }` |
| | totalWeight | number | Divalidasi terhadap 100 |
| | source | `'upload' \| 'paste' \| 'derived'` | `derived` bila disusun dari CPMK |
| Assessment | id | string | - |
| | type | `'uts' \| 'uas'` | - |
| | sessionRange | `{ from, to }` | `from <= to` |
| | blueprintText | string \| null | Kisi-kisi opsional |
| | cpmkIds | string[] | Cakupan hasil turunan |
| | scopeSource | `'blueprint' \| 'derived'` | Asal cakupan |
| QuestionSet | id | string | - |
| | assessmentId | string | FK Assessment |
| | style | `'interest' \| 'campus' \| 'learning-style' \| 'neutral'` | Gaya |
| | format | `'essay' \| 'multiple-choice'` | Bentuk |
| | questions | Question[] | Lihat 7.3 |
| | provider / model | string | Dicatat untuk audit |
| | promptVersion | string | Reproduksibilitas |
| Attempt | id | string | - |
| | questionSetId | string | FK QuestionSet |
| | status | `'in-progress' \| 'submitted'` | Mendukung pemulihan |
| | answers | Answer[] | Disimpan bertahap |
| | score | number | 0..100 |
| Answer | questionId | string | FK Question |
| | cpmkId | string | Disalin saat submit agar stabil |
| | response | string | Teks atau id opsi |
| | awardedPoints / maxPoints | number | Hasil penilaian |
| | feedback | string | Wajib untuk esai |
| | evaluatedBy | `'auto-key' \| 'ai' \| 'self'` | PG dinilai lokal |
| SkillScore | cpmkId | string | FK CPMK |
| | value | number | 0..100 |
| | sampleCount | number | Jumlah jawaban penyusun |
| | band | `'gap' \| 'developing' \| 'mastered'` | Turunan threshold |
| JournalEntry | id | string | - |
| | mood | `'semangat' \| 'tenang' \| 'biasa' \| 'lelah' \| 'cemas'` | Label, bukan emoji |
| | note | string | Isi bebas |
| | hope | string \| null | Harapan |
| Ticket | id | string | `SU-YYYYMMDD-nnn` |
| | type | `'bug' \| 'feedback' \| 'feature'` | - |
| | title / body | string | - |
| | status | `'open' \| 'exported' \| 'closed'` | `exported` setelah disalin |
| ApiKeySetting | provider | `'gemini' \| 'openai'` | - |
| | keyRef | string | Key di localStorage, bukan cookie |
| | status | `'unset' \| 'ok' \| 'invalid' \| 'unknown'` | Hasil test |
| | lastCheckedAt | string \| null | ISO |

**Aturan penyimpanan.**
- Satu objek localStorage per entity berisi array, dengan `schemaVersion`; versi lama dimigrasi in-place.
- Parsing gagal: entri dipindah ke `sus.quarantine`, aplikasi tetap berjalan, jumlah entri dilewati ditampilkan.
- SkillScore adalah materialisasi dari Attempt dan dapat dihitung ulang penuh kapan saja.
- Tahap 2 memetakan setiap entity ke tabel `id uuid primary key`, `user_id uuid references auth.users`, RLS `user_id = auth.uid()`.

## 7. AI / Prompt Contract

**Prinsip.** Pemanggilan AI terjadi di browser, langsung ke provider. Tidak ada proxy milik kami. Prompt hanya berisi data user dan konfigurasi aplikasi.

| Bagian | Isi | Batas |
| --- | --- | --- |
| System instruction | Peran penyusun soal UTS/UAS, larangan keluar materi, aturan JSON | Tetap, versi dipin (`promptVersion`) |
| Cakupan | Jenis ujian, rentang sesi, kode + deskripsi CPMK, bobot | Seluruh CPMK dalam cakupan |
| Rubrik | Kriteria, bobot, deskriptor level | Hanya CPMK dalam cakupan |
| Materi | Kutipan per sesi + ringkasan bila terpotong | Anggaran token: TBD per provider |
| Kisi-kisi | Teks bila ada | Opsional |
| Personalisasi | Prompt bebas, kategori minat, jurusan, gaya | Batas karakter terlihat di UI |
| Permintaan | Format, jumlah, kesulitan | Divalidasi sebelum kirim |

**Bentuk output.**

```json
{
  "questions": [
    {
      "cpmkCode": "CPMK-1",
      "prompt": "string",
      "format": "multiple-choice",
      "options": [{ "id": "A", "text": "string" }],
      "correctOptionId": "A",
      "explanation": "string",
      "rubricPoints": 10,
      "difficulty": "medium",
      "sourceSessions": [1, 2]
    }
  ]
}
```

Aturan: `cpmkCode` harus salah satu kode yang dikirim; `format` sama dengan permintaan; esai tanpa `options` dan `correctOptionId`; `rubricPoints` mengikuti bobot CPMK.

**Validasi output.**
1. Parse JSON; bila gagal, coba blok kode berpagar; bila masih gagal, tolak.
2. Skema: field wajib, tipe, panjang minimum teks soal.
3. Cakupan: semua `cpmkCode` ada di daftar yang dikirim.
4. Bentuk: PG minimal empat opsi dan tepat satu kunci; esai tanpa opsi.
5. Duplikasi: prompt identik ditolak.
6. Satu soal gagal → buang, sisanya dipakai. Lebih dari separuh gagal → tolak seluruh set.

**Penilaian.** PG dinilai lokal, tanpa panggilan AI. Esai dikirim ulang bersama rubrik; output `{ awardedPoints, feedback, matchedCriteria }`; feedback wajib menyebut kriteria yang terpenuhi dan tidak. Feedback tanpa rujukan kriteria ditandai "penilaian tidak lengkap" dengan opsi nilai manual.

**Token.** Estimasi `charCount / 4`. Bila materi melebihi anggaran, ambil kutipan per sesi secara proporsional (kepala + ekor tiap sesi), bukan hanya awal dokumen. UI menyebut sesi mana yang terpotong sebelum generate. Angka anggaran: TBD, satu konstanta konfigurasi.

| Kondisi gagal | Perilaku |
| --- | --- |
| Key belum diatur | Blokir generate, arahkan ke F11 |
| 401/403 | Pesan key ditolak, key tidak dihapus |
| 429 | Jeda dari provider bila ada, tombol coba lagi |
| 5xx / network | Satu retry dengan backoff, lalu error |
| Timeout | Batalkan request, set soal parsial tidak disimpan |
| JSON invalid dua kali | Error, tawarkan generate ulang |
| CORS diblokir | Pesan penyebab yang mungkin + rujukan README |

**Safety.**
- Larangan eksplisit: tidak mengarang CPMK, tidak menambah topik di luar materi, tidak mengarang kutipan, tidak menyebut soal sebagai bocoran ujian resmi.
- Setiap soal menyimpan `sourceSessions` agar bisa ditelusuri ke materi.
- Jurnal, tiket, dan data pribadi tidak dikirim ke provider.
- Output model dirender sebagai teks atau data terstruktur. Tidak ada `dangerouslySetInnerHTML`.
- Label tetap: "soal latihan buatan AI, bukan soal resmi".

## 8. Personalisasi & Gaya Soal

**Sumber personalisasi**, berurutan prioritas: prompt bebas user → kategori minat → jurusan → gaya belajar.

| Gaya | Perilaku | Contoh konteks |
| --- | --- | --- |
| `interest` | Konteks dari minat user | Bauran pemasaran dengan contoh tim basket kampus |
| `campus` | Konteks kampus SU | Studi kasus kantin, koperasi mahasiswa, UKM |
| `learning-style` | Struktur mengikuti gaya belajar | Langkah perhitungan bertahap untuk gaya prosedural |
| `neutral` | Tanpa personalisasi | Soal bergaya ujian |

**Aturan.**
- Personalisasi mengubah konteks dan bahasa, tidak mengubah CPMK, tidak menambah konsep.
- Bila minat tidak relevan, AI memakai analogi dan tidak memaksa topik.
- Nada dewasa dan langsung; sapa user dengan "kamu"; istilah teknis tetap aslinya ("biaya variabel", "jurnal penyesuaian").
- Kategori minat: olahraga, musik, kuliner, teknologi, bisnis, seni, gaming, traveling.

**Contoh prompt.**

```
Kamu penyusun soal latihan UTS untuk mahasiswa Manajemen.
Cakupan: sesi 1-7. CPMK: CPMK-1 (...), CPMK-2 (...).
Rubrik CPMK-1: kriteria ..., bobot ..., level ...
Materi (kutipan): ...
Personalisasi: mahasiswa menyukai basket dan kafe kampus; pakai konteks itu pada stem soal.
Buat 5 soal pilihan ganda, tiap soal 4 opsi, tepat satu benar.
Jangan memakai konsep di luar materi di atas. Keluarkan JSON sesuai skema.
```

## 9. Skill Chart & Skoring

**Nilai per CPMK.** `value = 100 * sum(awardedPoints) / sum(maxPoints)`, dihitung untuk Answer dengan `cpmkId` yang sama.

- `maxPoints` diturunkan dari bobot CPMK pada rubrik; tanpa rubrik semua soal berbobot sama.
- `sampleCount = 1` ditampilkan dengan penanda "data terbatas".
- `band`: `gap` < 60, `developing` 60–79, `mastered` >= 80. Threshold adalah keputusan produk, satu konstanta.
- Streak: jumlah tanggal lokal unik dengan minimal satu Attempt `submitted`, dihitung mundur dari hari ini.

**Render radar (SVG manual, tanpa library).**
- Jumlah sumbu = jumlah CPMK dalam scope, tampil 3–8; di luar itu pakai daftar progres.
- Sudut sumbu `i`: `(2 * PI * i) / n - PI / 2`, sumbu pertama di atas.
- Radius titik: `(value / 100) * maxRadius`; domain selalu 0–100 agar bentuk antar user sebanding.
- Layer: grid 25/50/75/100, garis sumbu, poligon data, label kode CPMK, titik data.
- Warna: garis sky-deep, isi sky opacity rendah, label ink-muted. Tanpa `style` kecuali geometri terhitung.
- Aksesibilitas: `role="img"` + `aria-label` ringkasan, ditambah daftar nilai sebagai teks di bawah chart.
- Motion: transisi bentuk 240ms; dimatikan pada `prefers-reduced-motion`.

**Interpretasi.** Radar menjawab "di mana saya lemah"; gap list menjawab "apa berikutnya". Insight karier diambil dari pemetaan lokal di `lib/mock-data.ts`, bukan dari AI, agar konsisten dan bisa ditinjau.

## 10. Desain

Ringkasan dari `skylearn-DESIGN.md` dengan adaptasi audiens 18–23 tahun: token dipertahankan, elemen khusus anak dilepas.

**Warna.** Sky #3B82F6 / Sky Bright #60A5FA / Sky Deep #1D4ED8 / Sky Soft #DBEAFE untuk aksi utama dan state aktif. Sun #FBBF24 hanya untuk streak dan pencapaian. Leaf #22C55E dan Leaf Soft #DCFCE7 untuk progres dan jawaban benar. Coral #F87171 dan Coral Soft #FEE2E2 untuk kesalahan lembut, bukan merah keras. Berry #A855F7 untuk aksen sekunder. Background #FFFFFF, Surface #F8FAFC, Surface Sunken #F1F5F9. Teks: Ink #0F172A, Ink Muted #475569, Ink Subtle #94A3B8. Garis: Outline #E2E8F0, Outline Strong #94A3B8.

**Tipografi.** Display Hubot Sans (fallback Nunito, Quicksand) untuk judul. Body Atkinson Hyperlegible (fallback Nunito Sans, Inter) untuk isi; alasan aksesibilitasnya tetap berlaku. Reading Lexend Deca. Mono JetBrains Mono untuk skor, timer, angka tabular. Minimum 16px, instruksi 16–18px, letter-spacing body 0.01em.

**Komponen.** `app-shell`, `stat-card`, `skill-radar`, `course-progress`, `gap-list`, `insight-card`, `journal-card`, plus answer tile di dalam halaman latihan.

**Radius, elevasi, spasi.** 8px input dan chip, 16px tombol, 20px kartu, 28px modal, 999px pill. Kartu memakai border 1px outline dan shadow `0 8px 24px rgba(15,23,42,0.06)` saat hover; modal `0 24px 48px rgba(15,23,42,0.12)`. Spasi basis 4px dengan skala 4/8/12/16/24/32/48/64; container maksimum 1280px, padding 24px desktop dan 20px mobile.

**Adaptasi mahasiswa.** Tap target minimum 44px. Tanpa confetti, star badge, maskot, atau "Read to me". Progress bar tetap; perayaan diganti ringkasan hasil. Nada copy langsung dan spesifik, tanpa "Yay!" atau "Oopsie".

**Motion dan aksesibilitas.** 240ms dengan `cubic-bezier(0.34, 1.56, 0.64, 1)`, tekan 120ms. `prefers-reduced-motion` mematikan transisi radar dan animasi progres. Kontras body minimal 4.5:1, target 7:1. Status benar/salah selalu disertai ikon dan teks. Fokus terlihat dengan ring sky 4px; semua kontrol terjangkau keyboard.

## 11. Non-Functional

**Performa lokal.** First load interaktif di bawah 2 detik pada mesin pengembangan biasa. Tidak ada blocking call ke jaringan saat aplikasi dibuka; semua data dari localStorage dan `lib/mock-data.ts`. Daftar panjang dirender bertahap. Radar SVG tanpa dependency, tetap ringan pada 8 sumbu.

**Privasi API key.** Key hanya di localStorage dan hanya menuju host provider yang dipilih; tidak di cookie, URL, context yang diserialisasi, console, atau laporan tiket. UI menyatakan bahwa key dapat dibaca script lain di origin yang sama. Detail kebijakan ada di AGENTS.md Bagian 7.

**Aksesibilitas.** Target WCAG 2.1 AA: kontras, label form, urutan fokus, pesan error terhubung ke field. Status dinamis diumumkan lewat `aria-live`. `lang="id"` pada dokumen.

**i18n.** Default `id`; string UI di satu modul kamus agar `en` bisa ditambah tanpa menyentuh komponen. Tanggal lewat `Intl.DateTimeFormat`. Istilah teknis tidak diterjemahkan.

**Offline.** Aplikasi tetap terbuka tanpa jaringan dan data lokal terbaca. Generate soal dan penilaian esai butuh jaringan dan menampilkan state "butuh koneksi". Tidak ada service worker di Tahap 1.

**Batas laju.** Satu generate dalam satu waktu; interval minimum antar pemanggilan dinyatakan di UI dan dijaga di klien.

## 12. Roadmap

**Tahap 1 — sekarang.** F1–F11, tanpa backend, tanpa biaya, tanpa admin. Selesai bila acceptance criteria terpenuhi dan aplikasi berjalan dengan `npm run dev` tanpa variabel lingkungan.

**Tahap 2 — SaaS kredit + Super Admin (belum dibangun).** Supabase Auth, profil di Postgres, RLS per user. Provider call pindah ke server; key user tidak lagi di klien. Kredit: saldo, pemotongan per generate, riwayat transaksi. Super Admin: katalog mata kuliah, materi default, moderasi tiket, kuota. Pembayaran lewat penyedia pihak ketiga.

**Tahap 3 — ekspansi.** Multi-kampus dan jurusan tambahan, kolaborasi kelas, bank soal bersama, analitik agregat anonim untuk dosen.

**Kesiapan SaaS — abstraksi yang ada sejak sekarang, tanpa fiturnya.**
1. **Provider adapter.** Satu antarmuka `generateQuestions()` dan `evaluateEssay()` dengan implementasi Gemini dan OpenAI; Tahap 2 menambah implementasi server tanpa mengubah pemanggil.
2. **Usage meter.** Setiap panggilan mencatat `{ provider, model, promptChars, completionChars, durationMs }` pada QuestionSet; Tahap 2 memakai data ini untuk pemotongan kredit.
3. **Billing hook.** `canGenerate()` mengembalikan izin: selalu benar di Tahap 1, memeriksa saldo di Tahap 2.
4. **Identity boundary.** Semua akses data lewat `lib/storage.ts`; penggantian ke Supabase hanya mengubah implementasi modul itu.

## 13. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Halusinasi soal di luar materi | Latihan menyesatkan | Validasi cakupan CPMK, kutipan materi wajib, `sourceSessions` per soal, label soal AI |
| API key bocor lewat XSS atau ekstensi | Biaya dan penyalahgunaan key user | Tanpa `dangerouslySetInnerHTML`, peringatan di UI, saran profil browser terpisah |
| Materi berhak cipta | Masalah hukum | Tahap 1 tanpa server dan tanpa berbagi; README menyatakan tanggung jawab user |
| Biaya token tak terkendali | User terkejut | Estimasi karakter sebelum generate, batas jumlah soal, potong materi proporsional, tanpa retry berulang |
| CPMK atau rubrik parsial | Penilaian tidak seimbang | Peringatan bobot, fallback bobot seragam, penanda "data terbatas" |
| Provider memblokir CORS | Fitur inti tidak jalan | Diuji di README, pesan error spesifik, daftar provider didukung |
| localStorage penuh | Data hilang | Peringatan kuota, ekspor, karantina entri rusak |
| Auth mock disalahpahami sebagai keamanan | Ekspektasi salah | Label "login simulasi, bukan autentikasi" di UI dan README |
| Perubahan model provider | Output berbeda | `promptVersion` dan model ID dicatat per QuestionSet |

## 14. Metrik Keberhasilan

Definisi metrik, bukan angka target. Diukur manual di Tahap 1 karena tidak ada telemetry.

1. **Alur inti selesai.** Persentase sesi di mana user berhasil membuat set soal dan mensubmit attempt tanpa bantuan developer.
2. **Validitas output.** Persentase set soal yang lolos validasi skema dan cakupan CPMK pada percobaan pertama.
3. **Cakupan penilaian.** Persentase soal yang terpetakan ke CPMK dengan yakin, bukan "tanpa CPMK".
4. **Pemakaian ulang.** Persentase user yang membuat lebih dari satu attempt dalam tujuh hari.
5. **Kualitas feedback.** Persentase jawaban esai yang feedbacknya menyebut kriteria rubrik.
6. **Kesehatan data.** Jumlah entri karantina dan kejadian kehilangan data per rilis.
7. **Kontribusi.** Jumlah PR eksternal diterima dan issue ditutup per siklus rilis.

**Open questions.**
- TBD: batas ukuran file unggahan dan batas karakter materi per mata kuliah.
- TBD: jumlah sumbu maksimum radar yang masih terbaca pada lebar 360px.
- TBD: model default per provider dan apakah model dapat diganti user.
- TBD: format rubrik yang diterima pada rilis pertama (teks bebas vs tabel).
- TBD: apakah nilai esai boleh dikoreksi manual dan pengaruhnya ke SkillScore.
- TBD: lisensi dan ketersediaan Hubot Sans serta Lexend Deca untuk distribusi open source.
- TBD: ekspor/impor seluruh data lokal sebagai satu berkas JSON.
- TBD: tiket dikirim ke GitHub Issues memakai token user atau disalin manual.
