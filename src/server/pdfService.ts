import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { execFile } from 'child_process';
import { promisify } from 'util';
import type { KAKData } from '../types/kak.ts';
import { formatRupiah, angkaKeTerbilang } from '../lib/pdf/terbilang.ts';
import { TEMPLATE_KAK_BASE64 } from './templateBase64.ts';

const execFileAsync = promisify(execFile);

function cleanLeadingNumber(text: string): string {
  if (!text) return '';
  return text.trim().replace(/^([0-9]+[\.\)]\s*)+/, '');
}

function cleanRupiahNumber(val: string): string {
  if (!val) return '0';
  const clean = val.replace(/[^0-9]/g, '');
  return formatRupiah(clean).replace(/^Rp\s*/i, '');
}

function setCellShading(tcXml: string, isGreen: boolean): string {
  const fillColor = isGreen ? '93c47d' : 'ffffff';
  const shdTag = `<w:shd w:fill="${fillColor}" w:val="clear"/>`;
  if (/<w:tcPr\s*\/>/.test(tcXml)) {
    return tcXml.replace(/<w:tcPr\s*\/>/, `<w:tcPr>${shdTag}</w:tcPr>`);
  }
  if (tcXml.includes('</w:tcPr>')) {
    const withoutShd = tcXml.replace(/<w:shd\b[^>]*\/>/g, '');
    return withoutShd.replace('</w:tcPr>', `${shdTag}</w:tcPr>`);
  }
  return tcXml.replace(/(<w:tc\b[^>]*>)/, `$1<w:tcPr>${shdTag}</w:tcPr>`);
}

