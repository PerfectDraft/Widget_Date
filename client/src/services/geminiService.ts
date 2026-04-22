import { GoogleGenAI } from "@google/genai";
import { Combo, REAL_LOCATIONS } from '../data';

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

export type AILogEntry = {
  id: string;
  timestamp: string;
  action: string;
  status: 'loading' | 'success' | 'error';
  details?: string;
};

let logListeners: ((logs: AILogEntry[]) => void)[] = [];
export let aiLogs: AILogEntry[] = [];

export const addAILog = (action: string, status: 'loading' | 'success' | 'error', details?: string) => {
  const newLog: AILogEntry = {
    id: Date.now().toString() + Math.random().toString(),
    timestamp: new Date().toLocaleTimeString('vi-VN'),
    action,
    status,
    details
  };
  aiLogs = [newLog, ...aiLogs].slice(0, 50); // Keep last 50 logs
  logListeners.forEach(listener => listener([...aiLogs]));
};

export const subscribeToAILogs = (listener: (logs: AILogEntry[]) => void) => {
  logListeners.push(listener);
  listener([...aiLogs]);
  return () => {
    logListeners = logListeners.filter(l => l !== listener);
  };
};

// Singleton AI client — API key chỉ đọc 1 lần duy nhất
const getAIClient = (): GoogleGenAI | null => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const fetchNearbyPlaces = async (userLocation: string): Promise<ExploreResult> => {
  const ai = getAIClient();
  if (!ai) {
    addAILog("Lấy địa điểm (fetchNearbyPlaces)", "error", "Thiếu API Key (VITE_GEMINI_API_KEY)");
    throw new Error("Missing VITE_GEMINI_API_KEY");
  }
  addAILog("Lấy địa điểm (fetchNearbyPlaces)", "loading", `Đang tìm vị trí: ${userLocation}`);
  
  const prompt = `
I am currently at: "${userLocation}".
First, determine the latitude and longitude of my location.
Then, use Google Maps to find EXACTLY 15 REAL places (cafes, restaurants, or attractions) near my location. Include a rich and diverse mix.
For each place, find its exact real name, real address, real rating, real latitude/longitude.
Also, provide the real Google Maps URI for the place.

Return ONLY a valid JSON object inside a \`\`\`json block with this exact structure:
{
  "userLocation": { "lat": number, "lng": number },
  "places": [
    {
      "id": "string (unique)",
      "name": "string (real name from Google Maps)",
      "address": "string (real address)",
      "rating": number (real rating, e.g. 4.5),
      "lat": number,
      "lng": number,
      "type": "string (e.g. Cafe, Restaurant)",
      "websiteUri": "string (REAL official website, Facebook, or Foody/Tripadvisor link. Leave empty if not found)",
      "mapsUri": "string (real Google Maps URL)"
    }
  ]
}
Do not include any other text outside the JSON block.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
    }
  });

  const text = response.text || '';
  const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
  
  let result: ExploreResult;
  try {
    if (jsonMatch && jsonMatch[1]) {
      result = JSON.parse(jsonMatch[1]);
    } else {
      result = JSON.parse(text);
    }
    addAILog("Lấy địa điểm (fetchNearbyPlaces)", "success", `Tìm thấy ${result.places?.length || 0} địa điểm.`);
  } catch (e) {
    console.error("Failed to parse response:", text);
    addAILog("Lấy địa điểm (fetchNearbyPlaces)", "error", "Lỗi phân tích cú pháp (Parse Error)");
    throw new Error("Failed to parse response from Gemini");
  }

  // Try to enrich with grounding metadata if available
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && chunks.length > 0) {
    result.places = result.places.map(place => {
      // Find matching chunk by name
      const chunk = chunks.find(c => c.maps?.title?.toLowerCase().includes(place.name.toLowerCase()) || place.name.toLowerCase().includes(c.maps?.title?.toLowerCase() || ''));
      if (chunk && chunk.maps) {
        return {
          ...place,
          mapsUri: chunk.maps.uri || place.mapsUri,
          name: chunk.maps.title || place.name,
        };
      }
      return place;
    });
  }

  return result;
};

// Haversine formula to calculate distance in km
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
}

export interface ComboParams {
  location: string;
  budget: string;
  companion: string;
  startTime: string;
  endTime: string;
  preferences: string[];
}

export const generateCombos = async (params: ComboParams): Promise<Combo[]> => {
  const ai = getAIClient();
  if (!ai) {
    addAILog("Tạo Combo (generateCombos)", "error", "Thiếu API Key (VITE_GEMINI_API_KEY)");
    throw new Error("Missing VITE_GEMINI_API_KEY");
  }
  addAILog("Tạo Combo (generateCombos)", "loading", `Đang tạo combo cho: ${params.location}, ${params.companion}`);
  
  const availablePlaces = REAL_LOCATIONS.map((l: any) => `- ${l.name} (${l.category}, ${l.theme}) - Giá khoảng: ${l.price} - ${l.address}`).join('\n');

  const prompt = `
I want to plan an authentic date/outing at: "${params.location}".
Budget: "${params.budget}".
Companion: "${params.companion}".
Time available: from ${params.startTime} to ${params.endTime}.
Preferences: ${params.preferences.join(', ')}.

CRITICAL INSTRUCTIONS:
1. Here is a curated list of REAL places. YOU MUST PRIORITIZE picking places from this list whenever possible to build your combos:
${availablePlaces}

2. If the curated list doesn't fit well enough, you can find other REAL places on Google Maps, but ensure they ACTUALLY EXIST. Do NOT hallucinate names.
3. Provide the EXACT real name and address so it can be queried directly on Maps.
4. Prices must be highly accurate and realistic to the current menu prices or entry fees.

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
    "icon": "string (A single descriptive emoji matching the theme)",
    "totalCost": number,
    "score": number,
    "activities": [
      {
        "time": "string",
        "name": "string (EXACT name on Google Maps)",
        "address": "string (EXACT address context from Google Maps)",
        "cost": number,
        "distance": "string",
        "lat": number,
        "lng": number,
        "websiteUri": "string (REAL official website, Facebook, Foody, or Tripadvisor link for this place)"
      }
    ]
  }
]
Do not include any other text outside the JSON block. Ensure the JSON is perfectly valid.
`;

  const MAX_RETRIES = 2; // Cố gắng Retry tối đa 2 lần trước khi quăng lỗi

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text || '';
      
      // ✅ Cải tiến 1: Regex gắp JSON siêu cường. Mặc kệ AI nói gì, chỉ tìm dấu array [ ]
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      let parsedResult;

      if (jsonMatch && jsonMatch[0]) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parse nguyên thô
        parsedResult = JSON.parse(text);
      }

      if (!Array.isArray(parsedResult)) {
        throw new Error("Dữ liệu trả về không phải là mảng Array.");
      }

      // Đánh dấu ID duy nhất
      parsedResult.forEach((combo: Combo, idx: number) => {
        combo.id = `live-combo-${idx}-${Date.now()}`;
      });

      addAILog("Tạo Combo (generateCombos)", "success", `Đã tạo ${parsedResult.length} combo.`);
      return parsedResult as Combo[];

    } catch (e: any) {
      addAILog("Tạo Combo (generateCombos)", "error", `Lỗi LLM: ${e.message} (Lần thử ${attempt + 1}/${MAX_RETRIES + 1})`);
      console.warn(`[API Retry ${attempt}/${MAX_RETRIES}] Gặp lỗi khi truy vấn LLM:`, e.message);
      
      if (attempt === MAX_RETRIES) {
        // Hết cơ hội, bung Lỗi ra cho App.tsx bắt
        throw new Error(`[FALLBACK LỖI AI] ${e.message}`);
      }
      
      // ✅ Cải tiến 2: Exponential Backoff - chờ lâu hơn với lỗi 503 (server overload)
      const is503 = e.message?.includes('503') || e.message?.includes('UNAVAILABLE');
      const sleepMs = is503 ? 5000 * (attempt + 1) : 1500 * (attempt + 1);
      console.log(`Đang chờ ${sleepMs}ms để Retry... (${is503 ? '503 overload' : 'lỗi thường'})`);
      await new Promise(resolve => setTimeout(resolve, sleepMs));
    }
  }

  throw new Error("All retries failed");
};

export const chatWithAI = async (history: {role: string, text: string}[], message: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    addAILog("Chat AI (chatWithAI)", "error", "Thiếu API Key (VITE_GEMINI_API_KEY)");
    return "Thiếu API Key. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env";
  }
  addAILog("Chat AI (chatWithAI)", "loading", `Người dùng chat: ${message.substring(0, 30)}...`);

  const systemInstruction = "Bạn là AI Trợ lý Hẹn hò tinh tế và hài hước của Widget Date. Nhiệm vụ tư vấn chi tiết các điểm đi chơi, review quán xá ở Việt Nam. Rất thân thiện, dùng icon dễ thương và chia lịch trình ra từng gạch đầu dòng rõ ràng, mạch lạc.";
  
  // 1. Tối ưu Token Rate Limit: Chỉ lấy 5 lượt Chat gần nhất để giảm Payload
  const recentHistory = history.slice(-5);
  const formattedHistory = recentHistory.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [...formattedHistory, { role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    addAILog("Chat AI (chatWithAI)", "success", "Đã nhận phản hồi từ AI.");
    return response.text || "Mình bị rớt mạng rồi, bạn thử lại sau nhe!!";
  } catch (e: any) {
    console.error("Chat error:", e);
    addAILog("Chat AI (chatWithAI)", "error", `Lỗi LLM: ${e.message || 'Unknown Error'}`);
    
    // 2. Chặn lỗi Rate Limit (429) và Trả lời tự động bằng Canned Responses
    const isRateLimit = e?.message?.includes('429') || e?.status === 429;
    
    if (isRateLimit) {
      const offlineReplies = [
        "Đằng ấy ơi, bộ não AI của mình đang xử lý quá tải thông tin (nhiều cặp đôi hỏi quá 😅). Trong lúc chờ, đằng ấy thử lướt mục Khám Phá hoặc Quẹt Thẻ Hẹn Hò xem có ưng quán nào không nè?",
        "Ôi hệ thống mình đang nóng ran vì vắt óc suy nghĩ ý tưởng hẹn hò cho bạn! Đằng ấy chờ 1 lát rồi hỏi lại mình nhé 💖",
        "Mình dùng trí tuệ năng lực quá độ nên bị kiệt sức xíu (Lỗi Quá tải). Bạn có thể lướt thử Chế Độ Quẹt Thẻ Swipe phía trên xem! Bấm lại nút Gửi sau vài phút nghen."
      ];
      return offlineReplies[Math.floor(Math.random() * offlineReplies.length)];
    }
    
    return "Mạng mẽo chập cheng quá, đằng ấy đợi một lát nha 💖!";
  }
};

export const scrapeGoogleMapsImage = async (mapsUri: string): Promise<string | null> => {
  try {
    // 1. Tối ưu Hiệu năng Cache: Check cache trước khi cào
    const cacheKey = `imgCache_${mapsUri}`;
    const cachedImage = localStorage.getItem(cacheKey);
    if (cachedImage) return cachedImage;

    // 2. Nếu chưa có, tiến hành Scrape bằng AllOrigins để proxy fetch HTML tránh bị chặn CORS
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(mapsUri)}`);
    const data = await response.json();
    if (!data.contents) return null;
    
    // Tìm thẻ og:image chứa ảnh đại diện thật của quán
    const match = data.contents.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) || 
                  data.contents.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
                  
    if (match && match[1]) {
      // Bỏ qua các ảnh icon placeholder của Google Maps
      if (match[1].includes('maps.gstatic.com') || match[1].includes('streetviewpixels')) {
        return null;
      }
      
      // Lệnh Cache! Gắn vào LocalStorage. Tốc độ O(1) Access Time
      localStorage.setItem(cacheKey, match[1]);
      return match[1];
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi Cào ảnh Google Maps:", error);
    return null;
  }
};
