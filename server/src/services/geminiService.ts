import { env } from '../config/env.js';

// --- Types ---

export interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  lat: number;
  lng: number;
  type: string;
  websiteUri?: string;
  mapsUri?: string;
  distance?: number;
}

export interface ExploreResult {
  userLocation: { lat: number; lng: number };
  places: Place[];
}

export interface ComboParams {
  location: string;
  budget: string;
  companion: string;
  startTime: string;
  endTime: string;
  preferences: string[];
  availablePlaces?: string;
}

export interface Activity {
  time: string;
  name: string;
  address?: string;
  cost: number;
  distance?: string;
  lat?: number;
  lng?: number;
  websiteUri?: string;
}

export interface Combo {
  id: string;
  theme: string;
  icon: string;
  totalCost: number;
  score: number;
  activities: Activity[];
}

// --- OpenRouter API Helper ---

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callOpenRouter(
  messages: OpenRouterMessage[],
  temperature = 0.7
): Promise<string> {
  const models = [env.OPENROUTER_MODEL, ...env.OPENROUTER_FALLBACK_MODELS];
  let lastError = '';

  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': env.CLIENT_ORIGIN,
          'X-Title': 'Widget Date',
        },
        body: JSON.stringify({ model, messages, temperature }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.warn(`[OpenRouter] Model "${model}" → ${res.status}`);
        console.warn(`[OpenRouter] Model "${model}" error:`, errorBody);
        lastError = `OpenRouter ${res.status}: ${errorBody}`;
        continue; // try next model for ANY error
      }

      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = data.choices?.[0]?.message?.content || '';

      if (content) {
        if (model !== env.OPENROUTER_MODEL) {
          console.info(`[OpenRouter] ✅ Fallback success with "${model}"`);
        }
        return content;
      }
    } catch (e: any) {
      console.warn(`[OpenRouter] Model "${model}" error:`, e.message);
      lastError = e.message;
    }
  }

  throw new Error(`All models exhausted. Last error: ${lastError}`);
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced?.[1]) return fenced[1].trim();
  return text.trim();
}

// --- Service Functions ---

export async function fetchNearbyPlaces(userLocation: string): Promise<ExploreResult> {
  const prompt = `
I am currently at: "${userLocation}".
First, determine the latitude and longitude of my location.
Then, find EXACTLY 15 REAL places (cafes, restaurants, or attractions) near my location. Include a rich and diverse mix.
For each place, provide its exact real name, real address, real rating, real latitude/longitude.
Also, provide the real Google Maps URI for the place.

Return ONLY a valid JSON object inside a \`\`\`json block with this exact structure:
{
  "userLocation": { "lat": number, "lng": number },
  "places": [
    {
      "id": "string (unique)",
      "name": "string (real name)",
      "address": "string",
      "rating": number,
      "lat": number,
      "lng": number,
      "type": "string",
      "websiteUri": "string",
      "mapsUri": "string"
    }
  ]
}
CRITICAL: ENSURE ALL DOUBLE QUOTES INSIDE STRINGS ARE ESCAPED (e.g. \\"). NO TRAILING COMMAS.
`;

  const text = await callOpenRouter([{ role: 'user', content: prompt }]);
  const jsonStr = extractJson(text);
  return JSON.parse(jsonStr) as ExploreResult;
}

