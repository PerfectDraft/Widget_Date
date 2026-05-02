const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' });

  const { history, message } = req.body;
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message string required' });
  }
  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'history array required' });
  }

  const systemPrompt = `Bạn là trợ lý AI hẹn hò thông minh tên "Date AI", chuyên tư vấn địa điểm hẹn hò tại Hà Nội, Việt Nam.
Bạn thân thiện, vui vẻ, hiểu tâm lý cặp đôi. Trả lời ngắn gọn, súc tích bằng tiếng Việt.
Khi đề xuất địa điểm, cố gắng cung cấp tên thực, địa chỉ và giá ước tính.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m: any) => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.text,
    })),
    { role: 'user', content: message },
  ];

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
        messages,
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Xin lỗi, mình không hiểu. Bạn có thể nói lại không?';
    return res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
