import { useState, useEffect } from 'react';
import type { WeatherWithForecast } from '../services/api';
import { fetchWeather } from '../services/api';

export function useWeather() {
  const [data, setData] = useState<WeatherWithForecast | null>(null);

  useEffect(() => {
    fetchWeather('Hanoi')
      .then(setData)
      .catch(err => console.error('Weather fetch error:', err));
  }, []);

  return data;
}
