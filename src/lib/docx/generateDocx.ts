import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  convertInchesToTwip,
  ShadingType,
} from 'docx';
import type { KAKData } from '../../types/kak';
import { formatRupiah, angkaKeTerbilang } from '../pdf/terbilang';

const FONT_FAMILY = 'Times New Roman';

// Border helpers for official tables
const borderThin = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: '999999',
};

const tableBorders = {
  top: borderThin,
  bottom: borderThin,
  left: borderThin,
  right: borderThin,
  insideHorizontal: borderThin,
  insideVertical: borderThin,
};

const borderNone = {
  style: BorderStyle.NONE,
  size: 0,
  color: 'auto',
};

const noBorders = {
  top: borderNone,
  bottom: borderNone,
  left: borderNone,
  right: borderNone,
  insideHorizontal: borderNone,
  insideVertical: borderNone,
};

/**
 * Membuat Dokumen Word (.docx) Lengkap dari Data KAK
 */
export async function generateKAKDocx(data: KAKData): Promise<Blob> {
  const tahun = data.tahun_anggaran || '2026';
  const asdep = data.asisten_deputi || 'Pemberdayaan Disabilitas dan Lanjut Usia';
  const deputi = data.deputi_bidang || 'Bidang Koordinasi Peningkatan Kesejahteraan Sosial';
  const nominalAnggaran = data.biaya_total_nominal || data.anggaran_output || '185000000';
  const formattedNominal = formatRupiah(nominalAnggaran);
  const terbilangNominal = data.biaya_total_terbilang || angkaKeTerbilang(nominalAnggaran);

  // Helper untuk membuat paragraf dinas standar
  const pText = (
    text: string,
    options?: {
      bold?: boolean;
      size?: number; // half-points (24 = 12pt)
      alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
      spaceBefore?: number;
      spaceAfter?: number;
      italics?: boolean;
    }
  ) => {
    return new Paragraph({
      alignment: options?.alignment || AlignmentType.LEFT,
      spacing: {
        before: options?.spaceBefore ?? 0,
        after: options?.spaceAfter ?? 60, // 3pt paragraph spacing (rapi dan padat)
        line: 260, // ~1.08 line spacing
      },
      children: [
        new TextRun({
          text,
          font: FONT_FAMILY,
          size: options?.size ?? 24, // 12pt
          bold: options?.bold ?? false,
          italics: options?.italics ?? false,
        }),
      ],
    });
  };

  // Helper judul bab (Heading)
  const pHeading = (
    title: string,
    level: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_2
  ) => {
    return new Paragraph({
      heading: level,
      spacing: { before: 140, after: 40 },
      children: [
        new TextRun({
          text: title,
          font: FONT_FAMILY,
          size: 26, // 13pt
          bold: true,
          color: '000000',
        }),
      ],
    });
  };

  // Helper row untuk tabel identitas 2 kolom
  const createIdentityRow = (label: string, value: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 3000, type: WidthType.DXA },
          margins: { top: 35, bottom: 35, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [
                new TextRun({
                  text: label,
                  font: FONT_FAMILY,
                  size: 22,
                  bold: true,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 6360, type: WidthType.DXA },
          margins: { top: 35, bottom: 35, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [
                new TextRun({
                  text: `: ${value}`,
                  font: FONT_FAMILY,
                  size: 22,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  // Helper detail kegiatan (poin a s.d. g)
  const createTahapDetails = (
    labelKegiatan: string,
    lokasi: string,
    waktu: string,
    peserta: string,
    jml: string,
    narasumber: string,
    output: string,
    alasan: string
  ) => {
    const rows = [
      { label: 'a. Lokasi', val: lokasi || 'DKI Jakarta' },
      { label: 'b. Waktu', val: waktu || `Tahun ${tahun}` },
      { label: 'c. Peserta', val: peserta || 'K/L Terkait' },
      { label: 'd. Jumlah Peserta', val: `${jml || '30'} orang` },
      { label: 'e. Narasumber', val: narasumber || 'Ada' },
      { label: 'f. Output yang akan dicapai', val: output || '-' },
      { label: 'g. Alasan pemilihan lokasi', val: alasan || '-' },
    ];

    return [
      new Paragraph({
        spacing: { before: 80, after: 30 },
        children: [
          new TextRun({
            text: labelKegiatan,
            font: FONT_FAMILY,
            size: 23,
            bold: true,
          }),
        ],
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        borders: noBorders,
        rows: rows.map(
          (r) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 2800, type: WidthType.DXA },
                  margins: { top: 25, bottom: 25, left: 60, right: 60 },
                  children: [
                    new Paragraph({
                      spacing: { before: 0, after: 15 },
                      children: [
                        new TextRun({
                          text: r.label,
                          font: FONT_FAMILY,
                          size: 21,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 6560, type: WidthType.DXA },
                  margins: { top: 25, bottom: 25, left: 60, right: 60 },
                  children: [
                    new Paragraph({
                      spacing: { before: 0, after: 15 },
                      children: [
                        new TextRun({
                          text: `: ${r.val}`,
                          font: FONT_FAMILY,
                          size: 21,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
        ),
      }),
    ];
  };

  // 1. HALAMAN COVER
  const coverElements = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200, after: 140 },
      children: [
        new TextRun({
          text: 'KERANGKA ACUAN KERJA (KAK)',
          font: FONT_FAMILY,
          size: 32, // 16pt
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 400 },
      children: [
        new TextRun({
          text: 'TERM OF REFERENCE (TOR)',
          font: FONT_FAMILY,
          size: 26,
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: 'RINCIAN OUTPUT (RO):',
          font: FONT_FAMILY,
          size: 24,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 800 },
      children: [
        new TextRun({
          text: (data.ro_nama || 'REKOMENDASI ALTERNATIF KEBIJAKAN').toUpperCase(),
          font: FONT_FAMILY,
          size: 26,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 80 },
      children: [
        new TextRun({
          text: 'KEMENTERIAN KOORDINATOR BIDANG PEMBANGUNAN MANUSIA DAN KEBUDAYAAN',
          font: FONT_FAMILY,
          size: 24,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 140 },
      children: [
        new TextRun({
          text: `TAHUN ANGGARAN ${tahun}`,
          font: FONT_FAMILY,
          size: 24,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];

  // 2. IDENTITAS & TUSI KAK
  const identitasElements = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 180 },
      children: [
        new TextRun({
          text: 'KERANGKA ACUAN KERJA / TERM OF REFERENCE',
          font: FONT_FAMILY,
          size: 28,
          bold: true,
        }),
      ],
    }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      borders: tableBorders,
      rows: [
        createIdentityRow('Kementerian Negara / Lembaga', 'Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan (024)'),
        createIdentityRow('Unit Eselon I', deputi),
        createIdentityRow('Unit Eselon II', `Asisten Deputi ${asdep}`),
        createIdentityRow('Sasaran Kegiatan', data.sasaran_kegiatan_bidang || 'Tersusunnya Kebijakan Bidang Kesejahteraan Sosial'),
        createIdentityRow('Klasifikasi Rincian Output', `${data.kro_nama || 'Kebijakan Bidang Perlindungan Sosial'} (${data.kro_kode || 'QCA.001'})`),
        createIdentityRow('Rincian Output (RO)', `${data.ro_nama || 'Rekomendasi Alternatif Kebijakan'} (${data.ro_kode || '001'})`),
        createIdentityRow('Indikator Rincian Output', data.indikator_ro || 'Jumlah Rekomendasi Kebijakan yang Dihasilkan'),
        createIdentityRow('Volume / Satuan', `${data.volume_ro || '1'} Output`),
      ],
    }),
    new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
  ];

  // 3. A. LATAR BELAKANG
  const latarBelakangElements = [
    pHeading('A. LATAR BELAKANG', HeadingLevel.HEADING_1),
    pHeading('1. Dasar Hukum', HeadingLevel.HEADING_2),
    pText(`1. ${data.dasar_hukum_ro || 'Undang-Undang Nomor 17 Tahun 2003 tentang Keuangan Negara;'}`),
    pText(`2. ${data.dasar_hukum_1 || 'Undang-Undang Nomor 25 Tahun 2004 tentang Sistem Perencanaan Pembangunan Nasional;'}`),
    pText(`3. ${data.dasar_hukum_2 || 'Peraturan Pemerintah Nomor 90 Tahun 2010 tentang Penyusunan Rencana Kerja dan Anggaran Kementerian Negara/Lembaga;'}`),
    pText(`4. ${data.dasar_hukum_3 || 'Peraturan Presiden Nomor 35 Tahun 2020 tentang Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan.'}`),

    pHeading('2. Gambaran Umum', HeadingLevel.HEADING_2),
    pHeading('2.1 Program yang Terkait Tugas dan Fungsi Utama', HeadingLevel.HEADING_3),
    pText(
      `Berdasarkan ${data.perpres_nomor || 'Peraturan Presiden Nomor 35 Tahun 2020'} tentang ${data.perpres_tentang || 'Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan'}, Kemenko PMK mempunyai tugas menyelenggarakan koordinasi, sinkronisasi, dan pengendalian urusan kementerian dalam penyelenggaraan pemerintahan di bidang pembangunan manusia dan kebudayaan. Urusan bidang yang dikoordinasikan meliputi ${data.urusan_bidang || 'kesejahteraan sosial, perlindungan disabilitas, dan kelanjutusiaan'}.`
    ),
    pText(
      `Dalam melaksanakan tugas tersebut, ${data.deputi_bidang_tusi || deputi} menyelenggarakan fungsi ${data.fungsi_deputi || 'koordinasi dan sinkronisasi perumusan, penetapan, dan pelaksanaan kebijakan'}. Secara operasional, Asisten Deputi ${asdep} menyelenggarakan fungsi ${data.asdep_fungsi || 'koordinasi kebijakan dan sinkronisasi pelaksanaan program'} bersama kementerian/lembaga teknis terkait seperti ${data.kl_koordinasi || 'Kemensos, Kemenkes, Kemendagri, dan Bappenas'}.`
    ),
    pText(
      `Program kerja ini mendukung Prioritas Nasional (PN) ${data.pn_nomor || '1'} yaitu "${data.pn_nama || 'Memperkuat Ketahanan Ekonomi untuk Pertumbuhan yang Berkualitas dan Berkeadilan'}" dengan Sasaran PN ${data.sasaran_pn_nomor || '1.1'}: "${data.sasaran_pn_nama || 'Meningkatnya Kesejahteraan Masyarakat Rentan'}" dalam Rencana Kerja Pemerintah (RKP) Tahun ${data.rkp_tahun || tahun}. Program Prioritas (PP) yang didukung adalah PP ${data.pp_nomor || '01'}: "${data.pp_nama || 'Pengentasan Kemiskinan dan Perlindungan Sosial'}".`
    ),
    pText(
      `Adapun target indikator pembangunan yang ditetapkan meliputi: ${data.indikator_rpjmn_list || '1) Tingkat kemiskinan ekstrem 0%; 2) Persentase lansia terlindungi bansos 85%; 3) Indeks inklusivitas disabilitas meningkat.'}`
    ),
    pText(
      `Data terbaru terkait program ${data.kegiatan_nama || 'Kebijakan Inklusif'} menyatakan bahwa ${data.gap_analysis_narasi || 'masih terdapat kesenjangan aksesibilitas dan pemenuhan hak perlindungan sosial di berbagai daerah, khususnya bagi kelompok lanjut usia dan penyandang disabilitas.'}`
    ),
    pText(
      `Berdasarkan penjelasan di atas maka terkait dengan tugas dan fungsi Asisten Deputi ${data.ro_rencana_asdep || asdep}, output yang akan dihasilkan pada rencana kerja tahun anggaran ${tahun} adalah:`
    ),
    pText(`1) ${data.ro_1_fokus_tujuan || 'Rekomendasi Alternatif Kebijakan Penguatan Aksesibilitas dan Jaminan Sosial Inklusif Disabilitas dan Lanjut Usia.'}`),
    pText(`2) ${data.ro_2_fokus_tujuan || 'Rekomendasi Skema Layanan Perawatan Jangka Panjang (Long-Term Care) Lansia Berbasis Komunitas.'}`),
    ...(data.ro_3_fokus_tujuan ? [pText(`3) ${data.ro_3_fokus_tujuan}`)] : []),

    pHeading('2.2 Program yang Terkait Reformasi Birokrasi (RB)', HeadingLevel.HEADING_3),
    pText(
      `Terhadap pelaksanaan Reformasi Birokrasi (RB), Asisten Deputi ${data.rb_asdep || asdep} mendapatkan mandat pengawalan indikator RB yaitu:`,
      { spaceAfter: 20 }
    ),
    ...(data.rb_indikator_list
      ? data.rb_indikator_list
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => pText(line, { spaceBefore: 0, spaceAfter: 20 }))
      : [
          pText('1. Indeks RB Tematik Penanggulangan Kemiskinan;', { spaceBefore: 0, spaceAfter: 20 }),
          pText('2. Peningkatan Standar Pelayanan Publik Ramah Kelompok Rentan.', { spaceBefore: 0, spaceAfter: 20 }),
        ]),

    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 80, after: 30 },
      children: [
        new TextRun({
          text: '2.3 Pengarusutamaan Gender dalam Pelaksanaan Program',
          font: FONT_FAMILY,
          size: 26,
          bold: true,
          color: '000000',
        }),
      ],
    }),
    pText(
      `Asisten Deputi ${data.pug_asdep_1 || asdep} telah mengintegrasikan perspektif gender dalam pelaksanaan program dan kegiatan melalui penerapan Anggaran Responsif Gender (ARG) dan penyusunan Gender Analysis Pathway (GAP). Berdasarkan analisis gender, masih terdapat kesenjangan dalam pelaksanaan kebijakan bidang ${data.pug_bidang || 'Perlindungan Disabilitas dan Lansia'}, antara lain ${data.pug_kesenjangan || 'akses layanan yang belum merata'} yang dipengaruhi oleh faktor ${data.pug_faktor || 'sosial dan infrastruktur'}. GAP secara lebih rinci dimuat dalam matriks Lampiran I KAK ini.`
    ),

    pHeading('2.4 Manajemen Risiko', HeadingLevel.HEADING_3),
    pText(
      `Dalam memastikan tercapainya output dan memaksimalkan dampak positif program, dilakukan manajemen risiko untuk mengendalikan risiko yang ada pada Asisten Deputi ${data.mr_asdep || asdep} melalui penguatan koordinasi lintas sektor dan mitigasi berkala. Matriks profil risiko terlampir pada Lampiran II KAK ini.`
    ),
  ];

  // 4. B. PENERIMA MANFAAT
  const penerimaManfaatElements = [
    pHeading('B. PENERIMA MANFAAT', HeadingLevel.HEADING_1),
    pText('Penerima manfaat dari kegiatan koordinasi dan penyusunan rekomendasi kebijakan ini meliputi:'),
    pText(`1. Internal: ${data.manfaat_internal || 'Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan (Deputi dan Asisten Deputi terkait);'}`),
    pText(`2. Eksternal: ${data.manfaat_eksternal || 'Kementerian/Lembaga Teknis (Kemensos, Bappenas, Kemendagri, Kemenkes) dan Pemerintah Daerah;'}`),
    pText(`3. Kelompok Masyarakat: ${data.manfaat_lainnya || 'Kelompok masyarakat rentan, penyandang disabilitas, dan warga lanjut usia (termasuk keluarga pendamping).'}`),
  ];

  // 5. C. STRATEGI PENCAPAIAN KELUARAN
  const strategiElements = [
    pHeading('C. STRATEGI PENCAPAIAN KELUARAN', HeadingLevel.HEADING_1),
    pHeading('1. Metode Pelaksanaan', HeadingLevel.HEADING_2),
    pText(`Metode pelaksanaan yang digunakan dalam menghasilkan ${data.metode_volume || data.volume_ro || '1'} output Rekomendasi Alternatif Kebijakan yaitu melalui:`),
    pText(`a. RAK 1: ${data.metode_rak1 || 'Swakelola Tipe I'}`),
    pText(`b. RAK 2: ${data.metode_rak2 || 'Swakelola Tipe I'}`),
    pText(`c. RAK 3: ${data.metode_rak3 || 'Swakelola'}`),

    pHeading('2. Tahapan dan Waktu Pelaksanaan', HeadingLevel.HEADING_2),
    pText(`Tahapan pelaksanaan kegiatan yang akan dilakukan pada tahun ${data.tahapan_tahun || tahun} diantaranya sebagai berikut:`),
    
    pText(`2.1 RAK 1: ${data.ro_nama || 'Peningkatan Kesejahteraan dan Perlindungan Lanjut Usia serta Disabilitas'}`, { bold: true }),
    pText(`2.1.1 Sub Komponen 051 Sinkronisasi, Koordinasi dan Pengendalian Bidang ${data.urusan_bidang || 'Pembangunan Manusia dan Kebudayaan'}`, { bold: true }),

    // Tahap 1
    pHeading('A. Melaksanakan Identifikasi Permasalahan', HeadingLevel.HEADING_3),
    pText(
      data.t1_pendahuluan ||
        `Sebagai koordinator bidang pembangunan manusia dan kebudayaan, Kemenko PMK melalui Asisten Deputi ${asdep} berperan menghimpun informasi lintas sektor terkait isu perlindungan disabilitas dan lansia di daerah.`
    ),
    // PARAGRAF WAJIB
    pText(
      `Identifikasi dilakukan dengan mengintegrasikan masukan dari kementerian/lembaga teknis yaitu ${data.kl_koordinasi || 'Kementerian Sosial, Kementerian Kesehatan, Kementerian Ketenagakerjaan, Kemendagri, dan Bappenas'}, pemerintah daerah, serta mitra pembangunan. Selain memetakan permasalahan tata kelola, identifikasi juga dilakukan menggunakan data terpilah menurut jenis kelamin, usia, disabilitas, dan kelompok rentan lainnya untuk mengetahui dampak bencana terhadap perempuan, laki-laki, anak, lansia, ibu hamil, penyandang disabilitas, serta kelompok rentan lainnya. Analisis tersebut digunakan untuk mengidentifikasi kesenjangan akses terhadap layanan dasar, bantuan kemanusiaan, layanan kesehatan, perlindungan sosial, serta mekanisme perlindungan dari kekerasan berbasis gender di lokasi bencana. Dengan demikian, isu yang diidentifikasi tidak hanya bersifat sektoral, tetapi juga memperhatikan kebutuhan spesifik kelompok rentan sehingga menjadi dasar penyusunan kebijakan yang lebih inklusif dan responsif gender.`
    ),
    ...createTahapDetails(
      `1. ${data.t1_kegiatan_judul || 'Rapat Koordinasi Identifikasi Permasalahan Aksesibilitas dan Jaminan Sosial Inklusif'}`,
      data.t1_lokasi,
      data.t1_waktu,
      data.t1_peserta,
      data.t1_jumlah_peserta,
      data.t1_narasumber,
      data.t1_output,
      data.t1_alasan_lokasi
    ),

    // Tahap 2
    pHeading('B. Melaksanakan Sinkronisasi, Koordinasi, dan Pengendalian', HeadingLevel.HEADING_3),
    pText(
      data.t2_pendahuluan ||
        `Tahap ini merupakan mandat utama Kemenko PMK dalam memastikan keterpaduan kebijakan lintas sektor. Sinkronisasi dilakukan dengan memastikan program kementerian/lembaga dan pemerintah daerah telah mengakomodasi kebutuhan perempuan dan laki-laki secara setara serta memperhatikan perlindungan kelompok rentan.`
    ),
    ...createTahapDetails(
      '1. Forum Koordinasi Daerah',
      data.t2_lokasi,
      data.t2_waktu,
      data.t2_peserta,
      data.t2_jumlah_peserta,
      data.t2_narasumber,
      data.t2_output,
      data.t2_alasan_lokasi
    ),

    // Tahap 3
    pHeading('C. Melaksanakan Monitoring dan Evaluasi', HeadingLevel.HEADING_3),
    pText(
      data.t3_pendahuluan ||
        `Sebagai koordinator, Kemenko PMK melakukan monitoring dan evaluasi terhadap pelaksanaan kebijakan perlindungan sosial lansia dan disabilitas dengan menilai efektivitas koordinasi lintas sektor, ketepatan sasaran bantuan, dan kendala implementasi di daerah.`
    ),
    ...createTahapDetails(
      '1. Kunjungan Lapangan ke Daerah untuk Verifikasi Langsung atas Pelaksanaan Program',
      data.t3_lokasi,
      data.t3_waktu,
      data.t3_peserta,
      data.t3_jumlah_peserta,
      data.t3_narasumber,
      data.t3_output,
      data.t3_alasan_lokasi
    ),

    // Tahap 4
    pHeading('D. Menyusun Rekomendasi Kebijakan', HeadingLevel.HEADING_3),
    pText(
      data.t4_pendahuluan_p1 ||
        `Tahap akhir berupa penyusunan rekomendasi kebijakan berdasarkan hasil identifikasi, koordinasi, serta monitoring dan evaluasi. Rekomendasi disusun dengan mempertimbangkan hasil analisis kesenjangan gender dan kebutuhan kelompok rentan agar kebijakan lebih inklusif.`
    ),
    pText(
      data.t4_pendahuluan_p2 ||
        `Rekomendasi mencakup penguatan penggunaan data terpilah, peningkatan kapasitas pemerintah daerah dalam penyediaan layanan ramah lansia, dan penyempurnaan indikator monitoring pemenuhan hak disabilitas.`
    ),
    ...createTahapDetails(
      '1. Rapat Penyusunan Rekomendasi Kebijakan dengan Melibatkan K/L Teknis, Pemda, dan Akademisi',
      data.t4_lokasi,
      data.t4_waktu,
      data.t4_peserta,
      data.t4_jumlah_peserta,
      data.t4_narasumber,
      data.t4_output,
      data.t4_alasan_lokasi
    ),

    pText(`Anggaran yang dibutuhkan untuk menghasilkan output ini adalah sebesar ${formatRupiah(data.anggaran_output || '185000000')}.`, { bold: true, spaceBefore: 180 }),
    
    pText(`2.2 RAK 2: Peningkatan Aksesibilitas dan Layanan Pendukung Bagi Lansia dan Disabilitas`, { bold: true }),
    pText(`2.2.1 Sub Komponen 052 Sinkronisasi, Koordinasi dan Pengendalian Bidang ${data.urusan_bidang || 'Pemberdayaan Disabilitas dan Lanjut Usia'}`, { bold: true }),
  ];

  // 6. MATRIKS WAKTU PELAKSANAAN (12 BULAN)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  const createMonthCell = (active: boolean) => {
    return new TableCell({
      width: { size: 450, type: WidthType.DXA },
      shading: {
        fill: active ? 'C8E6C9' : 'FFFFFF',
        type: ShadingType.CLEAR,
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: active ? '✓' : '',
              font: FONT_FAMILY,
              size: 18,
              bold: true,
              color: '2E7D32',
            }),
          ],
        }),
      ],
    });
  };

  const sk1 = data.schedule_subkomponen_1;
  const scheduleRows = [
    { label: 'Subkomponen 051 - Identifikasi Masalah', arr: sk1?.identifikasi },
    { label: 'Subkomponen 051 - Sinkronisasi & Koordinasi', arr: sk1?.sinkronisasi },
    { label: 'Subkomponen 051 - Monitoring & Evaluasi', arr: sk1?.monitoring },
    { label: 'Subkomponen 051 - Penyusunan Rekomendasi', arr: sk1?.rekomendasi },
  ];

  const waktuPelaksanaanElements = [
    pHeading('D. WAKTU PENCAPAIAN KELUARAN', HeadingLevel.HEADING_1),
    pText('Kurun waktu pencapaian output adalah sebagai berikut:'),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 3960, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Tahapan Kegiatan / Subkomponen', font: FONT_FAMILY, size: 20, bold: true })],
                }),
              ],
            }),
            ...monthNames.map(
              (m) =>
                new TableCell({
                  width: { size: 450, type: WidthType.DXA },
                  shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: m, font: FONT_FAMILY, size: 18, bold: true })],
                    }),
                  ],
                })
            ),
          ],
        }),
        ...scheduleRows.map(
          (sr) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 3960, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: sr.label, font: FONT_FAMILY, size: 19 })],
                    }),
                  ],
                }),
                ...monthNames.map((_, i) => createMonthCell(Boolean(sr.arr?.[i]))),
              ],
            })
        ),
      ],
    }),
  ];

  // 7. E. BIAYA YANG DIBUTUHKAN & PENGESAHAN
  const biayaDanTtdElements = [
    pHeading('E. BIAYA YANG DIBUTUHKAN', HeadingLevel.HEADING_1),
    pText(
      `Asisten Deputi ${data.biaya_asdep || asdep} pada Tahun Anggaran ${data.biaya_tahun || tahun} untuk menghasilkan ${data.biaya_volume || data.volume_ro || '1'} output memerlukan anggaran sebesar ${formattedNominal},- (${terbilangNominal}).`
    ),
    new Paragraph({ spacing: { before: 140, after: 0 }, children: [] }),

    // Kolom Tanda Tangan
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      borders: noBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4680, type: WidthType.DXA },
              children: [new Paragraph({ children: [] })],
            }),
            new TableCell({
              width: { size: 4680, type: WidthType.DXA },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Jakarta, ${data.ttd_tanggal || '30 Januari 2026'}`,
                      font: FONT_FAMILY,
                      size: 22,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 40, after: 500 },
                  children: [
                    new TextRun({
                      text: `Asisten Deputi ${data.ttd_asdep || asdep},`,
                      font: FONT_FAMILY,
                      size: 22,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.ttd_nama || 'Nama Pejabat Asisten Deputi',
                      font: FONT_FAMILY,
                      size: 22,
                      bold: true,
                      underline: {},
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `NIP. ${data.ttd_nip || '19750101 200003 1 001'}`,
                      font: FONT_FAMILY,
                      size: 21,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 8. LAMPIRAN I: GENDER ANALYSIS PATHWAY (GAP) - Sesuai Template Resmi Kemenko PMK
  const lampiranGAPElements = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: 'LAMPIRAN I',
          font: FONT_FAMILY,
          size: 26,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 160 },
      children: [
        new TextRun({
          text: 'GENDER ANALYSIS PATHWAY (GAP)',
          font: FONT_FAMILY,
          size: 24,
          bold: true,
        }),
      ],
    }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 2340, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Langkah 1\n(Identifikasi Isu dan Masalah Gender)*', font: FONT_FAMILY, size: 19, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2340, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Langkah 2\n(Identifikasi Faktor Penyebab)*', font: FONT_FAMILY, size: 19, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2340, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Langkah 3\n(Penyusunan Rencana Aksi Responsif Gender)*', font: FONT_FAMILY, size: 19, bold: true })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2340, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: 'Langkah 4\n(Identifikasi Pemangku Kepentingan (K/L/PD)*', font: FONT_FAMILY, size: 19, bold: true })],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 2340, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Mengidentifikasi kesenjangan gender yang menjadi dasar intervensi program/kegiatan.\n\nPanduan Penyusunan:\n1. Gunakan data terpilah laki-laki/perempuan.\n2. Jelaskan bentuk kesenjangan (akses, partisipasi, kontrol, manfaat).\n3. Hubungkan dengan substansi RO.\n4. Hindari hanya menuliskan data tanpa menjelaskan maknanya.\n\nContoh:\nMasih terdapat kesenjangan aksesibilitas dan layanan perlindungan sosial bagi lansia dan disabilitas perempuan di daerah percontohan.',
                      font: FONT_FAMILY,
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2340, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Mengidentifikasi faktor-faktor yang menyebabkan timbulnya kesenjangan gender.\n\nPanduan Penyusunan:\n1. Analisis faktor internal (kebijakan/prosedur) dan eksternal (sosio-kultural).\n2. Identifikasi hambatan struktural yang dihadapi kelompok sasaran.\n\nContoh:\nKurangnya sosialisasi standar pelayanan ramah disabilitas dan keterbatasan alokasi pendampingan di tingkat kelurahan.',
                      font: FONT_FAMILY,
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2340, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Merumuskan rencana aksi intervensi kebijakan yang responsif gender.\n\nPanduan Penyusunan:\n1. Rumuskan intervensi kebijakan yang terukur dan terarah.\n2. Alokasikan Anggaran Responsif Gender (ARG) yang memadai.\n\nContoh:\nPelaksanaan forum koordinasi penyusunan pedoman standar layanan inklusif dan afirmasi pelibatan organisasi disabilitas.',
                      font: FONT_FAMILY,
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2340, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Menentukan mitra kerja dan pemangku kepentingan terkait.\n\nPanduan Penyusunan:\n1. Tentukan Kementerian/Lembaga teknis penanggung jawab.\n2. Tentukan peran Pemerintah Daerah dan mitra kerja terkait.\n\nContoh:\nKemensos, Kemenkes, Bappenas, Kemendagri, Pemerintah Daerah Provinsi/Kabupaten/Kota, dan Asosiasi Penyandang Disabilitas.',
                      font: FONT_FAMILY,
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 9. LAMPIRAN II: MANAJEMEN RISIKO - Sesuai Template Resmi Kemenko PMK
  const mrTemplateRows = [
    {
      no: '1.',
      kategori: 'Risiko Kebijakan',
      kode: 'RK',
      definisi: 'Risiko yang bersumber dari adanya penetapan kebijakan organisasi dilakukan 1 (satu) kali dalam setahun dari internal maupun eksternal organisasi yang berdampak langsung terhadap organisasi.',
    },
    {
      no: '2.',
      kategori: 'Risiko Regulasi dan Legalitas',
      kode: 'RRL',
      definisi: 'Risiko yang timbul akibat ketidaksinkronan, kelemahan, atau ketidakjelasan regulasi serta aspek legalitas yang mendasari kebijakan dan program organisasi. Risiko ini mencakup kepatuhan terhadap peraturan perundang-undangan, potensi sengketa hukum, serta lemahnya implementasi regulasi di lapangan.',
    },
    {
      no: '3.',
      kategori: 'Risiko Keuangan',
      kode: 'RKeu',
      definisi: 'Risiko yang terkait dengan kerugian finansial, penyalahgunaan anggaran, ketidakakuratan pelaporan keuangan, atau kerugian aset negara (termasuk fraud).',
    },
    {
      no: '4.',
      kategori: 'Risiko Reputasi',
      kode: 'RR',
      definisi: 'Risiko yang berdampak pada menurunnya tingkat kepercayaan pemangku kepentingan yang bersumber dari persepsi negatif terhadap organisasi.',
    },
    {
      no: '5.',
      kategori: 'Risiko Operasional dan Sumber Daya Manusia',
      kode: 'ROSDM',
      definisi: 'Risiko yang muncul dari kelemahan dalam proses operasional internal, sistem kerja, serta kapasitas dan kompetensi sumber daya manusia. Risiko ini mencakup kegagalan prosedur, keterbatasan SDM, dan rendahnya efektivitas pelaksanaan tugas.',
    },
    {
      no: '6.',
      kategori: 'Risiko Stakeholder',
      kode: 'RS',
      definisi: 'Risiko yang berkaitan dengan pola hubungan antara organisasi dengan pemangku kepentingan dan/atau antar unit kerja di organisasi.',
    },
    {
      no: '7.',
      kategori: 'Risiko Bencana',
      kode: 'RB',
      definisi: 'Risiko yang berkaitan dengan potensi terjadinya peristiwa atau rangkaian peristiwa yang mengancam dan mengganggu kehidupan dan penghidupan masyarakat yang disebabkan, baik dari faktor alam dan/atau faktor non alam maupun faktor manusia.',
    },
    {
      no: '8.',
      kategori: 'Risiko Teknologi',
      kode: 'RT',
      definisi: 'Risiko yang berkaitan dengan kejahatan siber, ketidaktepatan implementasi teknologi, kecelakaan industri, kegagalan infrastruktur vital, dan disrupsi teknologi.',
    },
    {
      no: '9.',
      kategori: 'Risiko Tata Kelola dan Integritas',
      kode: 'RTKI',
      definisi: 'Risiko yang timbul akibat kelemahan dalam sistem tata kelola organisasi, mekanisme pengendalian internal, serta perilaku tidak etis yang mengganggu pencapaian tujuan organisasi.',
    },
  ];

  const lampiranRiskElements = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 30 },
      children: [
        new TextRun({
          text: 'LAMPIRAN II',
          font: FONT_FAMILY,
          size: 26,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: 'MANAJEMEN RISIKO',
          font: FONT_FAMILY,
          size: 24,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: 'Detail ada pada link https://bit.ly/PedomanBersamaKPMK',
          font: FONT_FAMILY,
          size: 20,
          italics: true,
          color: '2563EB',
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 30, after: 60 },
      children: [
        new TextRun({
          text: 'Keterangan:\n1. Kategori Risiko: pengelompokan atau klasifikasi risiko berdasarkan sumber, sifat, atau area dampaknya.',
          font: FONT_FAMILY,
          size: 20,
        }),
      ],
    }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 600, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', font: FONT_FAMILY, size: 18, bold: true })] })],
            }),
            new TableCell({
              width: { size: 2400, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kategori Risiko', font: FONT_FAMILY, size: 18, bold: true })] })],
            }),
            new TableCell({
              width: { size: 1200, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kode Risiko', font: FONT_FAMILY, size: 18, bold: true })] })],
            }),
            new TableCell({
              width: { size: 5160, type: WidthType.DXA },
              shading: { fill: 'EEEEEE', type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Definisi', font: FONT_FAMILY, size: 18, bold: true })] })],
            }),
          ],
        }),
        ...mrTemplateRows.map(
          (r) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 600, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 80, right: 80 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: r.no, font: FONT_FAMILY, size: 18 })] })],
                }),
                new TableCell({
                  width: { size: 2400, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 80, right: 80 },
                  children: [new Paragraph({ children: [new TextRun({ text: r.kategori, font: FONT_FAMILY, size: 18, bold: true })] })],
                }),
                new TableCell({
                  width: { size: 1200, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 80, right: 80 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: r.kode, font: FONT_FAMILY, size: 18, bold: true })] })],
                }),
                new TableCell({
                  width: { size: 5160, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 80, right: 80 },
                  children: [new Paragraph({ children: [new TextRun({ text: r.definisi, font: FONT_FAMILY, size: 18 })] })],
                }),
              ],
            })
        ),
      ],
    }),
  ];

  // Susun Dokumen Penuh
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Kerangka Acuan Kerja (KAK) - Kemenko PMK',
                    font: FONT_FAMILY,
                    size: 18,
                    italics: true,
                    color: '777777',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Halaman ',
                    font: FONT_FAMILY,
                    size: 18,
                    color: '777777',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_FAMILY,
                    size: 18,
                    color: '777777',
                  }),
                  new TextRun({
                    text: ' dari ',
                    font: FONT_FAMILY,
                    size: 18,
                    color: '777777',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: FONT_FAMILY,
                    size: 18,
                    color: '777777',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...coverElements,
          ...identitasElements,
          ...latarBelakangElements,
          ...penerimaManfaatElements,
          ...strategiElements,
          ...waktuPelaksanaanElements,
          ...biayaDanTtdElements,
          ...lampiranGAPElements,
          ...lampiranRiskElements,
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Helper untuk mengunduh berkas .docx di browser
 */
export function downloadKAKDocx(blob: Blob, fileName?: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'KAK-Hasil-Pengisian.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
