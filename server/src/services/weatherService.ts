import { env } from '../config/env.js';

export interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min: number; temp_max: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
  clouds?: { all: number };
  visibility?: number;
  sys?: { sunset: number; sunrise: number };
}

export interface ForecastDay {
  date: string;       // YYYY-MM-DD
  dayLabel: string;   // "T2", "T3", ... "CN"
  tempMin: number;
  tempMax: number;
  icon: string;       // OpenWeather icon code
  main: string;       // "Rain", "Clouds", etc.
  description: string;
}

export interface WeatherWithForecast {
  current: WeatherData;
  forecast: ForecastDay[];
}

const weatherCache = new Map<string, { data: WeatherWithForecast; fetchedAt: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export async function fetchWeather(city: string): Promise<WeatherWithForecast> {
  const cacheKey = city.toLowerCase();
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

  const baseParams = `units=metric&lang=vi&appid=${env.OPENWEATHER_API_KEY}`;
  const encodedCity = encodeURIComponent(city);

  // Fetch current + forecast in parallel
  const [currentRes, forecastRes] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&${baseParams}`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&${baseParams}`),
  ]);

  if (!currentRes.ok) {
    throw new Error(`OpenWeather API error: ${currentRes.status} ${currentRes.statusText}`);
  }

  const current = (await currentRes.json()) as WeatherData;

  let forecast: ForecastDay[] = [];
  if (forecastRes.ok) {
    const forecastRaw = await forecastRes.json() as { list: Array<{ dt_txt: string; main: { temp_min: number; temp_max: number }; weather: Array<{ main: string; icon: string; description: string }> }> };
    const dailyMap = new Map<string, { temps: number[]; icons: string[]; mains: string[]; descs: string[] }>();

    for (const item of forecastRaw.list || []) {
      const date = item.dt_txt.split(' ')[0]; // "2026-04-29"
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { temps: [], icons: [], mains: [], descs: [] });
      }
      const entry = dailyMap.get(date)!;
      entry.temps.push(item.main.temp_min, item.main.temp_max);
      entry.icons.push(item.weather[0]?.icon || '01d');
      entry.mains.push(item.weather[0]?.main || 'Clear');
      entry.descs.push(item.weather[0]?.description || '');
    }

    // Skip today, take next 5-6 days
    const today = new Date().toISOString().split('T')[0];
    for (const [date, entry] of dailyMap) {
      if (date === today) continue;
      const d = new Date(date);
      forecast.push({
        date,
        dayLabel: DAY_LABELS[d.getDay()],
        tempMin: Math.round(Math.min(...entry.temps)),
        tempMax: Math.round(Math.max(...entry.temps)),
        icon: entry.icons[Math.floor(entry.icons.length / 2)], // midday icon
        main: entry.mains[Math.floor(entry.mains.length / 2)],
        description: entry.descs[Math.floor(entry.descs.length / 2)],
      });
    }
  }

  const result: WeatherWithForecast = { current, forecast };
  weatherCache.set(cacheKey, { data: result, fetchedAt: Date.now() });
  return result;
}
