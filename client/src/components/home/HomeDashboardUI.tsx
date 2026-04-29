import { useState } from 'react';
import { HeartCrack, ArrowRight } from 'lucide-react';
import { ComboList } from './ComboList';
import { extractPlaceImage } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import type { Combo, Activity, ComboSlot } from '../../types';

export interface HomeDashboardUIProps {
  // User Info
  userName: string;
  userAvatar: string;
  dateMiles: number;
  
  // Interactions
  openChat: () => void;
  onAvatarClick: () => void;

  // Weather Data
  weatherData: any | null; // Keep existing shape
  onWeatherClick?: () => void;

  // AI Planner Form
  budget: string;
  onBudgetChange: (b: string) => void;
  companion: string;
  onCompanionChange: (c: string) => void;
  startTime: string;
  endTime: string;
  onTimeChange: (start: string, end: string) => void;
  preferences: string[];
  categories: string[];
  onPreferenceToggle: (c: string) => void;

  // Generation Action
  isGenerating: boolean;
  onGenerate: () => void;

  // Combo Results
  combos: Combo[];
  error: string | null;
  onSelectCombo: (combo: Combo) => void;
  onSelectVenue?: (venue: Activity) => void;
  formatVND: (n: number) => string;

  // Combo Focus Mode
  activeCombo: Combo | null;
  comboSlots: ComboSlot[];
  onClearCombo: () => void;
  onConfirmCombo: () => void;
  onRemoveSlot: (idx: number) => void;
  onManualCombo: () => void;
  setActiveCombo: (combo: Combo) => void;
}

