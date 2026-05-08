import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ComboList } from './ComboList';
import { extractPlaceImage } from '../../lib/utils';
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
  userName: string;
  userAvatar: string;
  dateMiles: number;
  openChat: () => void;
  onAvatarClick: () => void;
  weatherData: WeatherData | null;
  onWeatherClick?: () => void;
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
  isGenerating: boolean;
  onGenerate: () => void;
  combos: Combo[];
  error: string | null;
  onSelectCombo: (combo: Combo) => void;
  onSelectVenue?: (venue: Activity) => void;
  formatVND: (n: number) => string;
  activeCombo: Combo | null;
  comboSlots: ComboSlot[];
  onClearCombo: () => void;
  onConfirmCombo: () => void;
  onRemoveSlot: (idx: number) => void;
  onManualCombo: () => void;
  onAddSlot: () => void;
  setActiveCombo: (combo: Combo) => void;
  onNavigateToExplore: () => void;
}

export function HomeDashboardUI(props: HomeDashboardUIProps) {
  const {
    userName,
    userAvatar,
    dateMiles,
    openChat,
    onAvatarClick,
    weatherData,
    onWeatherClick,
    budget,
    onBudgetChange,
    companion,
    onCompanionChange,
    startTime,
    endTime,
    onTimeChange,
    preferences,
    categories,
    onPreferenceToggle,
    isGenerating,
    onGenerate,
    combos,
    error,
    onSelectCombo,
    onSelectVenue,
    formatVND,
    activeCombo,
    comboSlots,
    onClearCombo,
    onConfirmCombo,
    onRemoveSlot,
    onManualCombo,
    onAddSlot,
    setActiveCombo,
    onNavigateToExplore,
  } = props;

  const t = vi.dashboard;
  const tc = vi.common;
  const filledCount = comboSlots.filter((slot) => slot !== null).length;
  const allFilled = comboSlots.length > 0 && filledCount === comboSlots.length;
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

  if (activeCombo) {
    return (
      <motion.div
        key="focus-mode"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-background text-on-background font-body-md min-h-screen flex flex-col"
        role="dialog"
        aria-labelledby="focus-mode-title"
      >
        <header className="sticky top-0 z-40 px-6 py-4 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <input
                id="focus-mode-title"
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
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${comboSlots.length ? (filledCount / comboSlots.length) * 100 : 0}%` }}
            />
          </div>

          <section className="space-y-3" aria-label={t.selected_places_count}>
            {comboSlots.length === 0 && (
              <div className="glass-card rounded-3xl p-5 text-center text-on-surface-variant">{t.no_places_selected}</div>
            )}

            {comboSlots.map((slot, idx) => (
              <div key={idx} className="glass-card rounded-3xl border border-outline-variant/20 overflow-hidden">
                {slot ? (
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container shrink-0">
                      {extractPlaceImage(slot.imageUrl) ? (
                        <img
                          src={extractPlaceImage(slot.imageUrl)}
                          alt={slot.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-on-surface-variant text-xs">#{idx + 1}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-on-surface truncate">{slot.name}</p>
                      <p className="text-label-sm text-on-surface-variant truncate">{slot.address || slot.category || '---'}</p>
                      <p className="text-label-sm text-primary font-bold">{formatVND(slot.price || slot.cost || 0)}</p>
                    </div>
                    <button
                      onClick={() => onRemoveSlot(idx)}
                      className="p-2 rounded-full hover:bg-error-container/40 text-on-surface-variant hover:text-error transition-colors"
                      aria-label={`${tc.cancel} ${slot.name}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onNavigateToExplore}
                    className="w-full text-left p-4 flex items-center gap-3 hover:bg-primary-container/20 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-container/40 grid place-items-center text-primary">
                      <span className="material-symbols-outlined">add_location_alt</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-semibold">{t.no_places_selected}</p>
                      <p className="text-label-sm text-on-surface-variant">{t.add_place_hint}</p>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </section>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNavigateToExplore}
              className="flex-1 py-3 rounded-full border border-primary/40 text-primary font-bold hover:bg-primary-container/20 transition-colors"
            >
              {t.explore_button}
            </button>
            <button
              onClick={onAddSlot}
              className="flex-1 py-3 rounded-full border border-outline-variant/40 text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors"
            >
              {t.add_location}
            </button>
          </div>
        </main>

        <footer className="sticky bottom-0 z-30 px-6 pb-6 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent">
          <button
            onClick={onConfirmCombo}
            disabled={!allFilled}
            className={`w-full py-3 rounded-full font-bold transition-all ${
              allFilled
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
            }`}
          >
            {allFilled ? t.confirm_schedule : t.waiting_selection}
          </button>
        </footer>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="min-h-screen bg-background px-6 pb-24 pt-6 space-y-6"
    >
      <header className="flex items-center justify-between gap-3">
        <button onClick={onAvatarClick} className="flex items-center gap-3 min-w-0 cursor-pointer">
          <img src={userAvatar} alt="Avatar" className="w-11 h-11 rounded-2xl object-cover" />
          <div className="text-left min-w-0">
            <p className="text-label-sm text-on-surface-variant truncate">{t.welcome}</p>
            <p className="font-bold text-on-surface truncate">{userName}</p>
          </div>
        </button>
        <button
          onClick={openChat}
          className="px-3 py-2 rounded-full bg-primary-container/40 text-primary text-label-sm font-bold hover:bg-primary-container/60 transition-colors cursor-pointer"
        >
          Chat AI
        </button>
      </header>

      <section className="glass-card rounded-3xl p-4 flex items-center justify-between">
        <div>
          <p className="text-label-sm text-on-surface-variant">{dateStr}</p>
          <p className="font-bold text-on-surface">{t.date_miles}: {dateMiles}</p>
        </div>
        {weatherData ? (
          <button onClick={onWeatherClick} className="text-right cursor-pointer">
            <p className="font-bold text-on-surface">{Math.round(weatherData.main.temp)}°C</p>
            <p className="text-label-sm text-on-surface-variant">{weatherData.name}</p>
          </button>
        ) : (
          <div className="text-label-sm text-on-surface-variant">{tc.loading}</div>
        )}
      </section>

      <section className="glass-card rounded-3xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-on-surface">{t.ai_combo.create}</h2>
          <button
            onClick={() => setShowAiPlanner((prev) => !prev)}
            className="text-primary text-label-sm font-bold cursor-pointer"
          >
            {showAiPlanner ? tc.cancel : t.ai_combo.create}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showAiPlanner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <p className="text-label-sm text-on-surface-variant mb-2">{t.ai_combo.budget}</p>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => onBudgetChange(option)}
                      className={`px-3 py-2 rounded-full text-label-sm font-semibold transition-colors ${
                        budget === option
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container/30'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-label-sm text-on-surface-variant mb-2">{t.ai_combo.partner}</p>
                <div className="flex flex-wrap gap-2">
                  {COMPANION_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => onCompanionChange(option)}
                      className={`px-3 py-2 rounded-full text-label-sm font-semibold transition-colors ${
                        companion === option
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container/30'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-label-sm text-on-surface-variant">
                  {t.ai_combo.from}
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => onTimeChange(e.target.value, endTime)}
                    className="mt-1 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-on-surface"
                  />
                </label>
                <label className="text-label-sm text-on-surface-variant">
                  {t.ai_combo.to}
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => onTimeChange(startTime, e.target.value)}
                    className="mt-1 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-on-surface"
                  />
                </label>
              </div>

              <div>
                <p className="text-label-sm text-on-surface-variant mb-2">{t.ai_combo.interests}</p>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => onPreferenceToggle(category)}
                      className={`px-3 py-2 rounded-full text-label-sm font-semibold transition-colors ${
                        preferences.includes(category)
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container/30'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`w-full py-3 rounded-full font-bold transition-colors ${
                  isGenerating
                    ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                    : 'bg-primary text-on-primary hover:opacity-95'
                }`}
              >
                {isGenerating ? t.ai_combo.creating : t.ai_combo.create}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onManualCombo}
          className="w-full py-3 rounded-full border border-primary/40 text-primary font-bold hover:bg-primary-container/20 transition-colors"
        >
          {t.ai_combo.manual}
        </button>
      </section>

      <ComboList
        combos={combos}
        isLoading={isGenerating}
        error={error}
        onSelectCombo={onSelectCombo}
        onSelectVenue={onSelectVenue}
        onRetry={onGenerate}
        formatVND={formatVND}
      />

      <p style={srOnlyStyle}>Home dashboard content</p>
    </motion.div>
  );
}
