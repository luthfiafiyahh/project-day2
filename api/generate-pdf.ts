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

  const converterUrl = process.env.CONVERTER_API_URL || process.env.LIBREOFFICE_API_URL;
  if (converterUrl) {
    try {
      const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const response = await fetch(converterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({ error: `Converter error: ${text}` });
      }

      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'application/pdf');
      return res.status(200).send(Buffer.from(buffer));
    } catch (err: any) {
      console.error('Remote converter error:', err);
      return res.status(502).json({ error: `Gagal menghubungi remote converter: ${err.message}` });
    }
  }

  return res.status(503).json({
    error:
      'Layanan konversi PDF LibreOffice membutuhkan backend engine. Di localhost (komputer lokal) layanan ini otomatis aktif menggunakan LibreOffice lokal. Untuk Vercel production, silakan hubungkan CONVERTER_API_URL ke microservice Docker converter.',
  });
}
