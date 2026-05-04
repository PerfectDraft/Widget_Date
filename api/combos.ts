const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

const FALLBACK_MODELS = [
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'poolside/laguna-m.1:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'minimax/minimax-m2.5:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'nvidia/nemotron-nano-12b-v2-vl:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'openai/gpt-oss-120b:free',
];

async function callOpenRouter(apiKey: string, model: string, messages: any[]) {
  const response = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://widget-date-client.vercel.app',
    },
    body: JSON.stringify({ model, messages, max_tokens: 800 }),
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

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' });

  const { location, preferences, budget, weather } = req.body;

  const systemPrompt = `Trợ lý lên kế hoạch hẹn hò Hà Nội. Trả về JSON array 3 combo:
[{"id":string,"theme":string,"icon":string,"score":number,"totalCost":number,"activities":[{"time":"HH:MM","name":string,"address":string,"cost":number,"lat":number,"lng":number,"category":string}]}]
Chỉ JSON thuần, không markdown.`;

  const userMsg = `3 combo hẹn hò tại ${location || 'Hà Nội'}, sở thích: ${(preferences || []).join(', ') || 'Café, Ẩm thực'}, ngân sách: ${budget || '500000'}VND, thời tiết: ${weather || 'bình thường'}. Mỗi combo 2-3 hoạt động.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMsg },
  ];

  const primaryModel = process.env.OPENROUTER_MODEL || FALLBACK_MODELS[0];
  const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter(m => m !== primaryModel)];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[combos] Trying model: ${model}`);
      const data = await callOpenRouter(apiKey, model, messages);
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
      console.error(`[combos] Failed model ${model}:`, err.message);
      lastError = err;
    }
  }

  console.error('[combos] All models failed:', lastError?.message);
  return res.status(502).json({ error: 'AI service unavailable', details: lastError?.message });
}
