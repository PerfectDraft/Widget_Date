import { useState, useMemo } from 'react';
import { ComboList } from './ComboList';
import { extractPlaceImage } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import type { Combo, Activity, ComboSlot, WeatherData } from '../../types';
import vi from '../../locales/vi.json';

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
};

export interface HomeDashboardUIProps {
  // User Info
  userName: string;
  userAvatar: string;
  dateMiles: number;
  
  // Interactions
  openChat: () => void;
  onAvatarClick: () => void;
  
  // Weather Data
  weatherData: WeatherData | null;
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
  onAddSlot: () => void;
  setActiveCombo: (combo: Combo) => void;

  // Navigation
  onNavigateToExplore: () => void;
}

export function HomeDashboardUI(props: HomeDashboardUIProps) {
  const {
    userName, userAvatar, dateMiles, onAvatarClick, weatherData, onWeatherClick,
    budget, onBudgetChange, companion, onCompanionChange,
    startTime, endTime, onTimeChange, preferences, categories, onPreferenceToggle,
    isGenerating, onGenerate,
    combos, error, onSelectCombo, onSelectVenue, formatVND,
    activeCombo, comboSlots, onClearCombo, onConfirmCombo, onRemoveSlot, onManualCombo, onAddSlot, setActiveCombo,
    onNavigateToExplore
  } = props;

  const t = vi.dashboard;
  const tc = vi.common;

  const isFocusMode = activeCombo !== null;
  const filledCount = comboSlots.filter(s => s !== null).length;
  const allFilled = isFocusMode && filledCount === comboSlots.length && comboSlots.length > 0;

  const [showAiPlanner, setShowAiPlanner] = useState(false);

  const dateStr = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  // Budget Options per Stitch UI
  const BUDGET_OPTIONS = ['200K', '500K', '1M', '2M+'];
  
  // Companion Options
  const COMPANION_OPTIONS = ['Người yêu', 'Bạn bè', 'Crush'];

  // ===== Combo Focus Mode (inline, fits in main content area) =====
  if (isFocusMode && activeCombo) {
    return (
      <motion.div
        key="focus-mode"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-background text-on-background font-body-md min-h-screen pb-24 relative"
        role="dialog"
        aria-labelledby="focus-mode-title"
      >
        {/* Header with cancel */}
        <header className="sticky top-0 z-40 lg:hidden px-6 py-4 flex items-center justify-between border-b border-primary/30 bg-gradient-to-r from-primary to-secondary text-on-primary">
          <div className="flex flex-col flex-1 mr-4">
            <input
              type="text"
              id="focus-mode-title"
              aria-label={t.combo_name_label}
              value={activeCombo.theme}
              onChange={(e) => setActiveCombo({ ...activeCombo, theme: e.target.value })}
              className="text-headline-md font-bold text-on-primary bg-transparent border-none focus:ring-0 p-0 w-full"
            />
            <p className="text-label-sm text-on-primary/80">
              {filledCount}/{comboSlots.length} {t.selected_places_count}
            </p>
          </div>
          <button
            onClick={onClearCombo}
            className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-on-primary"
            aria-label={t.cancel_combo}
          >
            <span className="material-symbols-outlined text-on-primary/80 group-hover:text-on-primary text-[24px]">close</span>
          </button>
        </header>

        <div className="p-6">
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-surface-container-high mb-5 overflow-hidden" role="progressbar" aria-valuenow={filledCount} aria-valuemin={0} aria-valuemax={comboSlots.length}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary"
              initial={{ width: 0 }}
              animate={{ width: comboSlots.length > 0 ? `${(filledCount / comboSlots.length) * 100}%` : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Slot cards */}
          <div className="space-y-3">
            {comboSlots.map((slot, idx) => {
              const originalActivity = activeCombo.activities[idx];
              if (slot) {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 bg-primary-container/20 rounded-2xl p-3 border border-primary/20"
                  >
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
                      className="p-1.5 rounded-full hover:bg-error-container/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
                      aria-label={`${vi.explore.favorite_remove} ${slot.name}`}
                    >
                      <span className="material-symbols-outlined text-on-surface-variant hover:text-error text-[18px]">remove_circle</span>
                    </button>
                  </motion.div>
                );
              }
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 rounded-2xl p-3 border-2 border-dashed border-outline-variant/50 bg-surface-container-low/50"
                >
                  <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-outline-variant text-[24px]">add_location</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-label-sm text-outline font-bold">{originalActivity?.time || `Slot ${idx + 1}`}</p>
                    <p className="text-on-surface-variant text-body-md">{t.no_places_selected}</p>
                    <p className="text-[11px] text-outline-variant">{t.add_place_hint}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigate to Explore */}
          <button
            type="button"
            onClick={onNavigateToExplore}
            className="w-full mt-4 py-3 rounded-2xl border border-primary/30 bg-white/70 text-primary font-bold hover:bg-primary-container/35 transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t.explore_button}
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            {t.explore_button}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          {/* Add Slot Button */}
          <button
            onClick={onAddSlot}
            className="w-full mt-3 py-3 rounded-2xl border-2 border-dashed border-primary/40 text-primary font-bold hover:bg-primary-container/20 transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t.add_location}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {t.add_location}
          </button>

          {/* Total & Confirm */}
          <div className="bg-surface-container-low rounded-2xl p-4 mt-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-body-md text-on-surface-variant">{t.total_label ?? 'Tổng'}</span>
              <span className="text-title-md font-bold text-primary">
                {formatVND(comboSlots.filter(Boolean).reduce((sum, s) => sum + (s?.price ?? s?.cost ?? 0), 0))}
              </span>
            </div>
            <button
              onClick={allFilled ? onConfirmCombo : undefined}
              disabled={!allFilled}
              className={`w-full py-4 rounded-full font-bold text-body-lg flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                allFilled
                  ? 'bg-primary text-on-primary shadow-xl hover:scale-[1.02] cursor-pointer'
                  : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-50'
              }`}
              aria-label={allFilled ? t.confirm_schedule : `${t.waiting_selection} (${filledCount}/${comboSlots.length})`}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {allFilled ? 'check_circle' : 'hourglass_empty'}
              </span>
              {allFilled ? t.confirm_schedule : `${t.waiting_selection} (${filledCount}/${comboSlots.length})`}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ===== Normal Dashboard =====
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-24 relative">
      <h1 style={srOnlyStyle}>{tc.app_name} - {t.welcome} {userName}</h1>

      {/* Header — Avatar + Welcome + Date Miles */}
      <header className="sticky top-0 z-40 glass-card px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onAvatarClick} 
          className="flex items-center gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          aria-label={`${t.welcome} ${userName}`}
        >
          <div className="size-12 rounded-full overflow-hidden border-2 border-primary-container group-hover:border-primary transition-colors shadow-sm">
            <img 
              alt={userName} 
              className="w-full h-full object-cover" 
              src={userAvatar}
            />
          </div>
          <div>
            <p className="text-on-surface-variant text-label-sm text-left">{t.welcome}</p>
            <p className="text-headline-md font-bold text-on-surface text-left">{userName}</p>
          </div>
        </button>
        <div 
          className="bg-primary-fixed px-4 py-2 rounded-full flex items-center gap-2 shadow-sm"
          role="status"
          aria-label={`${t.date_miles}: ${dateMiles}`}
        >
          <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">stars</span>
          <span className="text-on-primary-fixed font-bold text-label-md">{dateMiles} {t.date_miles}</span>
        </div>
      </header>

      <main className="px-6 space-y-8 mt-6">

        {/* Weather Card */}
        <section className="glass-card rounded-[32px] p-5 sm:p-6 border-none bg-gradient-to-br from-primary/10 via-secondary/10 to-background shadow-xl relative overflow-hidden">
          <h2 style={srOnlyStyle}>{t.weather?.details ?? 'Thời tiết'}</h2>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {weatherData ? (
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 gap-3">
                <p className="text-primary font-bold text-label-sm uppercase tracking-[0.15em]">{dateStr}</p>
                <div className="bg-white/40 p-3 rounded-2xl backdrop-blur-md shadow-sm border border-white/20">
                  <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {weatherData.weather?.[0]?.main === 'Rain' ? 'rainy' : weatherData.weather?.[0]?.main === 'Clouds' ? 'cloud' : 'light_mode'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-3 min-w-0">
                <h3 className="text-[44px] sm:text-[56px] font-black leading-none text-on-surface tracking-tighter">
                  {Math.round(weatherData.main?.temp ?? 0)}°
                </h3>
                <div className="pb-1 sm:pb-2 min-w-0">
                  <p className="text-on-surface font-bold text-body-lg capitalize leading-tight break-words">{weatherData.weather?.[0]?.description}</p>
                  <p className="text-on-surface-variant text-label-md break-words">{weatherData.name} • {t.weather?.feels_like ?? 'Cảm giác như'} {Math.round(weatherData.main?.feels_like ?? 0)}°</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 pt-3 border-t border-white/30" role="table" aria-label="Thông tin thời tiết chi tiết">
                <div className="text-center" role="cell">
                  <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">water_drop</span>
                  <p className="text-label-sm text-on-surface mt-1 font-bold">{weatherData.main?.humidity ?? '--'}%</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{t.weather?.humidity ?? 'Độ ẩm'}</p>
                </div>
                <div className="text-center" role="cell">
                  <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">air</span>
                  <p className="text-label-sm text-on-surface mt-1 font-bold">{Math.round(weatherData.wind?.speed ?? 0)} m/s</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{t.weather?.wind ?? 'Gió'}</p>
                </div>
                <div className="text-center" role="cell">
                  <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">visibility</span>
                  <p className="text-label-sm text-on-surface mt-1 font-bold">{Math.round((weatherData.visibility ?? 10000) / 1000)} km</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{t.weather?.visibility ?? 'Tầm nhìn'}</p>
                </div>
              </div>
              <button
                onClick={() => onWeatherClick?.()}
                className="flex items-center gap-2 text-primary font-bold text-label-md bg-primary-container/30 px-4 py-2 rounded-full hover:bg-primary-container/50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t.weather?.details ?? 'Chi tiết thời tiết'}
              >
                {t.weather?.details ?? 'Chi tiết thời tiết'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6 w-full relative z-10" aria-label={tc.loading}>
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-24 bg-surface-container-high/60 rounded-2xl animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-surface-container-high/60 rounded-full animate-pulse" />
                    <div className="h-3 w-24 bg-surface-container-high/60 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/20">
                  {[0,1,2].map(i => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 bg-surface-container-high/60 rounded-full animate-pulse" />
                      <div className="w-10 h-3.5 bg-surface-container-high/60 rounded-full animate-pulse" />
                      <div className="w-8 h-2.5 bg-surface-container-high/60 rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Planner CTAs */}
        <section className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowAiPlanner(!showAiPlanner)}
              className={`p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${showAiPlanner ? 'border-primary bg-primary-container/20 shadow-md' : 'border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-high'}`}
              aria-expanded={showAiPlanner}
              aria-controls="ai-planner-section"
            >
              <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="font-bold text-primary">{t.ai_combo.create}</span>
            </button>
            <button 
              onClick={onManualCombo}
              className="p-4 rounded-[24px] border-2 border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-high transition-all flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
              aria-label={t.ai_combo.manual}
            >
              <span className="material-symbols-outlined text-[32px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>edit_calendar</span>
              <span className="font-bold text-tertiary">{t.ai_combo.manual}</span>
            </button>
          </div>
        </section>

        {/* AI Date Planner Section */}
        <AnimatePresence>
        {showAiPlanner && (
        <motion.section 
          id="ai-planner-section"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-6 overflow-hidden"
        >
          <h2 style={srOnlyStyle}>{t.ai_combo.create}</h2>

          <div className="space-y-3">
            <label id="budget-label" className="text-label-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">payments</span> {t.ai_combo.budget}
            </label>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="budget-label">
              {BUDGET_OPTIONS.map(b => (
                <button 
                  key={b}
                  onClick={() => onBudgetChange(b)}
                  className={`px-5 py-2 rounded-full font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                    budget === b 
                      ? "bg-primary text-on-primary shadow-md" 
                      : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
                  }`}
                  aria-checked={budget === b}
                  role="radio"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label id="companion-label" className="text-label-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">favorite</span> {t.ai_combo.partner}
            </label>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="companion-label">
              {COMPANION_OPTIONS.map(c => (
                <button 
                  key={c}
                  onClick={() => onCompanionChange(c)}
                  className={`px-5 py-2 rounded-full font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                    companion === c 
                      ? "bg-primary text-on-primary shadow-md" 
                      : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
                  }`}
                  aria-checked={companion === c}
                  role="radio"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-label-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">schedule</span> {t.ai_combo.time_range}
            </label>
            <div className="flex items-center gap-3 glass-card p-4 rounded-lg">
              <div className="flex-1 text-center">
                <p className="text-label-sm text-on-surface-variant">{t.ai_combo.from}</p>
                <input 
                  type="time" 
                  aria-label={t.ai_combo.from}
                  value={startTime} 
                  onChange={e => onTimeChange(e.target.value, endTime)} 
                  className="w-full bg-transparent border-none text-center text-body-lg font-bold text-on-surface p-0 focus:ring-2 focus:ring-primary rounded-md [&::-webkit-calendar-picker-indicator]:opacity-50 cursor-pointer"
                />
              </div>
              <div className="w-px h-8 bg-outline-variant"></div>
              <div className="flex-1 text-center">
                <p className="text-label-sm text-on-surface-variant">{t.ai_combo.to}</p>
                <input 
                  type="time" 
                  aria-label={t.ai_combo.to}
                  value={endTime} 
                  onChange={e => onTimeChange(startTime, e.target.value)} 
                  className="w-full bg-transparent border-none text-center text-body-lg font-bold text-on-surface p-0 focus:ring-2 focus:ring-primary rounded-md [&::-webkit-calendar-picker-indicator]:opacity-50 cursor-pointer"
                />
              </div>
              <span className="material-symbols-outlined text-outline" aria-hidden="true">calendar_today</span>
            </div>
          </div>

          <div className="space-y-3">
            <label id="interests-label" className="text-label-md text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">interests</span> {t.ai_combo.interests}
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="interests-label">
              {categories.map(cat => {
                const isSelected = preferences.includes(cat);
                return (
                  <button 
                    key={cat}
                    onClick={() => onPreferenceToggle(cat)}
                    className={`px-4 py-1.5 rounded-full text-label-md font-medium border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-1 ${
                      isSelected 
                        ? "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-container shadow-sm" 
                        : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
                    }`}
                    aria-pressed={isSelected}
                  >
                    # {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            disabled={isGenerating}
            onClick={onGenerate}
            className="w-full py-5 rounded-full bg-primary text-on-primary font-bold text-body-lg flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-70 disabled:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={isGenerating ? t.ai_combo.creating : t.ai_combo.create}
          >
            {isGenerating ? (
              <span className="material-symbols-outlined text-[28px] animate-spin" aria-hidden="true">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">bolt</span>
            )}
            {isGenerating ? t.ai_combo.creating : t.ai_combo.create}
          </button>
        </motion.section>
        )}
        </AnimatePresence>

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
      </main>
    </div>
  );
}
