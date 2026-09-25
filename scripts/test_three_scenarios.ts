import fs from 'fs';
import { defaultKAKData } from '../src/data/initialData';
import { renderKAKDocxBuffer, convertDocxToPdf } from '../src/server/pdfService';
import type { KAKData } from '../src/types/kak';
import { PDFDocument } from 'pdf-lib';

async function testScenario(name: string, data: KAKData) {
  console.log(`\n--- Pengujian Skenario: ${name} ---`);
  const docx = await renderKAKDocxBuffer(data);
  const pdf = await convertDocxToPdf(docx);
  const pdfDoc = await PDFDocument.load(pdf);
  const pageCount = pdfDoc.getPageCount();
  const fileName = `analysis/test_${name.toLowerCase().replace(/\s+/g, '_')}.pdf`;
  fs.writeFileSync(fileName, pdf);
  console.log(`✅ Berhasil! File: ${fileName} | Ukuran: ${pdf.length} bytes | Jumlah Halaman: ${pageCount}`);
  return pageCount;
}

async function run() {
  // Skenario 1: Isi Pendek
  const shortData: KAKData = {
    ...defaultKAKData,
    gap_analysis_narasi: 'Kondisi saat ini masih memerlukan koordinasi lintas sektor.',
    t1_pendahuluan: 'Tahap 1 dilakukan untuk identifikasi singkat.',
    t2_pendahuluan: 'Tahap 2 dilakukan koordinasi berkala.',
    t3_pendahuluan: 'Tahap 3 monitoring sampling daerah.',
    t4_pendahuluan_p1: 'Tahap 4 perumusan rekomendasi akhir.',
    t4_pendahuluan_p2: 'Rekomendasi diserahkan kepada pimpinan.',
  };
  await testScenario('Isi Pendek', shortData);

  // Skenario 2: Isi Normal
  await testScenario('Isi Normal', defaultKAKData);

  // Skenario 3: Isi Sangat Panjang (3x Lipat)
  const triple = (text: string) => `${text}\n\n${text}\n\n${text}`;
  const longData: KAKData = {
    ...defaultKAKData,
    gap_analysis_narasi: triple(defaultKAKData.gap_analysis_narasi),
    t1_pendahuluan: triple(defaultKAKData.t1_pendahuluan),
    t2_pendahuluan: triple(defaultKAKData.t2_pendahuluan),
    t3_pendahuluan: triple(defaultKAKData.t3_pendahuluan),
    t4_pendahuluan_p1: triple(defaultKAKData.t4_pendahuluan_p1),
    t4_pendahuluan_p2: triple(defaultKAKData.t4_pendahuluan_p2),
  };
  await testScenario('Isi Sangat Panjang', longData);

  console.log('\n=====================================================');
  console.log('SEMUA 3 SKENARIO PENGUJIAN SELESAI DENGAN SUKSES');
  console.log('=====================================================');
}

run().catch((err) => {
  console.error('Test scenarios error:', err);
  process.exit(1);
});
