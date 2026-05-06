const NVIDIA_API = 'https://integrate.api.nvidia.com/v1/chat/completions';

async function callNvidia(apiKey: string, model: string, messages: any[]) {
  const response = await fetch(NVIDIA_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, max_tokens: 2048, temperature: 0.8, stream: false }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`NVIDIA [${model}] ${response.status}: ${errBody}`);
  }

  return response.json();
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing NVIDIA_API_KEY' });

  const model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-mini-4b-instruct';

  const { history, message } = req.body;
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'message string required' });
  }
  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'history array required' });
  }

  const systemPrompt = `Bạn là trợ lý AI hẹn hò thông minh tên "Date AI", chuyên tư vấn địa điểm hẹn hò tại Hà Nội, Việt Nam.\nBạn thân thiện, vui vẻ, hiểu tâm lý cặp đôi. Trả lời ngắn gọn, súc tích bằng tiếng Việt.\nKhi đề xuất địa điểm, cố gắng cung cấp tên thực, địa chỉ và giá ước tính.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m: any) => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.text,
    })),
    { role: 'user', content: message },
  ];

  try {
    console.log(`[chat] Trying model: ${model}`);
    const data = await callNvidia(apiKey, model, messages);
    const reply = data.choices?.[0]?.message?.content || 'Xin lỗi, mình không hiểu. Bạn có thể nói lại không?';
    console.log(`[chat] Success with model: ${model}`);
    return res.json({ reply, model_used: model });
  } catch (err: any) {
    console.error(`[chat] Failed:`, err.message);
    return res.status(502).json({ error: 'AI service unavailable', details: err.message });
  }
}
