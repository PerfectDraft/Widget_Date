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
          <div
            className="h-1.5 rounded-full bg-surface-container-high mb-5 overflow-hidden