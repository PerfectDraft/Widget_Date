export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing PEXELS_API_KEY' });

  const { query, page = '1' } = req.query;
  if (!query) return res.status(400).json({ error: 'query param required' });

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query as string)}&per_page=5&page=${page}&orientation=portrait`,
      { headers: { Authorization: apiKey } }
    );

    if (!response.ok) {
      return res.status(502).json({ error: 'Pexels API error' });
    }

    const data = await response.json();
    const photos = (data.photos || []).map((p: any) => ({
      id: p.id,
      url: p.src.medium,       // ~400px wide, fast load
      large: p.src.large2x,   // for modal
      alt: p.alt,
    }));

    // Cache 24h on CDN
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.json({ photos });
  } catch (err) {
    console.error('Pexels error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
