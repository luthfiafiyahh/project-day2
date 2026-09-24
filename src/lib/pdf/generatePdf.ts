import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import type { KAKData } from '../../types/kak';
import { angkaKeTerbilang, formatRupiah } from './terbilang';

export interface GeneratePdfOptions {
  templateBytes?: Uint8Array;
}

/**
 * Word wrap helper for PDF text within a bounding box
 */
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  if (!text) return [];
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }
    const words = paragraph.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
  }
  return lines;
}

/**
 * Helper to mask out placeholder and draw single line text
 */
function maskAndDrawText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  options: {
    maskX: number;
    maskY: number; // PDF coordinates (bottom-left)
    maskW: number;
    maskH: number;
    textX?: number;
    textY?: number;
    fontSize?: number;
    color?: { r: number; g: number; b: number };
    align?: 'left' | 'center' | 'right';
  }
) {
  const {
    maskX,
    maskY,
    maskW,
    maskH,
    fontSize = 10,
    color = { r: 0, g: 0, b: 0 },
    align = 'left',
  } = options;

  // Mask area with clean white rectangle
  page.drawRectangle({
    x: maskX,
    y: maskY,
    width: maskW,
    height: maskH,
    color: rgb(1, 1, 1),
  });

  if (!text || !text.trim()) return;

  let currentFontSize = fontSize;
  let textWidth = font.widthOfTextAtSize(text, currentFontSize);
  const maxW = maskW - 4;

  if (textWidth > maxW && currentFontSize > 7) {
    currentFontSize = Math.max(7, (maxW / textWidth) * currentFontSize);
    textWidth = font.widthOfTextAtSize(text, currentFontSize);
  }

  let tx = options.textX ?? maskX;
  const ty = options.textY ?? (maskY + (maskH - currentFontSize) / 2);

  if (align === 'center') {
    tx = maskX + (maskW - textWidth) / 2;
  } else if (align === 'right') {
    tx = maskX + maskW - textWidth;
  }

  page.drawText(text, {
    x: tx,
    y: ty,
    size: currentFontSize,
    font,
    color: rgb(color.r, color.g, color.b),
  });
}

/**
 * Helper to mask out a single table row cell on Page 2 and adaptively draw 1 or 2 lines
 * so it never overshoots the right margin and stays cleanly formatted.
 */
