import type { Combo, LocationItem } from '../types';

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
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `API error: ${res.status}`);
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

export async function fetchWeather(city: string = 'Hanoi') {
  return apiRequest<any>(`/weather?city=${encodeURIComponent(city)}`);
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
