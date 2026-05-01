import { useState, useEffect } from 'react';
import type { WeatherWithForecast } from '../types';
import { fetchWeather } from '../services/api';

const MOCK_WEATHER: WeatherWithForecast = {
  current: {
    name: 'Hà Nội',
    main: { temp: 28, feels_like: 30, humidity: 65, pressure: 1012, temp_min: 26, temp_max: 32 },
    weather: [{ main: 'Clouds', description: 'nhiều mây', icon: '04d' }],
    wind: { speed: 3.5 },
    clouds: { all: 40 },
    visibility: 10000,
    sys: { sunset: 1714300000, sunrise: 1714250000 }
  },
  forecast: []
};

export function useWeather() {
  const [data, setData] = useState<WeatherWithForecast | null>(null);

  useEffect(() => {
    fetchWeather('Hanoi')
      .then(result => {
        if (result) {
          setData(result);
        } else {
          setData(MOCK_WEATHER);
        }
      })
      .catch(err => {
        console.error('Weather fetch error in hook:', err);
        setData(MOCK_WEATHER);
      });
  }, []);

  return data;
}
