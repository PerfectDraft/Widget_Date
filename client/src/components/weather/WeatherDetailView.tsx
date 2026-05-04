import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import type { ForecastDay, WeatherData } from '../../types';
import { useTranslation } from 'react-i18next';

interface WeatherDetailViewProps {
  weatherData: { current: WeatherData; forecast: ForecastDay[] } | null;
  onBack: () => void;
}

export function WeatherDetailView({ weatherData, onBack }: WeatherDetailViewProps) {
  const { t } = useTranslation();
  if (!weatherData) return null;

  const w = weatherData.current;
  const forecast = weatherData.forecast || [];

  const temp = Math.round(w.main.temp);
  const feelsLike = Math.round(w.main.feels_like);
  const tempMin = Math.round(w.main.temp_min);
  const tempMax = Math.round(w.main.temp_max);
  const humidity = w.main.humidity;
  const windSpeed = Math.round((w.wind?.speed || 0) * 3.6);
  const visibility = Math.round((w.visibility || 10000) / 1000);
  const description = w.weather[0]?.description || '';
  const mainWeather = w.weather[0]?.main || '';
  const cityName = w.name || 'Hà Nội';

  const sunsetTime = w.sys?.sunset
    ? new Date(w.sys.sunset * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
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

  const clouds = w.clouds?.all || 0;
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

        {/* Feels Like + Sunset — Fixed alignment */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_4px_20px_rgba(137,76,92,0.04)]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#847376] mb-2">{t('common.feels_like')}</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-[#1F1B17]" style={{ fontFamily: 'Epilogue' }}>{feelsLike}°</p>
              <span className="material-symbols-outlined text-[#D9B784] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                thermostat
              </span>
            </div>
            <p className="text-[11px] text-[#847376] mt-1.5">
              {feelsLike > temp ? 'Ẩm hơn nhiệt độ thực' : feelsLike < temp ? 'Mát hơn nhiệt độ thực' : 'Giống nhiệt độ thực'}
            </p>
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
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon="speed" label="PRESSURE" value={`${w.main.pressure} hPa`} />
          <StatCard icon="cloud" label="CLOUDS" value={`${clouds}%`} />
        </div>

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 shadow-[0_4px_20px_rgba(137,76,92,0.06)]">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#847376] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#894C5C] text-[20px]">calendar_month</span>
              DỰ BÁO TUẦN TỚI
            </h3>
            <div className="space-y-0">
              {forecast.map((day, i) => (
                <div
                  key={day.date}
                  className={`flex items-center justify-between py-3.5 ${i < forecast.length - 1 ? 'border-b border-[#EAE1DA]' : ''}`}
                >
                  <div className="w-10 text-sm font-bold text-[#524346]">{day.dayLabel}</div>
                  <span
                    className="material-symbols-outlined text-[24px] text-[#D9B784]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {getWeatherIcon(day.main)}
                  </span>
                  <p className="flex-1 text-sm text-[#847376] capitalize ml-3 truncate">{day.description}</p>
                  <div className="flex items-center gap-2 text-sm font-bold shrink-0">
                    <span className="text-[#894C5C]">{day.tempMax}°</span>
                    <span className="text-[#847376]">{day.tempMin}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
