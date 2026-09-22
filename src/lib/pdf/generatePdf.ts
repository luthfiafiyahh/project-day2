import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import type { KAKData, RiskItem } from '../../types/kak';
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
    const fsSize = 9.2;
    const lh = 13.5;
    let currY = 760;

    function drawP3Para(text: string, size = fsSize, lineH = lh, spaceAfter = 7) {
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
    drawP3Para(rpjmnText, fsSize, lh, 5);

    // 2. Indikator RPJMN list
    if (data.indikator_rpjmn_list) {
      drawP3Para(data.indikator_rpjmn_list, fsSize, lh, 7);
    }

    // 3. Renstra sentence (Restored without omission)
    const renstraText =
      `Adapun program dan indikator lainnya merujuk renstra Kemenko PMK ${data.renstra_periode || '2025-2029'} yang telah ditetapkan penjelasan prioritas lainnya yang merupakan mandat peraturan ("Indikator yang diampu melalui RO xxx dan telah tercantum dalam Perjanjian Kinerja") yaitu ……`;
    drawP3Para(renstraText, fsSize, lh, 7);

    // 4. Gap analysis (Clean flow without instructional remnants)
    const gapText =
      `Data terbaru terkait program ${data.kegiatan_nama || data.asdep_program_kerja || data.asisten_deputi || '……'} menyatakan bahwa ${data.gap_analysis_narasi || '……'}`;
    drawP3Para(gapText, fsSize, lh, 7);

    // 5. Program prioritas lainnya
    const progPrioText =
      `Asisten Deputi ${data.program_prioritas_deputi || data.asisten_deputi || '……'} memiliki program prioritas lainnya yang harus dikoordinasikan yaitu ${data.program_prioritas_uraian || '……'}.`;
    drawP3Para(progPrioText, fsSize, lh, 7);

    // 6. Output intro
    const outputIntro =
      `Berdasarkan penjelasan di atas maka terkait dengan tugas dan fungsi Asisten Deputi ${data.ro_rencana_asdep || data.asisten_deputi || '……'} , output yang akan dihasilkan pada rencana kerja tahun anggaran ${data.tahun_anggaran || '2026'} adalah:`;
    drawP3Para(outputIntro, fsSize, lh, 5);

    // 7. RO list
    if (data.ro_1_fokus_tujuan) {
      drawP3Para(`1) ${data.ro_1_fokus_tujuan}`, fsSize, lh, 4);
    }
    if (data.ro_2_fokus_tujuan) {
      drawP3Para(`2) ${data.ro_2_fokus_tujuan}`, fsSize, lh, 4);
    }
    if (data.ro_3_fokus_tujuan) {
      drawP3Para(`3) ${data.ro_3_fokus_tujuan}`, fsSize, lh, 4);
    }
  }

  // ==========================================
  // HALAMAN 4 (RB, PUG, MR, Penerima Manfaat)
  // ==========================================
  {
    const p4 = pages[3];

    // RB Asdep
    maskAndDrawText(p4, fontRegular, data.rb_asdep || data.asisten_deputi || '', {
      maskX: 429,
      maskY: 730,
      maskW: 95,
      maskH: 15,
      fontSize: 9.5,
    });

    // Mask yellow guide prompt in RB header without clipping 'yaitu'
    p4.drawRectangle({
      x: 283,
      y: 711,
      width: 245,
      height: 16,
      color: rgb(1, 1, 1),
    });
    p4.drawText(':', {
      x: 281.5,
      y: 713.5,
      size: 9.5,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });

    // Narasi Indikator RB (mask the yellow box and guide points)
    if (data.rb_indikator_list) {
      maskAndDrawMultiline(p4, fontRegular, data.rb_indikator_list, {
        maskX: 92,
        maskY: 540,
        maskW: 435,
        maskH: 172,
        fontSize: 9.2,
        lineHeight: 13.5,
      });
    }

    // 2.3 Pengarusutamaan Gender (PUG) - unified clean narrative, no overlap!
    p4.drawRectangle({
      x: 90,
      y: 348,
      width: 440,
      height: 170,
      color: rgb(1, 1, 1),
    });

    const pugNarrative =
      `Asisten Deputi ${data.pug_asdep_1 || data.asisten_deputi || '……'} telah mengintegrasikan perspektif gender dalam pelaksanaan program dan kegiatan melalui penerapan Anggaran Responsif Gender (ARG) dan penyusunan Gender Analysis Pathway (GAP). ` +
      `Berdasarkan hasil analisis gender, masih terdapat kesenjangan dalam pelaksanaan kebijakan bidang ${data.pug_bidang || '……'}, antara lain ${data.pug_kesenjangan || '……'} yang dipengaruhi oleh faktor ${data.pug_faktor || '……'}. ` +
      `Untuk mengatasi kesenjangan tersebut, Kemenko PMK melalui Asisten Deputi ${data.pug_asdep_2 || data.asisten_deputi || '……'} melakukan intervensi melalui ${data.pug_intervensi || '……'}. ` +
      `Diharapkan program dan kegiatan yang dilaksanakan dapat mendukung terwujudnya pembangunan manusia dan kebudayaan yang inklusif dan tepat sasaran. GAP secara lebih rinci dituangkan dalam matriks sebagaimana dimuat dalam lampiran KAK ini.`;

    const pugLines = wrapText(pugNarrative, fontRegular, 9.2, 435);
    let p4y = 512;
    for (const line of pugLines) {
      p4.drawText(line, {
        x: 92,
        y: p4y,
        size: 9.2,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      p4y -= 13.5;
    }

    // 2.4 Manajemen Risiko - clean narrative, no leftover yellow instructions
    p4.drawRectangle({
      x: 90,
      y: 185,
      width: 440,
      height: 132,
      color: rgb(1, 1, 1),
    });

    const mrNarrative =
      `Dalam memastikan tercapainya output dan memaksimalkan dampak positif program, perlu dilakukan manajemen risiko untuk mencegah kegagalan, melindungi sumber daya, dan ketepatan waktu pencapaian target serta efektivitas anggaran. ` +
      `Risiko yang ada dalam pelaksanaan program pada Asisten Deputi ${data.mr_asdep || data.asisten_deputi || '……'} yang perlu dikendalikan melalui penguatan koordinasi lintas sektor, monitoring dan evaluasi, serta penegasan peran dan tanggung jawab stakeholder. ` +
      `Matriks profil risiko terlampir pada lampiran 2 KAK ini.`;

    const mrLines = wrapText(mrNarrative, fontRegular, 9.2, 435);
    let mry = 312;
    for (const line of mrLines) {
      p4.drawText(line, {
        x: 92,
        y: mry,
        size: 9.2,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      mry -= 13.5;
    }

    // Penerima Manfaat
    maskAndDrawText(p4, fontRegular, data.manfaat_internal || '', {
      maskX: 109,
      maskY: 105,
      maskW: 415,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p4, fontRegular, data.manfaat_eksternal || '', {
      maskX: 109,
      maskY: 80,
      maskW: 415,
      maskH: 15,
      fontSize: 9.5,
    });
  }

  // ==========================================
  // HALAMAN 5 (Penerima Manfaat Lanjutan, RAK, Tahap 1)
  // ==========================================
  {
    const p5 = pages[4];

    // Penerima Manfaat Lainnya
    maskAndDrawText(p5, fontRegular, data.manfaat_lainnya || '', {
      maskX: 109,
      maskY: 755,
      maskW: 415,
      maskH: 15,
      fontSize: 9.5,
    });

    // Volume output
    maskAndDrawText(p5, fontRegular, data.metode_volume || data.volume_ro || '1', {
      maskX: 392,
      maskY: 598,
      maskW: 25,
      maskH: 15,
      fontSize: 9.5,
    });

    // RAK 1, 2, 3
    maskAndDrawText(p5, fontRegular, data.metode_rak1 || 'Swakelola', {
      maskX: 113,
      maskY: 554,
      maskW: 400,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p5, fontRegular, data.metode_rak2 || '', {
      maskX: 92,
      maskY: 535,
      maskW: 400,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p5, fontRegular, data.metode_rak3 || '', {
      maskX: 92,
      maskY: 516,
      maskW: 400,
      maskH: 15,
      fontSize: 9.5,
    });

    // Tahun tahapan
    maskAndDrawText(p5, fontRegular, data.tahapan_tahun || data.tahun_anggaran || '2026', {
      maskX: 431,
      maskY: 459,
      maskW: 30,
      maskH: 15,
      fontSize: 9.5,
    });

    // Pendahuluan Tahap 1 (Identifikasi Permasalahan)
    // Mask out the instruction line and sample box cleanly
    if (data.t1_pendahuluan) {
      maskAndDrawMultiline(p5, fontRegular, data.t1_pendahuluan, {
        maskX: 114,
        maskY: 150,
        maskW: 412,
        maskH: 236,
        fontSize: 9.2,
        lineHeight: 13.5,
      });
    }

    // Judul Rapat Tahap 1
    maskAndDrawText(p5, fontRegular, data.t1_kegiatan_judul || '1. Rapat Koordinasi Identifikasi Permasalahan', {
      maskX: 110,
      maskY: 74,
      maskW: 415,
      maskH: 15,
      fontSize: 9.5,
    });
  }

  // ==========================================
  // HALAMAN 6 (Tahap 1 Detail & Tahap 2 Sinkronisasi)
  // ==========================================
  {
    const p6 = pages[5];

    // Tahap 1: Identifikasi Permasalahan
    maskAndDrawText(p6, fontRegular, `Lokasi : ${data.t1_lokasi || 'DKI Jakarta'}`, {
      maskX: 148,
      maskY: 755,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p6, fontRegular, `Waktu : ${data.t1_waktu || 'Tahun 2026'}`, {
      maskX: 148,
      maskY: 740,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p6, fontRegular, `Peserta : ${data.t1_peserta || 'K/L terkait'}`, {
      maskX: 148,
      maskY: 726,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p6, fontRegular, data.t1_jumlah_peserta || '30', {
      maskX: 244,
      maskY: 711,
      maskW: 35,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p6, fontRegular, `Narasumber : ${data.t1_narasumber || 'Ada'}`, {
      maskX: 148,
      maskY: 697,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });

    if (data.t1_output) {
      maskAndDrawMultiline(p6, fontRegular, data.t1_output, {
        maskX: 148,
        maskY: 610,
        maskW: 375,
        maskH: 60,
        fontSize: 9.2,
        lineHeight: 13,
      });
    }

    maskAndDrawTableCell(p6, fontRegular, `Alasan pemilihan lokasi : ${data.t1_alasan_lokasi || '-'}`, {
      maskX: 135,
      maskY: 590,
      maskW: 395,
      maskH: 22,
      fontSize: 8.5,
    });

    // Tahap 2: Sinkronisasi, Koordinasi & Pengendalian
    if (data.t2_pendahuluan) {
      maskAndDrawMultiline(p6, fontRegular, data.t2_pendahuluan, {
        maskX: 114,
        maskY: 318,
        maskW: 412,
        maskH: 175,
        fontSize: 9.2,
        lineHeight: 13.5,
      });
    }

    maskAndDrawText(p6, fontRegular, `Lokasi : ${data.t2_lokasi || 'DKI Jakarta'}`, {
      maskX: 148,
      maskY: 227,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p6, fontRegular, `Waktu : ${data.t2_waktu || 'Tahun 2026'}`, {
      maskX: 148,
      maskY: 212,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p6, fontRegular, `Peserta : ${data.t2_peserta || 'K/L terkait'}`, {
      maskX: 148,
      maskY: 198,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p6, fontRegular, data.t2_jumlah_peserta || '50', {
      maskX: 244,
      maskY: 183,
      maskW: 35,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p6, fontRegular, `Narasumber : ${data.t2_narasumber || 'Ada'}`, {
      maskX: 148,
      maskY: 169,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });

    if (data.t2_output) {
      maskAndDrawMultiline(p6, fontRegular, data.t2_output, {
        maskX: 148,
        maskY: 110,
        maskW: 375,
        maskH: 60,
        fontSize: 9.2,
        lineHeight: 13,
      });
    }

    maskAndDrawTableCell(p6, fontRegular, `Alasan pemilihan lokasi : ${data.t2_alasan_lokasi || '-'}`, {
      maskX: 135,
      maskY: 90,
      maskW: 395,
      maskH: 22,
      fontSize: 8.5,
    });
  }

  // ==========================================
  // HALAMAN 7 (Tahap 3 Monev & Tahap 4 Rekomendasi Awal)
  // ==========================================
  {
    const p7 = pages[6];

    // Tahap 3: Monitoring dan Evaluasi Pendahuluan
    if (data.t3_pendahuluan) {
      maskAndDrawMultiline(p7, fontRegular, data.t3_pendahuluan, {
        maskX: 114,
        maskY: 507,
        maskW: 412,
        maskH: 150,
        fontSize: 9.2,
        lineHeight: 13.5,
      });
    }

    maskAndDrawText(p7, fontRegular, `Lokasi : ${data.t3_lokasi || 'DKI Jakarta'}`, {
      maskX: 148,
      maskY: 373,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p7, fontRegular, `Waktu : ${data.t3_waktu || 'Tahun 2026'}`, {
      maskX: 148,
      maskY: 358,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p7, fontRegular, `Peserta : ${data.t3_peserta || 'K/L terkait'}`, {
      maskX: 148,
      maskY: 343,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p7, fontRegular, data.t3_jumlah_peserta || '35', {
      maskX: 244,
      maskY: 328,
      maskW: 35,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p7, fontRegular, `Narasumber : ${data.t3_narasumber || 'Ada'}`, {
      maskX: 148,
      maskY: 314,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });

    if (data.t3_output) {
      maskAndDrawMultiline(p7, fontRegular, data.t3_output, {
        maskX: 148,
        maskY: 270,
        maskW: 375,
        maskH: 45,
        fontSize: 9.2,
        lineHeight: 13,
      });
    }

    maskAndDrawTableCell(p7, fontRegular, `Alasan pemilihan lokasi : ${data.t3_alasan_lokasi || '-'}`, {
      maskX: 135,
      maskY: 250,
      maskW: 395,
      maskH: 22,
      fontSize: 8.5,
    });

    // Tahap 4: Penyusunan Rekomendasi Kebijakan Pendahuluan (Awal Hal 7)
    if (data.t4_pendahuluan_p1) {
      maskAndDrawMultiline(p7, fontRegular, data.t4_pendahuluan_p1, {
        maskX: 114,
        maskY: 80,
        maskW: 412,
        maskH: 55,
        fontSize: 9.2,
        lineHeight: 13.5,
      });
    }
  }

  // ==========================================
  // HALAMAN 8 (Tahap 4 Detail & Anggaran & Header Jadwal)
  // ==========================================
  {
    const p8 = pages[7];

    // Tahap 4 Pendahuluan Lanjutan (Hal 8)
    if (data.t4_pendahuluan_p2) {
      maskAndDrawMultiline(p8, fontRegular, data.t4_pendahuluan_p2, {
        maskX: 114,
        maskY: 682,
        maskW: 412,
        maskH: 88,
        fontSize: 9.2,
        lineHeight: 13.5,
      });
    }

    maskAndDrawText(p8, fontRegular, `Lokasi : ${data.t4_lokasi || 'DKI Jakarta'}`, {
      maskX: 148,
      maskY: 548,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p8, fontRegular, `Waktu : ${data.t4_waktu || 'Tahun 2026'}`, {
      maskX: 148,
      maskY: 533,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p8, fontRegular, `Peserta : ${data.t4_peserta || 'K/L terkait'}`, {
      maskX: 148,
      maskY: 519,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p8, fontRegular, data.t4_jumlah_peserta || '40', {
      maskX: 244,
      maskY: 504,
      maskW: 35,
      maskH: 15,
      fontSize: 9.5,
    });
    maskAndDrawText(p8, fontRegular, `Narasumber : ${data.t4_narasumber || 'Ada'}`, {
      maskX: 148,
      maskY: 490,
      maskW: 375,
      maskH: 15,
      fontSize: 9.5,
    });

    if (data.t4_output) {
      maskAndDrawMultiline(p8, fontRegular, data.t4_output, {
        maskX: 148,
        maskY: 431,
        maskW: 375,
        maskH: 60,
        fontSize: 9.2,
        lineHeight: 13,
      });
    }

    maskAndDrawTableCell(p8, fontRegular, `Alasan pemilihan lokasi : ${data.t4_alasan_lokasi || '-'}`, {
      maskX: 135,
      maskY: 411,
      maskW: 395,
      maskH: 22,
      fontSize: 8.5,
    });

    // Anggaran Rp.xxxxx
    const formattedAnggaran = formatRupiah(data.anggaran_output || '185000000');
    maskAndDrawText(p8, fontRegular, formattedAnggaran, {
      maskX: 452,
      maskY: 332,
      maskW: 90,
      maskH: 15,
      fontSize: 9.5,
    });

    // Header RAK 1 pada tabel jadwal halaman 8 (y=134.78 to 158.03)
    const sk1 = data.schedule_subkomponen_1;
    for (let m = 0; m < 12; m++) {
      const isAnyActive =
        (sk1?.identifikasi?.[m] || 0) +
        (sk1?.sinkronisasi?.[m] || 0) +
        (sk1?.monitoring?.[m] || 0) +
        (sk1?.rekomendasi?.[m] || 0) > 0;
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
  {
    const p10 = pages[9];
    const gapHeight = 488;
    const gapY = 199;

    if (data.gap_langkah1) {
      maskAndDrawMultiline(p10, fontRegular, data.gap_langkah1, {
        maskX: 71.5,
        maskY: gapY,
        maskW: 113,
        maskH: gapHeight,
        fontSize: 8,
        lineHeight: 11.5,
      });
    }

    if (data.gap_langkah2) {
      maskAndDrawMultiline(p10, fontRegular, data.gap_langkah2, {
        maskX: 186.5,
        maskY: gapY,
        maskW: 123,
        maskH: gapHeight,
        fontSize: 8,
        lineHeight: 11.5,
      });
    }

    if (data.gap_langkah3) {
      maskAndDrawMultiline(p10, fontRegular, data.gap_langkah3, {
        maskX: 311.5,
        maskY: gapY,
        maskW: 129,
        maskH: gapHeight,
        fontSize: 8,
        lineHeight: 11.5,
      });
    }

    if (data.gap_langkah4) {
      maskAndDrawMultiline(p10, fontRegular, data.gap_langkah4, {
        maskX: 442.5,
        maskY: gapY,
        maskW: 112,
        maskH: gapHeight,
        fontSize: 8,
        lineHeight: 11.5,
      });
    }
  }

  // ==========================================
  // HALAMAN 11 (Lampiran II: Manajemen Risiko)
  // ==========================================
  {
    const p11 = pages[10];

    // Mask yellow highlight on pedoman link at y=515 to 528
    p11.drawRectangle({
      x: 106,
      y: 514,
      width: 300,
      height: 15,
      color: rgb(1, 1, 1),
    });
    p11.drawText('Detail ada pada link https://bit.ly/PedomanBersamaKPMK', {
      x: 107.2,
      y: 517,
      size: 10,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });

    function drawRiskRowOverlay(item: RiskItem, yBottom: number, rowHeight: number) {
      const fontSize = 6.8;
      const lineHeight = 9.2;

      // Mask row interior
      p11.drawRectangle({
        x: 18,
        y: yBottom + 1,
        width: 567,
        height: rowHeight - 2,
        color: rgb(1, 1, 1),
      });

      const cells = [
        { text: item.lingkup || '', x: 18, w: 50 },
        { text: item.peristiwa || '', x: 70, w: 72 },
        { text: `${item.kategori || ''} (${item.kodeKategori || ''})`, x: 144, w: 51 },
        { text: item.penyebab || '', x: 197, w: 63 },
        { text: item.dampak || '', x: 262, w: 56 },
        { text: String(item.lk || '1'), x: 320, w: 17, center: true },
        { text: String(item.ld || '1'), x: 339, w: 18, center: true },
        { text: String(item.br || item.lk * item.ld || '1'), x: 359, w: 19, center: true },
        { text: item.lr || 'Rendah', x: 380, w: 26, center: true },
        { text: item.perlakuan || '', x: 408, w: 78 },
        { text: item.pemilik || '', x: 488, w: 54 },
        { text: item.mitra || '', x: 544, w: 41 },
      ];

      for (const cell of cells) {
        if (cell.center) {
          const tw = fontRegular.widthOfTextAtSize(cell.text, fontSize);
          p11.drawText(cell.text, {
            x: cell.x + (cell.w - tw) / 2,
            y: yBottom + (rowHeight - fontSize) / 2,
            size: fontSize,
            font: fontBold,
            color: rgb(0, 0, 0),
          });
        } else {
          const lines = wrapText(cell.text, fontRegular, fontSize, cell.w - 3);
          let cy = yBottom + rowHeight - lineHeight - 1;
          for (const l of lines.slice(0, 6)) {
            p11.drawText(l, {
              x: cell.x + 1.5,
              y: cy,
              size: fontSize,
              font: fontRegular,
              color: rgb(0, 0, 0),
            });
            cy -= lineHeight;
          }
        }
      }
    }

    if (data.risk_rows?.[0]) drawRiskRowOverlay(data.risk_rows[0], 657, 48);
    if (data.risk_rows?.[1]) drawRiskRowOverlay(data.risk_rows[1], 605, 52);
    if (data.risk_rows?.[2]) drawRiskRowOverlay(data.risk_rows[2], 544, 61);
  }

  // Pages 12 and 13 remain exact copies of template reference material

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