export async function renderKAKDocxBuffer(data: KAKData): Promise<Buffer> {
  let content: string | Buffer;
  let templatePath = path.resolve(process.cwd(), 'templates/template_kak.docx');
  if (!fs.existsSync(templatePath)) {
    templatePath = path.resolve(process.cwd(), 'public/template_kak.docx');
  }
  if (fs.existsSync(templatePath)) {
    content = fs.readFileSync(templatePath, 'binary');
  } else {
    // Fallback to embedded base64 template for Vercel serverless runtime
    content = Buffer.from(TEMPLATE_KAK_BASE64, 'base64');
  }

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const d = data || ({} as KAKData);
  const tahun = d.tahun_anggaran || '2026';
  const asdep = d.asisten_deputi || '';
  const rawNominal = d.anggaran_output || d.biaya_total_nominal || '185000000';
  const cleanNominalStr = rawNominal.replace(/[^0-9]/g, '');
  const formattedNominal = formatRupiah(cleanNominalStr);
  const terbilangNominal =
    d.biaya_total_terbilang || `${formattedNominal} (${angkaKeTerbilang(cleanNominalStr)} Rupiah)`;
  const nominalOnlyNum = cleanRupiahNumber(cleanNominalStr);

  const templateData = {
    ...d,
    asisten_deputi: sanitizeString(asdep),
    tahun_anggaran: sanitizeString(tahun),
    deputi_bidang: sanitizeString(data.deputi_bidang),
    ro_nama: sanitizeString(data.ro_nama),
    ro_kode: sanitizeString(data.ro_kode),
    kro_nama: sanitizeString(data.kro_nama),
    kro_kode: sanitizeString(data.kro_kode),
    kegiatan_nama: sanitizeString(data.kegiatan_nama),
    kegiatan_kode: sanitizeString(data.kegiatan_kode),
    volume_ro: sanitizeString(data.volume_ro || '1'),
    sasaran_program_bidang: sanitizeString(data.sasaran_program_bidang),
    ikp_bidang: sanitizeString(data.ikp_bidang),
    sasaran_kegiatan_bidang: sanitizeString(data.sasaran_kegiatan_bidang),
    sasaran_kegiatan_kode: sanitizeString(data.sasaran_kegiatan_kode),
    indikator_ro: sanitizeString(data.indikator_ro),
    dasar_hukum_ro: sanitizeString(data.dasar_hukum_ro || data.ro_nama),
    dasar_hukum_1: cleanLeadingNumber(sanitizeString(data.dasar_hukum_1)),
    dasar_hukum_2: cleanLeadingNumber(sanitizeString(data.dasar_hukum_2)),
    dasar_hukum_3: cleanLeadingNumber(sanitizeString(data.dasar_hukum_3)),
    perpres_nomor: sanitizeString(data.perpres_nomor),
    perpres_tentang: sanitizeString(data.perpres_tentang),
    urusan_bidang: sanitizeString(data.urusan_bidang),
    deputi_bidang_tusi: sanitizeString(data.deputi_bidang_tusi),
    fungsi_deputi: sanitizeString(data.fungsi_deputi),
    fungsi_deputi_bidang: sanitizeString(data.fungsi_deputi_bidang),
    asdep_tusi: sanitizeString(data.asdep_tusi || asdep),
    asdep_fungsi: sanitizeString(data.asdep_fungsi),
    asdep_koordinasi: sanitizeString(data.asdep_koordinasi || asdep),
    kl_koordinasi: sanitizeString(data.kl_koordinasi),
    asdep_program_kerja: sanitizeString(data.asdep_program_kerja || asdep),
    pn_nomor: sanitizeString(data.pn_nomor),
    pn_nama: sanitizeString(data.pn_nama),
    sasaran_pn_nomor: sanitizeString(data.sasaran_pn_nomor),
    sasaran_pn_nama: sanitizeString(data.sasaran_pn_nama),
    rkp_tahun: sanitizeString(data.rkp_tahun || tahun),
    pp_nomor: sanitizeString(data.pp_nomor),
    pp_nama: sanitizeString(data.pp_nama),
    intervensi_bidang: sanitizeString(data.intervensi_bidang),
    intervensi_fokus: sanitizeString(data.intervensi_fokus),
    indikator_tahun: sanitizeString(data.indikator_tahun || tahun),
    indikator_rpjmn_list: sanitizeString(data.indikator_rpjmn_list),
    renstra_periode: sanitizeString(data.renstra_periode || '2025-2029'),
    renstra_indikator_opsional: sanitizeString(data.renstra_indikator_opsional || ''),
    gap_analysis_narasi: sanitizeString(data.gap_analysis_narasi),
    program_prioritas_deputi: sanitizeString(data.program_prioritas_deputi),
    program_prioritas_uraian: sanitizeString(data.program_prioritas_uraian),
    ro_rencana_asdep: sanitizeString(data.ro_rencana_asdep || asdep),
    ro_1_fokus_tujuan: sanitizeString(data.ro_1_fokus_tujuan),
    ro_2_fokus_tujuan: sanitizeString(data.ro_2_fokus_tujuan),
    ro_3_fokus_tujuan: sanitizeString(data.ro_3_fokus_tujuan),
    ro_4_opsional: sanitizeString(data.ro_4_opsional || ''),
    rb_asdep: sanitizeString(data.rb_asdep || asdep),
    rb_indikator_list: sanitizeString(data.rb_indikator_list),
    pug_asdep_1: sanitizeString(data.pug_asdep_1 || asdep),
    pug_bidang: sanitizeString(data.pug_bidang),
    pug_kesenjangan: sanitizeString(data.pug_kesenjangan),
    pug_faktor: sanitizeString(data.pug_faktor),
    pug_asdep_2: sanitizeString(data.pug_asdep_2 || asdep),
    pug_intervensi: sanitizeString(data.pug_intervensi),
    mr_asdep: sanitizeString(data.mr_asdep || asdep),
    manfaat_internal: sanitizeString(data.manfaat_internal),
    manfaat_eksternal: sanitizeString(data.manfaat_eksternal),
    manfaat_lainnya: sanitizeString(data.manfaat_lainnya),
    manfaat_lainnya_masyarakat: sanitizeString(data.manfaat_lainnya),
    metode_volume: sanitizeString(data.metode_volume || data.volume_ro || '1'),
    metode_rak1: sanitizeString(data.metode_rak1 || 'Swakelola Tipe I'),
    metode_rak2: sanitizeString(data.metode_rak2 || 'Swakelola Tipe I'),
    metode_rak3: sanitizeString(data.metode_rak3 || 'Swakelola'),
    tahapan_tahun: sanitizeString(data.tahapan_tahun || tahun),
    t1_pendahuluan: sanitizeString(data.t1_pendahuluan),
    t1_kegiatan_judul: cleanLeadingNumber(sanitizeString(data.t1_kegiatan_judul)),
    t1_lokasi: sanitizeString(data.t1_lokasi),
    t1_waktu: sanitizeString(data.t1_waktu),
    t1_peserta: sanitizeString(data.t1_peserta),
    t1_jumlah_peserta: sanitizeString(data.t1_jumlah_peserta || '30'),
    t1_narasumber: sanitizeString(data.t1_narasumber),
    t1_output: sanitizeString(data.t1_output),
    t1_alasan_lokasi: sanitizeString(data.t1_alasan_lokasi),
    t2_pendahuluan: sanitizeString(data.t2_pendahuluan),
    t2_lokasi: sanitizeString(data.t2_lokasi),
    t2_waktu: sanitizeString(data.t2_waktu),
    t2_peserta: sanitizeString(data.t2_peserta),
    t2_jumlah_peserta: sanitizeString(data.t2_jumlah_peserta || '30'),
    t2_narasumber: sanitizeString(data.t2_narasumber),
    t2_output: sanitizeString(data.t2_output),
    t2_alasan_lokasi: sanitizeString(data.t2_alasan_lokasi),
    t3_pendahuluan: sanitizeString(data.t3_pendahuluan),
    t3_lokasi: sanitizeString(data.t3_lokasi),
    t3_waktu: sanitizeString(data.t3_waktu),
    t3_peserta: sanitizeString(data.t3_peserta),
    t3_jumlah_peserta: sanitizeString(data.t3_jumlah_peserta || '30'),
    t3_narasumber: sanitizeString(data.t3_narasumber),
    t3_output: sanitizeString(data.t3_output),
    t3_alasan_lokasi: sanitizeString(data.t3_alasan_lokasi),
    t4_pendahuluan_p1: sanitizeString(data.t4_pendahuluan_p1),
    t4_pendahuluan_p2: sanitizeString(data.t4_pendahuluan_p2),
    t4_lokasi: sanitizeString(data.t4_lokasi),
    t4_waktu: sanitizeString(data.t4_waktu),
    t4_peserta: sanitizeString(data.t4_peserta),
    t4_jumlah_peserta: sanitizeString(data.t4_jumlah_peserta || '30'),
    t4_narasumber: sanitizeString(data.t4_narasumber),
    t4_output: sanitizeString(data.t4_output),
    t4_alasan_lokasi: sanitizeString(data.t4_alasan_lokasi),
    anggaran_output: nominalOnlyNum,
    biaya_asdep: sanitizeString(data.biaya_asdep || asdep),
    biaya_tahun: sanitizeString(data.biaya_tahun || tahun),
    biaya_volume: sanitizeString(data.biaya_volume || data.volume_ro || '1'),
    biaya_total_nominal: formattedNominal,
    biaya_total_terbilang: terbilangNominal,
    ttd_tanggal: sanitizeString(data.ttd_tanggal),
    ttd_asdep: sanitizeString(data.ttd_asdep || asdep),
    ttd_nama: sanitizeString(data.ttd_nama),
    ttd_nip: sanitizeString(data.ttd_nip),
    gap_langkah1: sanitizeString(data.gap_langkah1),
    gap_langkah2: sanitizeString(data.gap_langkah2),
    gap_langkah3: sanitizeString(data.gap_langkah3),
    gap_langkah4: sanitizeString(data.gap_langkah4),
  };

  doc.render(templateData);

  // Apply Schedule Table shading in XML
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
      if (tblIndex !== 2) return tblXml; // Table 1 (index 2)

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

          return setCellShading(tcXml, isActive);
        });
      });
    });

    renderedZip.file('word/document.xml', docXml);
  }

  const buf = renderedZip.generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });

  return buf;
}

