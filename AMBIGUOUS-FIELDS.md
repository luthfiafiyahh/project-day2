# AMBIGUOUS FIELDS & PENETAPAN SOLUSI

Sesuai instruksi Bagian 37, berikut inventarisasi teks/placeholder yang ambigu beserta kemungkinan makna dan keputusan teknisnya:

### Halaman 2: Peraturan Presiden Nomor …… (1) tentang …… (2) s.d. (9) dan di Hal 3 s.d. (15)
- **Kemungkinan Makna**: Angka dalam tanda kurung (1), (2), (3)...(15) adalah nomor penanda internal/template buatan pembuat format untuk memandu pengguna.
- **Rekomendasi Field ID**: `p2_perpres_nomor, p2_perpres_tentang, p2_urusan_bidang, p2_deputi_bidang_tusi, p2_fungsi_deputi, dst.`
- **Alasan & Keputusan Teknis**: Sesuai aturan Bagian 7 spesifikasi, marker '(1)', '(2)', dst. HARUS DIHAPUS pada PDF final output. Solusi: Overlay menutupi area marker dengan background putih dan mencetak nilai input pengguna tanpa tanda penomoran.

### Halaman 4: Kotak kuning berisi 'Catatan narasi terkait RB yang disusun pada penjelasan pelaksanaan tugas fungsi UKE harus memuat: ● regulasi... ● kondisi capaian...'
- **Kemungkinan Makna**: Panduan penyusunan narasi Reformasi Birokrasi dari Kemenko PMK.
- **Rekomendasi Field ID**: `p4_rb_indikator_list`
- **Alasan & Keputusan Teknis**: Teks ini bukan isi dokumen final melainkan petunjuk teknis bagi penyusun. Pada UI form ditampilkan sebagai 'Petunjuk Penyusunan RB', dan area template di-overlay dengan narasi RB yang disusun pengguna atau teks default profesional tanpa kotak kuning kotor.

### Halaman 5, 6, 7, 8: 'Buat kalimat pendahuluan adapun seperti contoh berikut' diikuti teks paragraf contoh
- **Kemungkinan Makna**: Teks panduan dan contoh narasi tahapan kegiatan (Identifikasi, Sinkronisasi, Monev, Rekomendasi).
- **Rekomendasi Field ID**: `p5_t1_pendahuluan, p6_t2_pendahuluan, p7_t3_pendahuluan, p7_t4_pendahuluan_p1, p8_t4_pendahuluan_p2`
- **Alasan & Keputusan Teknis**: Teks 'Buat kalimat pendahuluan adapun seperti contoh berikut' adalah instruksi template. Pada PDF output, teks instruksi ini harus dihilangkan, dan digantikan oleh narasi pendahuluan yang bersih (baik menggunakan contoh default atau teks kustom pengguna).

### Halaman 8: Anggaran yang dibutuhkan untuk menghasilkan output ini adalah sebesar Rp.xxxxx vs Halaman 9 sebesar …… (narasi rupiah)
- **Kemungkinan Makna**: Halaman 8 mencantumkan nominal angka (misal Rp 150.000.000), halaman 9 mencantumkan angka beserta terbilang naratif (misal Rp 150.000.000,- (Seratus Lima Puluh Juta Rupiah)).
- **Rekomendasi Field ID**: `p8_anggaran_output & p9_biaya_total_terbilang`
- **Alasan & Keputusan Teknis**: Aplikasi menyediakan generator terbilang otomatis Bahasa Indonesia: ketika pengguna memasukkan angka nominal di field anggaran, sistem secara otomatis mengonversinya menjadi teks terbilang yang tepat.

### Halaman 10: Tabel Lampiran I (Gender Analysis Pathway) berisi panduan dan contoh di bawah header 4 kolom
- **Kemungkinan Makna**: Template memuat penjelasan cara mengisi 4 langkah GAP beserta contoh pengisian pada industri kayu/fashion.
- **Rekomendasi Field ID**: `p10_gap_langkah1, p10_gap_langkah2, p10_gap_langkah3, p10_gap_langkah4`
- **Alasan & Keputusan Teknis**: Empat langkah GAP diisi pengguna secara terstruktur pada Form (Langkah 1, 2, 3, 4). Pada output PDF, area isi panduan/contoh di-overlay dengan data input pengguna yang rapi sesuai batas kolom tabel asli tanpa mengubah garis dan header tabel.

### Halaman 11: Gambar tabel spreadsheet Lampiran II (Manajemen Risiko) memiliki 3 baris dengan teks merah 'Contoh ...'
- **Kemungkinan Makna**: Screenshot tabel contoh profil risiko yang dimasukkan oleh pembuat dokumen.
- **Rekomendasi Field ID**: `p11_risiko_row_1, p11_risiko_row_2, p11_risiko_row_3`
- **Alasan & Keputusan Teknis**: Pengguna dapat menginput atau mengedit 3 baris risiko (Lingkup Administrasi, Substansi, MRPN/PKPN). Sistem melakukan overlay teks rapi di atas baris tabel, menutupi teks 'Contoh' berwarna merah dengan teks input resmi berwarna hitam.

