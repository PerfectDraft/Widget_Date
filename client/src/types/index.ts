export interface Activity {
  time: string;
  name: string;
  address?: string;
  cost: number;
  distance?: string;
  lat?: number;
  lng?: number;
  websiteUri?: string;
  imageUrl?: string;
  category?: string;
}

export interface Combo {
  id: string;
  theme: string;
  icon: string;
  totalCost: number;
  score: number;
  activities: Activity[];
}

/** A slot in a combo being built — null means unfilled */
export type ComboSlot = LocationItem | null;

/** Map location categories to AI-generated activity keywords for slot matching */
export const CATEGORY_SLOT_MAP: Record<string, string[]> = {
  cafe:          ['cafe', 'coffee', 'trà', 'cà phê', 'kem', 'bakery', 'Cafe'],
  food:          ['food', 'restaurant', 'nhà hàng', 'ăn', 'bún', 'phở', 'quán', 'grill', 'bbq', 'lẩu', 'Food'],
  entertainment: ['entertainment', 'phim', 'karaoke', 'bowling', 'game', 'vui chơi', 'Entertainment'],
  romantic:      ['romantic', 'lãng mạn', 'dạo', 'công viên', 'hồ', 'park'],
};

export interface ActivityLog {
  id: string;
  reason: string;
  amount: number;
  timestamp: string;
}

export interface UserReward {
  totalMiles: number;
  level: string;
  completedDates: number;
  badges: string[];
  history: ActivityLog[];
}

export interface LocationItem {
  id: string | number;
  name: string;
  category?: string;
  theme?: string;
  type?: string;
  address?: string;
  desc?: string;
  note?: string;
  price?: number;
  cost?: number;
  rating?: number;
  lat?: number;
  lng?: number;
  distance?: number;
  mapsLink?: string;
  mapsUri?: string;
  websiteUri?: string;
  imageUrl?: string;
  area?: string;
  dist?: string;
}

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
  date: string;
  dayLabel: string;
  tempMin: number;
  tempMax: number;
  icon: string;
  main: string;
  description: string;
}

export interface WeatherWithForecast {
  current: WeatherData;
  forecast: ForecastDay[];
}

export type Tab = 'home' | 'explore' | 'history' | 'wallet';
export type ExploreTab = 'map' | 'movies' | 'trends' | 'swipe';


export interface TrendItem {
  id: number;
  icon: string;
  name: string;
  badge: string;
  badgeColor: string;
  desc: string;
  price: string;
}

export interface MovieItem {
  id: number;
  icon: string;
  name: string;
  theaters: string;
  genre: string;
  rating: number;
  price: string;
  badge: string;
  note: string;
}
