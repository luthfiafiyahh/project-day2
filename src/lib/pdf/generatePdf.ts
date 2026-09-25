import type { KAKData } from '../../types/kak';

export interface GeneratePdfOptions {
  fileName?: string;
}

/**
 * Menghasilkan PDF resmi KAK menggunakan LibreOffice Headless melalui backend /api/generate-pdf.
 * Alur: template.docx -> docxtemplater -> hasil.docx -> LibreOffice headless -> hasil.pdf
 * Memastikan layout, margin, font Arial, spasi baris, dan tabel 100% presisi sesuai dokumen Word asli.
 */
export async function generateKAKPdf(
  data: KAKData,
  _options: GeneratePdfOptions = {}
): Promise<Uint8Array> {
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const rawText = await response.text();
      try {
        const errJson = JSON.parse(rawText);
        errorDetail = errJson.error || errJson.message || rawText;
      } catch {
        errorDetail = rawText;
      }
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(
      `Gagal membuat PDF (${response.status}): ${errorDetail || 'Layanan konversi LibreOffice tidak merespon.'}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Helper untuk memicu unduhan file PDF di browser
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const generatePdf = generateKAKPdf;
