import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface WeatherDetailViewProps {
  weatherData: any;
  onBack: () => void;
}

export function WeatherDetailView({ weatherData, onBack }: WeatherDetailViewProps) {
  if (!weatherData) return null;

  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const tempMin = Math.round(weatherData.main.temp_min);
  const tempMax = Math.round(weatherData.main.temp_max);
  const humidity = weatherData.main.humidity;
  const windSpeed = Math.round((weatherData.wind?.speed || 0) * 3.6); // m/s → km/h
  const visibility = Math.round((weatherData.visibility || 10000) / 1000);
  const description = weatherData.weather[0]?.description || '';
  const mainWeather = weatherData.weather[0]?.main || '';
  const cityName = weatherData.name || 'Hà Nội';

  // Sunset from sys
  const sunsetTime = weatherData.sys?.sunset
    ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : '18:42';

  const getWeatherIcon = (main: string) => {
    switch (main) {
      case 'Rain': return 'rainy';
      case 'Clouds': return 'cloud';
      case 'Drizzle': return 'grain';
      case 'Thunderstorm': return 'thunderstorm';
      case 'Snow': return 'ac_unit';
      default: return 'light_mode';
    }
  };

  // UV Index estimate based on cloudiness
  const clouds = weatherData.clouds?.all || 0;
  const uvEstimate = clouds > 70 ? 2 : clouds > 40 ? 4 : 6;
  const uvLabel = uvEstimate <= 2 ? 'Low' : uvEstimate <= 5 ? 'Moderate' : 'High';

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#FFF8F4] overflow-y-auto"
    >
      <div className="max-w-md mx-auto px-6 py-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 rounded-2xl hover:bg-[#F5ECE5] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#894C5C]" />
          </button>
          <h1 className="text-2xl font-semibold text-[#894C5C]" style={{ fontFamily: 'Epilogue, sans-serif' }}>
            {cityName}
          </h1>
        </div>

        {/* Main Weather Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_4px_20px_rgba(137,76,92,0.06)] mb-6 text-center">
          <span
            className="material-symbols-outlined text-[#D9B784] text-[80px] mb-4 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {getWeatherIcon(mainWeather)}
          </span>
          <h2 className="text-[72px] font-black leading-none text-[#894C5C] tracking-tighter" style={{ fontFamily: 'Epilogue' }}>
            {temp}°C
          </h2>
          <p className="text-lg text-[#524346] capitalize mt-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            {description}
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-[#847376]">
            <span>↑ {tempMax}°</span>
            <span>↓ {tempMin}°</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon="air" label="WIND SPEED" value={`${windSpeed} km/h`} />
          <StatCard icon="water_drop" label="HUMIDITY" value={`${humidity}%`} />
          <StatCard icon="sunny" label="UV INDEX" value={`${uvEstimate} ${uvLabel}`} />
          <StatCard icon="visibility" label="VISIBILITY" value={`${visibility} km`} />
        </div>

        {/* Feels Like + Sunset */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_4px_20px_rgba(137,76,92,0.04)]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#847376] mb-2">FEELS LIKE</p>
            <p className="text-3xl font-bold text-[#1F1B17]" style={{ fontFamily: 'Epilogue' }}>{feelsLike}°</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_4px_20px_rgba(137,76,92,0.04)]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#847376] mb-2">SUNSET</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-[#1F1B17]" style={{ fontFamily: 'Epilogue' }}>{sunsetTime}</p>
              <span className="material-symbols-outlined text-[#D9B784] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                wb_twilight
              </span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-[#EAE1DA] overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#F4A7B9] to-[#D9B784]" />
            </div>
          </div>
        </div>

        {/* Pressure & Clouds */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon="speed" label="PRESSURE" value={`${weatherData.main.pressure} hPa`} />
          <StatCard icon="cloud" label="CLOUDS" value={`${clouds}%`} />
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_4px_20px_rgba(137,76,92,0.04)] text-center">
      <span className="material-symbols-outlined text-[#894C5C] text-[28px] mb-2 block">{icon}</span>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#847376] mb-1">{label}</p>
      <p className="text-xl font-bold text-[#1F1B17]" style={{ fontFamily: 'Epilogue' }}>{value}</p>
    </div>
  );
}
