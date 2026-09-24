import type { KAKData } from '../../types/kak';

/**
 * Membuat Dokumen Word (.docx) Resmi dari Data KAK
 * Menggunakan template resmi Kemenko PMK melalui docxtemplater.
 */
export async function generateKAKDocx(data: KAKData): Promise<Blob> {
  const response = await fetch('/api/generate-docx', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Gagal membuat dokumen Word (${response.status} ${response.statusText})`;
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

  const blob = await response.blob();
  return blob;
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
