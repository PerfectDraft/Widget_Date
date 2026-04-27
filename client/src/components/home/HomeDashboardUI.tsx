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
        {/* Modern Weather & Date Banner (W3: Enlarged weather, added date) */}
        <section className="glass-card rounded-[32px] p-8 border-none bg-gradient-to-br from-primary/10 via-secondary/10 to-background shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary font-bold text-label-md uppercase tracking-[0.2em] mb-1">{dateStr}</p>
                <h2 className="text-headline-lg font-black text-on-surface">Chào buổi sáng, {userName.split(' ')[0]}!</h2>
              </div>
              <div className="bg-white/40 dark:bg-black/20 p-4 rounded-3xl backdrop-blur-md shadow-sm border border-white/20">
                <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {weatherData?.weather[0]?.main === 'Rain' ? 'rainy' : weatherData?.weather[0]?.main === 'Clouds' ? 'cloud' : 'light_mode'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {weatherData ? (
                <>
                  <h3 className="text-[64px] font-black leading-none text-on-surface tracking-tighter">
                    {Math.round(weatherData.main.temp)}°C
                  </h3>
                  <div className="space-y-1">
                    <p className="text-on-surface-variant font-bold text-body-lg capitalize flex items-center gap-2">
                       {weatherData.weather[0]?.description} 
                       <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                       {weatherData.name}
                    </p>
                    <p className="text-on-surface-variant/70 text-label-md">Thời tiết thật tuyệt để đi hẹn hò!</p>
                  </div>
                </>
              ) : (
                <div className="animate-pulse flex items-center gap-6 w-full">
                  <div className="h-20 w-32 bg-surface-container-high rounded-3xl"></div>
                  <div className="space-y-3 flex-1">
                    <div className="h-6 w-1/2 bg-surface-container-high rounded-full"></div>
                    <div className="h-4 w-1/3 bg-surface-container-high rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            
            <button className="flex items-center gap-2 text-primary font-bold text-label-md bg-primary-container/30 px-4 py-2 rounded-full hover:bg-primary-container/50 transition-colors">
              Xem chi tiết thời tiết
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>

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
            onRetry={onGenerate}
            formatVND={formatVND}
          />
        )}
      </main>
    </div>
  );
}
