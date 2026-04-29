import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import { Toast } from './components/Toast';

// Hooks
import { useWeather } from './hooks/useWeather';
import { useReward } from './hooks/useReward';
import { useChat } from './hooks/useChat';
import { useToast } from './hooks/useToast';
import { useDriveSync } from './hooks/useDriveSync';

// Pages
import { HomeView } from './components/home/HomeView';
import { ExploreView } from './components/explore/ExploreView';
import { DateMilesView } from './components/wallet/DateMilesView';
import { ChatPanel } from './components/chat/ChatPanel';
import { PaymentModal } from './components/modals/PaymentModal';
import { RideModal } from './components/modals/RideModal';
import { ImageViewer } from './components/modals/ImageViewer';
import { AuthView } from './components/auth/AuthView';
import { ProfileView } from './components/profile/ProfileView';
import { WeatherDetailView } from './components/weather/WeatherDetailView';
import { ComboActionModal } from './components/modals/ComboActionModal';

import type { Tab, Combo, LocationItem, ComboSlot } from './types';
import { CATEGORY_SLOT_MAP } from './types';

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// localStorage helpers
function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadJson('wd_auth', false));
  const [phone, setPhone] = useState<string | null>(() => loadJson('wd_phone', null));
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showProfile, setShowProfile] = useState(false);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  const { toastMessage, showToast, hideToast } = useToast();
  const weatherData = useWeather();
  const { userReward, setUserReward, earnMiles, incrementDates } = useReward(showToast);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const chat = useChat(currentUserId);

  // User Stats & Preferences (W6)
  const [preferences, setPreferences] = useState<string[]>(() => loadJson('wd_prefs', ['Cafe']));

  // Combo state — restore from localStorage
  const [combos, setCombos] = useState<Combo[]>(() => loadJson('wd_combos', []));
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [comboActionModal, setComboActionModal] = useState<Combo | null>(null);

  // Modal state
  const [rideModalLoc, setRideModalLoc] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [realImageLoc, setRealImageLoc] = useState<{ name: string; mapsUri: string; desc?: string; imageUrl?: string } | null>(null);

  // Saved places ("Thêm vào Combo" from Explore)
  const [savedPlaces, setSavedPlaces] = useState<LocationItem[]>([]);

  // Combo Focus Mode
  const [activeCombo, setActiveCombo] = useState<Combo | null>(null);
  const [comboSlots, setComboSlots] = useState<ComboSlot[]>([]);

  // Persist state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('wd_auth', JSON.stringify(isAuthenticated));
    localStorage.setItem('wd_phone', JSON.stringify(phone));
  }, [isAuthenticated, phone]);

  useEffect(() => {
    localStorage.setItem('wd_combos', JSON.stringify(combos));
  }, [combos]);

  useEffect(() => {
    localStorage.setItem('wd_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Sync state
  const drive = useDriveSync(
    combos, 
    userReward, 
    chat.chatMessages, 
    setCombos, 
    setUserReward, 
    chat.setChatMessages,
    preferences
  );

  // Update userId when drive identifier or auth phone changes
  useEffect(() => {
    setCurrentUserId(phone || drive.userIdentifier);
  }, [drive.userIdentifier, phone]);

  const handleAuthSuccess = (phone: string, _userData: any) => {
    setPhone(phone);
    setIsAuthenticated(true);
    showToast(`Chào mừng trở lại, ${phone}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPhone(null);
    setCurrentUserId(null);
    setCombos([]);
    setPreferences(['Cafe']);
    setShowProfile(false);
    // Clear all persisted data
    localStorage.removeItem('wd_auth');
    localStorage.removeItem('wd_phone');
    localStorage.removeItem('wd_combos');
    localStorage.removeItem('wd_prefs');
    showToast('Đã đăng xuất');
  };

  if (!isAuthenticated) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  // --- Combo Focus Mode Handlers ---

  const handleSelectCombo = (combo: Combo) => {
    setComboActionModal(combo);
  };

  const proceedWithCustomize = (combo: Combo) => {
    setActiveCombo(combo);
    setComboActionModal(null);
    setComboSlots(combo.activities.map((act) => ({
      id: Math.random().toString(36).substring(7),
      name: act.name,
      address: act.address,
      category: act.category || '',
      price: act.cost,
      lat: act.lat,
      lng: act.lng,
      imageUrl: act.imageUrl || ''
    })));
    showToast(`Đã chọn combo "${combo.theme}" để tùy chỉnh!`);
  };

  const proceedWithPayNow = (combo: Combo) => {
    setSelectedCombo(combo);
    setShowPaymentModal(true);
    setComboActionModal(null);
  };

  const handleManualCombo = () => {
    setActiveCombo({
      id: Math.random().toString(36).substring(7),
      theme: 'Tự tạo Combo',
      icon: 'edit_calendar',
      score: 10,
      totalCost: 0,
      activities: []
    });
    setComboSlots([null, null, null]);
    showToast('Tạo combo mới thành công. Hãy thêm địa điểm từ Khám phá!');
  };

  const handleAddSlot = () => {
    setComboSlots(prev => [...prev, null]);
  };

  const handleClearCombo = () => {
    setActiveCombo(null);
    setComboSlots([]);
    showToast('Đã huỷ combo');
  };

  const handleConfirmCombo = () => {
    if (!activeCombo || comboSlots.some(s => s === null)) return;
    const filledSlots = comboSlots as LocationItem[];
    const totalPrice = filledSlots.reduce((sum, loc) => sum + (loc.price || loc.cost || 0), 0);
    const finalCombo: Combo = {
      ...activeCombo,
      totalCost: totalPrice || activeCombo.totalCost,
      activities: filledSlots.map((loc, i) => ({
        time: activeCombo.activities[i]?.time || `${17 + i}:00`,
        name: loc.name,
        address: loc.address,
        cost: loc.price || loc.cost || activeCombo.activities[i]?.cost || 0,
        lat: loc.lat,
        lng: loc.lng,
        imageUrl: loc.imageUrl,
        category: loc.category,
      })),
    };
    setSelectedCombo(finalCombo);
    setShowPaymentModal(true);
  };

  /** Smart slot-filling: match loc.category to combo activity keywords */
  const findMatchingSlotIndex = (loc: LocationItem): number => {
    const locCat = (loc.category || '').toLowerCase();
    const locName = loc.name.toLowerCase();
    const locTheme = (loc.theme || '').toLowerCase();

    for (let i = 0; i < comboSlots.length; i++) {
      if (comboSlots[i] !== null) continue; // already filled
      const act = activeCombo?.activities[i];
      if (!act) continue;
      const actName = act.name.toLowerCase();

      // Check each slot map category
      for (const keywords of Object.values(CATEGORY_SLOT_MAP)) {
        const locMatches = keywords.some(kw => locCat.includes(kw) || locName.includes(kw) || locTheme.includes(kw));
        const actMatches = keywords.some(kw => actName.includes(kw));
        if (locMatches && actMatches) return i;
      }
    }
    // Fallback: first empty slot
    return comboSlots.findIndex(s => s === null);
  };

  const handleAddToCombo = (loc: LocationItem) => {
    if (!activeCombo) {
      // No combo active — add to saved places list
      setSavedPlaces(prev => {
        if (prev.some(p => p.id === loc.id)) {
          showToast(`${loc.name} đã có trong danh sách rồi!`);
          return prev;
        }
        showToast(`Đã thêm ${loc.name} vào danh sách! (${prev.length + 1} địa điểm)`);
        return [...prev, loc];
      });
      return;
    }

    // Combo Focus Mode — fill slot
    const allFilled = comboSlots.every(s => s !== null);
    if (allFilled) {
      showToast('Combo đã đầy đủ! Bấm "Chốt lịch" trên Home.');
      return;
    }

    const slotIdx = findMatchingSlotIndex(loc);
    if (slotIdx === -1) {
      showToast('Không còn slot trống!');
      return;
    }

    setComboSlots(prev => {
      const next = [...prev];
      next[slotIdx] = loc;
      return next;
    });
    const filled = comboSlots.filter(s => s !== null).length + 1;
    showToast(`Đã thêm ${loc.name} vào slot ${slotIdx + 1}! (${filled}/${comboSlots.length})`);
  };

  const handlePayment = () => {
    if (!selectedCombo) return;
    setPaymentSuccess(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    earnMiles(100, `Hoàn thành Combo: ${selectedCombo.theme}`);
    incrementDates();
    showToast('Thanh toán thành công & Nhận 100 Miles! 🎉');
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      setSelectedCombo(null);
      setActiveTab('wallet');
    }, 2000);
  };

  const handleRide = (app: 'grab' | 'be' | 'xanhsm', name: string, lat: number, lng: number) => {
    const encodedName = encodeURIComponent(name);
    const urls: Record<string, string> = {
      grab: `https://link.grab.com/open?screenType=BOOKING&dropOffLatitude=${lat}&dropOffLongitude=${lng}&dropOffName=${encodedName}`,
      be: `be://booking?dropoff_lat=${lat}&dropoff_lng=${lng}&dropoff_address=${encodedName}`,
      xanhsm: `xanhsm://booking?dropoff_lat=${lat}&dropoff_lng=${lng}&dropoff_address=${encodedName}`,
    };
    window.open(urls[app], '_blank');
    showToast(`Đang mở app ${app === 'grab' ? 'Grab' : app === 'be' ? 'Be' : 'Xanh SM'}...`);
    setRideModalLoc(null);
  };

  const location = 'Hà Nội';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-pink-200">
      <Toast message={toastMessage} onClose={hideToast} />

      {/* Main Content — No top-level header, each view has its own */}
      <main className="max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeView
              weatherData={weatherData?.current ?? null}
              showToast={showToast}
              setSelectedCombo={handleSelectCombo}
              setShowPaymentModal={setShowPaymentModal}
              setRideModalLoc={setRideModalLoc}
              setRealImageLoc={setRealImageLoc}
              combos={combos}
              setCombos={setCombos}
              openChat={() => chat.setIsChatOpen(true)}
              onAvatarClick={() => setShowProfile(true)}
              onWeatherClick={() => setShowWeatherDetail(true)}
              formatVND={formatVND}
              location={location}
              preferences={preferences}
              setPreferences={setPreferences}
              activeCombo={activeCombo}
              comboSlots={comboSlots}
              onClearCombo={handleClearCombo}
              onConfirmCombo={handleConfirmCombo}
              onRemoveSlot={(idx) => setComboSlots(prev => { const n = [...prev]; n[idx] = null; return n; })}
              onManualCombo={handleManualCombo}
              onAddSlot={handleAddSlot}
              setActiveCombo={setActiveCombo}
            />
          )}
          {activeTab === 'explore' && (
            <ExploreView
              showToast={showToast}
              setRideModalLoc={setRideModalLoc}
              setRealImageLoc={setRealImageLoc}
              formatVND={formatVND}
              onAddToCombo={handleAddToCombo}
              savedPlacesCount={savedPlaces.length}
              activeCombo={activeCombo}
              comboSlots={comboSlots}
            />
          )}
          {activeTab === 'wallet' && <DateMilesView userReward={userReward} />}
          {activeTab === 'history' && <DateMilesView userReward={userReward} historyOnly />}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav aria-label="Điều hướng chính" className="fixed bottom-0 left-0 right-0 glass-card pb-safe z-40">
        <div className="max-w-md mx-auto px-4 py-2 flex justify-around items-end">
          {([
            { id: 'home', icon: 'home', label: 'Trang chủ' },
            { id: 'explore', icon: 'explore', label: 'Khám phá' },
            { id: 'history', icon: 'history', label: 'Lịch sử' },
            { id: 'wallet', icon: 'emoji_events', label: 'Thành tích' },
          ] as const).map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-300 relative cursor-pointer',
                  isActive ? 'text-primary -translate-y-1' : 'text-on-surface-variant/60 hover:text-on-surface-variant'
                )}
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute -inset-2.5 bg-primary-fixed/50 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className={cn(
                      'material-symbols-outlined text-[24px] relative z-10 transition-all',
                      isActive && 'font-bold'
                    )}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className={cn(
                  'text-[10px] font-semibold transition-all',
                  isActive ? 'text-primary' : 'text-on-surface-variant/60'
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile Screen (overlay) */}
      <AnimatePresence>
        {showProfile && (
          <ProfileView
            phone={phone || ''}
            userName="Hưng"
            userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuD5fQvzhgWAnCEj7ACr7c_XPwX5u48krOmZuXxBChh911zOWYQRJcnaNtoQqplogf2AXUFicP9kn3TIbu-AI1FrobzW7zy73oO1v4ehbZKCtmSt1KXQJvIubhuBTzIGi1c0kzLLvt_Ykxn2ypNtz5YplxUHttU4mqRkMU9L82XDuoouQij2ZUUSpiP13o49_TSgYHOa0ZNTSCx4Am6e1gxZ83r7nQQ9uQpArgF6iu6SjN34NGisxjWTJ-xiImchPKYVctLQsyydIUBS"
            dateMiles={userReward.totalMiles}
            totalDates={userReward.completedDates}
            isDriveSynced={drive.isLoggedIn}
            isSyncing={drive.isSyncing}
            onDriveLogin={drive.login}
            onDriveLogout={drive.logout}
            onLogout={handleLogout}
            onBack={() => setShowProfile(false)}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Weather Detail Screen (overlay) */}
      <AnimatePresence>
        {showWeatherDetail && (
          <WeatherDetailView
            weatherData={weatherData}
            onBack={() => setShowWeatherDetail(false)}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <PaymentModal
        show={showPaymentModal}
        combo={selectedCombo}
        paymentSuccess={paymentSuccess}
        userReward={userReward}
        onClose={() => setShowPaymentModal(false)}
        onPay={handlePayment}
        formatVND={formatVND}
      />
      <ComboActionModal
        show={!!comboActionModal}
        combo={comboActionModal}
        onClose={() => setComboActionModal(null)}
        onCustomize={proceedWithCustomize}
        onPayNow={proceedWithPayNow}
      />
      <RideModal loc={rideModalLoc} onClose={() => setRideModalLoc(null)} onRide={handleRide} />
      <ImageViewer loc={realImageLoc} onClose={() => setRealImageLoc(null)} />

      {/* Chat FAB + Panel */}
      <button onClick={() => chat.setIsChatOpen(true)} className="fixed bottom-24 right-4 z-40 bg-primary hover:bg-on-primary-container text-on-primary rounded-full p-4 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
        <Bot className="w-6 h-6 animate-bounce" />
      </button>
      <ChatPanel {...chat} />

      {toastMessage && <Toast message={toastMessage} onClose={hideToast} />}
    </div>
  );
}