export async function generateCombos(params: ComboParams): Promise<Combo[]> {
  const prompt = `
I want to plan an authentic date/outing at: "${params.location}".
Budget: "${params.budget}".
Companion: "${params.companion}".
Time available: from ${params.startTime} to ${params.endTime}.
Preferences: ${params.preferences.join(', ')}.

CRITICAL INSTRUCTIONS:
1. ${params.availablePlaces ? `Here is a curated list of REAL places. YOU MUST PRIORITIZE picking places from this list whenever possible to build your combos:\n${params.availablePlaces}` : 'Find REAL places on Google Maps. Ensure they ACTUALLY EXIST. Do NOT hallucinate names.'}

2. Provide the EXACT real name and address so it can be queried directly on Maps.
3. Prices must be highly accurate and realistic to the current menu prices or entry fees.

Generate EXACTLY 5 distinct itinerary options (Combos) to give maximum variety. Each Combo should have a unique theme (e.g., Romantic, Fun, Mysterious, Active).
For each Combo:
- "theme": A short catchy theme name in Vietnamese (e.g., Lãng Mạn, Năng Động...).
- "score": A specific rating from 7 to 10 on how well it fits.
- "totalCost": Estimated total cost in VND for all activities (number only, e.g. 500000).
- "activities": An array of activities. For each activity, include:
  - "time": Start time of the activity (e.g., "18:00").
  - "name": REAL name of the place from Google Maps.
  - "cost": Estimated cost in VND for this specific activity (number, 0 if free).
  - "distance": Estimated distance string (e.g., "1.2 km").
  - "lat": Real latitude of the place.
  - "lng": Real longitude of the place.

Return ONLY a valid JSON array of combos inside a \`\`\`json block. The structure MUST BE an array of this object:
[
  {
    "id": "c1",
    "theme": "string",
    "icon": "string",
    "totalCost": number,
    "score": number,
    "activities": [
      {
        "time": "string",
        "name": "string",
        "address": "string",
        "cost": number,
        "distance": "string",
        "lat": number,
        "lng": number,
        "websiteUri": "string"
      }
    ]
  }
]
CRITICAL RULES FOR JSON: 
1. DO NOT include trailing commas. 
2. ESCAPE ALL double quotes inside strings (e.g., "name": "Quán \\"ABC\\""). 
3. DO NOT output any extra markdown text outside the valid JSON array.
`;

  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const text = await callOpenRouter([{ role: 'user', content: prompt }]);
      const jsonStr = extractJson(text);

      // Try parsing as array first from extracted block
      let parsedResult;
      const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (arrayMatch?.[0]) {
        parsedResult = JSON.parse(arrayMatch[0]);
      } else {
        parsedResult = JSON.parse(jsonStr);
      }

      if (!Array.isArray(parsedResult)) {
        throw new Error('Response is not an array.');
      }

      parsedResult.forEach((combo: Combo, idx: number) => {
        combo.id = `live-combo-${idx}-${Date.now()}`;
      });

      return parsedResult as Combo[];
    } catch (e: any) {
      console.warn(`[API Retry ${attempt}/${MAX_RETRIES}] Error:`, e.message);

      if (attempt === MAX_RETRIES) {
        throw new Error(`AI generation failed after ${MAX_RETRIES + 1} attempts: ${e.message}`);
      }

      const is503 = e.message?.includes('503') || e.message?.includes('UNAVAILABLE');
      const sleepMs = is503 ? 5000 * (attempt + 1) : 1500 * (attempt + 1);
      await new Promise(resolve => setTimeout(resolve, sleepMs));
    }
  }

  throw new Error('All retries failed');
}

export async function chatWithAI(
  history: { role: string; text: string }[],
  message: string
): Promise<string> {
  const systemInstruction =
    'Bạn là AI Trợ lý Hẹn hò tinh tế và hài hước của Widget Date. Nhiệm vụ tư vấn chi tiết các điểm đi chơi, review quán xá ở Việt Nam. Rất thân thiện, dùng icon dễ thương và chia lịch trình ra từng gạch đầu dòng rõ ràng, mạch lạc.';

  const recentHistory = history.slice(-5);
  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemInstruction },
    ...recentHistory.map(msg => ({
      role: (msg.role === 'model' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: msg.text,
    })),
    { role: 'user', content: message },
  ];

  try {
    const text = await callOpenRouter(messages, 0.8);
    return text || 'Mình bị rớt mạng rồi, bạn thử lại sau nhe!!';
  } catch (e: any) {
    console.error('Chat error:', e);

    const isRateLimit = e?.message?.includes('429');
    if (isRateLimit) {
      const offlineReplies = [
        'Đằng ấy ơi, bộ não AI của mình đang xử lý quá tải thông tin (nhiều cặp đôi hỏi quá 😅). Đằng ấy chờ 1 lát rồi hỏi lại mình nhé 💖',
        'Ôi hệ thống mình đang nóng ran vì vắt óc suy nghĩ ý tưởng hẹn hò cho bạn! Đằng ấy chờ 1 lát rồi hỏi lại mình nhé 💖',
        'Mình dùng trí tuệ năng lực quá độ nên bị kiệt sức xíu. Bấm lại nút Gửi sau vài phút nghen.',
      ];
      return offlineReplies[Math.floor(Math.random() * offlineReplies.length)];
    }

    throw new Error(`Chat failed: ${e.message}`);
  }
}
