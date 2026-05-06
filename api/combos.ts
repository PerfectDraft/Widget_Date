const NVIDIA_API = 'https://integrate.api.nvidia.com/v1/chat/completions';

async function callNvidia(apiKey: string, model: string, messages: any[]) {
  const response = await fetch(NVIDIA_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, max_tokens: 4096, temperature: 0.7, stream: false }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`[${model}] ${response.status}: ${errBody}`);
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

  const model = process.env.NVIDIA_MODEL || 'mistralai/mistral-nemotron';

  const { location, preferences, budget, weather, startTime, endTime, companion } = req.body;

  const systemPrompt = `Trợ lý lên kế hoạch hẹn hò Hà Nội. Trả về JSON array 3 combo:
[{"id":string,"theme":string,"icon":string,"score":number,"totalCost":number,"activities":[{"time":"HH:MM","name":string,"address":string,"cost":number,"lat":number,"lng":number,"category":string}]}]
Chỉ JSON thuần, không markdown.
QUAN TRỌNG: Trường "time" của mỗi activity PHẢI nằm trong khung giờ người dùng đã chọn. Không được đặt giờ ngoài khoảng đó.`;

  const resolvedStart = startTime || '18:00';
  const resolvedEnd = endTime || '22:00';
  const resolvedCompanion = companion || 'Người yêu';

  const userMsg = `3 combo hẹn hò tại ${location || 'Hà Nội'}, sở thích: ${(preferences || []).join(', ') || 'Café, Ẩm thực'}, ngân sách: ${budget || '500000'}VND, thời tiết: ${weather || 'bình thường'}, đi cùng: ${resolvedCompanion}. Thời gian hẹn hò: từ ${resolvedStart} đến ${resolvedEnd}. Mỗi activity phải có "time" nằm trong khoảng thời gian này. Mỗi combo 2-3 hoạt động.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMsg },
  ];

  try {
    console.log(`[combos] Trying model: ${model}`);
    const data = await callNvidia(apiKey, model, messages);
    let content = data.choices?.[0]?.message?.content || '[]';
    content = content.replace(/^```[\w]*\n?/i, '').replace(/\n?```$/i, '').trim();

    let combos;
    try {
      const parsed = JSON.parse(content);
      combos = Array.isArray(parsed) ? parsed : (parsed.combos || parsed.data || []);
    } catch {
      combos = [];
    }

    console.log(`[combos] Success with model: ${model}`);
    return res.json({ combos, model_used: model });
  } catch (err: any) {
    console.error(`[combos] Failed:`, err.message);
    return res.status(502).json({ error: 'AI service unavailable', details: err.message });
  }
}
