import { env } from '../config/env.js';

export interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
}

const weatherCache = new Map<string, { data: WeatherData; fetchedAt: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export async function fetchWeather(city: string): Promise<WeatherData> {
  const cacheKey = city.toLowerCase();
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=vi&appid=${env.OPENWEATHER_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OpenWeather API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as WeatherData;
  weatherCache.set(cacheKey, { data, fetchedAt: Date.now() });
  return data;
}