function maskAndDrawTableCell(
  page: PDFPage,
  font: PDFFont,
  text: string,
  options: {
    maskX: number;
    maskY: number; // PDF coordinates (bottom-left)
    maskW: number;
    maskH: number;
    fontSize?: number;
    color?: { r: number; g: number; b: number };
  }
) {
  const {
    maskX,
    maskY,
    maskW,
    maskH,
    fontSize = 9,
    color = { r: 0, g: 0, b: 0 },
  } = options;

  // Mask area with clean white rectangle
  page.drawRectangle({
    x: maskX,
    y: maskY,
    width: maskW,
    height: maskH,
    color: rgb(1, 1, 1),
  });

  if (!text || !text.trim()) return;

  const cleanText = text.trim();
  const innerW = maskW - 6;

  // 1. Fits in 1 line at standard font size
  const wDefault = font.widthOfTextAtSize(cleanText, fontSize);
  if (wDefault <= innerW) {
    const ty = maskY + (maskH - fontSize) / 2 + 1;
    page.drawText(cleanText, {
      x: maskX + 2,
      y: ty,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
    return;
  }

  // 2. Fits in 1 line with a slightly smaller font size (8.5pt)
  const w85 = font.widthOfTextAtSize(cleanText, 8.5);
  if (w85 <= innerW) {
    const ty = maskY + (maskH - 8.5) / 2 + 1;
    page.drawText(cleanText, {
      x: maskX + 2,
      y: ty,
      size: 8.5,
      font,
      color: rgb(color.r, color.g, color.b),
    });
    return;
  }

  // 3. Otherwise wrap into 2 lines at 8pt (or 7.5pt if needed)
  let useSize = 8;
  let lines = wrapText(cleanText, font, useSize, innerW);

  if (lines.length > 2) {
    useSize = 7.5;
    lines = wrapText(cleanText, font, useSize, innerW);
  }

  if (lines.length === 2) {
    // 2 lines inside maskH (18pt):
    page.drawText(lines[0], {
      x: maskX + 2,
      y: maskY + 9.5,
      size: useSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
    page.drawText(lines[1], {
      x: maskX + 2,
      y: maskY + 1.2,
      size: useSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
  } else if (lines.length > 2) {
    // 3 lines if text is extremely long: compact 7pt
    const tinySize = 7;
    const tinyLines = wrapText(cleanText, font, tinySize, innerW);
    const lineStep = 6.0;
    let currY = maskY + maskH - 7;
    for (const line of tinyLines.slice(0, 3)) {
      page.drawText(line, {
        x: maskX + 2,
        y: currY,
        size: tinySize,
        font,
        color: rgb(color.r, color.g, color.b),
      });
      currY -= lineStep;
    }
  } else {
    // Single line fallback
    const ty = maskY + (maskH - useSize) / 2 + 1;
    page.drawText(lines[0], {
      x: maskX + 2,
      y: ty,
      size: useSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
  }
}

/**
 * Helper to mask out an area and draw multiline text
 */
function maskAndDrawMultiline(
  page: PDFPage,
  font: PDFFont,
  text: string,
  options: {
    maskX: number;
    maskY: number; // PDF bottom-left
    maskW: number;
    maskH: number;
    fontSize?: number;
    lineHeight?: number;
    color?: { r: number; g: number; b: number };
    align?: 'left' | 'center';
  }
) {
  const {
    maskX,
    maskY,
    maskW,
    maskH,
    fontSize = 9.5,
    lineHeight = 13.5,
    color = { r: 0, g: 0, b: 0 },
    align = 'left',
  } = options;

  // Mask area with white
  page.drawRectangle({
    x: maskX,
    y: maskY,
    width: maskW,
    height: maskH,
    color: rgb(1, 1, 1),
  });

  if (!text || !text.trim()) return;

  // Fit font size if text is long
  let currentFontSize = fontSize;
  let currentLineHeight = lineHeight;
  let wrappedLines = wrapText(text, font, currentFontSize, maskW - 6);

  const maxLinesAllowed = Math.floor(maskH / currentLineHeight);
  if (wrappedLines.length > maxLinesAllowed && currentFontSize > 7.5) {
    currentFontSize = 8;
    currentLineHeight = 11.5;
    wrappedLines = wrapText(text, font, currentFontSize, maskW - 6);
  }

  let currY = maskY + maskH - currentLineHeight;
  for (const line of wrappedLines) {
    if (currY < maskY) break;
    let lx = maskX + 3;
    if (align === 'center') {
      const lw = font.widthOfTextAtSize(line, currentFontSize);
      lx = maskX + (maskW - lw) / 2;
    }
    page.drawText(line, {
      x: lx,
      y: currY,
      size: currentFontSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
    currY -= currentLineHeight;
  }
}

/**
 * Main function to generate final 13-page KAK PDF with user data overlay
 */
export async function generateKAKPdf(
  data: KAKData,
  options: GeneratePdfOptions = {}
): Promise<Uint8Array> {
  let templateBytes = options.templateBytes;

  if (!templateBytes) {
    const response = await fetch('/template.pdf');
    if (!response.ok) {
      throw new Error(`Gagal memuat template PDF: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    templateBytes = new Uint8Array(arrayBuffer);
  }

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();

  if (pages.length !== 13) {
    throw new Error(`Template PDF harus memiliki tepat 13 halaman, ditemukan: ${pages.length}`);
  }

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Month columns X coordinates for pages 8 & 9
  const monthCols = [
    { start: 248.25, end: 269.25 }, // 1 (Jan)
    { start: 269.25, end: 290.25 }, // 2 (Feb)
    { start: 290.25, end: 311.25 }, // 3 (Mar)
    { start: 311.25, end: 332.25 }, // 4 (Apr)
    { start: 332.25, end: 353.25 }, // 5 (Mei)
    { start: 353.25, end: 374.25 }, // 6 (Jun)
    { start: 374.25, end: 395.25 }, // 7 (Jul)
    { start: 395.25, end: 416.25 }, // 8 (Agu)
    { start: 416.25, end: 437.25 }, // 9 (Sep)
    { start: 437.25, end: 465.75 }, // 10 (Okt)
    { start: 465.75, end: 494.25 }, // 11 (Nov)
    { start: 494.25, end: 522.75 }, // 12 (Des)
  ];

  const greenFill = rgb(0.5765, 0.7686, 0.4902); // Exact template green (#93c47d)
  const whiteFill = rgb(1, 1, 1);
  const tableBorderColor = rgb(0.3, 0.3, 0.3);

  function colorMonthCell(
    page: PDFPage,
    colIdx: number,
    yBottom: number,
    yTop: number,
    active: boolean
  ) {
    const col = monthCols[colIdx];
    if (!col) return;
    const w = col.end - col.start;
    const h = yTop - yBottom;

    page.drawRectangle({
      x: col.start,
      y: yBottom,
      width: w,
      height: h,
      color: active ? greenFill : whiteFill,
      borderColor: tableBorderColor,
      borderWidth: 0.5,
    });
  }

  // ==========================================
  // HALAMAN 1 (Sampul / Cover)
  // ==========================================
  {
    const p1 = pages[0];

    // ASISTEN DEPUTI …… (centered across page width 596)
    const asdepTitle = `ASISTEN DEPUTI ${data.asisten_deputi || '……'}`;
    maskAndDrawText(p1, fontBold, asdepTitle, {
      maskX: 50,
      maskY: 526,
      maskW: 496,
      maskH: 18,
      fontSize: 11,
      align: 'center',
    });

    // TAHUN …… (centered)
    const tahunTitle = `TAHUN ${data.tahun_anggaran || '……'}`;
    maskAndDrawText(p1, fontBold, tahunTitle, {
      maskX: 150,
      maskY: 512,
      maskW: 296,
      maskH: 17,
      fontSize: 11,
      align: 'center',
    });

    // REKOMENDASI ALTERNATIF KEBIJAKAN ……
    // Full block on Page 1:
    //   y_pdf 488 = "RINCIAN OUTPUT (RO):" label
    //   y_pdf 474 = "REKOMENDASI ALTERNATIF KEBIJAKAN ……"
    //   y_pdf 460 = "(……)" kode RO
    // We mask the entire block (y=446 to y=508) and dynamically position all rows
    // so that label, multi-line title, and code never collide regardless of length.
    let cleanRoName = (data.ro_nama || '').trim();
    cleanRoName = cleanRoName.replace(/^rincian\s+output\s*(\(ro\))?\s*:\s*/i, '').trim();

    let roFullTitle = '';
    if (!cleanRoName) {
      roFullTitle = 'REKOMENDASI ALTERNATIF KEBIJAKAN ……';
    } else if (/^rekomendasi\s+alternatif\s+kebijakan/i.test(cleanRoName)) {
      roFullTitle = cleanRoName.toUpperCase();
    } else {
      roFullTitle = `REKOMENDASI ALTERNATIF KEBIJAKAN ${cleanRoName.toUpperCase()}`;
    }
    const roCode = `(${data.ro_kode || '……'})`;

    // Step 1: Clean white mask over the entire RO block
    p1.drawRectangle({
      x: 45,
      y: 446,
      width: 506,
      height: 62, // covers y=446 to y=508
      color: rgb(1, 1, 1),
    });

    // Step 2: Determine appropriate font size and wrap lines for title
    const maxTitleW = 466;
    let titleFontSize = 10.5;
    let titleLines = wrapText(roFullTitle, fontBold, titleFontSize, maxTitleW);

    if (titleLines.length === 2) {
      titleFontSize = 10;
      titleLines = wrapText(roFullTitle, fontBold, titleFontSize, maxTitleW);
    } else if (titleLines.length === 3) {
      titleFontSize = 9;
      titleLines = wrapText(roFullTitle, fontBold, titleFontSize, maxTitleW);
    } else if (titleLines.length > 3) {
      titleFontSize = 8;
      titleLines = wrapText(roFullTitle, fontBold, titleFontSize, maxTitleW);
    }

    const nTitle = titleLines.length;

    // Step 3: Compute vertical baseline positions with generous, non-overlapping spacing
    let labelY = 489;
    let labelFontSize = 11;
    let codeY = 461;
    let codeFontSize = 10.5;
    let titleYPositions: number[] = [];

    if (nTitle <= 1) {
      // 1-line title (standard template layout)
      labelY = 489;
      labelFontSize = 11;
      titleYPositions = [475];
      codeY = 461;
      codeFontSize = 10.5;
    } else if (nTitle === 2) {
      // 2-line title (e.g. 80-120 chars)
      // Label at 494, Line 1 at 480 (14pt gap), Line 2 at 467 (13pt gap), Code at 453 (14pt gap)
      labelY = 494;
      labelFontSize = 10.5;
      titleYPositions = [480, 467];
      codeY = 453;
      codeFontSize = 10;
    } else if (nTitle === 3) {
      // 3-line title (e.g. 120-180 chars)
      // Equal 11.5pt spacing across 5 rows
      labelY = 496;
      labelFontSize = 9.5;
      titleYPositions = [484.5, 473, 461.5];
      codeY = 450;
      codeFontSize = 9.5;
    } else {
      // 4+ lines (extreme long title)
      labelFontSize = 8.5;
      codeFontSize = 8.5;
      const topY = 497;
      const bottomY = 449;
      const totalRows = nTitle + 2;
      const step = (topY - bottomY) / (totalRows - 1);
      labelY = topY;
      titleYPositions = [];
      for (let i = 0; i < nTitle; i++) {
        titleYPositions.push(topY - step * (i + 1));
      }
      codeY = bottomY;
    }

    // Step 4: Draw "RINCIAN OUTPUT (RO):"
    const roLabel = 'RINCIAN OUTPUT (RO):';
    const roLabelW = fontBold.widthOfTextAtSize(roLabel, labelFontSize);
    p1.drawText(roLabel, {
      x: 298 - roLabelW / 2,
      y: labelY,
      size: labelFontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Step 5: Draw Title lines
    for (let i = 0; i < titleLines.length; i++) {
      const line = titleLines[i];
      const lw = fontBold.widthOfTextAtSize(line, titleFontSize);
      p1.drawText(line, {
        x: 298 - lw / 2,
        y: titleYPositions[i],
        size: titleFontSize,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
    }

    // Step 6: Draw Kode RO
    const codeW = fontBold.widthOfTextAtSize(roCode, codeFontSize);
    p1.drawText(roCode, {
      x: 298 - codeW / 2,
      y: codeY,
      size: codeFontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });


    // Kebijakan Bidang …… (KRO)
    const kroTitle = `Kebijakan Bidang ${data.kro_nama || '……'}`;
    maskAndDrawText(p1, fontRegular, kroTitle, {
      maskX: 80,
      maskY: 417,
      maskW: 436,
      maskH: 17,
      fontSize: 11,
      align: 'center',
    });

    // (……) Kode KRO
    const kroCode = `(${data.kro_kode || '……'})`;
    maskAndDrawText(p1, fontRegular, kroCode, {
      maskX: 230,
      maskY: 403,
      maskW: 136,
      maskH: 16,
      fontSize: 11,
      align: 'center',
    });

    // Kebijakan …… (Kegiatan)
    const kegiatanTitle = `Kebijakan ${data.kegiatan_nama || '……'}`;
    maskAndDrawText(p1, fontRegular, kegiatanTitle, {
      maskX: 80,
      maskY: 346,
      maskW: 436,
      maskH: 17,
      fontSize: 11,
      align: 'center',
    });

    // (……) Kode Kegiatan
    const kegCode = `(${data.kegiatan_kode || '……'})`;
    maskAndDrawText(p1, fontRegular, kegCode, {
      maskX: 230,
      maskY: 332,
      maskW: 136,
      maskH: 16,
      fontSize: 11,
      align: 'center',
    });

    // DEPUTI BIDANG …… (bawah)
    const deputiTitle = `DEPUTI BIDANG ${data.deputi_bidang ? data.deputi_bidang.toUpperCase() : '……'}`;
    maskAndDrawText(p1, fontBold, deputiTitle, {
      maskX: 50,
      maskY: 218,
      maskW: 496,
      maskH: 18,
      fontSize: 11,
      align: 'center',
    });

    // TAHUN …… (bawah)
    maskAndDrawText(p1, fontBold, tahunTitle, {
      maskX: 150,
      maskY: 172,
      maskW: 296,
      maskH: 17,
      fontSize: 11,
      align: 'center',
    });
  }

  // ==========================================
  // HALAMAN 2 (Identitas, Dasar Hukum, Gambaran Umum)
  // ==========================================
  {
    const p2 = pages[1];

    // Identitas KAK (Right column from x=242 to 546)
    // Unit Eselon II : Asisten Deputi ……
    maskAndDrawTableCell(p2, fontRegular, `Asisten Deputi ${data.asisten_deputi || '……'}`, {
      maskX: 242,
      maskY: 683,
      maskW: 304,
      maskH: 18,
      fontSize: 9,
    });

    // Sasaran Program
    maskAndDrawMultiline(p2, fontRegular, `Meningkatnya koordinasi dalam mengembangkan dan menyerasikan kebijakan Bidang ${data.sasaran_program_bidang || '……'}`, {
      maskX: 242,
      maskY: 605,
      maskW: 304,
      maskH: 35,
      fontSize: 9,
      lineHeight: 12.5,
    });

    // IKP
    maskAndDrawMultiline(p2, fontRegular, `Jumlah Rekomendasi Kebijakan di Bidang ${data.ikp_bidang || '……'} yang dihasilkan`, {
      maskX: 242,
      maskY: 568,
      maskW: 304,
      maskH: 35,
      fontSize: 9,
      lineHeight: 12.5,
    });

    // Kegiatan
    let kegP2 = (data.kegiatan_nama || '').trim();
    if (!kegP2) kegP2 = '……';
    if (!/^kebijakan/i.test(kegP2)) {
      kegP2 = `Kebijakan ${kegP2}`;
    }
    const kegFullP2 = `${kegP2} (${data.kegiatan_kode || '……'})`;
    maskAndDrawTableCell(p2, fontRegular, kegFullP2, {
      maskX: 242,
      maskY: 550,
      maskW: 304,
      maskH: 18,
      fontSize: 9,
    });

    // Sasaran Kegiatan
    let sasaranKegP2 = (data.sasaran_kegiatan_bidang || '').trim();
    if (!sasaranKegP2) sasaranKegP2 = '……';
    if (!/^tersusunnya\s+kebijakan\s+bidang/i.test(sasaranKegP2)) {
      sasaranKegP2 = `Tersusunnya Kebijakan Bidang ${sasaranKegP2}`;
    }
    const sasaranKegFullP2 = `${sasaranKegP2} (${data.sasaran_kegiatan_kode || '……'})`;
    maskAndDrawTableCell(p2, fontRegular, sasaranKegFullP2, {
      maskX: 242,
      maskY: 531,
      maskW: 304,
      maskH: 18,
      fontSize: 9,
    });

    // KRO
    let kroP2 = (data.kro_nama || '').trim();
    if (!kroP2) kroP2 = '……';
    if (!/^kebijakan\s+bidang/i.test(kroP2)) {
      kroP2 = `Kebijakan Bidang ${kroP2}`;
    }
    const kroFullP2 = `${kroP2} (${data.kro_kode || '……'})`;
    maskAndDrawTableCell(p2, fontRegular, kroFullP2, {
      maskX: 242,
      maskY: 512,
      maskW: 304,
      maskH: 18,
      fontSize: 9,
    });

    // RO
    let roP2 = (data.ro_nama || '').trim();
    roP2 = roP2.replace(/^rincian\s+output\s*(\(ro\))?\s*:\s*/i, '').trim();
    if (!roP2) roP2 = '……';
    if (!/^rekomendasi\s+alternatif\s+kebijakan/i.test(roP2)) {
      roP2 = `Rekomendasi Alternatif Kebijakan ${roP2}`;
    }
    const roFullP2 = `${roP2} (${data.ro_kode || '……'})`;
    maskAndDrawTableCell(p2, fontRegular, roFullP2, {
      maskX: 242,
      maskY: 493,
      maskW: 304,
      maskH: 18,
      fontSize: 9,
    });

    // Indikator RO
    let indP2 = (data.indikator_ro || '').trim();
    if (!indP2) indP2 = '……';
    if (!/^jumlah\s+rekomendasi\s+alternatif\s+kebijakan/i.test(indP2)) {
      indP2 = `Jumlah Rekomendasi Alternatif Kebijakan ${indP2}`;
    }
    maskAndDrawTableCell(p2, fontRegular, indP2, {
      maskX: 242,
      maskY: 474,
      maskW: 304,
      maskH: 18,
      fontSize: 9,
    });

    // Volume RO
    maskAndDrawTableCell(p2, fontRegular, `${data.volume_ro || '1'}   Rekomendasi Alternatif Kebijakan`, {
      maskX: 242,
      maskY: 455,
      maskW: 304,
      maskH: 18,
      fontSize: 9,
    });

    // Dasar Hukum
    // RO …… diantaranya yaitu:
    maskAndDrawText(p2, fontRegular, `${data.dasar_hukum_ro || data.ro_nama || '……'} diantaranya yaitu:`, {
      maskX: 92,
      maskY: 346,
      maskW: 434,
      maskH: 15,
      fontSize: 9.5,
    });

    // Butir Dasar Hukum 1, 2, 3
    maskAndDrawText(p2, fontRegular, `1)  ${data.dasar_hukum_1 || ''}`, {
      maskX: 106,
      maskY: 327,
      maskW: 420,
      maskH: 15,
      fontSize: 9.2,
    });
    maskAndDrawText(p2, fontRegular, `2)  ${data.dasar_hukum_2 || ''}`, {
      maskX: 106,
      maskY: 308,
      maskW: 420,
      maskH: 15,
      fontSize: 9.2,
    });
    maskAndDrawText(p2, fontRegular, `3)  ${data.dasar_hukum_3 || ''}`, {
      maskX: 106,
      maskY: 289,
      maskW: 420,
      maskH: 15,
      fontSize: 9.2,
    });

    // Mask out the yellow instruction box "Cantumkan Undang-undang, PP..."
    p2.drawRectangle({
      x: 106,
      y: 258,
      width: 425,
      height: 28,
      color: rgb(1, 1, 1),
    });

    // 2.1 Program yang Terkait Tugas dan Fungsi Utama
    // Re-render the complete narrative block cleanly without markers (1)-(9) or collisions
    const tusiNarrative =
      `Berdasarkan Peraturan Presiden Nomor ${data.perpres_nomor || '……'} tentang ${data.perpres_tentang || '……'} antara lain mengatur bahwa Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan (Kemenko PMK) mempunyai tugas dan fungsi menyelenggarakan urusan pemerintahan di bidang ${data.urusan_bidang || '……'} untuk membantu Presiden dalam menyelenggarakan pemerintahan negara. ` +
      `Dalam menjalankan tugas tersebut, Deputi Bidang ${data.deputi_bidang_tusi || data.deputi_bidang || '……'} menyelenggarakan fungsi ${data.fungsi_deputi || '……'} kebijakan di bidang ${data.fungsi_deputi_bidang || '……'}. ` +
      `Untuk mendukung pelaksanaan fungsi tersebut, Asisten Deputi ${data.asdep_tusi || data.asisten_deputi || '……'} juga menjalankan fungsi ${data.asdep_fungsi || '……'} dengan seluruh Kementerian/Lembaga dibawah koordinasi Asisten Deputi ${data.asdep_koordinasi || data.asisten_deputi || '……'}`;

    maskAndDrawMultiline(p2, fontRegular, tusiNarrative, {
      maskX: 92,
      maskY: 72,
      maskW: 435,
      maskH: 150,
      fontSize: 9.2,
      lineHeight: 14,
    });
  }

  // ==========================================
  // HALAMAN 3 (RPJMN, RKP, Renstra, Gap Analysis, Output RO)
  // ==========================================
  {
    const p3 = pages[2];

    // Mask entire content area on Page 3 (y=115 to y=775)
    p3.drawRectangle({
      x: 90,
      y: 115,
      width: 440,
      height: 660,
      color: rgb(1, 1, 1),
    });

    const maxW = 435;
    const fsSize = 8.85;
    const lh = 11.9;
    let currY = 760;

    function drawP3Para(text: string, size = fsSize, lineH = lh, spaceAfter = 3.5) {
      const lines = wrapText(text, fontRegular, size, maxW);
      for (const line of lines) {
        p3.drawText(line, {
          x: 92,
          y: currY,
          size,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        currY -= lineH;
      }
      currY -= spaceAfter;
    }

    // 1. RPJMN narrative
    const rpjmnText =
      `antara lain ${data.kl_koordinasi || '……'}.\n` +
      `Program kerja Asisten Deputi ${data.asdep_program_kerja || data.asisten_deputi || '……'} berdasarkan Rencana Pembangunan Jangka Menengah Nasional (RPJMN) 2025-2029 pada Prioritas Nasional (PN) ${data.pn_nomor || '……'} yaitu ${data.pn_nama || '……'}. ` +
      `Sasaran utama PN ${data.sasaran_pn_nomor || '……'} yaitu ${data.sasaran_pn_nama || '……'}. ` +
      `Rencana Kerja Pemerintah (RKP) ${data.rkp_tahun || data.tahun_anggaran || '……'} sebagai turunan dari RPJMN 2025-2029 menyebutkan bahwa arah kebijakan dalam rangka mewujudkan sasaran pembangunan PN ${data.pp_nomor || '……'} yaitu ${data.pp_nama || '……'}. ` +
      `Intervensi kebijakan bidang ${data.intervensi_bidang || '……'} yang menjadi fokus yaitu ${data.intervensi_fokus || '……'}.\n` +
      `Program dan indikator merujuk RPJMN yang dikawal di tahun ${data.indikator_tahun || data.tahun_anggaran || '……'} ("Indikator berdasarkan Lampiran III RPJMN 2025-2029") diantaranya yaitu:`;
    drawP3Para(rpjmnText, fsSize, lh, 3);

    // 2. Indikator RPJMN list
    if (data.indikator_rpjmn_list) {
      drawP3Para(data.indikator_rpjmn_list, fsSize, lh, 3.5);
    }

    // 3. Renstra sentence (diisi contoh data untuk bagian opsional sesuai permintaan)
    const renstraOpsional =
      data.renstra_indikator_opsional ||
      'Persentase Penurunan Kesenjangan Aksesibilitas dan Perlindungan Sosial Inklusif sebesar 85%';
    const renstraText =
      `Adapun program dan indikator lainnya merujuk renstra Kemenko PMK ${data.renstra_periode || '2025-2029'} yang telah ditetapkan penjelasan prioritas lainnya yang merupakan mandat peraturan ("Indikator yang diampu melalui RO xxx dan telah tercantum dalam Perjanjian Kinerja") yaitu ${renstraOpsional} (Opsional)`;
    drawP3Para(renstraText, fsSize, lh, 3.5);

    // 4. Gap analysis (narasi berisi poin 1 s/d 4 diisi contoh data konkret)
    const gapDefault =
      '1) Isu-isu strategis yang melatarbelakangi usulan rencana SKP mencakup keterbatasan fasilitas publik dan belum optimalnya jaminan perlindungan sosial adaptif bagi kelompok rentan, di mana kondisi eksisting menunjukkan capaian pemenuhan hak disabilitas baru mencapai 65% dari target nasional 85%; 2) Data indikator kewilayahan mencatat bahwa 62% fasilitas publik di tingkat kabupaten/kota belum memenuhi standar ramah disabilitas dan lansia; 3) Gap analysis mengindikasikan perlunya akselerasi integrasi data tunggal sosial ekonomi (Regsosek) guna mencapai target RKP 2026 dan RPJMN 2025-2029; 4) Konsentrasi kewilayahan difokuskan pada 120 kabupaten/kota prioritas di wilayah percontohan Jawa, Bali, dan Indonesia Timur.';
    const gapContent = data.gap_analysis_narasi || gapDefault;
    const gapText =
      `Data terbaru terkait program ${data.kegiatan_nama || data.asdep_program_kerja || data.asisten_deputi || 'Pemberdayaan Disabilitas dan Lanjut Usia'} menyatakan bahwa ${gapContent}`;
    drawP3Para(gapText, fsSize, lh, 3.5);

    // 5. Program prioritas lainnya
    const prioDefault =
      'Strategi Nasional Kelanjutusiaan (Stranas Lansia) berdasarkan Perpres No. 88 Tahun 2021 dan Rencana Aksi Nasional Penyandang Disabilitas (RAN PD) 2025-2029 berdasarkan PP No. 70 Tahun 2019.';
    const progPrioText =
      `Asisten Deputi ${data.program_prioritas_deputi || data.asisten_deputi || 'Pemberdayaan Disabilitas dan Lanjut Usia'} memiliki program prioritas lainnya yang harus dikoordinasikan yaitu ${data.program_prioritas_uraian || prioDefault}`;
    drawP3Para(progPrioText, fsSize, lh, 3.5);

    // 6. Output intro
    const outputIntro =
      `Berdasarkan penjelasan di atas maka terkait dengan tugas dan fungsi Asisten Deputi ${data.ro_rencana_asdep || data.asisten_deputi || 'Pemberdayaan Disabilitas dan Lanjut Usia'} , output yang akan dihasilkan pada rencana kerja tahun anggaran ${data.tahun_anggaran || '2026'} adalah:`;
    drawP3Para(outputIntro, fsSize, lh, 3.0);

    // 7. RO list (1 s.d. 4 sesuai template KAK)
    const ro1Text =
      data.ro_1_fokus_tujuan ||
      'Rekomendasi Alternatif Kebijakan Penguatan Aksesibilitas dan Jaminan Sosial Inklusif Disabilitas dan Lanjut Usia.\nRekomendasi alternatif kebijakan ini bertujuan untuk menjamin perlindungan sosial adaptif dan fasilitas publik ramah disabilitas secara merata. Rekomendasi difokuskan pada standarisasi infrastruktur dasar dan bantuan sosial terintegrasi. Melalui kebijakan ini diharapkan terwujud kemandirian dan pemenuhan hak-hak dasar kelompok rentan.';
    drawP3Para(`1) ${ro1Text}`, fsSize, lh, 2.5);

    const ro2Text =
      data.ro_2_fokus_tujuan ||
      'Rekomendasi Alternatif Kebijakan Skema Layanan Perawatan Jangka Panjang (Long-Term Care) Lansia Berbasis Komunitas.\nRekomendasi alternatif kebijakan ini bertujuan untuk memperkuat dukungan perawatan keluarga dan fasilitas pendamping lansia di tingkat komunitas. Rekomendasi difokuskan pada penguatan kapasitas tenaga pendamping dan posyandu lansia terpadu. Melalui kebijakan ini diharapkan kualitas hidup lansia dan kesejahteraan keluarga meningkat secara berkelanjutan.';
    drawP3Para(`2) ${ro2Text}`, fsSize, lh, 2.5);

    const ro3Text =
      data.ro_3_fokus_tujuan ||
      'Rekomendasi Alternatif Kebijakan Harmonisasi Tata Kelola Kelembagaan Komisi Disabilitas dan Komda Lansia.';
    drawP3Para(`3) ${ro3Text}`, fsSize, lh, 2.5);

    const ro4Text =
      data.ro_4_opsional ||
      'Koordinasi Penanganan Kelompok Rentan dan Penyandang Masalah Kesejahteraan Sosial (PMKS) Lintas Sektor (Opsional)';
    drawP3Para(`4) ${ro4Text}`, fsSize, lh, 2.5);
  }

  // ==========================================
  // HALAMAN 4 (2.2 RB, PUG, MR, Penerima Manfaat)
  // ==========================================
  {
    const p4 = pages[3];

    // Bersihkan seluruh area isi Halaman 4 agar bersih dan tersusun rapi dari atas
    p4.drawRectangle({
      x: 65,
      y: 60,
      width: 475,
      height: 720,
      color: rgb(1, 1, 1),
    });

    let p4y = 755;
    const maxW = 435;
    const fsRegular = 9.0;
    const lhRegular = 12.3;

    const drawP4Para = (text: string, size = fsRegular, lineH = lhRegular, spaceAfter = 4) => {
      const lines = wrapText(text, fontRegular, size, maxW);
      for (const line of lines) {
        p4.drawText(line, {
          x: 92,
          y: p4y,
          size,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        p4y -= lineH;
      }
      p4y -= spaceAfter;
    };

    // 2.2 Program yang Terkait Reformasi Birokrasi (RB)
    p4.drawText('2.2. Program yang Terkait Reformasi Birokrasi (RB)', {
      x: 92,
      y: p4y,
      size: 9.3,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p4y -= 13;

    const rbMandat = `Terhadap pelaksanaan Reformasi Birokrasi (RB), Asisten Deputi ${data.rb_asdep || data.asisten_deputi || '……'} mendapatkan mandat pengawalan indikator RB yaitu:`;
    drawP4Para(rbMandat, fsRegular, lhRegular, 3);

    // Indikator RB
    const rbListRaw =
      data.rb_indikator_list ||
      `1. Indeks Reformasi Birokrasi Tematik Penanggulangan Kemiskinan dan Aksesibilitas Inklusif\n2. Tingkat kepatuhan unit kerja terhadap standar pelayanan publik inklusif ramah kelompok rentan`;
    const rbLines = wrapText(rbListRaw, fontRegular, fsRegular, maxW);
    for (const rbl of rbLines) {
      if (rbl.trim() === '') continue;
      p4.drawText(rbl, {
        x: 92,
        y: p4y,
        size: fsRegular,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      p4y -= lhRegular;
    }
    p4y -= 4;

    // Catatan narasi terkait RB (Wajib ada sesuai instruksi pengguna)
    const rbNoteIntro = 'Catatan narasi terkait RB yang disusun pada penjelasan pelaksanaan tugas fungsi UKE harus memuat:';
    drawP4Para(rbNoteIntro, fsRegular, lhRegular, 3);

    const rbBullets = [
      'regulasi/peraturan perundangan yang mendasari,',
      'kondisi capaian indikator terkini dan target yang diharapkan,',
      'isu strategis yang harus dikawal,',
      'faktor penghambat yang harus dientaskan dan faktor pendorong yang perlu diperkuat baik dari aspek regulasi-data-koordinasi-penguatan kebijakan fiskal-pelibatan multistakeholder-dan aspek lainnya',
      'keterhubungan dengan Reformasi birokrasi general/tematik',
      'pelibatan stakeholder disebutkan K/L dan pemerintah daerah, kelompok masyarakat, masyarakat, organisasi dalam/dan luar negeri yang terlibat dalam pelaksanaan tugas fungsi UKE',
    ];

    for (const bText of rbBullets) {
      p4.drawText('\u2022', {
        x: 104,
        y: p4y,
        size: 9.0,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      const bLines = wrapText(bText, fontRegular, fsRegular, maxW - 24);
      for (const bl of bLines) {
        p4.drawText(bl, {
          x: 114,
          y: p4y,
          size: fsRegular,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        p4y -= lhRegular;
      }
      p4y -= 1.5;
    }
    p4y -= 6; // Jarak rapat dan pas menuju 2.3 PUG (tidak ada ruang kosong besar!)

    // 2.3 Pengarusutamaan Gender dalam Pelaksanaan Program
    p4.drawText('2.3 Pengarusutamaan Gender dalam Pelaksanaan Program', {
      x: 92,
      y: p4y,
      size: 9.3,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p4y -= 13;

    const pugNarrative =
      `Asisten Deputi ${data.pug_asdep_1 || data.asisten_deputi || '……'} telah mengintegrasikan perspektif gender dalam pelaksanaan program dan kegiatan melalui penerapan Anggaran Responsif Gender (ARG) dan penyusunan Gender Analysis Pathway (GAP). ` +
      `Berdasarkan hasil analisis gender, masih terdapat kesenjangan dalam pelaksanaan kebijakan bidang ${data.pug_bidang || '……'}, antara lain ${data.pug_kesenjangan || '……'} yang dipengaruhi oleh faktor ${data.pug_faktor || '……'}. ` +
      `Untuk mengatasi kesenjangan tersebut, Kemenko PMK melalui Asisten Deputi ${data.pug_asdep_2 || data.asisten_deputi || '……'} melakukan intervensi melalui ${data.pug_intervensi || '……'}. ` +
      `Diharapkan program dan kegiatan yang dilaksanakan dapat mendukung terwujudnya pembangunan manusia dan kebudayaan yang inklusif dan tepat sasaran. GAP secara lebih rinci dituangkan dalam matriks sebagaimana dimuat dalam lampiran KAK ini.`;
    drawP4Para(pugNarrative, fsRegular, lhRegular, 7);

    // 2.4 Manajemen Risiko
    p4.drawText('2.4 Manajemen Risiko', {
      x: 92,
      y: p4y,
      size: 9.3,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p4y -= 13;

    const mrNarrative =
      `Dalam memastikan tercapainya output dan memaksimalkan dampak positif program, perlu dilakukan manajemen risiko untuk mencegah kegagalan, melindungi sumber daya, dan ketepatan waktu pencapaian target serta efektivitas anggaran. ` +
      `Risiko yang ada dalam pelaksanaan program pada Asisten Deputi ${data.mr_asdep || data.asisten_deputi || '……'} yang perlu dikendalikan melalui penguatan koordinasi lintas sektor, monitoring dan evaluasi, serta penegasan peran dan tanggung jawab stakeholder. ` +
      `Matriks profil risiko terlampir pada lampiran 2 KAK ini.`;
    drawP4Para(mrNarrative, fsRegular, lhRegular, 8);

    // B. PENERIMA MANFAAT
    p4.drawText('B. PENERIMA MANFAAT', {
      x: 92,
      y: p4y,
      size: 9.5,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p4y -= 13;

    p4.drawText('1.1 Lembaga eksternal yang akan menerima manfaat dari kegiatan ini meliputi:', {
      x: 92,
      y: p4y,
      size: fsRegular,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    p4y -= 12;

    const drawP4Item = (num: string, text: string) => {
      const lines = wrapText(`${num} ${text}`, fontRegular, fsRegular, maxW - 14);
      for (const line of lines) {
        p4.drawText(line, {
          x: 106,
          y: p4y,
          size: fsRegular,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        p4y -= lhRegular;
      }
      p4y -= 2;
    };

    drawP4Item('1.', data.manfaat_internal || 'Internal Kemenko PMK (Deputi dan Asisten Deputi terkait);');
    drawP4Item('2.', data.manfaat_eksternal || 'Kementerian/Lembaga Teknis (Kemensos, Bappenas, Kemendagri, Kemenkes) dan Mitra Terkait;');
    drawP4Item('3.', 'Pemerintah Daerah Provinsi/Kabupaten/Kota dan Mitra Kerja Terkait');

    // 1.2 Kelompok masyarakat yang menerima manfaat dari kegiatan ini meliputi:
    p4y -= 4;
    p4.drawText('1.2 Kelompok masyarakat yang menerima manfaat dari kegiatan ini meliputi:', {
      x: 92,
      y: p4y,
      size: fsRegular,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    p4y -= 12;

    const m2Lines = wrapText(
      `1. ${data.manfaat_lainnya || 'Kelompok masyarakat peduli lansia dan keluarga pendamping'}`,
      fontRegular,
      fsRegular,
      maxW - 14
    );
    for (const l of m2Lines) {
      p4.drawText(l, {
        x: 106,
        y: p4y,
        size: fsRegular,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      p4y -= lhRegular;
    }
  }

  // Helper untuk merender detail kegiatan (a. Lokasi s.d. g. Alasan Pemilihan Lokasi)
  const renderTahapItems = (
    p: PDFPage,
    startY: number,
    judul: string,
    lokasi: string,
    waktu: string,
    peserta: string,
    jml: string,
    narasumber: string,
    output: string,
    alasan: string,
    akunNote?: string
  ): number => {
    let y = startY;

    if (judul) {
      const jLines = wrapText(judul, fontBold, 9.3, 420);
      for (const jl of jLines) {
        p.drawText(jl, {
          x: 111,
          y,
          size: 9.3,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        y -= 13.0;
      }
      y -= 1.5;
    }

    const simpleRow = (label: string, val: string) => {
      p.drawText(label, {
        x: 125,
        y,
        size: 9.2,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      const lines = wrapText(`: ${val}`, fontRegular, 9.2, 315);
      for (let i = 0; i < lines.length; i++) {
        p.drawText(lines[i], {
          x: 215,
          y: y - (i * 12.5),
          size: 9.2,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
      }
      y -= Math.max(13.0, lines.length * 12.5 + 1);
    };

    simpleRow('a. Lokasi', lokasi || 'DKI Jakarta');
    simpleRow('b. Waktu', waktu || 'Tahun 2026');
    simpleRow('c. Peserta', peserta || 'K/L terkait');
    simpleRow('d. Jumlah Peserta', `${jml || '30'} orang`);
    simpleRow('e. Narasumber', narasumber || 'Ada');

    // f. Output yang akan dicapai
    p.drawText('f. Output yang akan dicapai :', {
      x: 125,
      y,
      size: 9.2,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    y -= 12.5;
    const outLines = wrapText(output || '-', fontRegular, 9.0, 385);
    for (const ol of outLines) {
      p.drawText(ol, {
        x: 140,
        y,
        size: 9.0,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      y -= 12.0;
    }
    y -= 1.0;

    // g. Alasan pemilihan lokasi
    p.drawText('g. Alasan pemilihan lokasi :', {
      x: 125,
      y,
      size: 9.2,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    const alasanText = alasan || '-';
    if (fontRegular.widthOfTextAtSize(`: ${alasanText}`, 9.0) <= 240) {
      p.drawText(`: ${alasanText}`, {
        x: 260,
        y,
        size: 9.0,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      y -= 13.5;
    } else {
      y -= 12.0;
      const alLines = wrapText(alasanText, fontRegular, 8.8, 385);
      for (const al of alLines) {
        p.drawText(al, {
          x: 140,
          y,
          size: 8.8,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        y -= 11.5;
      }
      y -= 1.0;
    }

    if (akunNote) {
      y -= 2;
      const akLines = wrapText(akunNote, fontRegular, 8.0, 420);
      for (const ak of akLines) {
        p.drawText(ak, {
          x: 111,
          y,
          size: 8.0,
          font: fontRegular,
          color: rgb(0.35, 0.35, 0.35),
        });
        y -= 10.0;
      }
    }

    return y;
  };

  // ==========================================
  // HALAMAN 5 (Tahapan dan Waktu Pelaksanaan - RAK 1 / Tahap 1 Utuh)
  // ==========================================
  {
    const p5 = pages[4];

    // Bersihkan seluruh area isi Halaman 5 agar tersusun rapi dari atas
    p5.drawRectangle({
      x: 65,
      y: 60,
      width: 475,
      height: 720,
      color: rgb(1, 1, 1),
    });

    let p5y = 755;
    const maxW = 435;
    const fsRegular = 9.2;
    const lhRegular = 13.0;

    const drawP5Para = (text: string, size = fsRegular, lineH = lhRegular, spaceAfter = 6) => {
      const lines = wrapText(text, fontRegular, size, maxW);
      for (const line of lines) {
        p5.drawText(line, {
          x: 92,
          y: p5y,
          size,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        p5y -= lineH;
      }
      p5y -= spaceAfter;
    };

    // C. STRATEGI PENCAPAIAN KELUARAN
    p5.drawText('C. STRATEGI PENCAPAIAN KELUARAN', {
      x: 92,
      y: p5y,
      size: 9.5,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p5y -= 13;

    p5.drawText('1. Metode Pelaksanaan', {
      x: 92,
      y: p5y,
      size: 9.2,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p5y -= 12;

    const vol = String(data.metode_volume || data.volume_ro || '1');
    const metodeIntro = `Metode pelaksanaan yang digunakan dalam menghasilkan ${vol} output Rekomendasi Alternatif Kebijakan yaitu melalui:`;
    drawP5Para(metodeIntro, fsRegular, lhRegular, 4);

    const drawP5Item = (num: string, text: string) => {
      const lines = wrapText(`${num} ${text}`, fontRegular, fsRegular, maxW - 14);
      for (const line of lines) {
        p5.drawText(line, {
          x: 106,
          y: p5y,
          size: fsRegular,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        p5y -= lhRegular;
      }
      p5y -= 2;
    };

    drawP5Item('a.', `RAK 1: ${data.metode_rak1 || 'Swakelola Tipe I'}`);
    drawP5Item('b.', `RAK 2: ${data.metode_rak2 || 'Swakelola Tipe I'}`);
    drawP5Item('c.', `RAK 3: ${data.metode_rak3 || 'Swakelola'}`);
    p5y -= 6;

    // 2. Tahapan dan Waktu Pelaksanaan
    p5.drawText('2. Tahapan dan Waktu Pelaksanaan', {
      x: 92,
      y: p5y,
      size: 9.5,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p5y -= 13;

    const tahapanTahun = data.tahapan_tahun || data.tahun_anggaran || '2026';
    const tahapanIntro = `Tahapan pelaksanaan kegiatan yang akan dilakukan pada tahun ${tahapanTahun}, diantaranya sebagai berikut:`;
    drawP5Para(tahapanIntro, fsRegular, lhRegular, 5);

    // 2.1 RAK 1
    const rak1Title = `2.1 RAK 1: ${data.ro_nama || 'Peningkatan Kesejahteraan dan Perlindungan Lanjut Usia serta Disabilitas'}`;
    const rak1Size = fontBold.widthOfTextAtSize(rak1Title, 9.3) > 430 ? 8.8 : 9.3;
    p5.drawText(rak1Title, {
      x: 92,
      y: p5y,
      size: rak1Size,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p5y -= 13;

    // 2.1.1 Sub Komponen 051
    const subkomp1Title = `2.1.1 Sub Komponen 051 Sinkronisasi, Koordinasi dan Pengendalian Bidang ${data.urusan_bidang || data.fungsi_deputi_bidang || 'Pemberdayaan Disabilitas dan Lanjut Usia'}`;
    const subkomp1Size = fontBold.widthOfTextAtSize(subkomp1Title, 9.3) > 430 ? 8.8 : 9.3;
    p5.drawText(subkomp1Title, {
      x: 92,
      y: p5y,
      size: subkomp1Size,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p5y -= 13;

    // A. Melaksanakan Identifikasi Permasalahan
    p5.drawText('A. Melaksanakan Identifikasi Permasalahan', {
      x: 95,
      y: p5y,
      size: 9.3,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p5y -= 13;

    // Paragraf 1: Pendahuluan
    const t1P1 =
      data.t1_pendahuluan ||
      `Sebagai koordinator bidang pembangunan manusia dan kebudayaan, Kemenko PMK melalui Asisten Deputi ${data.asisten_deputi || 'Pemberdayaan Disabilitas dan Lanjut Usia'} berperan menghimpun informasi lintas sektor terkait isu ${data.kegiatan_nama || 'perlindungan disabilitas dan lansia'} di daerah.`;
    drawP5Para(t1P1, fsRegular, lhRegular, 4);

    // Paragraf 2: Identifikasi dilakukan...
    const t1P2 =
      `Identifikasi dilakukan dengan mengintegrasikan masukan dari kementerian/lembaga teknis yaitu ${data.kl_koordinasi || 'Kementerian Sosial, Kementerian Kesehatan, dan K/L terkait'}, pemerintah daerah, serta mitra pembangunan. Selain memetakan permasalahan tata kelola, identifikasi juga dilakukan menggunakan data terpilah menurut jenis kelamin, usia, disabilitas, dan kelompok rentan lainnya untuk mengetahui dampak bencana terhadap perempuan, laki-laki, anak, lansia, ibu hamil, penyandang disabilitas, serta kelompok rentan lainnya. Analisis tersebut digunakan untuk mengidentifikasi kesenjangan akses terhadap layanan dasar, bantuan kemanusiaan, layanan kesehatan, perlindungan sosial, serta mekanisme perlindungan dari kekerasan berbasis gender di lokasi bencana. Dengan demikian, isu yang diidentifikasi tidak hanya bersifat sektoral, tetapi juga memperhatikan kebutuhan spesifik kelompok rentan sehingga menjadi dasar penyusunan kebijakan yang lebih inklusif dan responsif gender.`;
    drawP5Para(t1P2, fsRegular, lhRegular, 7);

    // Subjudul Kegiatan
    p5.drawText('Kegiatan yang dilaksanakan dalam tahapan ini meliputi :', {
      x: 111,
      y: p5y,
      size: 9.2,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    p5y -= 14;

    // Detail Kegiatan Tahap 1 (Menyatu utuh dengan judulnya di Halaman 5 tanpa pemisahan halaman)
    p5y = renderTahapItems(
      p5,
      p5y,
      `1. ${data.t1_kegiatan_judul || 'Rapat Koordinasi Identifikasi Permasalahan Aksesibilitas dan Jaminan Sosial Inklusif'}`,
      data.t1_lokasi,
      data.t1_waktu,
      data.t1_peserta,
      data.t1_jumlah_peserta,
      data.t1_narasumber,
      data.t1_output,
      data.t1_alasan_lokasi,
      '*akun yang diperkenankan: Belanja Bahan, Narasumber, Transport Lokal'
    );
  }

  // ==========================================
  // HALAMAN 6 (Tahap 2 Sinkronisasi & Tahap 3 Monitoring dan Evaluasi)
  // ==========================================
  {
    const p6 = pages[5];

    // Bersihkan seluruh area isi Halaman 6 agar tersusun rapi dari atas tanpa jeda template lama
    p6.drawRectangle({
      x: 65,
      y: 60,
      width: 475,
      height: 720,
      color: rgb(1, 1, 1),
    });

    let p6y = 755;
    const maxW = 435;
    const fsRegular = 9.2;
    const lhRegular = 12.8;

    const drawP6Para = (text: string, size = fsRegular, lineH = lhRegular, spaceAfter = 6) => {
      const lines = wrapText(text, fontRegular, size, maxW);
      for (const line of lines) {
        p6.drawText(line, {
          x: 95,
          y: p6y,
          size,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        p6y -= lineH;
      }
      p6y -= spaceAfter;
    };

    // B. Melaksanakan Sinkronisasi, Koordinasi, dan Pengendalian
    p6.drawText('B. Melaksanakan Sinkronisasi, Koordinasi, dan Pengendalian', {
      x: 95,
      y: p6y,
      size: 9.3,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p6y -= 13;

    const t2Text =
      data.t2_pendahuluan ||
      `Tahap ini merupakan mandat utama Kemenko PMK dalam memastikan keterpaduan kebijakan lintas sektor. Sinkronisasi dilakukan dengan memastikan program kementerian/lembaga dan pemerintah daerah telah mengakomodasi kebutuhan perempuan dan laki-laki secara setara serta memperhatikan perlindungan kelompok rentan. Koordinasi juga mendorong pemanfaatan data terpilah sebagai dasar perencanaan, penganggaran, dan pengambilan keputusan. Pengendalian dilakukan melalui penyepakatan indikator capaian yang mengukur kebermanfaatan program bagi seluruh kelompok masyarakat secara inklusif.`;
    drawP6Para(t2Text, fsRegular, lhRegular, 7);

    p6.drawText('Kegiatan yang dilaksanakan dalam tahapan ini meliputi :', {
      x: 111,
      y: p6y,
      size: 9.2,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    p6y -= 14;

    p6y = renderTahapItems(
      p6,
      p6y,
      '1. Forum koordinasi daerah',
      data.t2_lokasi,
      data.t2_waktu,
      data.t2_peserta,
      data.t2_jumlah_peserta,
      data.t2_narasumber,
      data.t2_output,
      data.t2_alasan_lokasi,
      '*akun yang diperkenankan: Belanja Bahan, Narasumber, Transport Lokal'
    );

    // C. Melaksanakan Monitoring dan Evaluasi (Mengalir langsung di bawah Tahap 2)
    p6y -= 12;
    p6.drawText('C. Melaksanakan Monitoring dan Evaluasi', {
      x: 95,
      y: p6y,
      size: 9.3,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p6y -= 13;

    const t3Text =
      data.t3_pendahuluan ||
      `Sebagai koordinator, Kemenko PMK melakukan monitoring dan evaluasi terhadap pelaksanaan kebijakan perlindungan sosial lansia dan disabilitas dengan menilai efektivitas koordinasi lintas sektor, ketepatan sasaran bantuan, dan kendala implementasi di daerah.`;
    drawP6Para(t3Text, fsRegular, lhRegular, 7);

    p6.drawText('Kegiatan yang dilaksanakan dalam tahapan ini meliputi :', {
      x: 111,
      y: p6y,
      size: 9.2,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    p6y -= 14;

    p6y = renderTahapItems(
      p6,
      p6y,
      '1. Kunjungan lapangan ke daerah untuk melakukan verifikasi langsung atas pelaksanaan program',
      data.t3_lokasi,
      data.t3_waktu,
      data.t3_peserta,
      data.t3_jumlah_peserta,
      data.t3_narasumber,
      data.t3_output,
      data.t3_alasan_lokasi,
      '*akun yang diperkenankan: Belanja Bahan, Narasumber, Transport Lokal, Perjalanan Dinas Paket Meeting'
    );
  }

  // ==========================================
  // HALAMAN 7 (Tahap 4 Rekomendasi Kebijakan & RAK 2 Subkomponen)
  // ==========================================
  {
    const p7 = pages[6];

    // Bersihkan seluruh area isi Halaman 7 agar tersusun rapi dari atas
    p7.drawRectangle({
      x: 65,
      y: 60,
      width: 475,
      height: 720,
      color: rgb(1, 1, 1),
    });

    let p7y = 755;
    const maxW = 435;
    const fsRegular = 9.2;
    const lhRegular = 12.8;

    const drawP7Para = (text: string, size = fsRegular, lineH = lhRegular, spaceAfter = 6) => {
      const lines = wrapText(text, fontRegular, size, maxW);
      for (const line of lines) {
        p7.drawText(line, {
          x: 95,
          y: p7y,
          size,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        p7y -= lineH;
      }
      p7y -= spaceAfter;
    };

    // D. Menyusun Rekomendasi Kebijakan
    p7.drawText('D. Menyusun Rekomendasi Kebijakan', {
      x: 95,
      y: p7y,
      size: 9.3,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p7y -= 13;

    const t4P1 =
      data.t4_pendahuluan_p1 ||
      `Tahap akhir berupa penyusunan rekomendasi kebijakan berdasarkan hasil identifikasi, koordinasi, serta monitoring dan evaluasi. Rekomendasi disusun dengan mempertimbangkan hasil analisis kesenjangan gender dan kebutuhan kelompok rentan agar kebijakan lebih inklusif.`;
    drawP7Para(t4P1, fsRegular, lhRegular, 4);

    const t4P2 =
      data.t4_pendahuluan_p2 ||
      `Rekomendasi mencakup penguatan penggunaan data terpilah, peningkatan kapasitas pemerintah daerah dalam penyediaan layanan ramah lansia, dan penyempurnaan indikator monitoring pemenuhan hak disabilitas.`;
    drawP7Para(t4P2, fsRegular, lhRegular, 7);

    p7.drawText('Kegiatan yang dilaksanakan dalam tahapan ini meliputi :', {
      x: 111,
      y: p7y,
      size: 9.2,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    p7y -= 14;

    p7y = renderTahapItems(
      p7,
      p7y,
      '1. Rapat penyusunan rekomendasi kebijakan dengan melibatkan K/L teknis, pemerintah daerah, dan akademisi',
      data.t4_lokasi,
      data.t4_waktu,
      data.t4_peserta,
      data.t4_jumlah_peserta,
      data.t4_narasumber,
      data.t4_output,
      data.t4_alasan_lokasi,
      '*akun yang diperkenankan: Belanja Bahan, Narasumber, Transport Lokal, Perjalanan Dinas Paket Meeting'
    );

    // Anggaran yang dibutuhkan
    p7y -= 12;
    const formattedAnggaran = formatRupiah(data.anggaran_output || '185000000');
    const terbilangAnggaran = angkaKeTerbilang(Number(data.anggaran_output || 185000000));
    const anggaranText = `Anggaran yang dibutuhkan untuk menghasilkan output ini adalah sebesar ${formattedAnggaran} (${terbilangAnggaran} Rupiah).`;
    drawP7Para(anggaranText, fsRegular, lhRegular, 10);

    // 2.2 RAK 2
    const rak2Title = `2.2 RAK 2: Peningkatan Aksesibilitas dan Layanan Pendukung Bagi Lansia dan Disabilitas`;
    const rak2Size = fontBold.widthOfTextAtSize(rak2Title, 9.3) > 430 ? 8.8 : 9.3;
    p7.drawText(rak2Title, {
      x: 95,
      y: p7y,
      size: rak2Size,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p7y -= 13;

    // 2.2.1 Sub Komponen 052
    const subkomp2Title = `2.2.1 Sub Komponen 052 Sinkronisasi, Koordinasi dan Pengendalian Bidang ${data.urusan_bidang || data.fungsi_deputi_bidang || 'Pemberdayaan Disabilitas dan Lanjut Usia'}`;
    const subkomp2Size = fontBold.widthOfTextAtSize(subkomp2Title, 9.3) > 430 ? 8.8 : 9.3;
    p7.drawText(subkomp2Title, {
      x: 95,
      y: p7y,
      size: subkomp2Size,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    p7y -= 13;

    p7.drawText('Dan seterusnya', {
      x: 95,
      y: p7y,
      size: 9.0,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // ==========================================
  // HALAMAN 8 (Header Jadwal & Tabel Jadwal 12 Bulan)
  // ==========================================
  {
    const p8 = pages[7];

    // Bersihkan area atas halaman 8 (di atas D. Waktu Pencapaian Keluaran)
    p8.drawRectangle({
      x: 65,
      y: 245,
      width: 475,
      height: 535,
      color: rgb(1, 1, 1),
    });

    // Header RAK 1 pada tabel jadwal halaman 8 (hanya tutup titik-titik setelah RAK)
    p8.drawRectangle({
      x: 129,
      y: 118,
      width: 25,
      height: 14,
      color: rgb(1, 1, 1),
    });
    p8.drawText(` 1`, {
      x: 129,
      y: 121,
      size: 9.5,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Matriks bulan aktif RAK 1 pada tabel jadwal halaman 8 (y=134.78 to 158.03)
    const sk1 = data.schedule_subkomponen_1;
    for (let m = 0; m < 12; m++) {
      const isAnyActive =
        Boolean(sk1?.identifikasi?.[m]) ||
        Boolean(sk1?.sinkronisasi?.[m]) ||
        Boolean(sk1?.monitoring?.[m]) ||
        Boolean(sk1?.rekomendasi?.[m]);
      colorMonthCell(p8, m, 134.78, 158.03, isAnyActive);
    }
  }

  // ==========================================
  // HALAMAN 9 (Matriks Jadwal 12 Bulan & Biaya & TTD)
  // ==========================================
  {
    const p9 = pages[8];

    // Matriks Subkomponen 1
    const sk1 = data.schedule_subkomponen_1;
    for (let m = 0; m < 12; m++) {
      colorMonthCell(p9, m, 644.75, 687.5, Boolean(sk1?.identifikasi?.[m]));
      colorMonthCell(p9, m, 583.25, 644.75, Boolean(sk1?.sinkronisasi?.[m]));
      colorMonthCell(p9, m, 540.5, 583.25, Boolean(sk1?.monitoring?.[m]));
      colorMonthCell(p9, m, 497.75, 540.5, Boolean(sk1?.rekomendasi?.[m]));
    }

    // Matriks Subkomponen 2
    const sk2 = data.schedule_subkomponen_2;
    for (let m = 0; m < 12; m++) {
      colorMonthCell(p9, m, 431.0, 473.75, Boolean(sk2?.identifikasi?.[m]));
      colorMonthCell(p9, m, 369.5, 431.0, Boolean(sk2?.sinkronisasi?.[m]));
      colorMonthCell(p9, m, 326.75, 369.5, Boolean(sk2?.monitoring?.[m]));
      colorMonthCell(p9, m, 284.0, 326.75, Boolean(sk2?.rekomendasi?.[m]));
    }

    // D. BIAYA YANG DIBUTUHKAN
    // Cleanly re-render the two narrative lines to completely eliminate collisions and yellow highlight
    const nominalAnggaran = data.biaya_total_nominal || data.anggaran_output || '185000000';
    const terbilangText =
      data.biaya_total_terbilang ||
      `${formatRupiah(nominalAnggaran)},- (${angkaKeTerbilang(nominalAnggaran)})`;

    const biayaSentence =
      `Asisten Deputi ${data.biaya_asdep || data.asisten_deputi || '……'} pada Tahun Anggaran ${data.biaya_tahun || data.tahun_anggaran || '2026'} untuk menghasilkan ${data.biaya_volume || data.volume_ro || '1'} output memerlukan anggaran sebesar ${terbilangText}.`;

    maskAndDrawMultiline(p9, fontRegular, biayaSentence, {
      maskX: 72,
      maskY: 205,
      maskW: 455,
      maskH: 34,
      fontSize: 9.5,
      lineHeight: 14,
    });

    // Pengesahan
    // Jakarta, ……
    maskAndDrawText(p9, fontRegular, `Jakarta, ${data.ttd_tanggal || '15 Januari 2026'}`, {
      maskX: 356,
      maskY: 189,
      maskW: 187,
      maskH: 15,
      fontSize: 10,
    });

    // Asisten Deputi ……,
    maskAndDrawText(p9, fontRegular, `Asisten Deputi ${data.ttd_asdep || data.asisten_deputi || '……'},`, {
      maskX: 356,
      maskY: 174,
      maskW: 187,
      maskH: 15,
      fontSize: 10,
    });

    // Nama Pejabat TTD (Bold)
    maskAndDrawText(p9, fontBold, data.ttd_nama || '……', {
      maskX: 356,
      maskY: 103,
      maskW: 187,
      maskH: 15,
      fontSize: 10,
    });

    // NIP ……
    maskAndDrawText(p9, fontRegular, `NIP ${data.ttd_nip || '……'}`, {
      maskX: 356,
      maskY: 78,
      maskW: 187,
      maskH: 15,
      fontSize: 10,
    });
  }

  // ==========================================
  // HALAMAN 10 (Lampiran I: Gender Analysis Pathway)
  // ==========================================
  // Bagian tabel Lampiran I dibiarkan utuh sesuai format template resmi Kemenko PMK.

  // ==========================================
  // HALAMAN 11 (Lampiran II: Manajemen Risiko)
  // ==========================================
  // Bagian tabel Lampiran II dibiarkan utuh sesuai format template resmi Kemenko PMK.
  // Pages 10, 11, 12, dan 13 merupakan materi acuan/pedoman resmi dari template.

  const finalPdfBytes = await pdfDoc.save();
  return finalPdfBytes;
}

/**
 * Helper to trigger browser download of the generated PDF
 */
export function downloadKAKPdf(pdfBytes: Uint8Array, fileName?: string): void {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'KAK-Hasil-Pengisian.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const generatePdf = generateKAKPdf;

