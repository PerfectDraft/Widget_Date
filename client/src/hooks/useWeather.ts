import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/api';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    fetchWeather('Hanoi')
      .then(setWeatherData)
      .catch(err => console.error('Weather fetch error:', err));
  }, []);

  return weatherData;
}
