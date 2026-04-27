import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, History, Trophy, MapPin, Bot, Cloud, CloudOff, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import { Toast } from './components/Toast';

// Hooks
import { useWeather } from './hooks/useWeather';
import { useReward } from './hooks/useReward';
import { useChat } from './hooks/useChat';
import { useToast } from './hooks/useToast';
import { useDriveSync } from './hooks/useDriveSync';

// Pages (lazy-loaded inline for now — will be separate files in future)
import { HomeView } from './components/home/HomeView';
import { ExploreView } from './components/explore/ExploreView';
import { DateMilesView } from './components/wallet/DateMilesView';
import { ChatPanel } from './components/chat/ChatPanel';
import { PaymentModal } from './components/modals/PaymentModal';
import { RideModal } from './components/modals/RideModal';
import { ImageViewer } from './components/modals/ImageViewer';
import { AuthView } from './components/auth/AuthView';

import type { Tab, Combo, LocationItem } from './types';

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { toastMessage, showToast, hideToast } = useToast();
  const weatherData = useWeather();
  const { userReward, setUserReward, earnMiles, incrementDates } = useReward(showToast);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const chat = useChat(currentUserId);

  // User Stats & Preferences (W6)
  const [preferences, setPreferences] = useState<string[]>(['Cafe']);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');

  // Combo state
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const handleAuthSuccess = (phone: string, userData: any) => {
    setPhone(phone);
    setIsAuthenticated(true);
    showToast(`Chào mừng trở lại, ${phone}!`);
    // Sync if needed or load profile
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPhone(null);
    setCurrentUserId(null);
    showToast('Đã đăng xuất');
  };

  if (!isAuthenticated) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  // Modal state
  const [rideModalLoc, setRideModalLoc] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [realImageLoc, setRealImageLoc] = useState<{ name: string; mapsUri: string; desc?: string; imageUrl?: string } | null>(null);

  // Saved places ("Thêm vào Combo" from Explore)
  const [savedPlaces, setSavedPlaces] = useState<LocationItem[]>([]);

  const handleAddToCombo = (loc: LocationItem) => {
    setSavedPlaces(prev => {
      if (prev.some(p => p.id === loc.id)) {
        showToast(`${loc.name} đã có trong danh sách rồi!`);
        return prev;
      }
      showToast(`Đã thêm ${loc.name} vào combo! (${prev.length + 1} địa điểm)`);
      return [...prev, loc];
    });
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

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">W</div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Widget Date</h1>
        </div>
        <div className="flex items-center gap-2">
          {drive.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1.5 rounded-full">
                {drive.isInitializing ? <Cloud className="w-3 h-3 animate-pulse text-blue-500" /> : drive.isSyncing ? <Cloud className="w-3 h-3 animate-pulse text-indigo-500" /> : <Cloud className="w-3 h-3 text-green-500" />}
                {drive.isInitializing ? 'Loading' : drive.isSyncing ? 'Syncing...' : 'Synced'}
              </span>
            </div>
          ) : (
             <button onClick={() => drive.login()} aria-label="Đăng nhập Google Drive Backup" className="text-xs font-semibold bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-full hover:bg-slate-50 flex items-center gap-1 transition-colors">
              <CloudOff className="w-3 h-3 text-slate-400" />
              Backup
            </button>
          )}

          <button onClick={handleLogout} aria-label="Đăng xuất" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-slate-100 shadow-sm">
            <LogOut className="w-5 h-5" />
          </button>

          {drive.isLoggedIn && (
            <div className="flex items-center gap-1">
              {!drive.phoneNumber || isEditingPhone ? (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-pink-200">
                  <input
                    type="tel"
                    placeholder="Số điện thoại..."
                    className="bg-transparent text-xs px-2 py-0.5 outline-none w-24"
                    value={phoneValue}
                    onChange={(e) => setPhoneValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        drive.setPhoneNumber(phoneValue);
                        setIsEditingPhone(false);
                        showToast('Đã lưu số điện thoại! 📱');
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      drive.setPhoneNumber(phoneValue);
                      setIsEditingPhone(false);
                      showToast('Đã lưu số điện thoại! 📱');
                    }}
                    className="p-1 rounded-full bg-pink-500 text-white"
                  >
                    <History className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsEditingPhone(true);
                    setPhoneValue(drive.phoneNumber || '');
                  }}
                  className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1 border border-transparent hover:border-pink-300 transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {drive.phoneNumber}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <MapPin className="w-4 h-4 text-pink-500" /> {location}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeView
              weatherData={weatherData}
              showToast={showToast}
              setSelectedCombo={setSelectedCombo}
              setShowPaymentModal={setShowPaymentModal}
              setRideModalLoc={setRideModalLoc}
              setRealImageLoc={setRealImageLoc}
              combos={combos}
              setCombos={setCombos}
              openChat={() => chat.setIsChatOpen(true)}
              formatVND={formatVND}
              location={location}
              preferences={preferences}
              setPreferences={setPreferences}
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
            />
          )}
          {activeTab === 'wallet' && <DateMilesView userReward={userReward} />}
          {activeTab === 'history' && <DateMilesView userReward={userReward} historyOnly />}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav aria-label="Điều hướng chính" className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-40">
        <div className="max-w-md mx-auto px-6 py-3 flex justify-between items-center">
          {([
            { id: 'home', icon: Home, label: 'Trang chủ' },
            { id: 'explore', icon: Compass, label: 'Khám phá' },
            { id: 'history', icon: History, label: 'Lịch sử' },
            { id: 'wallet', icon: Trophy, label: 'Date Milestones' },
          ] as const).map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} aria-label={item.label} aria-current={isActive ? 'page' : undefined} className={cn('flex flex-col items-center gap-1 p-2 transition-all duration-200', isActive ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600')}>
                <div className="relative">
                  <Icon className={cn('w-6 h-6', isActive && 'fill-purple-50')} />
                  {isActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full" />}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

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
      <RideModal loc={rideModalLoc} onClose={() => setRideModalLoc(null)} onRide={handleRide} />
      <ImageViewer loc={realImageLoc} onClose={() => setRealImageLoc(null)} />

      {/* Chat FAB + Panel */}
      <button onClick={() => chat.setIsChatOpen(true)} className="fixed bottom-24 right-4 z-40 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full p-4 shadow-lg shadow-pink-500/30 transition-transform hover:scale-105 active:scale-95">
        <Bot className="w-6 h-6 animate-bounce" />
      </button>
      <ChatPanel {...chat} />

      {toastMessage && <Toast message={toastMessage} onClose={hideToast} />}
    </div>
  );
}
