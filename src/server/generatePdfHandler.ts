import { renderKAKDocxBuffer } from './pdfService.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const docxBuf = await renderKAKDocxBuffer(data);

    const customConverter = process.env.CONVERTER_API_URL || process.env.LIBREOFFICE_API_URL;
    const converterEndpoint = customConverter || 'https://demo.gotenberg.dev/forms/libreoffice/convert';

    const formData = new FormData();
    const uint8 = new Uint8Array(docxBuf);
    const blob = new Blob([uint8], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    formData.append('files', blob, 'kak_document.docx');

    const convertRes = await fetch(converterEndpoint, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(45000),
    });

    if (!convertRes.ok) {
      const errText = await convertRes.text();
      throw new Error(`Gagal konversi ke PDF (${convertRes.status}): ${errText}`);
    }

    const pdfArrayBuffer = await convertRes.arrayBuffer();
    res.setHeader('Content-Type', 'application/pdf');
    return res.status(200).send(Buffer.from(pdfArrayBuffer));
  } catch (err: any) {
    console.error('API /api/generate-pdf error:', err);
    return res.status(500).json({ error: err.message || 'Gagal memproses dokumen PDF' });
  }
}
