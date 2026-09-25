import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import type { KAKData } from '../../types/kak';
import { formatRupiah, angkaKeTerbilang } from '../pdf/terbilang';

function cleanLeadingNumber(text: string): string {
  if (!text) return '';
  return text.trim().replace(/^([0-9]+[\.\)]\s*)+/, '');
}

function cleanRupiahNumber(val: string): string {
  if (!val) return '0';
  const clean = val.replace(/[^0-9]/g, '');
  return formatRupiah(clean).replace(/^Rp\s*/i, '');
}

/**
 * Membuat Dokumen Word (.docx) Resmi dari Data KAK secara Client-Side di Browser
 * Menggunakan template resmi Kemenko PMK (/template_kak.docx) melalui docxtemplater & pizzip.
 */
export async function generateKAKDocx(data: KAKData): Promise<Blob> {
  // 1. Muat template Word resmi dari folder public
  const res = await fetch('/template_kak.docx');
  if (!res.ok) {
    throw new Error(`Gagal memuat template Word (/template_kak.docx): ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();

  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const tahun = data.tahun_anggaran || '2026';
  const asdep = data.asisten_deputi || '';
  const rawNominal = data.anggaran_output || data.biaya_total_nominal || '185000000';
  const cleanNominalStr = rawNominal.replace(/[^0-9]/g, '');
  const formattedNominal = formatRupiah(cleanNominalStr);
  const terbilangNominal =
    data.biaya_total_terbilang || `${formattedNominal} (${angkaKeTerbilang(cleanNominalStr)} Rupiah)`;
  const nominalOnlyNum = cleanRupiahNumber(cleanNominalStr);

  const templateData = {
    ...data,
    asisten_deputi: asdep,
    tahun_anggaran: tahun,
    deputi_bidang: data.deputi_bidang || '',
    ro_nama: data.ro_nama || '',
    ro_kode: data.ro_kode || '',
    kro_nama: data.kro_nama || '',
    kro_kode: data.kro_kode || '',
    kegiatan_nama: data.kegiatan_nama || '',
    kegiatan_kode: data.kegiatan_kode || '',
    volume_ro: data.volume_ro || '1',
    sasaran_program_bidang: data.sasaran_program_bidang || '',
    ikp_bidang: data.ikp_bidang || '',
    sasaran_kegiatan_bidang: data.sasaran_kegiatan_bidang || '',
    sasaran_kegiatan_kode: data.sasaran_kegiatan_kode || '',
    indikator_ro: data.indikator_ro || '',
    dasar_hukum_ro: data.dasar_hukum_ro || data.ro_nama || '',
    dasar_hukum_1: cleanLeadingNumber(data.dasar_hukum_1 || ''),
    dasar_hukum_2: cleanLeadingNumber(data.dasar_hukum_2 || ''),
    dasar_hukum_3: cleanLeadingNumber(data.dasar_hukum_3 || ''),
    perpres_nomor: data.perpres_nomor || '',
    perpres_tentang: data.perpres_tentang || '',
    urusan_bidang: data.urusan_bidang || '',
    deputi_bidang_tusi: data.deputi_bidang_tusi || '',
    fungsi_deputi: data.fungsi_deputi || '',
    fungsi_deputi_bidang: data.fungsi_deputi_bidang || '',
    asdep_tusi: data.asdep_tusi || asdep,
    asdep_fungsi: data.asdep_fungsi || '',
    asdep_koordinasi: data.asdep_koordinasi || asdep,
    kl_koordinasi: data.kl_koordinasi || '',
    asdep_program_kerja: data.asdep_program_kerja || asdep,
    pn_nomor: data.pn_nomor || '',
    pn_nama: data.pn_nama || '',
    sasaran_pn_nomor: data.sasaran_pn_nomor || '',
    sasaran_pn_nama: data.sasaran_pn_nama || '',
    rkp_tahun: data.rkp_tahun || tahun,
    pp_nomor: data.pp_nomor || '',
    pp_nama: data.pp_nama || '',
    intervensi_bidang: data.intervensi_bidang || '',
    intervensi_fokus: data.intervensi_fokus || '',
    indikator_tahun: data.indikator_tahun || tahun,
    indikator_rpjmn_list: data.indikator_rpjmn_list || '',
    renstra_periode: data.renstra_periode || '2025-2029',
    renstra_indikator_opsional: data.renstra_indikator_opsional || '',
    gap_analysis_narasi: data.gap_analysis_narasi || '',
    program_prioritas_deputi: data.program_prioritas_deputi || '',
    program_prioritas_uraian: data.program_prioritas_uraian || '',
    ro_rencana_asdep: data.ro_rencana_asdep || asdep,
    ro_1_fokus_tujuan: data.ro_1_fokus_tujuan || '',
    ro_2_fokus_tujuan: data.ro_2_fokus_tujuan || '',
    ro_3_fokus_tujuan: data.ro_3_fokus_tujuan || '',
    ro_4_opsional: data.ro_4_opsional || '',
    rb_asdep: data.rb_asdep || asdep,
    rb_indikator_list: data.rb_indikator_list || '',
    pug_asdep_1: data.pug_asdep_1 || asdep,
    pug_bidang: data.pug_bidang || '',
    pug_kesenjangan: data.pug_kesenjangan || '',
    pug_faktor: data.pug_faktor || '',
    pug_asdep_2: data.pug_asdep_2 || asdep,
    pug_intervensi: data.pug_intervensi || '',
    mr_asdep: data.mr_asdep || asdep,
    manfaat_internal: data.manfaat_internal || '',
    manfaat_eksternal: data.manfaat_eksternal || '',
    manfaat_lainnya: data.manfaat_lainnya || '',
    manfaat_lainnya_masyarakat: data.manfaat_lainnya || '',
    metode_volume: data.metode_volume || data.volume_ro || '1',
    metode_rak1: data.metode_rak1 || 'Swakelola Tipe I',
    metode_rak2: data.metode_rak2 || 'Swakelola Tipe I',
    metode_rak3: data.metode_rak3 || 'Swakelola',
    tahapan_tahun: data.tahapan_tahun || tahun,
    t1_pendahuluan: data.t1_pendahuluan || '',
    t1_kegiatan_judul: cleanLeadingNumber(data.t1_kegiatan_judul || ''),
    t1_lokasi: data.t1_lokasi || '',
    t1_waktu: data.t1_waktu || '',
    t1_peserta: data.t1_peserta || '',
    t1_jumlah_peserta: data.t1_jumlah_peserta || '30',
    t1_narasumber: data.t1_narasumber || '',
    t1_output: data.t1_output || '',
    t1_alasan_lokasi: data.t1_alasan_lokasi || '',
    t2_pendahuluan: data.t2_pendahuluan || '',
    t2_lokasi: data.t2_lokasi || '',
    t2_waktu: data.t2_waktu || '',
    t2_peserta: data.t2_peserta || '',
    t2_jumlah_peserta: data.t2_jumlah_peserta || '30',
    t2_narasumber: data.t2_narasumber || '',
    t2_output: data.t2_output || '',
    t2_alasan_lokasi: data.t2_alasan_lokasi || '',
    t3_pendahuluan: data.t3_pendahuluan || '',
    t3_lokasi: data.t3_lokasi || '',
    t3_waktu: data.t3_waktu || '',
    t3_peserta: data.t3_peserta || '',
    t3_jumlah_peserta: data.t3_jumlah_peserta || '30',
    t3_narasumber: data.t3_narasumber || '',
    t3_output: data.t3_output || '',
    t3_alasan_lokasi: data.t3_alasan_lokasi || '',
    t4_pendahuluan_p1: data.t4_pendahuluan_p1 || '',
    t4_pendahuluan_p2: data.t4_pendahuluan_p2 || '',
    t4_lokasi: data.t4_lokasi || '',
    t4_waktu: data.t4_waktu || '',
    t4_peserta: data.t4_peserta || '',
    t4_jumlah_peserta: data.t4_jumlah_peserta || '30',
    t4_narasumber: data.t4_narasumber || '',
    t4_output: data.t4_output || '',
    t4_alasan_lokasi: data.t4_alasan_lokasi || '',
    anggaran_output: nominalOnlyNum,
    biaya_asdep: data.biaya_asdep || asdep,
    biaya_tahun: data.biaya_tahun || tahun,
    biaya_volume: data.biaya_volume || data.volume_ro || '1',
    biaya_total_nominal: formattedNominal,
    biaya_total_terbilang: terbilangNominal,
    ttd_tanggal: data.ttd_tanggal || '',
    ttd_asdep: data.ttd_asdep || asdep,
    ttd_nama: data.ttd_nama || '',
    ttd_nip: data.ttd_nip || '',
    gap_langkah1: data.gap_langkah1 || '',
    gap_langkah2: data.gap_langkah2 || '',
    gap_langkah3: data.gap_langkah3 || '',
    gap_langkah4: data.gap_langkah4 || '',
  };

  doc.render(templateData);

  // Pewarnaan hijau (shading) matriks jadwal 12 bulan
  const renderedZip = doc.getZip();
  let docXml = renderedZip.file('word/document.xml')?.asText() || '';

  const sk1 = data.schedule_subkomponen_1;
  const sk2 = data.schedule_subkomponen_2 || sk1;

  if (sk1) {
    const scheduleConfig = [
      { rowIdx: 4, months: sk1.identifikasi },
      { rowIdx: 5, months: sk1.sinkronisasi },
      { rowIdx: 6, months: sk1.monitoring },
      { rowIdx: 7, months: sk1.rekomendasi },
      { rowIdx: 9, months: sk2?.identifikasi },
      { rowIdx: 10, months: sk2?.sinkronisasi },
      { rowIdx: 11, months: sk2?.monitoring },
      { rowIdx: 12, months: sk2?.rekomendasi },
    ];

    const tableRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
    let tblIndex = 0;
    docXml = docXml.replace(tableRegex, (tblXml) => {
      tblIndex++;
      if (tblIndex !== 2) return tblXml;

      const trRegex = /<w:tr[\s\S]*?<\/w:tr>/g;
      let rIdx = 0;
      return tblXml.replace(trRegex, (trXml) => {
        const curRow = rIdx++;
        const config = scheduleConfig.find((c) => c.rowIdx === curRow);
        if (!config || !config.months) return trXml;

        const tcRegex = /<w:tc[\s\S]*?<\/w:tc>/g;
        let cIdx = 0;
        return trXml.replace(tcRegex, (tcXml) => {
          const curCol = cIdx++;
          if (curCol < 2 || curCol > 13) return tcXml;
          const monthIdx = curCol - 2;
          const isActive = Boolean(config.months[monthIdx]);

          let newTc = tcXml.replace(/<w:shd\b[^>]*\/>/g, '');
          if (isActive) {
            if (newTc.includes('</w:tcPr>')) {
              newTc = newTc.replace('</w:tcPr>', '<w:shd w:fill="93c47d" w:val="clear"/></w:tcPr>');
            } else {
              newTc = newTc.replace(
                '<w:tc>',
                '<w:tc><w:tcPr><w:shd w:fill="93c47d" w:val="clear"/></w:tcPr>'
              );
            }
          }
          return newTc;
        });
      });
    });

    renderedZip.file('word/document.xml', docXml);
  }

  const u8 = renderedZip.generate({
    type: 'uint8array',
    compression: 'DEFLATE',
  });

  const outBlob = new Blob([u8 as unknown as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  return outBlob;
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
