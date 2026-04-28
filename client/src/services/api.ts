import type { Combo, LocationItem, TrendItem } from '../types';

/** API error with HTTP status code */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const API_BASE = '/api';

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('google_access_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: 'Network error' }));
    throw new ApiError(errorBody.error || `API error: ${res.status}`, res.status);
  }

  return res.json();
}

// --- Gemini Endpoints ---

export interface ExploreResult {
  userLocation: { lat: number; lng: number };
  places: LocationItem[];
}

export async function fetchNearbyPlaces(location: string): Promise<ExploreResult> {
  return apiRequest<ExploreResult>('/nearby-places', {
    method: 'POST',
    body: JSON.stringify({ location }),
  });
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

export async function generateCombos(params: ComboParams): Promise<Combo[]> {
  return apiRequest<Combo[]>('/combos', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function chatWithAI(
  history: { role: string; text: string }[],
  message: string
): Promise<string> {
  const data = await apiRequest<{ reply: string }>('/chat', {
    method: 'POST',
    body: JSON.stringify({ history, message }),
  });
  return data.reply;
}

// --- Scraper Endpoint ---

export async function fetchPlaceImage(mapsUrl: string): Promise<string | null> {
  const data = await apiRequest<{ imageUrl: string | null }>(
    `/place-image?url=${encodeURIComponent(mapsUrl)}`
  );
  return data.imageUrl;
}

// --- Weather Endpoint ---

export interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
}

export async function fetchWeather(city: string = 'Hanoi'): Promise<WeatherData> {
  return apiRequest<WeatherData>(`/weather?city=${encodeURIComponent(city)}`);
}

// --- User Endpoints (W6) ---

export interface UserSyncParams {
  phone: string;
  googleId?: string;
  preferences?: string[];
  lastTab?: string;
}

export async function syncUser(params: UserSyncParams): Promise<{ status: string }> {
  return apiRequest<{ status: string }>('/user/sync', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export interface UserProfile {
  phone: string;
  googleId?: string;
  preferences?: string[];
  lastTab?: string;
  createdAt?: string;
}

export async function getUserProfile(phone: string): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/user/profile?phone=${encodeURIComponent(phone)}`);
}

export async function saveUserPlace(phone: string, placeId: string, placeData: Record<string, unknown>): Promise<{ status: string }> {
  return apiRequest<{ status: string }>('/user/place', {
    method: 'POST',
    body: JSON.stringify({ phone, placeId, placeData }),
  });
}

// --- Utilities (kept client-side) ---

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- Auth Endpoints ---

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: { phone: string; googleId?: string };
  error?: string;
}

export async function login(phone: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
}

export async function register(phone: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
}

// --- Trends Endpoints ---

export async function getTrends(): Promise<TrendItem[]> {
  const result = await apiRequest<{ trends: TrendItem[] }>('/trends');
  return result.trends;
}