export function HomeDashboardUI(props: HomeDashboardUIProps) {
  const {
    userName, userAvatar, dateMiles, openChat, onAvatarClick, weatherData, onWeatherClick,
    budget, onBudgetChange, companion, onCompanionChange,
    startTime, endTime, onTimeChange, preferences, categories, onPreferenceToggle,
    isGenerating, onGenerate,
    combos, error, onSelectCombo, onSelectVenue, formatVND,
    activeCombo, comboSlots, onClearCombo, onConfirmCombo, onRemoveSlot, onManualCombo, setActiveCombo
  } = props;

  const isFocusMode = activeCombo !== null;
  const filledCount = comboSlots.filter(s => s !== null).length;
  const allFilled = isFocusMode && filledCount === comboSlots.length;

  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  const [showAiPlanner, setShowAiPlanner] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Budget Options per Stitch UI
  const BUDGET_OPTIONS = ['200K', '500K', '1M', '2M+'];
  
  // Companion Options
  const COMPANION_OPTIONS = ['Người yêu', 'Bạn bè', 'Crush'];

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-24 relative">
      {/* Header — Avatar + Welcome + Date Miles */}
      <header className="sticky top-0 z-40 glass-card px-6 py-4 flex items-center justify-between">
        <button onClick={onAvatarClick} className="flex items-center gap-3 group cursor-pointer">
          <div className="size-12 rounded-full overflow-hidden border-2 border-primary-container group-hover:border-primary transition-colors shadow-sm">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src={userAvatar}
            />
          </div>
          <div>
            <p className="text-on-surface-variant text-label-sm">Welcome back,</p>
            <h1 className="text-headline-md font-bold text-on-surface">{userName}</h1>
          </div>
        </button>
        <div className="bg-primary-fixed px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          <span className="text-on-primary-fixed font-bold text-label-md">{dateMiles} Date Miles</span>
        </div>
      </header>

      <main className="px-6 space-y-8 mt-6">

        {/* ========== COMBO FOCUS MODE ========== */}
        <AnimatePresence>
          {isFocusMode && activeCombo && (
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-50 bg-background overflow-y-auto pb-8"
            >
              {/* Header with cancel */}
              <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center justify-between border-b border-outline-variant/30">
                <div className="flex flex-col flex-1 mr-4">
                  <input
                    type="text"
                    value={activeCombo.theme}
                    onChange={(e) => setActiveCombo({ ...activeCombo, theme: e.target.value })}
                    className="text-headline-md font-bold text-on-surface bg-transparent border-none focus:ring-0 p-0 w-full"
                  />
                  <p className="text-label-sm text-on-surface-variant">{filledCount}/{comboSlots.length} địa điểm đã chọn</p>
                </div>
                <button
                  onClick={onClearCombo}
                  className="p-2 rounded-full hover:bg-error-container/40 transition-colors cursor-pointer group shrink-0"
                  aria-label="Huỷ combo"
                >
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-error text-[24px]">close</span>
                </button>
              </div>

              <div className="p-6">
                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-surface-container-high mb-5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary transition-all duration-500"
                    style={{ width: `${(filledCount / comboSlots.length) * 100}%` }}
                  />
                </div>

                {/* Slot cards */}
                <div className="space-y-3">
                  {comboSlots.map((slot, idx) => {
                    const originalActivity = activeCombo.activities[idx];
                    if (slot) {
                      // Filled slot
                      return (
                        <div key={idx} className="flex items-center gap-3 bg-primary-container/20 rounded-2xl p-3 border border-primary/20">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container-high shrink-0">
                            {extractPlaceImage(slot.imageUrl) ? (
                              <img src={extractPlaceImage(slot.imageUrl)} alt={slot.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-label-sm text-primary font-bold">{originalActivity?.time || `Slot ${idx + 1}`}</p>
                            <p className="font-bold text-on-surface truncate">{slot.name}</p>
                            <p className="text-[11px] text-on-surface-variant truncate">{slot.address}</p>
                          </div>
                          <button
                            onClick={() => onRemoveSlot(idx)}
                            className="p-1.5 rounded-full hover:bg-error-container/40 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-error text-[18px]">remove_circle</span>
                          </button>
                        </div>
                      );
                    }
                    // Empty slot
                    return (
                      <div key={idx} className="flex items-center gap-3 rounded-2xl p-3 border-2 border-dashed border-outline-variant/50 bg-surface-container-low/50">
                        <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-outline-variant text-[24px]">add_location</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-label-sm text-outline font-bold">{originalActivity?.time || `Slot ${idx + 1}`}</p>
                          <p className="text-on-surface-variant text-body-md">Chưa chọn địa điểm</p>
                          <p className="text-[11px] text-outline-variant">Bấm Khám phá để thêm</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  onClick={allFilled ? onConfirmCombo : undefined}
                  disabled={!allFilled}
                  className={`w-full mt-5 py-4 rounded-full font-bold text-body-lg flex items-center justify-center gap-2 transition-all ${
                    allFilled
                      ? 'bg-primary text-on-primary shadow-xl hover:scale-[1.02] cursor-pointer'
                      : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {allFilled ? 'check_circle' : 'hourglass_empty'}
                  </span>
                  {allFilled ? 'Chốt lịch ✨' : `Chờ chọn địa điểm (${filledCount}/${comboSlots.length})`}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== REST OF CONTENT ========== */}
        <div className="transition-opacity duration-300">

        {/* Weather Card — Clean 2-column layout */}
        <section className="glass-card rounded-[32px] p-6 border-none bg-gradient-to-br from-primary/10 via-secondary/10 to-background shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {weatherData ? (
            <div className="relative z-10">
              {/* Row 1: Date + Icon */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-primary font-bold text-label-sm uppercase tracking-[0.15em]">{dateStr}</p>
                <div className="bg-white/40 p-3 rounded-2xl backdrop-blur-md shadow-sm border border-white/20">
                  <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {weatherData.weather[0]?.main === 'Rain' ? 'rainy' : weatherData.weather[0]?.main === 'Clouds' ? 'cloud' : 'light_mode'}
                  </span>
                </div>
              </div>

              {/* Row 2: Temp + Description */}
              <div className="flex items-end gap-4 mb-3">
                <h3 className="text-[56px] font-black leading-none text-on-surface tracking-tighter">
                  {Math.round(weatherData.main.temp)}°
                </h3>
                <div className="pb-2">
                  <p className="text-on-surface font-bold text-body-lg capitalize">
                    {weatherData.weather[0]?.description}
                  </p>
                  <p className="text-on-surface-variant text-label-md">
                    {weatherData.name} • Feels {Math.round(weatherData.main.feels_like)}°
                  </p>
                </div>
              </div>

              {/* Expandable Detail */}
              {showWeatherDetail && (
                <div className="grid grid-cols-3 gap-3 mb-4 pt-3 border-t border-white/30">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">water_drop</span>
                    <p className="text-label-sm text-on-surface mt-1 font-bold">{weatherData.main.humidity}%</p>
                    <p className="text-[10px] text-on-surface-variant">Humidity</p>
                  </div>
                  <div className="text-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">air</span>
                    <p className="text-label-sm text-on-surface mt-1 font-bold">{Math.round(weatherData.wind?.speed || 0)} m/s</p>
                    <p className="text-[10px] text-on-surface-variant">Wind</p>
                  </div>
                  <div className="text-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">visibility</span>
                    <p className="text-label-sm text-on-surface mt-1 font-bold">{Math.round((weatherData.visibility || 10000) / 1000)} km</p>
                    <p className="text-[10px] text-on-surface-variant">Visibility</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => onWeatherClick?.()}
                className="flex items-center gap-2 text-primary font-bold text-label-md bg-primary-container/30 px-4 py-2 rounded-full hover:bg-primary-container/50 transition-colors cursor-pointer"
              >
                Xem chi tiết thời tiết
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="animate-pulse flex items-center gap-6 w-full relative z-10">
              <div className="h-16 w-28 bg-surface-container-high rounded-3xl" />
              <div className="space-y-3 flex-1">
                <div className="h-5 w-1/2 bg-surface-container-high rounded-full" />
                <div className="h-4 w-1/3 bg-surface-container-high rounded-full" />
              </div>
            </div>
          )}
        </section>
        {/* Planner CTAs */}
        <section className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowAiPlanner(!showAiPlanner)}
              className={`p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${showAiPlanner ? 'border-primary bg-primary-container/20 shadow-md' : 'border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="font-bold text-primary">Tạo Combo AI</span>
            </button>
            <button 
              onClick={onManualCombo}
              className="p-4 rounded-[24px] border-2 border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-high transition-all flex flex-col items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[32px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>edit_calendar</span>
              <span className="font-bold text-tertiary">Tự Tạo Combo</span>
            </button>
          </div>
        </section>

        {/* AI Date Planner Section */}
        <AnimatePresence>
        {showAiPlanner && (
        <motion.section 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-6 overflow-hidden"
        >

          {/* Budget */}
          <div className="space-y-3">
            <label className="text-label-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">payments</span> Ngân sách
            </label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map(b => (
                <button 
                  key={b}
                  onClick={() => onBudgetChange(b)}
                  className={`px-5 py-2 rounded-full font-medium transition-colors cursor-pointer ${
                    budget === b 
                      ? "bg-primary text-on-primary shadow-md" 
                      : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Companion */}
          <div className="space-y-3">
            <label className="text-label-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">favorite</span> Người đi cùng
            </label>
            <div className="flex flex-wrap gap-2">
              {COMPANION_OPTIONS.map(c => (
                <button 
                  key={c}
                  onClick={() => onCompanionChange(c)}
                  className={`px-5 py-2 rounded-full font-medium transition-colors cursor-pointer ${
                    companion === c 
                      ? "bg-primary text-on-primary shadow-md" 
                      : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot */}
          <div className="space-y-3">
            <label className="text-label-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">schedule</span> Khung giờ
            </label>
            <div className="flex items-center gap-3 glass-card p-4 rounded-lg">
              <div className="flex-1 text-center">
                <p className="text-label-sm text-on-surface-variant">Từ</p>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={e => onTimeChange(e.target.value, endTime)} 
                  className="w-full bg-transparent border-none text-center text-body-lg font-bold text-on-surface p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-50 cursor-pointer"
                />
              </div>
              <div className="w-px h-8 bg-outline-variant"></div>
              <div className="flex-1 text-center">
                <p className="text-label-sm text-on-surface-variant">Đến</p>
                 <input 
                  type="time" 
                  value={endTime} 
                  onChange={e => onTimeChange(startTime, e.target.value)} 
                  className="w-full bg-transparent border-none text-center text-body-lg font-bold text-on-surface p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-50 cursor-pointer"
                />
              </div>
              <span className="material-symbols-outlined text-outline">calendar_today</span>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <label className="text-label-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">interests</span> Sở thích
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const isSelected = preferences.includes(cat);
                return (
                  <button 
                    key={cat}
                    onClick={() => onPreferenceToggle(cat)}
                    className={`px-4 py-1.5 rounded-full text-label-md font-medium border transition-colors cursor-pointer ${
                      isSelected 
                        ? "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-container shadow-sm" 
                        : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    # {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create Combo CTA */}
          <button 
            disabled={isGenerating}
            onClick={onGenerate}
            className="w-full py-5 rounded-full bg-primary text-on-primary font-bold text-body-lg flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <span className="material-symbols-outlined text-[28px] animate-spin">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            )}
            {isGenerating ? 'Đang tạo...' : 'Tạo Combo AI'}
          </button>
        </motion.section>
        )}
        </AnimatePresence>

        {/* Combo List with 4 visual states */}
        {(combos.length > 0 || isGenerating || error) && (
          <ComboList 
            combos={combos}
            isLoading={isGenerating}
            error={error}
            onSelectCombo={onSelectCombo}
            onSelectVenue={onSelectVenue}
            onRetry={onGenerate}
            formatVND={formatVND}
          />
        )}
        </div>{/* end dim wrapper */}
      </main>
    </div>
  );
}
