import { useState } from 'react';
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

import type { Tab, Combo } from './types';

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { toastMessage, showToast, hideToast } = useToast();
  const weatherData = useWeather();
  const { userReward, setUserReward, earnMiles, incrementDates } = useReward(showToast);
  const chat = useChat();

  // Combo state
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Sync state
  const drive = useDriveSync(combos, userReward, setCombos, setUserReward);

  // Modal state
  const [rideModalLoc, setRideModalLoc] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [realImageLoc, setRealImageLoc] = useState<{ name: string; mapsUri: string; desc?: string; imageUrl?: string } | null>(null);

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
              <button onClick={drive.logout} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-100 rounded-full transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
             <button onClick={() => drive.login()} className="text-xs font-semibold bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-full hover:bg-slate-50 flex items-center gap-1 transition-colors">
              <CloudOff className="w-3 h-3 text-slate-400" />
              Backup
            </button>
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
            />
          )}
          {activeTab === 'explore' && (
            <ExploreView
              showToast={showToast}
              setRideModalLoc={setRideModalLoc}
              setRealImageLoc={setRealImageLoc}
              formatVND={formatVND}
            />
          )}
          {activeTab === 'wallet' && <DateMilesView userReward={userReward} />}
          {activeTab === 'history' && <DateMilesView userReward={userReward} historyOnly />}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-40">
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
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn('flex flex-col items-center gap-1 p-2 transition-all duration-200', isActive ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600')}>
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
