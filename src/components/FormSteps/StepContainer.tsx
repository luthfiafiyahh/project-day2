import React from 'react';
import type { KAKData } from '../../types/kak';
import { FORM_STEPS } from '../../data/steps';
import { TextField, TextAreaField } from './FormField';
import { ScheduleTable } from '../ScheduleMatrix/ScheduleTable';
import { GAPForm } from '../GAPManager/GAPForm';
import { RiskTableForm } from '../RiskManager/RiskTableForm';
import { numberToTerbilangRupiah } from '../../lib/pdf/terbilang';
import {
  FileText,
  Layers,
  Target,
  Compass,
  Calendar,
  DollarSign,
  PenTool,
  Info,
} from 'lucide-react';

interface Props {
  currentStep: number;
  data: KAKData;
  onChange: (field: keyof KAKData, value: any) => void;
  onBulkChange: (patch: Partial<KAKData>) => void;
}

export const StepContainer: React.FC<Props> = ({
  currentStep,
  data,
  onChange,
  onBulkChange,
}) => {
  const stepDef = FORM_STEPS.find((s) => s.id === currentStep);

  const handleNominalChange = (rawNominal: string) => {
    // Clean non-digits
    const cleanDigits = rawNominal.replace(/\D/g, '');
    const num = Number(cleanDigits) || 0;
    const formatted = num > 0 ? num.toLocaleString('id-ID') : '';
    const terbilangText = num > 0 ? numberToTerbilangRupiah(num) : '';

    onBulkChange({
      biaya_total_nominal: formatted || rawNominal,
      biaya_total_terbilang: terbilangText,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Step Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <span>Bagian {currentStep} dari 16</span>
          <span>•</span>
          <span>{stepDef?.category}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {stepDef?.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {stepDef?.description}
        </p>
      </div>

      {/* STEP 1: SAMPUL & IDENTITAS */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-0.5">Panduan Halaman Sampul (Halaman 1)</h4>
              <p className="leading-relaxed">
                Teks Asisten Deputi dan Deputi Bidang akan otomatis dicetak dengan huruf kapital di bagian sampul depan KAK dan disinkronkan ke seluruh bab terkait.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <TextField
              label="Nama Asisten Deputi (Eselon II)"
              description="Contoh: PEMBERDAYAAN DISABILITAS DAN LANJUT USIA"
              required
              value={data.asisten_deputi}
              onChange={(val) => onChange('asisten_deputi', val.toUpperCase())}
              placeholder="PEMBERDAYAAN DISABILITAS DAN LANJUT USIA"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Tahun Anggaran"
                description="Tahun pelaksanaan kegiatan KAK"
                required
                value={data.tahun_anggaran}
                onChange={(val) => onChange('tahun_anggaran', val)}
                placeholder="2026"
              />

              <TextField
                label="Deputi Bidang Pengampu (Eselon I)"
                description="Contoh: KOORDINASI PENINGKATAN KESEJAHTERAAN SOSIAL"
                required
                value={data.deputi_bidang}
                onChange={(val) => onChange('deputi_bidang', val.toUpperCase())}
                placeholder="KOORDINASI PENINGKATAN KESEJAHTERAAN SOSIAL"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PROGRAM & OUTPUT */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
              Rincian Output (RO)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField
                label="Kode RO"
                required
                value={data.ro_kode}
                onChange={(val) => onChange('ro_kode', val)}
                placeholder="001"
                className="md:col-span-1"
              />
              <TextField
                label="Nama Rincian Output (RO)"
                required
                value={data.ro_nama}
                onChange={(val) => onChange('ro_nama', val)}
                placeholder="Peningkatan Kesejahteraan dan Perlindungan Lanjut Usia serta Disabilitas"
                className="md:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <TextField
                label="Kode KRO"
                required
                value={data.kro_kode}
                onChange={(val) => onChange('kro_kode', val)}
                placeholder="036.CL.001"
                className="md:col-span-1"
              />
              <TextField
                label="Klasifikasi Rincian Output (KRO)"
                required
                value={data.kro_nama}
                onChange={(val) => onChange('kro_nama', val)}
                placeholder="Kebijakan Perlindungan Sosial dan Penanggulangan Kemiskinan"
                className="md:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <TextField
                label="Kode Kegiatan"
                required
                value={data.kegiatan_kode}
                onChange={(val) => onChange('kegiatan_kode', val)}
                placeholder="1234"
                className="md:col-span-1"
              />
              <TextField
                label="Nama Kegiatan"
                required
                value={data.kegiatan_nama}
                onChange={(val) => onChange('kegiatan_nama', val)}
                placeholder="Koordinasi Pelaksanaan Kebijakan Kesejahteraan Sosial"
                className="md:col-span-2"
              />
              <TextField
                label="Volume Keluaran (RO)"
                required
                value={data.volume_ro}
                onChange={(val) => onChange('volume_ro', val)}
                placeholder="1"
                suffix="Rekomendasi"
                className="md:col-span-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SASARAN & INDIKATOR KINERJA */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <TextField
              label="Sasaran Program Bidang (Eselon I)"
              required
              value={data.sasaran_program_bidang}
              onChange={(val) => onChange('sasaran_program_bidang', val)}
              placeholder="Peningkatan Kesejahteraan Sosial dan Pemberdayaan Masyarakat"
            />

            <TextField
              label="Indikator Kinerja Program (IKP) Bidang"
              required
              value={data.ikp_bidang}
              onChange={(val) => onChange('ikp_bidang', val)}
              placeholder="Perlindungan Sosial dan Pemberdayaan Disabilitas"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField
                label="Kode Sasaran"
                value={data.sasaran_kegiatan_kode}
                onChange={(val) => onChange('sasaran_kegiatan_kode', val)}
                placeholder="01"
                className="md:col-span-1"
              />
              <TextField
                label="Sasaran Kegiatan Bidang"
                required
                value={data.sasaran_kegiatan_bidang}
                onChange={(val) => onChange('sasaran_kegiatan_bidang', val)}
                placeholder="Peningkatan Kesejahteraan Lanjut Usia dan Disabilitas"
                className="md:col-span-3"
              />
            </div>

            <TextField
              label="Indikator Rincian Output (RO)"
              required
              value={data.indikator_ro}
              onChange={(val) => onChange('indikator_ro', val)}
              placeholder="Peningkatan Aksesibilitas dan Layanan Perlindungan Sosial Lanjut Usia"
            />
          </div>
        </div>
      )}

      {/* STEP 4: DASAR HUKUM */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <TextField
              label="Nama RO pada Kalimat Pengantar Dasar Hukum"
              description="Teks ini dimasukkan ke kalimat: 'Dasar hukum yang mendasari pelaksanaan RO [Nama RO] adalah...'"
              value={data.dasar_hukum_ro}
              onChange={(val) => onChange('dasar_hukum_ro', val)}
              placeholder="Peningkatan Perlindungan Sosial Disabilitas dan Lansia"
            />

            <div className="space-y-3 pt-2">
              <TextField
                label="Dasar Hukum 1 (Undang-Undang / Utama)"
                required
                value={data.dasar_hukum_1}
                onChange={(val) => onChange('dasar_hukum_1', val)}
                placeholder="Undang-Undang Nomor 8 Tahun 2016 tentang Penyandang Disabilitas"
              />

              <TextField
                label="Dasar Hukum 2 (Peraturan Pemerintah / UU Terkait)"
                value={data.dasar_hukum_2}
                onChange={(val) => onChange('dasar_hukum_2', val)}
                placeholder="Undang-Undang Nomor 13 Tahun 1998 tentang Kesejahteraan Lanjut Usia"
              />

              <TextField
                label="Dasar Hukum 3 (Perpres / Permen Teknis)"
                value={data.dasar_hukum_3}
                onChange={(val) => onChange('dasar_hukum_3', val)}
                placeholder="Peraturan Pemerintah Nomor 39 Tahun 2020 tentang Akomodasi yang Layak untuk Penyandang Disabilitas"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: TUGAS DAN FUNGSI KEMENKO PMK */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Nomor Perpres SOTK Kemenko PMK"
                required
                value={data.perpres_nomor}
                onChange={(val) => onChange('perpres_nomor', val)}
                placeholder="72 Tahun 2024"
              />
              <TextField
                label="Judul Perpres SOTK"
                required
                value={data.perpres_tentang}
                onChange={(val) => onChange('perpres_tentang', val)}
                placeholder="Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan"
                className="md:col-span-2"
              />
            </div>

            <TextField
              label="Urusan Bidang Pemerintahan Kemenko PMK"
              required
              value={data.urusan_bidang}
              onChange={(val) => onChange('urusan_bidang', val)}
              placeholder="Pembangunan Manusia dan Kebudayaan"
            />

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                Tusi Tingkat Kedeputian
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Fungsi Deputi Bidang"
                  value={data.fungsi_deputi}
                  onChange={(val) => onChange('fungsi_deputi', val)}
                  placeholder="Koordinasi dan Sinkronisasi"
                />
                <TextField
                  label="Substansi Bidang Kedeputian"
                  value={data.fungsi_deputi_bidang}
                  onChange={(val) => onChange('fungsi_deputi_bidang', val)}
                  placeholder="Peningkatan Kesejahteraan Sosial dan Perlindungan Disabilitas"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                Tusi Tingkat Asisten Deputi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Fungsi Asdep Pelaksana"
                  value={data.asdep_fungsi}
                  onChange={(val) => onChange('asdep_fungsi', val)}
                  placeholder="Sinkronisasi dan Pengendalian Kebijakan"
                />
                <TextField
                  label="Bidang Koordinasi Asdep"
                  value={data.asdep_koordinasi}
                  onChange={(val) => onChange('asdep_koordinasi', val)}
                  placeholder="Pemberdayaan Disabilitas dan Lanjut Usia"
                />
              </div>

              <TextField
                label="Daftar Kementerian / Lembaga yang Dikoordinasikan"
                description="Sebutkan instansi mitra kementerian/lembaga terkait"
                value={data.kl_koordinasi}
                onChange={(val) => onChange('kl_koordinasi', val)}
                placeholder="Kementerian Sosial, Kementerian Kesehatan, Kementerian Ketenagakerjaan, Kemendagri, dan Bappenas"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: KETERKAITAN RPJMN & RKP */}
      {currentStep === 6 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
              Prioritas Nasional (PN) RPJMN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField
                label="Nomor PN"
                required
                value={data.pn_nomor}
                onChange={(val) => onChange('pn_nomor', val)}
                placeholder="1"
                className="md:col-span-1"
              />
              <TextField
                label="Nama Prioritas Nasional (PN)"
                required
                value={data.pn_nama}
                onChange={(val) => onChange('pn_nama', val)}
                placeholder="Memperkokoh Ketahanan Sosial, Budaya, dan Ekologi"
                className="md:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField
                label="Nomor Sasaran PN"
                value={data.sasaran_pn_nomor}
                onChange={(val) => onChange('sasaran_pn_nomor', val)}
                placeholder="03"
                className="md:col-span-1"
              />
              <TextField
                label="Sasaran Prioritas Nasional"
                required
                value={data.sasaran_pn_nama}
                onChange={(val) => onChange('sasaran_pn_nama', val)}
                placeholder="Perluasan Perlindungan Sosial Adaptif dan Inklusif"
                className="md:col-span-3"
              />
            </div>

            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 pt-2">
              Program Prioritas (PP) RKP
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextField
                label="Tahun RKP"
                value={data.rkp_tahun}
                onChange={(val) => onChange('rkp_tahun', val)}
                placeholder="2026"
                className="md:col-span-1"
              />
              <TextField
                label="Nomor PP"
                value={data.pp_nomor}
                onChange={(val) => onChange('pp_nomor', val)}
                placeholder="02"
                className="md:col-span-1"
              />
              <TextField
                label="Nama Program Prioritas (PP)"
                required
                value={data.pp_nama}
                onChange={(val) => onChange('pp_nama', val)}
                placeholder="Penguatan Sistem Perlindungan Sosial Sepanjang Hayat"
                className="md:col-span-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <TextField
                label="Bidang Intervensi Kebijakan"
                value={data.intervensi_bidang}
                onChange={(val) => onChange('intervensi_bidang', val)}
                placeholder="Perlindungan Sosial dan Fasilitas Ramah Disabilitas"
              />
              <TextField
                label="Fokus Kebijakan"
                value={data.intervensi_fokus}
                onChange={(val) => onChange('intervensi_fokus', val)}
                placeholder="Penyediaan sarana publik inklusif dan jaminan perawatan lansia berbasis keluarga"
              />
            </div>

            <TextAreaField
              label="Daftar Indikator Sasaran RPJMN / RKP (Halaman 4)"
              description="Tuliskan indikator sasaran pembangunan beserta targetnya (gunakan baris baru untuk setiap indikator)"
              rows={4}
              value={data.indikator_rpjmn_list}
              onChange={(val) => onChange('indikator_rpjmn_list', val)}
              placeholder="1. Persentase penyandang disabilitas penerima bantuan sosial adaptif (target: 85%)&#10;2. Cakupan perlindungan jaminan sosial lanjut usia terlantar (target: 90%)"
            />
          </div>
        </div>
      )}

      {/* STEP 7: RENSTRA & GAP ANALYSIS */}
      {currentStep === 7 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <TextField
              label="Periode Renstra Kemenko PMK"
              value={data.renstra_periode}
              onChange={(val) => onChange('renstra_periode', val)}
              placeholder="2025-2029"
            />

            <TextField
              label="Indikator Renstra Kemenko PMK (Opsional)"
              description="Indikator yang diampu melalui RO xxx dan tercantum dalam Perjanjian Kinerja"
              value={data.renstra_indikator_opsional || ''}
              onChange={(val) => onChange('renstra_indikator_opsional', val)}
              placeholder="Persentase Penurunan Kesenjangan Aksesibilitas dan Perlindungan Sosial Inklusif sebesar 85%"
            />

            <TextAreaField
              label="Narasi Data Terbaru & Gap Analysis (Halaman 5 / KAK Hal. 3)"
              description="Memuat narasi: 1) Isu strategis & capaian target SKP; 2) Data indikator kewilayahan; 3) Gap analysis kondisi terkini vs target RKP & RPJMN; 4) Konsentrasi kewilayahan"
              required
              rows={5}
              value={data.gap_analysis_narasi}
              onChange={(val) => onChange('gap_analysis_narasi', val)}
              placeholder="1) Isu-isu strategis... 2) Data indikator... 3) Gap analysis... 4) Konsentrasi kewilayahan..."
            />

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                Rencana Output Terkait (RO 1 s.d. 4)
              </h4>
              <TextAreaField
                label="RO 1: Rekomendasi Alternatif Kebijakan"
                description="Sebutkan nama rekomendasi, tujuan, fokus, dan harapan kebijakan"
                required
                rows={3}
                value={data.ro_1_fokus_tujuan}
                onChange={(val) => onChange('ro_1_fokus_tujuan', val)}
                placeholder="Rekomendasi Alternatif Kebijakan...&#10;Rekomendasi alternatif kebijakan ini bertujuan untuk... Rekomendasi difokuskan pada... Melalui kebijakan ini diharapkan..."
              />
              <TextAreaField
                label="RO 2: Rekomendasi Alternatif Kebijakan"
                description="Sebutkan nama rekomendasi, tujuan, fokus, dan harapan kebijakan"
                rows={3}
                value={data.ro_2_fokus_tujuan}
                onChange={(val) => onChange('ro_2_fokus_tujuan', val)}
                placeholder="Rekomendasi Alternatif Kebijakan...&#10;Rekomendasi alternatif kebijakan ini bertujuan untuk... Rekomendasi difokuskan pada... Melalui kebijakan ini diharapkan..."
              />
              <TextField
                label="RO 3: Rekomendasi Alternatif Kebijakan"
                value={data.ro_3_fokus_tujuan}
                onChange={(val) => onChange('ro_3_fokus_tujuan', val)}
                placeholder="Rekomendasi Alternatif Kebijakan Harmonisasi Tata Kelola Kelembagaan..."
              />
              <TextField
                label="RO 4: Koordinasi (Opsional)"
                value={data.ro_4_opsional || ''}
                onChange={(val) => onChange('ro_4_opsional', val)}
                placeholder="Koordinasi Penanganan Kelompok Rentan dan PMKS Lintas Sektor (Opsional)"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: REFORMASI BIROKRASI (RB) & GENDER (PUG) */}
      {currentStep === 8 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
              Pengawalan Reformasi Birokrasi (RB) Tematik
            </h3>
            <TextAreaField
              label="Indikator RB Tematik yang Dikawal (Halaman 6)"
              description="Sebutkan tema RB terkait (e.g. Penurunan Kemiskinan Ekstrem, Digitalisasi Administrasi Pemerintahan)"
              rows={3}
              value={data.rb_indikator_list}
              onChange={(val) => onChange('rb_indikator_list', val)}
              placeholder="1. Penurunan angka kemiskinan ekstrem melalui integrasi data disabilitas&#10;2. Peningkatan kepatuhan standar pelayanan publik ramah kelompok rentan"
            />

            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 pt-2">
              Pengarusutamaan Gender (PUG)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextAreaField
                label="Analisis Kesenjangan Gender (Isu Kesenjangan)"
                rows={3}
                value={data.pug_kesenjangan}
                onChange={(val) => onChange('pug_kesenjangan', val)}
                placeholder="Lansia perempuan dan penyandang disabilitas memiliki tingkat kemiskinan lebih tinggi..."
              />
              <TextAreaField
                label="Faktor Penyebab Kesenjangan"
                rows={3}
                value={data.pug_faktor}
                onChange={(val) => onChange('pug_faktor', val)}
                placeholder="Keterbatasan akses transportasi ramah disabilitas, minimnya informasi bantuan sosial..."
              />
            </div>

            <TextAreaField
              label="Rencana Aksi Intervensi Responsif Gender"
              rows={3}
              value={data.pug_intervensi}
              onChange={(val) => onChange('pug_intervensi', val)}
              placeholder="Menyusun rekomendasi alokasi kuota bantuan afirmatif khusus lansia perempuan tunggal..."
            />
          </div>
        </div>
      )}

      {/* STEP 9: PENERIMA MANFAAT & METODE */}
      {currentStep === 9 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
              Penerima Manfaat Kebijakan (Halaman 7)
            </h3>
            <div className="space-y-3">
              <TextField
                label="Penerima Manfaat Internal Kemenko PMK"
                required
                value={data.manfaat_internal}
                onChange={(val) => onChange('manfaat_internal', val)}
                placeholder="Pimpinan Kemenko PMK, unit kerja Kedeputian terkait, dan pengambil kebijakan internal"
              />
              <TextField
                label="Penerima Manfaat Eksternal (K/L, Pemda, Stakeholders)"
                required
                value={data.manfaat_eksternal}
                onChange={(val) => onChange('manfaat_eksternal', val)}
                placeholder="Kementerian Sosial, Kementerian Kesehatan, Pemerintah Daerah Provinsi/Kabupaten/Kota"
              />
              <TextField
                label="Penerima Manfaat Lainnya (Masyarakat / Sasaran Akhir)"
                value={data.manfaat_lainnya}
                onChange={(val) => onChange('manfaat_lainnya', val)}
                placeholder="Masyarakat luas, khususnya kelompok penyandang disabilitas dan warga lanjut usia"
              />
            </div>

            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 pt-4">
              Metode Pelaksanaan Rincian Output
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Metode Swakelola (Rapat / Koordinasi)"
                value={data.metode_rak1}
                onChange={(val) => onChange('metode_rak1', val)}
                placeholder="Rapat Koordinasi dan Sinkronisasi Lintas Sektor"
              />
              <TextField
                label="Metode Pelaksanaan Lapangan / Monev"
                value={data.metode_rak2}
                onChange={(val) => onChange('metode_rak2', val)}
                placeholder="Kunjungan Lapangan dan Verifikasi Data Daerah"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 10: TAHAP 1: IDENTIFIKASI PERMASALAHAN */}
      {currentStep === 10 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-indigo-700">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">
                Tahap 1: Melaksanakan Identifikasi Permasalahan (Halaman 8)
              </h3>
            </div>

            <TextField
              label="Judul Rapat Koordinasi Tahap 1"
              required
              value={data.t1_kegiatan_judul}
              onChange={(val) => onChange('t1_kegiatan_judul', val)}
              placeholder="Rapat Koordinasi Identifikasi Masalah Kebijakan Perlindungan Disabilitas"
            />

            <TextAreaField
              label="Latar Belakang / Pendahuluan Tahap 1"
              rows={3}
              value={data.t1_pendahuluan}
              onChange={(val) => onChange('t1_pendahuluan', val)}
              placeholder="Identifikasi permasalahan dilakukan untuk memetakan kendala regulasi dan operasional..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Lokasi Pelaksanaan"
                required
                value={data.t1_lokasi}
                onChange={(val) => onChange('t1_lokasi', val)}
                placeholder="Jakarta / hybrid meeting"
              />
              <TextField
                label="Waktu Pelaksanaan"
                required
                value={data.t1_waktu}
                onChange={(val) => onChange('t1_waktu', val)}
                placeholder="Bulan Februari 2026"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Peserta yang Diundang"
                value={data.t1_peserta}
                onChange={(val) => onChange('t1_peserta', val)}
                placeholder="Perwakilan K/L teknis, pakar kebijakan, organisasi disabilitas"
              />
              <TextField
                label="Jumlah Peserta"
                value={data.t1_jumlah_peserta}
                onChange={(val) => onChange('t1_jumlah_peserta', val)}
                placeholder="45 orang"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Narasumber"
                value={data.t1_narasumber}
                onChange={(val) => onChange('t1_narasumber', val)}
                placeholder="Direktur Rehabilitasi Sosial Kemensos, Staf Ahli Bappenas"
              />
              <TextField
                label="Target Luaran / Output Tahap 1"
                required
                value={data.t1_output}
                onChange={(val) => onChange('t1_output', val)}
                placeholder="Laporan Hasil Identifikasi Permasalahan Kebijakan"
              />
            </div>

            <TextField
              label="Alasan Pemilihan Lokasi"
              value={data.t1_alasan_lokasi}
              onChange={(val) => onChange('t1_alasan_lokasi', val)}
              placeholder="Memudahkan koordinasi langsung dengan kantor pusat K/L teknis terkait"
            />
          </div>
        </div>
      )}

      {/* STEP 11: TAHAP 2: SINKRONISASI, KOORDINASI & PENGENDALIAN */}
      {currentStep === 11 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-indigo-700">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">
                Tahap 2: Sinkronisasi, Koordinasi & Pengendalian (Halaman 8)
              </h3>
            </div>

            <TextAreaField
              label="Latar Belakang / Pendahuluan Tahap 2"
              rows={3}
              value={data.t2_pendahuluan}
              onChange={(val) => onChange('t2_pendahuluan', val)}
              placeholder="Tahapan sinkronisasi difokuskan pada penyelarasan komitmen antar kementerian..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Lokasi Pelaksanaan"
                required
                value={data.t2_lokasi}
                onChange={(val) => onChange('t2_lokasi', val)}
                placeholder="Jakarta / hybrid"
              />
              <TextField
                label="Waktu Pelaksanaan"
                required
                value={data.t2_waktu}
                onChange={(val) => onChange('t2_waktu', val)}
                placeholder="Bulan April - Mei 2026"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Peserta yang Dilibatkan"
                value={data.t2_peserta}
                onChange={(val) => onChange('t2_peserta', val)}
                placeholder="Pejabat Eselon II dan fungsional perencana K/L teknis"
              />
              <TextField
                label="Jumlah Peserta"
                value={data.t2_jumlah_peserta}
                onChange={(val) => onChange('t2_jumlah_peserta', val)}
                placeholder="50 orang"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Narasumber"
                value={data.t2_narasumber}
                onChange={(val) => onChange('t2_narasumber', val)}
                placeholder="Deputi Kemenko PMK, Deputi Bappenas, Dirjen Perbendaharaan"
              />
              <TextField
                label="Target Luaran / Output Tahap 2"
                required
                value={data.t2_output}
                onChange={(val) => onChange('t2_output', val)}
                placeholder="Matriks Kesepakatan Sinkronisasi Program Lintas K/L"
              />
            </div>

            <TextField
              label="Alasan Pemilihan Lokasi"
              value={data.t2_alasan_lokasi}
              onChange={(val) => onChange('t2_alasan_lokasi', val)}
              placeholder="Efisiensi anggaran dan fleksibilitas kehadiran perwakilan K/L"
            />
          </div>
        </div>
      )}

      {/* STEP 12: TAHAP 3: MONITORING DAN EVALUASI */}
      {currentStep === 12 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-indigo-700">
              <Compass className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">
                Tahap 3: Monitoring dan Evaluasi (Halaman 9)
              </h3>
            </div>

            <TextAreaField
              label="Latar Belakang / Pendahuluan Tahap 3"
              rows={3}
              value={data.t3_pendahuluan}
              onChange={(val) => onChange('t3_pendahuluan', val)}
              placeholder="Monitoring lapangan dilaksanakan untuk memvalidasi implementasi di tingkat daerah..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Lokasi Pelaksanaan (Provinsi / Kab / Kota)"
                required
                value={data.t3_lokasi}
                onChange={(val) => onChange('t3_lokasi', val)}
                placeholder="Provinsi Jawa Tengah dan DI Yogyakarta"
              />
              <TextField
                label="Waktu Pelaksanaan"
                required
                value={data.t3_waktu}
                onChange={(val) => onChange('t3_waktu', val)}
                placeholder="Bulan Juli - Agustus 2026"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Peserta / Tim Monev"
                value={data.t3_peserta}
                onChange={(val) => onChange('t3_peserta', val)}
                placeholder="Tim Pokja Kemenko PMK, Dinsos Provinsi, Bappeda Kab/Kota"
              />
              <TextField
                label="Jumlah Peserta / Sasaran Lapangan"
                value={data.t3_jumlah_peserta}
                onChange={(val) => onChange('t3_jumlah_peserta', val)}
                placeholder="30 orang"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Narasumber / Informan Kunci"
                value={data.t3_narasumber}
                onChange={(val) => onChange('t3_narasumber', val)}
                placeholder="Kepala Dinas Sosial setempat, pengelola panti sosial"
              />
              <TextField
                label="Target Luaran / Output Tahap 3"
                required
                value={data.t3_output}
                onChange={(val) => onChange('t3_output', val)}
                placeholder="Laporan Hasil Monitoring Lapangan dan Evaluasi Capaian"
              />
            </div>

            <TextField
              label="Alasan Pemilihan Lokasi Daerah"
              value={data.t3_alasan_lokasi}
              onChange={(val) => onChange('t3_alasan_lokasi', val)}
              placeholder="Daerah percontohan dengan tingkat populasi disabilitas dan lansia yang signifikan"
            />
          </div>
        </div>
      )}

      {/* STEP 13: TAHAP 4: PENYUSUNAN REKOMENDASI & ANGGARAN */}
      {currentStep === 13 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-indigo-700">
              <Target className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">
                Tahap 4: Penyusunan Rekomendasi Kebijakan & Estimasi Anggaran (Halaman 9)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextAreaField
                label="Uraian Pendahuluan Paragraf 1"
                rows={3}
                value={data.t4_pendahuluan_p1}
                onChange={(val) => onChange('t4_pendahuluan_p1', val)}
                placeholder="Penyusunan rekomendasi merupakan muara integrasi dari hasil identifikasi, sinkronisasi, dan monev..."
              />
              <TextAreaField
                label="Uraian Pendahuluan Paragraf 2"
                rows={3}
                value={data.t4_pendahuluan_p2}
                onChange={(val) => onChange('t4_pendahuluan_p2', val)}
                placeholder="Rekomendasi disajikan dalam bentuk policy brief dan rancangan instruksi pimpinan..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Lokasi Pelaksanaan"
                required
                value={data.t4_lokasi}
                onChange={(val) => onChange('t4_lokasi', val)}
                placeholder="Jakarta / Ruang Rapat Kemenko PMK"
              />
              <TextField
                label="Waktu Pelaksanaan"
                required
                value={data.t4_waktu}
                onChange={(val) => onChange('t4_waktu', val)}
                placeholder="Bulan Oktober - November 2026"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Peserta Rapat Pleno"
                value={data.t4_peserta}
                onChange={(val) => onChange('t4_peserta', val)}
                placeholder="Tim Penyusun Rekomendasi Kebijakan Kemenko PMK"
              />
              <TextField
                label="Target Luaran Akhir Tahap 4"
                required
                value={data.t4_output}
                onChange={(val) => onChange('t4_output', val)}
                placeholder="Naskah Rekomendasi Kebijakan (Policy Paper / Policy Brief)"
              />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <TextField
                label="Estimasi Kebutuhan Anggaran Output (di Bagian Akhir Tahapan)"
                description="Contoh: Rp 450.000.000,- (Empat Ratus Lima Puluh Juta Rupiah)"
                required
                value={data.anggaran_output}
                onChange={(val) => onChange('anggaran_output', val)}
                placeholder="Rp 450.000.000,- (Empat Ratus Lima Puluh Juta Rupiah)"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 14: MATRIKS JADWAL PELAKSANAAN (12 BULAN) */}
      {currentStep === 14 && (
        <div className="space-y-6">
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-0.5">Panduan Matriks Jadwal 12 Bulan (Halaman 10)</h4>
              <p className="leading-relaxed">
                Klik pada kotak bulan untuk mengaktifkan/menonaktifkan jadwal. Bulan yang aktif akan diarsir dengan warna hijau resmi template KAK ({`#93c47d`}) pada dokumen PDF.
              </p>
            </div>
          </div>

          <ScheduleTable
            subkomponenName="Subkomponen 1: Koordinasi dan Perumusan Kebijakan"
            subkomponenCode="001"
            value={data.schedule_subkomponen_1}
            onChange={(val) => onChange('schedule_subkomponen_1', val)}
          />

          <ScheduleTable
            subkomponenName="Subkomponen 2: Monitoring dan Evaluasi Lapangan"
            subkomponenCode="002"
            value={data.schedule_subkomponen_2}
            onChange={(val) => onChange('schedule_subkomponen_2', val)}
          />
        </div>
      )}

      {/* STEP 15: LAMPIRAN I: GENDER ANALYSIS PATHWAY (GAP) */}
      {currentStep === 15 && (
        <GAPForm
          langkah1={data.gap_langkah1}
          langkah2={data.gap_langkah2}
          langkah3={data.gap_langkah3}
          langkah4={data.gap_langkah4}
          onChange={(field, val) => onChange(field, val)}
        />
      )}

      {/* STEP 16: LAMPIRAN II: MANAJEMEN RISIKO & PENGESAHAN */}
      {currentStep === 16 && (
        <div className="space-y-8">
          {/* Section 6 Biaya */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-indigo-700">
              <DollarSign className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">
                Bagian 6: Rencana Anggaran Biaya (Halaman 10)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Asisten Deputi Pengusul"
                value={data.biaya_asdep}
                onChange={(val) => onChange('biaya_asdep', val)}
                placeholder={data.asisten_deputi}
              />
              <TextField
                label="Tahun Anggaran"
                value={data.biaya_tahun}
                onChange={(val) => onChange('biaya_tahun', val)}
                placeholder={data.tahun_anggaran}
              />
              <TextField
                label="Volume Keluaran"
                value={data.biaya_volume}
                onChange={(val) => onChange('biaya_volume', val)}
                placeholder="1 (Satu) Rekomendasi Kebijakan"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <TextField
                  label="Total Nominal Anggaran (Rp)"
                  description="Ketik angka nominal (terbilang akan dihitung otomatis)"
                  required
                  prefix="Rp"
                  value={data.biaya_total_nominal}
                  onChange={handleNominalChange}
                  placeholder="450.000.000"
                />
              </div>
              <div>
                <TextField
                  label="Terbilang Rupiah"
                  description="Dihasilkan secara otomatis dari nominal angka"
                  required
                  value={data.biaya_total_terbilang}
                  onChange={(val) => onChange('biaya_total_terbilang', val)}
                  placeholder="Empat Ratus Lima Puluh Juta Rupiah"
                />
              </div>
            </div>
          </div>

          {/* Section Tanda Tangan Pengesahan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-indigo-700">
              <PenTool className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">
                Pengesahan Dokumen KAK (Halaman 10 Bawah)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Tempat & Tanggal Pengesahan"
                description="Contoh: Jakarta, 12 Januari 2026"
                required
                value={data.ttd_tanggal}
                onChange={(val) => onChange('ttd_tanggal', val)}
                placeholder="Jakarta, 12 Januari 2026"
              />
              <TextField
                label="Jabatan Penandatangan"
                description="Contoh: Asisten Deputi Pemberdayaan Disabilitas dan Lanjut Usia"
                required
                value={data.ttd_asdep}
                onChange={(val) => onChange('ttd_asdep', val)}
                placeholder="Asisten Deputi Pemberdayaan Disabilitas dan Lanjut Usia"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Nama Lengkap & Gelar Pejabat"
                required
                value={data.ttd_nama}
                onChange={(val) => onChange('ttd_nama', val)}
                placeholder="Dr. H. Ahmad Fauzi, S.Sos., M.Si."
              />
              <TextField
                label="NIP Pejabat"
                required
                value={data.ttd_nip}
                onChange={(val) => onChange('ttd_nip', val)}
                placeholder="19750817 200003 1 002"
              />
            </div>
          </div>

          {/* Lampiran II: Manajemen Risiko */}
          <RiskTableForm
            riskRows={data.risk_rows}
            onChange={(rows) => onChange('risk_rows', rows)}
          />
        </div>
      )}
    </div>
  );
};
