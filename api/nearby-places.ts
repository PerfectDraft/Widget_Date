const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' });

  const { lat, lng, category, query } = req.body;

  const prompt = `Gợi ý 6 địa điểm ${category || ''} gần tọa độ (${lat}, ${lng}) tại Hà Nội.
${query ? `Yêu cầu thêm: ${query}` : ''}
Trả về JSON array:
[{"id":string,"name":string,"address":string,"category":string,"price":number,"lat":number,"lng":number,"description":string,"rating":number,"imageUrl":string}]
Chỉ trả JSON.`;

  try {
    const response = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://widget-date-client.vercel.app',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) return res.status(502).json({ error: 'AI service error' });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    let places;
    try {
      const parsed = JSON.parse(content);
      places = Array.isArray(parsed) ? parsed : (parsed.places || parsed.data || []);
    } catch {
      places = [];
    }
    return res.json({ places });
  } catch (err) {
    console.error('Nearby places error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
