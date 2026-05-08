import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import { Toast } from './components/Toast';

import { useWeather } from './hooks/useWeather';
import { useReward } from './hooks/useReward';
import { useChat } from './hooks/useChat';
import { useToast } from './hooks/useToast';
import { useDriveSync } from './hooks/useDriveSync';

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

function getInitialAuth(): boolean {
  const token = localStorage.getItem('wd_token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch { return false; }
}

const NAV_ITEMS = [
  { id: 'home',    icon: 'home',         label: 'Trang chủ' },
  { id: 'explore', icon: 'explore',      label: 'Khám phá' },
  { id: 'fashion', icon: 'checkroom',    label: 'Phong cách' },
  { id: 'history', icon: 'history',      label: 'Lịch sử' },
  { id: 'wallet',  icon: 'emoji_events', label: 'Thành tích' },
] as const;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth);
  const [phone, setPhone] = useState<string | null>(() => loadJson('wd_phone', null));
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showProfile, setShowProfile] = useState(false);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  const { toastMessage, showToast, hideToast } = useToast();
  const weatherData = useWeather();
  const { userReward, setUserReward, earnMiles, incrementDates } = useReward(showToast);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const chat = useChat(currentUserId);

  const [userName, setUserName]       = useState<string>(()    => loadJson('wd_username', ''));
  const [userAvatar, setUserAvatar]   = useState<string>(()    => loadJson('wd_avatar', DEFAULT_AVATAR));
  const [preferences, setPreferences] = useState<string[]>(()  => loadJson('wd_prefs', ['Cafe']));
  const [combos, setCombos]           = useState<Combo[]>(()   => loadJson('wd_combos', []));
  const [selectedCombo, setSelectedCombo]   = useState<Combo | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess]     = useState(false);
  const [comboActionModal, setComboActionModal] = useState<Combo | null>(null);
  const [rideModalLoc, setRideModalLoc]   = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [realImageLoc, setRealImageLoc]   = useState<{ name: string; mapsUri: string; desc?: string; imageUrl?: string } | null>(null);
  const [savedPlaces, setSavedPlaces]     = useState<LocationItem[]>([]);
  const [activeCombo, setActiveCombo]     = useState<Combo | null>(null);
  const [comboSlots, setComboSlots]       = useState<ComboSlot[]>([]);

  useEffect(() => { localStorage.setItem('wd_phone',    JSON.stringify(phone));       }, [phone]);
  useEffect(() => { localStorage.setItem('wd_combos',   JSON.stringify(combos));      }, [combos]);
  useEffect(() => { localStorage.setItem('wd_prefs',    JSON.stringify(preferences)); }, [preferences]);
  useEffect(() => { localStorage.setItem('wd_username', JSON.stringify(userName));    }, [userName]);
  useEffect(() => { localStorage.setItem('wd_avatar',   JSON.stringify(userAvatar));  }, [userAvatar]);

  const loadProfile = useCallback(async (phoneNum: string) => {
    try {
      const token = localStorage.getItem('wd_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/user?action=profile&phone=${encodeURIComponent(phoneNum)}`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      if (data.display_name) setUserName(data.display_name);
      else if (!loadJson('wd_username', '')) setUserName(phoneNum);
      if (data.avatar_url) setUserAvatar(data.avatar_url);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { if (isAuthenticated && phone) loadProfile(phone); }, [isAuthenticated, phone, loadProfile]);

  const drive = useDriveSync(combos, userReward, chat.chatMessages, setCombos, setUserReward, chat.setChatMessages, preferences);
  useEffect(() => { setCurrentUserId(phone || drive.userIdentifier); }, [drive.userIdentifier, phone]);

  const handleAuthSuccess = (p: string, token: string, _userData?: { phone: string; googleId?: string }) => {
    localStorage.setItem('wd_token', token);
    localStorage.setItem('wd_phone', JSON.stringify(p));
    setPhone(p); setIsAuthenticated(true);
    showToast('Chào mừng trở lại!');
    loadProfile(p);
  };

  const handleLogout = () => {
    setIsAuthenticated(false); setPhone(null); setCurrentUserId(null);
    setCombos([]); setPreferences(['Cafe']); setUserName(''); setUserAvatar(DEFAULT_AVATAR); setShowProfile(false);
    ['wd_token','wd_auth','wd_phone','wd_combos','wd_prefs','wd_username','wd_avatar'].forEach(k => localStorage.removeItem(k));
    showToast('Đã đăng xuất');
  };

  if (!isAuthenticated) return <AuthView onAuthSuccess={handleAuthSuccess} />;

  const handleSelectCombo    = (combo: Combo) => setComboActionModal(combo);
  const proceedWithCustomize = (combo: Combo) => {
    setActiveCombo(combo); setComboActionModal(null);
    setComboSlots(combo.activities.map(act => ({ id: Math.random().toString(36).substring(7), name: act.name, address: act.address, category: act.category || '', price: act.cost, lat: act.lat, lng: act.lng, imageUrl: act.imageUrl || '' })));
    showToast(`Đã chọn combo "${combo.theme}" để tùy chỉnh!`);
  };
  const proceedWithPayNow = (combo: Combo) => { setSelectedCombo(combo); setShowPaymentModal(true); setComboActionModal(null); };
  const handleManualCombo = () => {
    setActiveCombo({ id: Math.random().toString(36).substring(7), theme: 'Tự tạo Combo', icon: 'edit_calendar', score: 10, totalCost: 0, activities: [] });
    setComboSlots([null, null, null]);
    showToast('Tạo combo mới. Hãy thêm địa điểm từ Khám phá!');
  };
  const handleAddSlot    = () => setComboSlots(prev => [...prev, null]);
  const handleClearCombo = () => { setActiveCombo(null); setComboSlots([]); showToast('Đã huỷ combo'); };
  const handleConfirmCombo = () => {
    if (!activeCombo || comboSlots.some(s => s === null)) return;
    const fs = comboSlots as LocationItem[];
    const totalPrice = fs.reduce((s, l) => s + (l.price || l.cost || 0), 0);
    const finalCombo: Combo = { ...activeCombo, totalCost: totalPrice || activeCombo.totalCost, activities: fs.map((l, i) => ({ time: activeCombo.activities[i]?.time || `${17+i}:00`, name: l.name, address: l.address, cost: l.price || l.cost || activeCombo.activities[i]?.cost || 0, lat: l.lat, lng: l.lng, imageUrl: l.imageUrl, category: l.category })) };
    setSelectedCombo(finalCombo); setShowPaymentModal(true);
  };
  const findMatchingSlotIndex = (loc: LocationItem): number => {
    const lc = (loc.category||'').toLowerCase(), ln = loc.name.toLowerCase(), lt = (loc.theme||'').toLowerCase();
    for (let i = 0; i < comboSlots.length; i++) {
      if (comboSlots[i] !== null) continue;
      const act = activeCombo?.activities[i]; if (!act) continue;
      const an = act.name.toLowerCase();
      for (const kws of Object.values(CATEGORY_SLOT_MAP)) {
        if (kws.some(k => lc.includes(k)||ln.includes(k)||lt.includes(k)) && kws.some(k => an.includes(k))) return i;
      }
    }
    return comboSlots.findIndex(s => s === null);
  };
  const handleAddToCombo = (loc: LocationItem) => {
    if (!activeCombo) {
      setSavedPlaces(prev => {
        if (prev.some(p => p.id === loc.id)) { showToast(`${loc.name} đã có rồi!`); return prev; }
        showToast(`Đã thêm ${loc.name}! (${prev.length+1})`); return [...prev, loc];
      }); return;
    }
    if (comboSlots.every(s => s !== null)) { showToast('Combo đã đầy!'); return; }
    const idx = findMatchingSlotIndex(loc);
    if (idx === -1) { showToast('Không còn slot!'); return; }
    setComboSlots(prev => { const n=[...prev]; n[idx]=loc; return n; });
    showToast(`Đã thêm ${loc.name} vào slot ${idx+1}!`);
  };
  const handlePayment = () => {
    if (!selectedCombo) return;
    setPaymentSuccess(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    earnMiles(100, `Hoàn thành Combo: ${selectedCombo.theme}`);
    incrementDates();
    showToast('Thanh toán thành công & Nhận 100 Miles! 🎉');
    setTimeout(() => { setShowPaymentModal(false); setPaymentSuccess(false); setSelectedCombo(null); setActiveTab('wallet'); }, 2000);
  };
  const handleRide = (app: 'grab'|'be'|'xanhsm', name: string, lat: number, lng: number) => {
    const e = encodeURIComponent(name);
    const urls = { grab: `https://link.grab.com/open?screenType=BOOKING&dropOffLatitude=${lat}&dropOffLongitude=${lng}&dropOffName=${e}`, be: `be://booking?dropoff_lat=${lat}&dropoff_lng=${lng}&dropoff_address=${e}`, xanhsm: `xanhsm://booking?dropoff_lat=${lat}&dropoff_lng=${lng}&dropoff_address=${e}` };
    window.open(urls[app], '_blank');
    showToast(`Đang mở ${app === 'grab' ? 'Grab' : app === 'be' ? 'Be' : 'Xanh SM'}...`);
    setRideModalLoc(null);
  };

  const filledSlots = comboSlots.filter(s => s !== null).length;

  /* ── Sidebar (laptop only) ─────────────────────────────── */
  const SidebarNav = () => (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0">
      <div className="sticky top-6 flex flex-col gap-1.5 p-3">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-3 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-on-primary-container flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-on-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>
          <div>
            <p className="font-bold text-[17px] text-on-surface leading-tight">Widget Date</p>
            <p className="text-[11px] text-on-surface-variant/70">Kế hoạch hẹn hò ✨</p>
          </div>
        </div>

        {/* Nav items */}
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left w-full group overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-primary-fixed to-primary-fixed/60 text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-white/50 hover:text-on-surface'
              )}
            >
              {!isActive && (
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              )}
              <span
                className="material-symbols-outlined text-[22px] relative z-10"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-sm relative z-10">{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="sidebar-pip"
                  className="ml-auto w-2 h-2 rounded-full bg-primary relative z-10"
                />
              )}
            </button>
          );
        })}

        {/* Chat AI button */}
        <button
          onClick={() => chat.setIsChatOpen(true)}
          className="relative flex items-center gap-3 px-4 py-3 rounded-2xl mt-3 overflow-hidden group
                     bg-gradient-to-r from-primary to-on-primary-container text-on-primary
                     hover:opacity-95 transition-all shadow-lg shadow-primary/25"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Bot className="w-5 h-5 relative z-10" />
          <span className="text-sm font-semibold relative z-10">Chat AI</span>
          <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full relative z-10">AI</span>
        </button>

        {/* Combo Status Bar — desktop sidebar, chỉ hiện khi đang tạo combo */}
        <AnimatePresence>
          {activeCombo && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="hidden lg:block mt-3 rounded-2xl overflow-hidden shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)',
              }}
            >
              <div className="px-4 py-3 flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-white text-[22px] shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {activeCombo.icon || 'edit_calendar'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-[13px] truncate leading-tight">{activeCombo.theme}</p>
                  <p className="text-white/80 text-[11px] mt-0.5">{filledSlots}/{comboSlots.length} địa điểm đã chọn</p>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-[11px]">{filledSlots}/{comboSlots.length}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1 bg-white/20 mx-4 mb-3 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: comboSlots.length > 0 ? `${(filledSlots / comboSlots.length) * 100}%` : '0%' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              </div>
              <div className="px-4 pb-3 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex-1 text-center text-white text-[11px] py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={handleClearCombo}
                  className="flex-1 text-center text-white/80 text-[11px] py-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
                >
                  Huỷ combo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-pink-200">
      <Toast message={toastMessage} onClose={hideToast} />

      <div className="lg:max-w-6xl lg:mx-auto lg:px-6 lg:py-6 lg:flex lg:gap-6">
        <SidebarNav />
        <main
          id="main-content"
          className="flex-1 min-w-0 pb-20 lg:pb-6 max-w-md mx-auto w-full lg:max-w-none lg:mx-0"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'home'    && <HomeView weatherData={weatherData?.current ?? null} showToast={showToast} setSelectedCombo={handleSelectCombo} setShowPaymentModal={setShowPaymentModal} setRideModalLoc={setRideModalLoc} setRealImageLoc={setRealImageLoc} combos={combos} setCombos={setCombos} openChat={() => chat.setIsChatOpen(true)} onAvatarClick={() => setShowProfile(true)} onWeatherClick={() => setShowWeatherDetail(true)} formatVND={formatVND} location="Hà Nội" preferences={preferences} setPreferences={setPreferences} activeCombo={activeCombo} comboSlots={comboSlots} onClearCombo={handleClearCombo} onConfirmCombo={handleConfirmCombo} onRemoveSlot={idx => setComboSlots(prev => { const n=[...prev]; n[idx]=null; return n; })} onManualCombo={handleManualCombo} onAddSlot={handleAddSlot} setActiveCombo={setActiveCombo} userName={userName||phone||''} userAvatar={userAvatar} dateMiles={userReward.totalMiles} onNavigateToExplore={() => setActiveTab('explore')} />}
            {activeTab === 'explore' && <ExploreView showToast={showToast} setRideModalLoc={setRideModalLoc} setRealImageLoc={setRealImageLoc} formatVND={formatVND} onAddToCombo={handleAddToCombo} savedPlacesCount={savedPlaces.length} activeCombo={activeCombo} comboSlots={comboSlots} />}
            {activeTab === 'fashion' && <FashionView />}
            {activeTab === 'wallet'  && <DateMilesView userReward={userReward} />}
            {activeTab === 'history' && <HistoryView />}
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Nav (mobile only) */}
      <nav
        aria-label="Điều hướng chính"
        className="fixed bottom-0 left-0 right-0 pb-safe z-50 lg:hidden border-t border-primary/10"
        style={{
          background: 'rgba(255, 248, 244, 0.85)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        <div className="max-w-md mx-auto px-2 py-2 flex justify-around items-end">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} aria-label={item.label} aria-current={isActive ? 'page' : undefined}
                className={cn('flex flex-col items-center gap-0.5 px-2 py-1 transition-all duration-300 relative cursor-pointer', isActive ? 'text-primary -translate-y-1' : 'text-on-surface-variant/60 hover:text-on-surface-variant')}
              >
                <div className="relative">
                  {isActive && <motion.div layoutId="nav-active-bg" className="absolute -inset-2.5 bg-primary-fixed/50 rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                  <span className={cn('material-symbols-outlined text-[22px] relative z-10 transition-all', isActive && 'font-bold')} style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
                </div>
                <span className={cn('text-[9px] font-semibold transition-all', isActive ? 'text-primary' : 'text-on-surface-variant/60')}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {showProfile && <ProfileView phone={phone||''} userName={userName||phone||''} userAvatar={userAvatar} dateMiles={userReward.totalMiles} totalDates={userReward.completedDates} isDriveSynced={drive.isLoggedIn} isSyncing={drive.isSyncing} onDriveLogin={drive.login} onDriveLogout={drive.logout} onLogout={handleLogout} onBack={() => setShowProfile(false)} showToast={showToast} onProfileUpdated={(n,a) => { if(n) setUserName(n); if(a) setUserAvatar(a); }} />}
      </AnimatePresence>
      <AnimatePresence>
        {showWeatherDetail && <WeatherDetailView weatherData={weatherData} onBack={() => setShowWeatherDetail(false)} />}
      </AnimatePresence>

      <PaymentModal show={showPaymentModal} combo={selectedCombo} paymentSuccess={paymentSuccess} userReward={userReward} onClose={() => setShowPaymentModal(false)} onPay={handlePayment} formatVND={formatVND} />
      <ComboActionModal show={!!comboActionModal} combo={comboActionModal} onClose={() => setComboActionModal(null)} onCustomize={proceedWithCustomize} onPayNow={proceedWithPayNow} />
      <RideModal loc={rideModalLoc} onClose={() => setRideModalLoc(null)} onRide={handleRide} />
      <ImageViewer loc={realImageLoc} onClose={() => setRealImageLoc(null)} />

      {/* Chat FAB (mobile only) */}
      <button onClick={() => chat.setIsChatOpen(true)} className="fixed bottom-24 right-4 z-40 lg:hidden bg-primary hover:bg-on-primary-container text-on-primary rounded-full p-4 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
        <Bot className="w-6 h-6 animate-bounce" />
      </button>
      <ChatPanel {...chat} />
      {toastMessage && <Toast message={toastMessage} onClose={hideToast} />}
    </div>
  );
}
