# FIELD MAPPING & ARSITEKTUR KAK

Dokumen ini memetakan teks template asli, Field ID, komponen UI input, dan perilaku overlay PDF.

## 1. Sinkronisasi Data Lintas Halaman
Beberapa data yang muncul berulang kali diinput **SATU KALI** oleh pengguna pada Wizard Form dan secara otomatis disinkronkan ke seluruh 13 halaman:

- `asisten_deputi`: Halaman 1 (Judul), Halaman 2 (Eselon II, Tusi), Halaman 3 (RPJMN, RO), Halaman 4 (RB, PUG, MR), Halaman 5 (Tahapan), Halaman 9 (Biaya & Tanda Tangan).
- `tahun_anggaran`: Halaman 1 (Atas & Bawah), Halaman 2, Halaman 3, Halaman 5, Halaman 6, Halaman 7, Halaman 8, Halaman 9.
- `deputi_bidang`: Halaman 1 (Bawah), Halaman 2 (Tusi), Halaman 3 (Program Prioritas).
- `ro_nama` & `ro_kode`: Halaman 1, Halaman 2, Halaman 3, Halaman 5.
- `kro_nama` & `kro_kode`: Halaman 1, Halaman 2.
- `kegiatan_nama` & `kegiatan_kode`: Halaman 1, Halaman 2.

## 2. Pemetaan Wizard Form (16 Tahapan)

### Step 1: Identitas Dokumen & Sampul
Field yang terlibat: `cover_asisten_deputi, cover_tahun, cover_deputi_bidang`

### Step 2: Klasifikasi & Rincian Output
Field yang terlibat: `cover_kegiatan_nama, cover_kegiatan_kode, cover_kro_nama, cover_kro_kode, cover_ro_nama, cover_ro_kode, p2_volume_ro`

### Step 3: Sasaran & Indikator Kinerja
Field yang terlibat: `p2_sasaran_program_bidang, p2_ikp_bidang, p2_sasaran_kegiatan_bidang, p2_sasaran_kegiatan_kode, p2_indikator_ro`

### Step 4: Dasar Hukum
Field yang terlibat: `p2_dasar_hukum_ro, p2_dasar_hukum_1, p2_dasar_hukum_2, p2_dasar_hukum_3`

### Step 5: Tugas dan Fungsi (Tusi Kemenko PMK)
Field yang terlibat: `p2_perpres_nomor, p2_perpres_tentang, p2_urusan_bidang, p2_deputi_bidang_tusi, p2_fungsi_deputi, p2_fungsi_deputi_bidang, p2_asdep_tusi, p2_asdep_fungsi, p2_asdep_koordinasi, p3_kl_koordinasi`

### Step 6: Keterkaitan RPJMN & RKP
Field yang terlibat: `p3_asdep_program_kerja, p3_pn_nomor, p3_pn_nama, p3_sasaran_pn_nomor, p3_sasaran_pn_nama, p3_rkp_tahun, p3_pp_nomor, p3_pp_nama, p3_intervensi_bidang, p3_intervensi_fokus, p3_indikator_tahun, p3_indikator_rpjmn_list`

### Step 7: Data Dukung & Gap Analysis
Field yang terlibat: `p3_renstra_periode, p3_gap_analysis_narasi, p3_program_prioritas_deputi, p3_program_prioritas_uraian, p3_ro_1_fokus_tujuan, p3_ro_2_fokus_tujuan, p3_ro_3_fokus_tujuan`

### Step 8: Reformasi Birokrasi (RB) & Gender (PUG)
Field yang terlibat: `p4_rb_asdep, p4_rb_indikator_list, p4_pug_asdep_1, p4_pug_bidang, p4_pug_kesenjangan, p4_pug_faktor, p4_pug_asdep_2, p4_pug_intervensi, p4_mr_asdep`

### Step 9: Penerima Manfaat & Strategi Pelaksanaan
Field yang terlibat: `p4_manfaat_internal, p4_manfaat_eksternal, p5_manfaat_lainnya, p5_metode_volume, p5_metode_rak1, p5_metode_rak2, p5_metode_rak3, p5_tahapan_tahun`

### Step 10: Tahap 1: Identifikasi Permasalahan
Field yang terlibat: `p5_t1_pendahuluan, p5_t1_kegiatan_judul, p6_t1_lokasi, p6_t1_waktu, p6_t1_peserta, p6_t1_jumlah_peserta, p6_t1_narasumber, p6_t1_output, p6_t1_alasan_lokasi`

### Step 11: Tahap 2: Sinkronisasi, Koordinasi & Pengendalian
Field yang terlibat: `p6_t2_pendahuluan, p6_t2_lokasi, p6_t2_waktu, p6_t2_peserta, p6_t2_jumlah_peserta, p6_t2_narasumber, p6_t2_output, p6_t2_alasan_lokasi`

### Step 12: Tahap 3: Monitoring dan Evaluasi
Field yang terlibat: `p7_t3_pendahuluan, p7_t3_lokasi, p7_t3_waktu, p7_t3_peserta, p7_t3_jumlah_peserta, p7_t3_narasumber, p7_t3_output, p7_t3_alasan_lokasi`

### Step 13: Tahap 4: Penyusunan Rekomendasi Kebijakan
Field yang terlibat: `p7_t4_pendahuluan_p1, p8_t4_pendahuluan_p2, p8_t4_lokasi, p8_t4_waktu, p8_t4_peserta, p8_t4_jumlah_peserta, p8_t4_narasumber, p8_t4_output, p8_t4_alasan_lokasi, p8_anggaran_output`

### Step 14: Jadwal Pelaksanaan (12 Bulan) & Biaya
Field yang terlibat: `p8_jadwal_rak, p9_jadwal_matrix, p9_biaya_asdep, p9_biaya_tahun, p9_biaya_volume, p9_biaya_total_terbilang, p9_ttd_tanggal, p9_ttd_asdep, p9_ttd_nama, p9_ttd_nip`

### Step 15: Lampiran I: Gender Analysis Pathway (GAP)
Field yang terlibat: `p10_gap_langkah1, p10_gap_langkah2, p10_gap_langkah3, p10_gap_langkah4`

### Step 16: Lampiran II: Manajemen Risiko & Review
Field yang terlibat: `p11_risiko_row_1, p11_risiko_row_2, p11_risiko_row_3`

