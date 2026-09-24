import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { defaultKAKData } from '../src/data/initialData';
import { formatRupiah, angkaKeTerbilang } from '../src/lib/pdf/terbilang';
import type { KAKData } from '../src/types/kak';

const execFileAsync = promisify(execFile);

export async function renderKAKDocxBuffer(data: KAKData): Promise<Buffer> {
  const templatePath = path.resolve(process.cwd(), 'templates/template_kak.docx');
  const content = fs.readFileSync(templatePath, 'binary');

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Prepare sanitized view model
  const tahun = data.tahun_anggaran || '2026';
  const asdep = data.asisten_deputi || '';
  const nominal = data.anggaran_output || data.biaya_total_nominal || '185000000';
  const formattedNominal = formatRupiah(nominal);
  const terbilangNominal = data.biaya_total_terbilang || `${formattedNominal} (${angkaKeTerbilang(nominal)} Rupiah)`;

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
    dasar_hukum_1: data.dasar_hukum_1 || '',
    dasar_hukum_2: data.dasar_hukum_2 || '',
    dasar_hukum_3: data.dasar_hukum_3 || '',
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
    t1_kegiatan_judul: data.t1_kegiatan_judul || '',
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
    anggaran_output: formattedNominal,
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

  // Apply Schedule Table shading in XML
  const renderedZip = doc.getZip();
  let docXml = renderedZip.file('word/document.xml')?.asText() || '';

  // Handle schedule table rows shading if schedule data provided
  const sk1 = data.schedule_subkomponen_1;
  const sk2 = data.schedule_subkomponen_2 || sk1;

  if (sk1) {
    // Table 1 is the second table in document.xml
    // Regex replace table cell shading for schedule rows
    // Rows in table 1:
    // row 4: Identifikasi sk1
    // row 5: Sinkronisasi sk1
    // row 6: Monev sk1
    // row 7: Rekomendasi sk1
    // row 9: Identifikasi sk2
    // row 10: Sinkronisasi sk2
    // row 11: Monev sk2
    // row 12: Rekomendasi sk2
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

    // Find all tables
    const tableRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
    let tblIndex = 0;
    docXml = docXml.replace(tableRegex, (tblXml) => {
      tblIndex++;
      if (tblIndex !== 2) return tblXml; // Table 1 is index 2

      // Process table rows
      const trRegex = /<w:tr[\s\S]*?<\/w:tr>/g;
      let rIdx = 0;
      return tblXml.replace(trRegex, (trXml) => {
        const curRow = rIdx++;
        const config = scheduleConfig.find((c) => c.rowIdx === curRow);
        if (!config || !config.months) return trXml;

        // Process cells in this row (cells 0, 1 are headers, 2..13 are months 1..12)
        const tcRegex = /<w:tc[\s\S]*?<\/w:tc>/g;
        let cIdx = 0;
        return trXml.replace(tcRegex, (tcXml) => {
          const curCol = cIdx++;
          if (curCol < 2 || curCol > 13) return tcXml;
          const monthIdx = curCol - 2;
          const isActive = Boolean(config.months[monthIdx]);

          // Strip existing w:shd
          let newTc = tcXml.replace(/<w:shd\b[^>]*\/>/g, '');
          if (isActive) {
            // Insert green shading into tcPr
            if (newTc.includes('<w:tcPr>')) {
              newTc = newTc.replace('<w:tcPr>', '<w:tcPr><w:shd w:fill="93c47d" w:val="clear"/>');
            } else {
              newTc = newTc.replace('<w:tc>', '<w:tc><w:tcPr><w:shd w:fill="93c47d" w:val="clear"/></w:tcPr>');
            }
          }
          return newTc;
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

export async function convertDocxToPdf(docxBuffer: Buffer): Promise<Buffer> {
  const tmpDir = path.resolve(process.cwd(), 'node_modules/.tmp_pdf');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const id = Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const inputDocx = path.join(tmpDir, `input_${id}.docx`);
  const outputPdf = path.join(tmpDir, `input_${id}.pdf`);

  fs.writeFileSync(inputDocx, docxBuffer);

  try {
    // Execute LibreOffice headless
    const sofficeCmd = fs.existsSync('/opt/homebrew/bin/soffice')
      ? '/opt/homebrew/bin/soffice'
      : '/Applications/LibreOffice.app/Contents/MacOS/soffice';

    await execFileAsync(sofficeCmd, ['--headless', '--convert-to', 'pdf', '--outdir', tmpDir, inputDocx]);

    if (!fs.existsSync(outputPdf)) {
      throw new Error(`PDF conversion output not found at ${outputPdf}`);
    }

    const pdfBuffer = fs.readFileSync(outputPdf);
    return pdfBuffer;
  } finally {
    // Cleanup temp files
    try {
      if (fs.existsSync(inputDocx)) fs.unlinkSync(inputDocx);
      if (fs.existsSync(outputPdf)) fs.unlinkSync(outputPdf);
    } catch {
      // ignore
    }
  }
}

async function runTest() {
  console.log('Rendering DOCX from template_kak.docx with defaultKAKData...');
  const docxBuf = await renderKAKDocxBuffer(defaultKAKData);
  fs.writeFileSync('analysis/test_output.docx', docxBuf);
  console.log('Saved analysis/test_output.docx (' + docxBuf.length + ' bytes)');

  console.log('Converting DOCX to PDF via LibreOffice headless...');
  const pdfBuf = await convertDocxToPdf(docxBuf);
  fs.writeFileSync('analysis/test_output.pdf', pdfBuf);
  console.log('Saved analysis/test_output.pdf (' + pdfBuf.length + ' bytes)');
}

if (process.argv[1]?.includes('test_pipeline')) {
  runTest().catch((err) => {
    console.error('Error running test:', err);
    process.exit(1);
  });
}
