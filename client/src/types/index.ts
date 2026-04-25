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
}

export interface Combo {
  id: string;
  theme: string;
  icon: string;
  totalCost: number;
  score: number;
  activities: Activity[];
}

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
