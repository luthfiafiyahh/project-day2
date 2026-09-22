export interface StepDefinition {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  requiredFields: string[];
}

export const FORM_STEPS: StepDefinition[] = [
  {
    id: 1,
    title: 'Identitas Dokumen & Sampul',
    shortTitle: 'Sampul & Identitas',
    description: 'Informasi unit kerja Asisten Deputi, Tahun Anggaran, dan Deputi Bidang pengampu KAK.',
    category: 'Identitas',
    requiredFields: ['asisten_deputi', 'tahun_anggaran', 'deputi_bidang'],
  },
  {
    id: 2,
    title: 'Klasifikasi & Rincian Output',
    shortTitle: 'Program & Output',
    description: 'Rincian Output (RO), Klasifikasi RO (KRO), Kegiatan, dan volume keluaran.',
    category: 'Program',
    requiredFields: ['ro_nama', 'ro_kode', 'kro_nama', 'kro_kode', 'kegiatan_nama', 'kegiatan_kode', 'volume_ro'],
  },
  {
    id: 3,
    title: 'Sasaran & Indikator Kinerja',
    shortTitle: 'Sasaran & IKP',
    description: 'Sasaran program, indikator kinerja program (IKP), sasaran kegiatan, dan indikator RO.',
    category: 'Program',
    requiredFields: ['sasaran_program_bidang', 'ikp_bidang', 'sasaran_kegiatan_bidang', 'indikator_ro'],
  },
  {
    id: 4,
    title: 'Dasar Hukum',
    shortTitle: 'Dasar Hukum',
    description: 'Landasan peraturan perundang-undangan (UU, PP, Perpres, Permen) yang mendasari pelaksanaan RO.',
    category: 'Latar Belakang',
    requiredFields: ['dasar_hukum_1'],
  },
  {
    id: 5,
    title: 'Tugas dan Fungsi (Tusi Kemenko PMK)',
    shortTitle: 'Tusi Kemenko',
    description: 'Perpres dasar tusi Kemenko PMK, fungsi koordinasi Deputi dan Asisten Deputi pelaksana.',
    category: 'Latar Belakang',
    requiredFields: ['perpres_nomor', 'perpres_tentang', 'urusan_bidang', 'fungsi_deputi'],
  },
  {
    id: 6,
    title: 'Keterkaitan RPJMN & RKP',
    shortTitle: 'RPJMN & RKP',
    description: 'Prioritas Nasional (PN), Sasaran PN, Program Prioritas (PP) RKP, dan fokus intervensi kebijakan.',
    category: 'Latar Belakang',
    requiredFields: ['pn_nomor', 'pn_nama', 'sasaran_pn_nama', 'pp_nama', 'intervensi_bidang'],
  },
  {
    id: 7,
    title: 'Data Dukung & Gap Analysis',
    shortTitle: 'Gap Analysis & RO',
    description: 'Renstra Kemenko PMK, analisis kesenjangan isu strategis di daerah, dan rencana alternatif kebijakan.',
    category: 'Latar Belakang',
    requiredFields: ['gap_analysis_narasi', 'ro_1_fokus_tujuan'],
  },
  {
    id: 8,
    title: 'Reformasi Birokrasi (RB) & Gender (PUG)',
    shortTitle: 'RB & Gender',
    description: 'Pengawalan indikator RB tematik, analisis kesenjangan gender (PUG), dan mitigasi risiko awal.',
    category: 'Kebijakan',
    requiredFields: ['rb_indikator_list', 'pug_kesenjangan', 'pug_intervensi'],
  },
  {
    id: 9,
    title: 'Penerima Manfaat & Strategi Pelaksanaan',
    shortTitle: 'Manfaat & Metode',
    description: 'Pihak penerima manfaat internal dan eksternal, serta metode pelaksanaan (swakelola/kontraktual).',
    category: 'Strategi',
    requiredFields: ['manfaat_internal', 'manfaat_eksternal', 'metode_rak1'],
  },
  {
    id: 10,
    title: 'Tahap 1: Identifikasi Permasalahan',
    shortTitle: 'Tahap 1: Identifikasi',
    description: 'Pelaksanaan rapat koordinasi identifikasi permasalahan, lokasi, peserta, narasumber, dan target output.',
    category: 'Pelaksanaan',
    requiredFields: ['t1_kegiatan_judul', 't1_lokasi', 't1_waktu', 't1_output'],
  },
  {
    id: 11,
    title: 'Tahap 2: Sinkronisasi, Koordinasi & Pengendalian',
    shortTitle: 'Tahap 2: Sinkronisasi',
    description: 'Pelaksanaan kegiatan sinkronisasi lintas sektor, lokasi, waktu, peserta, dan komitmen output.',
    category: 'Pelaksanaan',
    requiredFields: ['t2_lokasi', 't2_waktu', 't2_output'],
  },
  {
    id: 12,
    title: 'Tahap 3: Monitoring dan Evaluasi',
    shortTitle: 'Tahap 3: Monev',
    description: 'Kegiatan pemantauan langsung ke daerah, verifikasi lapangan, dan evaluasi capaian kebijakan.',
    category: 'Pelaksanaan',
    requiredFields: ['t3_lokasi', 't3_waktu', 't3_output'],
  },
  {
    id: 13,
    title: 'Tahap 4: Penyusunan Rekomendasi & Anggaran',
    shortTitle: 'Tahap 4: Rekomendasi',
    description: 'Penyusunan naskah rekomendasi kebijakan akhir dan estimasi kebutuhan anggaran keluaran.',
    category: 'Pelaksanaan',
    requiredFields: ['t4_lokasi', 't4_waktu', 't4_output', 'anggaran_output'],
  },
  {
    id: 14,
    title: 'Matriks Jadwal Pelaksanaan (12 Bulan)',
    shortTitle: 'Jadwal 12 Bulan',
    description: 'Tabel jadwal 12 bulan untuk tiap subkomponen kegiatan (klik bulan yang aktif).',
    category: 'Jadwal',
    requiredFields: [],
  },
  {
    id: 15,
    title: 'Lampiran I: Gender Analysis Pathway (GAP)',
    shortTitle: 'Lampiran I: GAP',
    description: 'Form 4 langkah analisis responsif gender (Isu, Penyebab, Rencana Aksi, Pemangku Kepentingan).',
    category: 'Lampiran',
    requiredFields: ['gap_langkah1', 'gap_langkah2', 'gap_langkah3', 'gap_langkah4'],
  },
  {
    id: 16,
    title: 'Lampiran II: Manajemen Risiko & Pengesahan',
    shortTitle: 'Risiko & Pengesahan',
    description: 'Tabel manajemen risiko 3 tingkat, blok tanda tangan pengesahan, dan pembuatan dokumen PDF final.',
    category: 'Pengesahan',
    requiredFields: ['ttd_nama', 'ttd_nip'],
  },
];
