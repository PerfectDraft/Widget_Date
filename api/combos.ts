const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' });

  const { location, preferences, budget, weather } = req.body;

  const systemPrompt = `Bạn là trợ lý AI lên kế hoạch hẹn hò tại Hà Nội, Việt Nam. 
Trả về JSON array gồm 3 combo hẹn hò theo format:
[{
  "id": string (uuid ngắn),
  "theme": string (tên combo),
  "icon": string (material symbol icon name),
  "score": number (1-10),
  "totalCost": number (VND),
  "activities": [{
    "time": string ("HH:MM"),
    "name": string,
    "address": string,
    "cost": number,
    "lat": number,
    "lng": number,
    "category": string
  }]
}]
Chỉ trả JSON thuần túy (raw JSON array), không giải thích, không markdown, không code block.`;

  const userMsg = `Tạo 3 combo hẹn hò tại ${location || 'Hà Nội'}.
Sở thích: ${(preferences || []).join(', ') || 'Café, Ẩm thực'}.
Ngân sách: ${budget || '500000'} VND/người.
Thời tiết hôm nay: ${weather || 'bình thường'}.`;

  try {
    const response = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://widget-date-client.vercel.app',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMsg },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter error:', err);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '[]';

    content = content.replace(/^```[\w]*\n?/i, '').replace(/\n?```$/i, '').trim();

    let combos;
    try {
      const parsed = JSON.parse(content);
      combos = Array.isArray(parsed) ? parsed : (parsed.combos || parsed.data || []);
    } catch {
      combos = [];
    }
    return res.json({ combos });
  } catch (err) {
    console.error('Combos error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
