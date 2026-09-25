export default async function handler(req: any, res: any) {
  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const response = await fetch('https://ukisai.com/api/swift/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer none',
      },
      body: payload,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Vercel Serverless Chat Proxy Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch AI response' });
  }
}