function sanitizeString(val: string): string {
  if (!val) return '';
  return val.trim().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
}

export async function convertDocxToPdf(docxBuffer: Buffer): Promise<Buffer> {
  const tmpDir = path.resolve(process.cwd(), 'node_modules/.tmp_pdf');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const id = Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const inputDocx = path.join(tmpDir, `input_${id}.docx`);
  const outputPdf = path.join(tmpDir, `input_${id}.pdf`);
  const userEnvDir = `file:///tmp/soffice_env_${id}`;
  const localEnvPath = `/tmp/soffice_env_${id}`;

  fs.writeFileSync(inputDocx, docxBuffer);

  try {
    const sofficeCmd = fs.existsSync('/opt/homebrew/bin/soffice')
      ? '/opt/homebrew/bin/soffice'
      : (fs.existsSync('/Applications/LibreOffice.app/Contents/MacOS/soffice')
          ? '/Applications/LibreOffice.app/Contents/MacOS/soffice'
          : 'soffice');

    await execFileAsync(sofficeCmd, [
      `-env:UserInstallation=${userEnvDir}`,
      '--headless',
      '--convert-to',
      'pdf',
      '--outdir',
      tmpDir,
      inputDocx,
    ]);

    if (!fs.existsSync(outputPdf)) {
      throw new Error(`PDF conversion output not found at ${outputPdf}`);
    }

    const pdfBuffer = fs.readFileSync(outputPdf);
    return pdfBuffer;
  } finally {
    try {
      if (fs.existsSync(inputDocx)) fs.unlinkSync(inputDocx);
      if (fs.existsSync(outputPdf)) fs.unlinkSync(outputPdf);
      if (fs.existsSync(localEnvPath)) fs.rmSync(localEnvPath, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}

export async function generateKAKPdfFromDocx(data: KAKData): Promise<Buffer> {
  const docxBuf = await renderKAKDocxBuffer(data);
  const pdfBuf = await convertDocxToPdf(docxBuf);
  return pdfBuf;
}
