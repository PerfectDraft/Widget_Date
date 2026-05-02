import { useState, useEffect, useCallback } from 'react';
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
import { HistoryView } from './components/history/HistoryView';
import { FashionView } from './components/fashion/FashionView';

import type { Tab, Combo, LocationItem, ComboSlot } from './types';
import { CATEGORY_SLOT_MAP } from './types';

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5fQvzhgWAnCEj7ACr7c_XPwX5u48krOmZuXxBChh911zOWYQRJcnaNtoQqplogf2AXUFicP9kn3TIbu-AI1FrobzW7zy73oO1v4ehbZKCtmSt1KXQJvIubhuBTzIGi1c0kzLLvt_Ykxn2ypNtz5YplxUHttU4mqRkMU9L82XDuoouQij2ZUUSpiP13o49_TSgYHOa0ZNTSCx4Am6e1gxZ83r7nQQ9uQpArgF6iu6SjN34NGisxjWTJ-xiImchPKYVctLQsyydIUBS';

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

  // User profile state
  const [userName, setUserName] = useState<string>(() => loadJson('wd_username', ''));
  const [userAvatar, setUserAvatar] = useState<string>(() => loadJson('wd_avatar', DEFAULT_AVATAR));

  const [preferences, setPreferences] = useState<string[]>(() => loadJson('wd_prefs', ['Cafe']));

  const [combos, setCombos] = useState<Combo[]>(() => loadJson('wd_combos', []));
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [comboActionModal, setComboActionModal] = useState<Combo | null>(null);

  const [rideModalLoc, setRideModalLoc] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [realImageLoc, setRealImageLoc] = useState<{ name: string; mapsUri: string; desc?: string; imageUrl?: string } | null>(null);

  const [savedPlaces, setSavedPlaces] = useState<LocationItem[]>([]);

  const [activeCombo, setActiveCombo] = useState<Combo | null>(null);
  const [comboSlots, setComboSlots] = useState<ComboSlot[]>([]);

  // Persist auth
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

  // Persist userName & userAvatar to localStorage
  useEffect(() => {
    localStorage.setItem('wd_username', JSON.stringify(userName));
  }, [userName]);
  useEffect(() => {
    localStorage.setItem('wd_avatar', JSON.stringify(userAvatar));
  }, [userAvatar]);

  // Load profile from DB when authenticated
  const loadProfile = useCallback(async (phoneNum: string) => {
    try {
      const res = await fetch(`/api/user?action=profile&phone=${encodeURIComponent(phoneNum)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.display_name) {
        setUserName(data.display_name);
      } else if (!loadJson('wd_username', '')) {
        setUserName(phoneNum);
      }
      if (data.avatar_url) setUserAvatar(data.avatar_url);
    } catch (e) {
      // silent fail — use cached values
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && phone) {
      loadProfile(phone);
    }
  }, [isAuthenticated, phone, loadProfile]);

  const drive = useDriveSync(
    combos,
    userReward,
    chat.chatMessages,
    setCombos,
    setUserReward,
    chat.setChatMessages,
    preferences
  );

  useEffect(() => {
    setCurrentUserId(phone || drive.userIdentifier);
  }, [drive.userIdentifier, phone]);

  const handleAuthSuccess = (p: string, _userData?: { phone: string; googleId?: string }) => {
    setPhone(p);
    setIsAuthenticated(true);
    showToast(`Chào mừng trở lại!`);
    loadProfile(p);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPhone(null);
    setCurrentUserId(null);
    setCombos([]);
    setPreferences(['Cafe']);
    setUserName('');
    setUserAvatar(DEFAULT_AVATAR);
    setShowProfile(false);
    localStorage.removeItem('wd_auth');
    localStorage.removeItem('wd_phone');
    localStorage.removeItem('wd_combos');
    localStorage.removeItem('wd_prefs');
    localStorage.removeItem('wd_username');
    localStorage.removeItem('wd_avatar');
    showToast('Đã đăng xuất');
  };

  if (!isAuthenticated) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  const handleSelectCombo = (combo: Combo) => setComboActionModal(combo);

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

  const handleAddSlot = () => setComboSlots(prev => [...prev, null]);

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

  const findMatchingSlotIndex = (loc: LocationItem): number => {
    const locCat = (loc.category || '').toLowerCase();
    const locName = loc.name.toLowerCase();
    const locTheme = (loc.theme || '').toLowerCase();
    for (let i = 0; i < comboSlots.length; i++) {
      if (comboSlots[i] !== null) continue;
      const act = activeCombo?.activities[i];
      if (!act) continue;
      const actName = act.name.toLowerCase();
      for (const keywords of Object.values(CATEGORY_SLOT_MAP)) {
        const locMatches = keywords.some(kw => locCat.includes(kw) || locName.includes(kw) || locTheme.includes(kw));
        const actMatches = keywords.some(kw => actName.includes(kw));
        if (locMatches && actMatches) return i;
      }
    }
    return comboSlots.findIndex(s => s === null);
  };

  const handleAddToCombo = (loc: LocationItem) => {
    if (!activeCombo) {
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
    const allFilled = comboSlots.every(s => s !== null);
    if (allFilled) { showToast('Combo đã đầy đủ! Bấm "Chốt lịch" trên Home.'); return; }
    const slotIdx = findMatchingSlotIndex(loc);
    if (slotIdx === -1) { showToast('Không còn slot trống!'); return; }
    setComboSlots(prev => { const next = [...prev]; next[slotIdx] = loc; return next; });
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

      <main id="main-content" className="max-w-md mx-auto w-full">
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
          {activeTab === 'fashion' && <FashionView />}
          {activeTab === 'wallet' && <DateMilesView userReward={userReward} />}
          {activeTab === 'history' && <HistoryView />}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav aria-label="Điều hướng chính" className="fixed bottom-0 left-0 right-0 glass-card pb-safe z-40">
        <div className="max-w-md mx-auto px-2 py-2 flex justify-around items-end">
          {([
            { id: 'home', icon: 'home', label: 'Trang chủ' },
            { id: 'explore', icon: 'explore', label: 'Khám phá' },
            { id: 'fashion', icon: 'checkroom', label: 'Phong cách' },
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
                  'flex flex-col items-center gap-0.5 px-2 py-1 transition-all duration-300 relative cursor-pointer',
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
                      'material-symbols-outlined text-[22px] relative z-10 transition-all',
                      isActive && 'font-bold'
                    )}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className={cn(
                  'text-[9px] font-semibold transition-all',
                  isActive ? 'text-primary' : 'text-on-surface-variant/60'
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile Screen */}
      <AnimatePresence>
        {showProfile && (
          <ProfileView
            phone={phone || ''}
            userName={userName || phone || ''}
            userAvatar={userAvatar}
            dateMiles={userReward.totalMiles}
            totalDates={userReward.completedDates}
            isDriveSynced={drive.isLoggedIn}
            isSyncing={drive.isSyncing}
            onDriveLogin={drive.login}
            onDriveLogout={drive.logout}
            onLogout={handleLogout}
            onBack={() => setShowProfile(false)}
            showToast={showToast}
            onProfileUpdated={(newName, newAvatar) => {
              if (newName) setUserName(newName);
              if (newAvatar) setUserAvatar(newAvatar);
            }}
          />
        )}
      </AnimatePresence>

      {/* Weather Detail Screen */}
      <AnimatePresence>
        {showWeatherDetail && (
          <WeatherDetailView
            weatherData={weatherData}
            onBack={() => setShowWeatherDetail(false)}
          />
        )}
      </AnimatePresence>

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

      <button onClick={() => chat.setIsChatOpen(true)} className="fixed bottom-24 right-4 z-40 bg-primary hover:bg-on-primary-container text-on-primary rounded-full p-4 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
        <Bot className="w-6 h-6 animate-bounce" />
      </button>
      <ChatPanel {...chat} />

      {toastMessage && <Toast message={toastMessage} onClose={hideToast} />}
    </div>
  );
}
