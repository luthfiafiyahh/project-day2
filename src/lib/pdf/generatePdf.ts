import type { KAKData } from '../../types/kak';

export interface GeneratePdfOptions {
  watermark?: string;
  enableDebugBox?: boolean;
}

/**
 * Generate PDF dari data KAK menggunakan template Word resmi (.docx)
 * melalui pipeline: template_kak.docx -> docxtemplater -> LibreOffice Headless -> PDF.
 * Menjamin 100% font, ukuran, margin, spasi, tabel, gambar, dan layout presisi sesuai template asli.
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
    let errorMessage = `Gagal membuat PDF (${response.status} ${response.statusText})`;
    try {
      const errJson = await response.json();
      if (errJson.error) {
        errorMessage = errJson.error;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export const generatePdf = generateKAKPdf;

/**
 * Helper untuk mengunduh dokumen PDF di browser
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
