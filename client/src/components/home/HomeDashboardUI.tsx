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

  const BUDGET_OPTIONS = ['200K', '500K', '1M', '2M+'];
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
        <header className="sticky top-0 z-40 glass-card px-6 py-4 flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex flex-col flex-1 mr-4">
            <input
              type="text"
              aria-label={t.combo_name_label}
              value={activeCombo.theme}
              onChange={(e) => setActiveCombo({ ...activeCombo, theme: e.target.value })}
              className="text-headline-md font-bold text-on-surface bg-transparent border-none focus:ring-0 p-0 w-full"
            />
            <p className="text-label-sm text-on-surface-variant">
              {filledCount}/{comboSlots.length} {t.selected_places_count}
            </p>
          </div>
          <button
            onClick={onClearCombo}
            className="p-2 rounded-full hover:bg-error-container/40 transition-colors cursor-pointer group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
            aria-label={t.cancel_combo}
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-error text-[24px]">close</span>
          </button>
        </header>

        <div className="p-6">
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-surface-container-high mb-5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: comboSlots.length > 0 ? `${(filledCount / comboSlots.length) * 100}%` : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Slots grid */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {comboSlots.map((slot, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container border border-outline-variant/30"
              >
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                  <span className="text-label-sm font-bold text-on-primary-container">{idx + 1}</span>
                </div>
                {slot ? (
                  <>
                    <img
                      src={extractPlaceImage(slot)}
                      alt={slot.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md font-semibold text-on-surface truncate">{slot.name}</p>
                      <p className="text-label-sm text-on-surface-variant">{formatVND(slot.price_per_person ?? 0)}</p>
                    </div>
                    <button
                      onClick={() => onRemoveSlot(idx)}
                      className="p-1.5 rounded-full hover:bg-error-container/40 shrink-0 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
                      aria-label={`Xoá ${slot.name}`}
                    >
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">remove_circle</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-body-md text-on-surface-variant">{t.empty_slot_label}</p>
                    </div>
                    <button
                      onClick={onNavigateToExplore}
                      className="text-label-sm text-primary font-semibold hover:underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {t.add_place_btn}
                    </button>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Add slot button */}
          <button
            onClick={onAddSlot}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-outline-variant/60 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span className="text-label-md font-medium">{t.add_slot_btn}</span>
          </button>

          {/* Total & Confirm */}
          <div className="bg-surface-container-low rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-body-md text-on-surface-variant">{t.total_label}</span>
              <span className="text-title-md font-bold text-primary">
                {formatVND(comboSlots.filter(Boolean).reduce((sum, s) => sum + (s?.price_per_person ?? 0), 0))}
              </span>
            </div>
            <button
              onClick={onConfirmCombo}
              disabled={!allFilled}
              className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-semibold text-body-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98]"
            >
              {t.confirm_combo_btn}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ===== Normal Dashboard =====
  return (
    <div className="bg-background text-on-background font-body-md">
      {/* Top greeting bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <p className="text-label-sm text-on-surface-variant">{dateStr}</p>
          <h1 className="text-headline-sm font-bold text-on-surface">
            {t.greeting.replace('{name}', userName)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {weatherData && (
            <button
              onClick={onWeatherClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Thời tiết: ${weatherData.description}`}
            >
              <span className="text-base leading-none">{weatherData.icon}</span>
              <span>{weatherData.temp}°</span>
            </button>
          )}
          <button
            onClick={onAvatarClick}
            className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full cursor-pointer"
            aria-label="Mở hồ sơ"
          >
            <img src={userAvatar} alt={userName} className="w-9 h-9 rounded-full object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 bg-primary text-on-primary text-[9px] font-bold px-1 rounded-full leading-tight">
              {dateMiles}
            </span>
          </button>
        </div>
      </div>

      {/* AI Planner Card */}
      <div className="px-4 mb-4">
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
          {/* Card header – always visible */}
          <button
            className="w-full flex items-center justify-between px-5 py-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setShowAiPlanner(v => !v)}
            aria-expanded={showAiPlanner}
            aria-controls="ai-planner-body"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">auto_awesome</span>
              </div>
              <div className="text-left">
                <p className="text-body-md font-semibold text-on-surface">{t.ai_planner_title}</p>
                <p className="text-label-sm text-on-surface-variant">{t.ai_planner_subtitle}</p>
              </div>
            </div>
            <motion.span
              animate={{ rotate: showAiPlanner ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-on-surface-variant text-[20px]"
            >
              expand_more
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {showAiPlanner && (
              <motion.div
                id="ai-planner-body"
                key="ai-planner-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className="px-5 pb-5 space-y-4">
                  {/* Budget */}
                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-2">{t.budget_label}</label>
                    <div className="flex gap-2 flex-wrap">
                      {BUDGET_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => onBudgetChange(opt)}
                          className={`px-4 py-1.5 rounded-full text-label-md font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            budget === opt
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Companion */}
                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-2">{t.companion_label}</label>
                    <div className="flex gap-2 flex-wrap">
                      {COMPANION_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => onCompanionChange(opt)}
                          className={`px-4 py-1.5 rounded-full text-label-md font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            companion === opt
                              ? 'bg-secondary text-on-secondary'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-2">{t.time_label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={startTime}
                        onChange={e => onTimeChange(e.target.value, endTime)}
                        className="flex-1 px-3 py-2 rounded-xl bg-surface-container text-on-surface text-body-sm border border-outline-variant/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Giờ bắt đầu"
                      />
                      <span className="text-on-surface-variant">–</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={e => onTimeChange(startTime, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-surface-container text-on-surface text-body-sm border border-outline-variant/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Giờ kết thúc"
                      />
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <label className="block text-label-md text-on-surface-variant mb-2">{t.preferences_label}</label>
                    <div className="flex gap-2 flex-wrap">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => onPreferenceToggle(cat)}
                          className={`px-3 py-1.5 rounded-full text-label-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            preferences.includes(cat)
                              ? 'bg-tertiary-container text-on-tertiary-container'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate button */}
                  <button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-semibold text-body-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="material-symbols-outlined text-[20px]"
                        >
                          progress_activity
                        </motion.span>
                        {t.generating_btn}
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                        {t.generate_btn}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-4 px-4 py-3 rounded-2xl bg-error-container text-on-error-container text-body-sm flex items-center gap-2" role="alert">
          <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
          {error}
        </div>
      )}

      {/* Manual combo CTA */}
      <div className="px-4 mb-4">
        <button
          onClick={onManualCombo}
          className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[22px]">tune</span>
            <div className="text-left">
              <p className="text-body-md font-semibold">{t.manual_combo_title}</p>
              <p className="text-label-sm opacity-80">{t.manual_combo_subtitle}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>

      {/* Combo Results */}
      {combos.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-title-md font-bold text-on-surface mb-3">{t.suggested_combos_title}</h2>
          <ComboList
            combos={combos}
            onSelect={onSelectCombo}
            onSelectVenue={onSelectVenue}
            formatVND={formatVND}
          />
        </div>
      )}

      {/* sr-only helper */}
      <div style={srOnlyStyle} aria-live="polite" aria-atomic="true">
        {isGenerating ? t.generating_btn : ''}
      </div>
    </div>
  );
}
