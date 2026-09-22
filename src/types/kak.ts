export interface RiskItem {
  no: number;
  lingkup: string;
  peristiwa: string;
  kategori: string;
  kodeKategori: string;
  penyebab: string;
  dampak: string;
  lk: number; // 1 - 5
  ld: number; // 1 - 5
  br: number; // calculated LK x LD or score
  lr: string; // Rendah / Sedang / Tinggi
  perlakuan: string;
  pemilik: string;
  mitra: string;
}

export interface ScheduleSubcomponent {
  identifikasi: number[]; // 12 numbers (0 or 1)
  sinkronisasi: number[]; // 12 numbers (0 or 1)
  monitoring: number[];   // 12 numbers (0 or 1)
  rekomendasi: number[];  // 12 numbers (0 or 1)
}

export interface KAKData {
  // 1. Identitas Dokumen & Sampul
  asisten_deputi: string;
  tahun_anggaran: string;
  deputi_bidang: string;

  // 2. Program, RO, KRO, Kegiatan
  ro_nama: string;
  ro_kode: string;
  kro_nama: string;
  kro_kode: string;
  kegiatan_nama: string;
  kegiatan_kode: string;
  volume_ro: string;

  // 3. Sasaran & Indikator Kinerja
  sasaran_program_bidang: string;
  ikp_bidang: string;
  sasaran_kegiatan_bidang: string;
  sasaran_kegiatan_kode: string;
  indikator_ro: string;

  // 4. Dasar Hukum
  dasar_hukum_ro: string;
  dasar_hukum_1: string;
  dasar_hukum_2: string;
  dasar_hukum_3: string;

  // 5. Tugas dan Fungsi (Tusi Kemenko PMK)
  perpres_nomor: string;
  perpres_tentang: string;
  urusan_bidang: string;
  deputi_bidang_tusi: string;
  fungsi_deputi: string;
  fungsi_deputi_bidang: string;
  asdep_tusi: string;
  asdep_fungsi: string;
  asdep_koordinasi: string;
  kl_koordinasi: string;

  // 6. RPJMN & RKP
  asdep_program_kerja: string;
  pn_nomor: string;
  pn_nama: string;
  sasaran_pn_nomor: string;
  sasaran_pn_nama: string;
  rkp_tahun: string;
  pp_nomor: string;
  pp_nama: string;
  intervensi_bidang: string;
  intervensi_fokus: string;
  indikator_tahun: string;
  indikator_rpjmn_list: string;

  // 7. Renstra & Gap Analysis & Output Kerja
  renstra_periode: string;
  gap_analysis_narasi: string;
  program_prioritas_deputi: string;
  program_prioritas_uraian: string;
  ro_rencana_asdep: string;
  ro_1_fokus_tujuan: string;
  ro_2_fokus_tujuan: string;
  ro_3_fokus_tujuan: string;

  // 8. Reformasi Birokrasi (RB) & Gender (PUG) & MR
  rb_asdep: string;
  rb_indikator_list: string;
  pug_asdep_1: string;
  pug_bidang: string;
  pug_kesenjangan: string;
  pug_faktor: string;
  pug_asdep_2: string;
  pug_intervensi: string;
  mr_asdep: string;

  // 9. Penerima Manfaat & Metode
  manfaat_internal: string;
  manfaat_eksternal: string;
  manfaat_lainnya: string;
  metode_volume: string;
  metode_rak1: string;
  metode_rak2: string;
  metode_rak3: string;
  tahapan_tahun: string;

  // 10. Tahap 1: Identifikasi Permasalahan
  t1_pendahuluan: string;
  t1_kegiatan_judul: string;
  t1_lokasi: string;
  t1_waktu: string;
  t1_peserta: string;
  t1_jumlah_peserta: string;
  t1_narasumber: string;
  t1_output: string;
  t1_alasan_lokasi: string;

  // 11. Tahap 2: Sinkronisasi, Koordinasi & Pengendalian
  t2_pendahuluan: string;
  t2_lokasi: string;
  t2_waktu: string;
  t2_peserta: string;
  t2_jumlah_peserta: string;
  t2_narasumber: string;
  t2_output: string;
  t2_alasan_lokasi: string;

  // 12. Tahap 3: Monitoring dan Evaluasi
  t3_pendahuluan: string;
  t3_lokasi: string;
  t3_waktu: string;
  t3_peserta: string;
  t3_jumlah_peserta: string;
  t3_narasumber: string;
  t3_output: string;
  t3_alasan_lokasi: string;

  // 13. Tahap 4: Penyusunan Rekomendasi Kebijakan
  t4_pendahuluan_p1: string;
  t4_pendahuluan_p2: string;
  t4_lokasi: string;
  t4_waktu: string;
  t4_peserta: string;
  t4_jumlah_peserta: string;
  t4_narasumber: string;
  t4_output: string;
  t4_alasan_lokasi: string;
  anggaran_output: string;

  // 14. Jadwal Pelaksanaan 12 Bulan
  schedule_subkomponen_1: ScheduleSubcomponent;
  schedule_subkomponen_2: ScheduleSubcomponent;

  // 15. Biaya & Pengesahan
  biaya_asdep: string;
  biaya_tahun: string;
  biaya_volume: string;
  biaya_total_nominal: string;
  biaya_total_terbilang: string;
  ttd_tanggal: string;
  ttd_asdep: string;
  ttd_nama: string;
  ttd_nip: string;

  // 16. Lampiran I: Gender Analysis Pathway (GAP)
  gap_langkah1: string;
  gap_langkah2: string;
  gap_langkah3: string;
  gap_langkah4: string;

  // 17. Lampiran II: Manajemen Risiko
  risk_rows: RiskItem[];
}
