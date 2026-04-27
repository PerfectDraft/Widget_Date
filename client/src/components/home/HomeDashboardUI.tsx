import { HeartCrack, ArrowRight } from 'lucide-react';
import { ComboList } from './ComboList';
import type { Combo, Activity } from '../../types';

export interface HomeDashboardUIProps {
  // User Info
  userName: string;
  userAvatar: string;
  dateMiles: number;
  
  // Interactions
  openChat: () => void;

  // Weather Data
  weatherData: any | null; // Keep existing shape

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
}

export function HomeDashboardUI(props: HomeDashboardUIProps) {
  const {
    userName, userAvatar, dateMiles, openChat, weatherData,
    budget, onBudgetChange, companion, onCompanionChange,
    startTime, endTime, onTimeChange, preferences, categories, onPreferenceToggle,
    isGenerating, onGenerate,
    combos, error, onSelectCombo, onSelectVenue, formatVND
  } = props;

  // Budget Options per Stitch UI
  const BUDGET_OPTIONS = ['200K', '500K', '1M', '2M+'];
  
  // Companion Options
  const COMPANION_OPTIONS = ['Người yêu', 'Bạn bè', 'Crush'];

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-24 relative">
      {/* Header Section */}
      <header className="sticky top-0 z-40 glass-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full overflow-hidden border-2 border-primary-container">
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
        </div>
        <div className="bg-primary-fixed px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          <span className="text-on-primary-fixed font-bold text-label-md">{dateMiles} Date Miles</span>
        </div>
      </header>

      <main className="px-6 space-y-8 mt-6">
        {/* Weather Banner */}
        <section className="glass-card rounded-lg p-5 flex items-center justify-between border-none">
          <div className="flex items-center gap-4">
            <div className="bg-tertiary-fixed p-2 rounded-full text-on-tertiary-fixed">
              <span className="material-symbols-outlined">light_mode</span>
            </div>
            <div>
              {weatherData ? (
                <>
                  <h2 className="text-on-surface font-bold text-body-md">
                    {weatherData.name} • {Math.round(weatherData.main.temp)}°C, <span className="capitalize">{weatherData.weather[0]?.description}</span>
                  </h2>
                  <p className="text-on-surface-variant text-label-sm">Perfect weather for a date!</p>
                </>
              ) : (
                <div className="animate-pulse">
                  <h2 className="text-on-surface font-bold text-body-md bg-surface-container-high text-transparent rounded w-32">Loading...</h2>
                  <p className="text-on-surface-variant text-label-sm bg-surface-container-high text-transparent rounded mt-1 w-24">Loading info</p>
                </div>
              )}
            </div>
          </div>
          <button className="text-primary font-bold text-label-md flex items-center gap-1 cursor-pointer">
            See details
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </section>

        {/* Warning Banner (Copied from existing HomeView to preserve functionality) */}
        <div className="bg-error-container/20 border border-error-container shadow-sm rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={openChat}>
          <div className="relative z-10 flex items-start gap-4">
            <div className="bg-error-container p-2.5 rounded-full flex-shrink-0">
              <HeartCrack className="w-6 h-6 text-error" />
            </div>
            <div>
              <h3 className="text-error font-bold mb-1">Cảnh báo: Tình cảm đang nguội lạnh! 🧊</h3>
              <p className="text-on-error-container text-sm">Đã 18 ngày hai bạn chưa đi Date. Trò chuyện với AI để lên lịch hâm nóng tình cảm ngay nhé!</p>
              <button className="mt-3 text-xs font-bold text-error bg-error-container/50 hover:bg-error-container px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                Nhắn AI tư vấn gấp <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Date Planner Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h2 className="text-headline-md font-bold text-on-surface">Lên Lịch Hẹn Hò AI</h2>
          </div>

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
        </section>

        {/* Combo List with 4 visual states */}
        {(combos.length > 0 || isGenerating || error) && (
          <ComboList 
            combos={combos}
            isLoading={isGenerating}
            error={error}
            onSelectCombo={onSelectCombo}
            onSelectVenue={onSelectVenue}
            formatVND={formatVND}
          />
        )}
      </main>
    </div>
  );
}
