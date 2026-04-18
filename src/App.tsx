import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Home, Compass, Clock, Wallet, MapPin, Users, Heart, Coffee, Utensils, Gamepad2, Film, Footprints, Sparkles, CheckCircle2, CreditCard, ArrowRight, Zap, History, Map as MapIcon, TrendingUp, Plus, Navigation2, Shirt, CloudRain, Star, ShoppingBag, Car, Image as ImageIcon, X, Sun, CalendarHeart, HeartCrack, Send, Bot, Trophy, Award, Target, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import { SAMPLE_COMBOS, REAL_LOCATIONS, TRENDS, MOVIES, OUTFIT_STYLES, RENTAL_STYLES, Combo, MILESTONE_LEVELS, BADGES, UserReward, THEME_TO_OUTFIT_STYLE } from './data';
import { fetchNearbyPlaces, calculateDistance, Place, generateCombos, chatWithAI, scrapeGoogleMapsImage, subscribeToAILogs, AILogEntry } from './services/geminiService';
import { Toast } from './components/Toast';

type Tab = 'home' | 'explore' | 'history' | 'wallet';
type ExploreTab = 'map' | 'movies' | 'trends' | 'swipe';

// Swipe Card Component cho Tab Tinder
const SwipeCard = ({ loc, isTop, indexOffset, onSwipe, onViewImage }: any) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    const fetchImg = async () => {
      if (loc.imageUrl) {
        if(mounted) setImgUrl(loc.imageUrl);
        return;
      }
      const uri = loc.mapsLink || loc.mapsUri || `https://maps.google.com/maps?q=${encodeURIComponent(loc.name)}`;
      const url = await scrapeGoogleMapsImage(uri);
      if(mounted && url) setImgUrl(url);
    };
    fetchImg();
    return () => { mounted = false; };
  }, [loc.name, loc.mapsUri, loc.mapsLink, loc.imageUrl]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1 - indexOffset * 0.2,
        scale: 1 - indexOffset * 0.05,
        y: indexOffset * 15,
        zIndex: 10 - indexOffset,
        position: 'absolute'
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="w-full max-w-sm h-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col cursor-grab touch-none"
    >
      <div className="relative w-full h-2/3 bg-slate-200" onClick={onViewImage}>
        {imgUrl ? (
          <img src={imgUrl} alt={loc.name} className="w-full h-full object-cover pointer-events-none" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="animate-pulse flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Đang dò ảnh...</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
          <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{loc.name}</h2>
          <div className="flex items-center gap-2 text-white/90 text-sm drop-shadow">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span className="line-clamp-1">{loc.desc || loc.theme || loc.address || 'Hà Nội'}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 flex flex-col bg-white">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 flex items-center gap-1 rounded-lg text-xs font-bold"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500"/> {loc.rating || 4.5}</span>
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold">{loc.type || loc.category || 'Hẹn hò cực chill'}</span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 flex-1">{loc.note || loc.theme || 'Địa điểm lý tưởng cho cặp đôi với không gian lãng mạn và đồ ăn cực ngon!'}</p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="w-12 h-12 rounded-full border border-red-200 text-red-500 flex items-center justify-center bg-red-50/50 shadow-sm">
            <X className="w-6 h-6" />
          </div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-100 px-3 py-1 rounded-full">Kéo trái/phải</p>
          <div className="w-12 h-12 rounded-full border border-emerald-200 text-emerald-500 flex items-center justify-center bg-emerald-50/50 shadow-sm">
            <Heart className="w-6 h-6 fill-emerald-500/20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const AIMonitor = () => {
  const [logs, setLogs] = useState<AILogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return subscribeToAILogs(setLogs);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[130px] right-4 z-[90] bg-slate-900 text-emerald-400 rounded-full p-3 shadow-lg shadow-emerald-500/20 border border-emerald-500/30 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center font-mono text-xs gap-2"
      >
        <Zap className="w-5 h-5" />
        <span className="font-bold hidden sm:inline">AI STATUS</span>
        {logs.length > 0 && logs[0].status === 'loading' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />}
        {logs.length > 0 && logs[0].status === 'error' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md h-[70vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <h3 className="text-emerald-400 font-mono font-bold flex items-center gap-2"><Zap className="w-4 h-4"/> AI Network Monitor</h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] sm:text-xs bg-[#0f172a]">
                {logs.length === 0 ? (
                  <div className="text-slate-500 text-center mt-10">Chưa có kết nối LLM nào...</div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="border-l-2 pl-3 py-1 border-slate-700">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <span>[{log.timestamp}]</span>
                        <span className="text-slate-300 font-bold">{log.action}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        {log.status === 'loading' && <span className="text-yellow-400 flex items-center gap-1 shrink-0"><div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"/> Loading...</span>}
                        {log.status === 'success' && <span className="text-emerald-400 flex items-center gap-1 shrink-0"><div className="w-2 h-2 rounded-full bg-emerald-400"/> Success</span>}
                        {log.status === 'error' && <span className="text-red-400 flex items-center gap-1 shrink-0"><div className="w-2 h-2 rounded-full bg-red-400"/> Error</span>}
                        <span className={log.status === 'error' ? 'text-red-300' : 'text-slate-300'}>{log.details}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [exploreSubTab, setExploreSubTab] = useState<ExploreTab>('map');
  const [isGenerating, setIsGenerating] = useState(false);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: 'Chào đằng ấy 👋! Mình là trợ lý AI Hẹn Hò. Đằng ấy muốn ăn món Việt, đồ Âu sang chảnh, hay đi một nơi nào đó thật Chill? Cứ tâm sự chi tiết ở đây nha!' }
  ]);
  const [isChatting, setIsChatting] = useState(false);
  
  // Modals
  const [rideModalLoc, setRideModalLoc] = useState<{name: string, lat: number, lng: number} | null>(null);
  const [realImageLoc, setRealImageLoc] = useState<{name: string, mapsUri: string, desc?: string} | null>(null);
  const [realImgUrls, setRealImgUrls] = useState<string[]>([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isRealImgLoading, setIsRealImgLoading] = useState(false);

  const handleOpenRealImage = async (name: string, mapsUri?: string, desc?: string, imageUrl?: string) => {
    const finalUri = mapsUri || `https://maps.google.com/maps?q=${encodeURIComponent(name)}`;
    setRealImageLoc({ name, mapsUri: finalUri, desc });
    setCurrentImgIndex(0);
    
    let primaryImage = '';
    
    if (imageUrl) {
      // Decode image url embedded inside Google maps URL if exists
      const match = imageUrl.match(/6s(https:%2F%2F[^!&]+)/);
      if (match) {
        let decoded = decodeURIComponent(match[1]);
        primaryImage = decoded.replace(/=w\d+-h\d+-k-no/, '=s800');
      } else if (!imageUrl.includes('google.com/maps') && !imageUrl.includes('maps.app.goo.gl')) {
        primaryImage = imageUrl;
      }
    }

    if (!primaryImage) {
      setIsRealImgLoading(true);
      setRealImgUrls([]);
      const targetUri = (imageUrl && (imageUrl.includes('google.com/maps') || imageUrl.includes('maps.app.goo.gl'))) ? imageUrl : finalUri;
      const imgUrl = await scrapeGoogleMapsImage(targetUri);
      primaryImage = imgUrl || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80`;
    }

    // Lấy thêm ảnh context giả lập từ Unsplash để tạo thành Gallery vì link gốc chỉ chứa 1 ảnh
    const fakeGallery = [
      primaryImage,
      `https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80`,
      `https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80`
    ];
    
    setIsRealImgLoading(false);
    setRealImgUrls(fakeGallery);
  };

  // Date Miles & Gamification State
  const [userReward, setUserReward] = useState<UserReward>(() => {
    const saved = localStorage.getItem('user_reward');
    return saved ? JSON.parse(saved) : {
      totalMiles: 0,
      level: 'Newbie',
      completedDates: 0,
      badges: ['first_date'],
      history: []
    };
  });

  // Lưu vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('user_reward', JSON.stringify(userReward));
  }, [userReward]);

  // Helper cộng điểm
  const earnMiles = (amount: number, reason: string) => {
    setUserReward(prev => {
      const newMiles = prev.totalMiles + amount;
      const currentLevelObj = [...MILESTONE_LEVELS].reverse().find(l => newMiles >= l.min);
      const newLevel = currentLevelObj ? currentLevelObj.name : 'Newbie';

      if (newLevel !== prev.level) {
        showToast(`Level Up! Bạn đã đạt hạng ${newLevel}! ✨`);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }

      return {
        ...prev,
        totalMiles: newMiles,
        level: newLevel,
        history: [{
          id: Math.random().toString(36).substr(2, 9),
          reason,
          amount,
          timestamp: new Date().toLocaleString('vi-VN')
        }, ...prev.history].slice(0, 10) // Giữ 10 giao dịch gần nhất
      };
    });
  };

  // Form State
  const [location, setLocation] = useState('Hà Nội');
  const [budget, setBudget] = useState('500K');
  const [companion, setCompanion] = useState('Người yêu');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('22:00');
  const [preferences, setPreferences] = useState<string[]>(['Cafe']);
  
  // Display State
  const [mapFilter, setMapFilter] = useState('Tất cả');

  // Weather state
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Hanoi&units=metric&lang=vi&appid=7eb67699a868fd2f0b5be2741b92b5dd');
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
  }, []);

  // Dynamic Map State
  const [exploreLocationInput, setExploreLocationInput] = useState('Hồ Hoàn Kiếm, Hà Nội');
  const [dynamicPlaces, setDynamicPlaces] = useState<any[]>(REAL_LOCATIONS);
  const [placesSort, setPlacesSort] = useState<'rating_desc' | 'rating_asc' | 'dist_asc' | 'dist_desc' | 'best_choice'>('rating_desc');
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  
  // Swipe State
  const [swipeIndex, setSwipeIndex] = useState(0);

  const handleFetchPlaces = () => {
    // Kiểm tra HTTPS - Geolocation bị chặn trên HTTP không phải localhost
    const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isSecureContext) {
      setSearchError('❌ Trình duyệt chặn Geolocation trên HTTP! Hãy truy cập qua localhost:5173 thay vì IP mạng để dùng tính năng này.');
      showToast('❌ Truy cập qua localhost:5173 để dùng Geolocation!');
      return;
    }

    if (!navigator.geolocation) {
      showToast('Trình duyệt của bạn không hỗ trợ định vị (Geolocation)!');
      return;
    }
    
    setLoadingPlaces(true);
    setSearchError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });
        
        const placesWithDist = REAL_LOCATIONS.map((p: any) => {
          let distance = 999;
          if (p.lat && p.lng) {
            distance = calculateDistance(lat, lng, p.lat, p.lng);
          }
          return { ...p, distance };
        });
        
        setDynamicPlaces(placesWithDist as any);
        setPlacesSort('best_choice');
        setLoadingPlaces(false);
        showToast('Đã tính toán khoảng cách thành công!');
      },
      (error) => {
        console.error("Lỗi Geolocation:", error);
        let errMsg = 'Không lấy được vị trí của bạn.';
        if (error.code === 1) errMsg = '❌ Bạn đã từ chối cấp quyền vị trí. Hãy bật lại trong cài đặt trình duyệt ở icon khóa đầu thanh địa chỉ.';
        if (error.code === 2) errMsg = '❌ Không xác định được vị trí. Hãy kiểm tra kết nối mạng.';
        if (error.code === 3) errMsg = '❌ Thời gian chờ định vị quá lâu. Hãy thử lại.';
        setSearchError(errMsg);
        showToast(errMsg);
        setLoadingPlaces(false);
      },
      { timeout: 10000, maximumAge: 60000 }  // timeout 10s, cache 1 phút
    );
  };

  const getSortedPlaces = () => {
    const places = [...dynamicPlaces];
    if (placesSort === 'rating_desc') places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (placesSort === 'rating_asc') places.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    if (placesSort === 'dist_asc') places.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    if (placesSort === 'dist_desc') places.sort((a, b) => (b.distance || 0) - (a.distance || 0));
    if (placesSort === 'best_choice') {
      places.sort((a, b) => ((b.rating || 0) * 10 - (b.distance || 999)) - ((a.rating || 0) * 10 - (a.distance || 999)));
    }
    return places;
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);
    
    try {
      const respText = await chatWithAI(chatMessages, userMsg.text);
      setChatMessages(prev => [...prev, { role: 'model', text: respText }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: 'Hệ thống đang bận, đằng ấy gửi lại nhé!' }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      showToast('AI đang tìm và thiết kế các combo thật cho bạn...');
      const liveCombos = await generateCombos({
        location,
        budget,
        companion,
        startTime,
        endTime,
        preferences
      });
      setCombos(liveCombos);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || '';
      
      if (errMsg.includes('[FALLBACK LỖI AI]')) {
        showToast('Mạng AI bị nghẽn (429)! Đã thử tải lại 2 lần thất bại. Xin dùng Combo mẫu tạm nha! 🥲');
      } else {
        showToast('Có lỗi định dạng AI. Tạm thời hiển thị combo mẫu!');
      }
      
      setCombos(SAMPLE_COMBOS);
    } finally {
      setIsGenerating(false);
    }
  };

  const showToast = (msg: string) => setToastMessage(msg);

  const handlePayment = () => {
    if (!selectedCombo) return;

    setPaymentSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Cập nhật: Thay vì trừ tiền, hãy cộng Miles!
    earnMiles(100, `Hoàn thành Combo: ${selectedCombo?.name || selectedCombo?.theme}`);
    setUserReward(prev => ({ ...prev, completedDates: prev.completedDates + 1 }));
    
    showToast("Thanh toán thành công & Nhận 100 Miles! 🎉");
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      setSelectedCombo(null);
      setActiveTab('wallet'); // Chuyển sang tab Date Miles để xem điểm
    }, 2000);
  };



  const handleRide = (app: 'grab' | 'be' | 'xanhsm', name: string, lat: number, lng: number) => {
    let url = '';
    const encodedName = encodeURIComponent(name);
    if (app === 'grab') {
      url = `https://link.grab.com/open?screenType=BOOKING&dropOffLatitude=${lat}&dropOffLongitude=${lng}&dropOffName=${encodedName}`;
    } else if (app === 'be') {
      url = `be://booking?dropoff_lat=${lat}&dropoff_lng=${lng}&dropoff_address=${encodedName}`;
    } else if (app === 'xanhsm') {
      url = `xanhsm://booking?dropoff_lat=${lat}&dropoff_lng=${lng}&dropoff_address=${encodedName}`;
    }
    
    // Open in new tab or trigger deep link
    window.open(url, '_blank');
    
    setTimeout(() => {
      showToast(`Đang mở app ${app === 'grab' ? 'Grab' : app === 'be' ? 'Be' : 'Xanh SM'}...`);
    }, 500);
    setRideModalLoc(null);
  };

  const renderHome = () => (
    <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      
      {/* Banner Thời tiết */}
      <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col gap-4">
          {weatherData ? (
            <>
              <div className="flex items-center justify-between">
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-white/10 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white" /> {weatherData.name}
                </span>
                <div className="flex items-center gap-2 text-sm font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 capitalize">
                  <CloudRain className="w-4 h-4 text-white" /> {weatherData.weather[0]?.description}
                </div>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <h2 className="text-5xl font-extrabold leading-tight mb-1 flex items-center gap-2">
                    {Math.round(weatherData.main.temp)}°C
                  </h2>
                  <p className="text-white/90 text-sm font-medium">Cảm giác như {Math.round(weatherData.main.feels_like)}°C • Độ ẩm: {weatherData.main.humidity}%</p>
                </div>
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon}@2x.png`} 
                  alt="Thời tiết" 
                  className="w-20 h-20 -mb-2"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-white/80">
              <span className="animate-pulse flex items-center gap-2"><Sun className="w-5 h-5"/> Đang lấy thông tin thời tiết...</span>
            </div>
          )}
        </div>
      </div>

      {/* Cảnh báo lâu chưa đi hẹn hò */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-5 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsChatOpen(true)}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="bg-red-100 p-2.5 rounded-2xl flex-shrink-0">
            <HeartCrack className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-red-800 font-bold mb-1">Cảnh báo: Tình cảm đang nguội lạnh! 🧊</h3>
            <p className="text-red-600 text-sm">Đã 18 ngày hai bạn chưa đi Date (từ 05/03/2026). Trò chuyện với AI để lên lịch hâm nóng tình cảm ngay nhé!</p>
            <button className="mt-3 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
               Nhắn AI tư vấn gấp <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Lên lịch hẹn hò 💖</h2>
        
        {/* Budget */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Wallet className="w-4 h-4 text-purple-500" /> Ngân sách</label>
          <div className="flex flex-wrap gap-2">
            {['200K', '500K', '1M', '2M', '5M+'].map(b => (
              <button key={b} onClick={() => setBudget(b)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", budget === b ? "bg-slate-900 text-white shadow-md scale-105" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>{b}</button>
            ))}
          </div>
        </div>

        {/* Companion */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Users className="w-4 h-4 text-pink-500" /> Đi cùng ai?</label>
          <div className="grid grid-cols-3 gap-2">
            {['Bạn bè', 'Người yêu', 'Gia đình'].map(c => (
              <button key={c} onClick={() => setCompanion(c)} className={cn("py-2.5 rounded-2xl text-sm font-medium transition-all border", companion === c ? "border-pink-500 bg-pink-50 text-pink-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>{c}</button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> Thời gian rảnh</label>
          <div className="flex items-center gap-3">
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
            <span className="text-slate-400">→</span>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-500" /> Sở thích</label>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(REAL_LOCATIONS.map((loc: any) => loc.category).filter(Boolean))).map((cat: any) => {
              const prefId = String(cat);
              const isSelected = preferences.includes(prefId);
              return (
                <button key={prefId} onClick={() => setPreferences(isSelected ? preferences.filter(p => p !== prefId) : [...preferences, prefId])} className={cn("flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border", isSelected ? "border-purple-500 bg-purple-50 text-purple-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
                  {prefId}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button onClick={handleGenerate} disabled={isGenerating} className="w-full relative group overflow-hidden rounded-2xl p-[1px]">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
          <div className="relative bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition-colors">
            {isGenerating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sparkles className="w-5 h-5" /></motion.div> : <><Zap className="w-5 h-5" /> Tạo Combo AI</>}
          </div>
        </button>
      </div>

      {/* Generated Combos */}
      {combos.length > 0 && (
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-bold text-slate-800">Combo Đề Xuất ✨</h2>
          <div className="space-y-4">
            {combos.map((combo, idx) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={combo.id} className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100 overflow-hidden group">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-xl">
                        {typeof combo.icon === 'string' ? combo.icon : combo.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">Combo {combo.theme}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> {combo.score}/10</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700">{formatVND(combo.totalCost)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative pl-4 border-l-2 border-slate-100 space-y-6 ml-4 mb-6">
                    {combo.activities.map((act, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white"></div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold text-purple-600 mb-0.5">{act.time}</p>
                            <p className="font-medium text-slate-800">{act.name}</p>
                            {act.address && <p className="text-xs text-slate-600 mt-0.5">{act.address}</p>}
                            {act.distance && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {act.distance}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-600">{act.cost === 0 ? 'Miễn phí' : formatVND(act.cost)}</p>
                          </div>
                        </div>
                        
                        {/* Transport Section */}
                        {act.lat && act.lng && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1"><Car className="w-3 h-3" /> Giao thông đến đây</p>
                            <div className="flex gap-2">
                              <button onClick={() => handleRide('grab', act.name, act.lat!, act.lng!)} className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1" title="Deep Link giúp bạn mở app đặt xe ngay lập tức!">
                                🟢 Grab
                              </button>
                              <button onClick={() => handleRide('be', act.name, act.lat!, act.lng!)} className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1" title="Deep Link giúp bạn mở app đặt xe ngay lập tức!">
                                🟡 Be
                              </button>
                              <button onClick={() => handleRide('xanhsm', act.name, act.lat!, act.lng!)} className="flex-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1" title="Deep Link giúp bạn mở app đặt xe ngay lập tức!">
                                🚙 Xanh SM
                              </button>
                            </div>
                          </div>
                        )}
                        {act.websiteUri && (
                          <a href={act.websiteUri} target="_blank" rel="noreferrer" className="inline-flex mt-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors items-center gap-1 shadow-sm">
                            🌐 Mở Website / Thư Viện Ảnh (Thực Tế)
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  {combo.activities.length > 0 && (
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(location)}&waypoints=${combo.activities.slice(0,-1).map(a => encodeURIComponent(`${a.name}, ${a.address || location}`)).join('|')}&destination=${encodeURIComponent(`${combo.activities[combo.activities.length-1].name}, ${combo.activities[combo.activities.length-1].address || location}`)}`}
                      target="_blank" rel="noreferrer" 
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors mt-2 shadow-sm border border-blue-200"
                    >
                      <MapIcon className="w-4 h-4" /> 🗺️ Xem Lộ Trình (Google Maps Route)
                    </a>
                  )}
                  <button onClick={() => { setSelectedCombo(combo); setShowPaymentModal(true); }} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors mt-3">
                    Chọn Combo Này <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>


        </div>
      )}
    </motion.div>
  );

  const renderExplore = () => (
    <motion.div key="explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 flex-wrap">
        {[
          { id: 'map', label: 'Bản Đồ', icon: MapIcon },
          { id: 'swipe', label: 'Quẹt Thẻ', icon: Heart },
          { id: 'movies', label: 'Phim', icon: Film },
          { id: 'trends', label: 'Hot Trend', icon: TrendingUp }
        ].map(tab => (
          <button key={tab.id} onClick={() => setExploreSubTab(tab.id as ExploreTab)} className={cn("flex-1 whitespace-nowrap px-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all", exploreSubTab === tab.id ? "bg-slate-900 text-white shadow-md" : (tab.id === 'swipe' ? "text-pink-500 hover:text-pink-600 font-bold bg-pink-50" : "text-slate-500 hover:text-slate-700"))}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {exploreSubTab === 'map' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <label className="text-sm font-bold text-slate-700 block">Vị trí của bạn</label>
            <div className="flex gap-2">
              <button 
                onClick={handleFetchPlaces}
                disabled={loadingPlaces}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-slate-900/20"
              >
                {loadingPlaces ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang định vị và tìm kiếm AI...</>
                ) : (
                  <><Navigation2 className="w-5 h-5" /> Sử dụng vị trí hiện tại (Geolocation)</>
                )}
              </button>
            </div>
            {searchError && <p className="text-red-500 text-xs mt-2">{searchError}</p>}
          </div>

          <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-48 bg-slate-200 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.4170942006!2d105.75612349141834!3d21.02273870409085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1710385000000!5m2!1svi!2s" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Địa điểm quanh đây</h3>
            <select 
              value={placesSort}
              onChange={(e) => setPlacesSort(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="best_choice">Best Choice (Gần & Sao cao)</option>
              <option value="rating_desc">Đánh giá cao nhất</option>
              <option value="rating_asc">Đánh giá thấp nhất</option>
              <option value="dist_asc">Gần nhất</option>
              <option value="dist_desc">Xa nhất</option>
            </select>
          </div>

          <div className="grid gap-4">
            {getSortedPlaces().map((loc: any) => (
              <div key={loc.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      {loc.name}
                      {loc.websiteUri && (
                        <a href={loc.websiteUri} target="_blank" rel="noreferrer" className="text-purple-500 hover:text-purple-600" title="Mở trang web thực tế / đánh giá">
                          🌐
                        </a>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500">{loc.address} • {loc.theme || loc.type || loc.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold shrink-0">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {loc.rating}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <MapPin className="w-3 h-3" /> 
                  {loc.distance !== undefined && loc.distance !== 999 ? `Cách bạn ${loc.distance.toFixed(1)} km • ` : ''} 
                  Giá khoảng: {formatVND(loc.price || loc.cost || 0)}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button onClick={() => showToast('Đã thêm vào combo của bạn!')} className="bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> Thêm vào Combo
                  </button>
                  <button onClick={() => setRideModalLoc({name: loc.name, lat: loc.lat || 0, lng: loc.lng || 0})} className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
                    <Car className="w-3 h-3" /> Gọi Xe Đến Đây
                  </button>
                  <button onClick={() => handleOpenRealImage(loc.name, loc.mapsLink || loc.mapsUri, loc.theme || loc.type || loc.category, loc.imageUrl)} className="col-span-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-slate-200">
                    <ImageIcon className="w-3 h-3" /> Xem Ảnh Thực Tế Của Địa Điểm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {exploreSubTab === 'swipe' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" /> Date Matcher
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-full">Tinder UX</span>
          </div>
          
          {(() => {
            const swipeCards = dynamicPlaces.length > 0 ? dynamicPlaces : REAL_LOCATIONS;
            if (swipeIndex >= swipeCards.length) {
              return (
                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm text-center space-y-4 h-[450px]">
                  <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center">
                    <HeartCrack className="w-10 h-10 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xl">Hết Thẻ Mất Rồi!</h3>
                    <p className="text-sm text-slate-500 mt-2">Dẹp màn hình qua một bên và nhắn tin cho trợ lý AI nếu bạn vẫn chưa biết đi đâu nhé.</p>
                  </div>
                  <button onClick={() => setSwipeIndex(0)} className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-pink-500/20 active:scale-95 transition-transform">Trộn Thẻ Vuốt Lại</button>
                </div>
              );
            }

            return (
              <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                <AnimatePresence>
                  {swipeCards.slice(swipeIndex, swipeIndex + 3).reverse().map((loc, i, arr) => {
                    const isTop = i === arr.length - 1;
                    const indexOffset = arr.length - 1 - i;
                    
                    return (
                      <SwipeCard 
                        key={loc.id || loc.name} 
                        loc={loc} 
                        isTop={isTop} 
                        indexOffset={indexOffset} 
                        onSwipe={(dir: string) => {
                          if (dir === 'right') {
                            showToast('Đã thả tim! Mình lưu vào Giỏ Combo nhé 💖');
                            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#ec4899', '#f97316'] });
                          }
                          setSwipeIndex(prev => prev + 1);
                        }}
                        onViewImage={() => handleOpenRealImage(loc.name, loc.mapsLink || loc.mapsUri, loc.desc || loc.theme || loc.type || loc.category, loc.imageUrl)}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            );
          })()}
        </motion.div>
      )}

      {exploreSubTab === 'movies' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Film className="w-5 h-5 text-pink-500" /> Đang Chiếu Tại Hà Nội</h2>
          <div className="grid gap-4">
            {MOVIES.map(movie => (
              <div key={movie.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                    {movie.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800 leading-tight">{movie.name}</h3>
                      <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-md">{movie.rating}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{movie.theaters} • {movie.genre}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-pink-600">{movie.price}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{movie.badge}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                  <p className="text-xs text-blue-800 italic flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
                    {movie.note}
                  </p>
                </div>
                <button onClick={() => showToast('Đã thêm vào combo của bạn!')} className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Thêm vào Combo
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {exploreSubTab === 'trends' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-orange-500" /> Trending tại Hà Nội - Tháng 3/2026</h2>
          <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x">
            {TRENDS.map(trend => (
              <div key={trend.id} className="snap-center shrink-0 w-64 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center text-5xl mb-4 relative overflow-hidden">
                  {trend.icon}
                  <div className={cn("absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full", trend.badgeColor)}>
                    {trend.badge}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{trend.name}</h3>
                <p className="text-xs text-slate-500 mb-3 flex-1">{trend.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-orange-600">{trend.price}</span>
                  <button onClick={() => showToast('Đã thêm vào combo của bạn!')} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderDateMiles = () => {
    const currentLevelInfo = MILESTONE_LEVELS.find(l => l.name === userReward.level);
    const nextLevelInfo = MILESTONE_LEVELS[MILESTONE_LEVELS.findIndex(l => l.name === userReward.level) + 1];
    const progress = nextLevelInfo 
      ? ((userReward.totalMiles - currentLevelInfo!.min) / (nextLevelInfo.min - currentLevelInfo!.min)) * 100 
      : 100;

    return (
      <div className="p-4 space-y-6 pb-24">
        {/* Hero Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`bg-gradient-to-br ${currentLevelInfo?.color || 'from-rose-500 to-orange-500'} p-6 rounded-3xl text-white shadow-xl relative overflow-hidden`}
        >
          <div className="relative z-10">
            <p className="text-sm opacity-80 uppercase tracking-widest font-bold">Current Status</p>
            <h2 className="text-4xl font-black mt-1 flex items-center gap-2">
              {currentLevelInfo?.icon} {userReward.level}
            </h2>
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>{userReward.totalMiles} Miles</span>
                <span>{nextLevelInfo ? `${nextLevelInfo.min} Miles to ${nextLevelInfo.name}` : 'Max Level'}</span>
              </div>
              <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Total Dates', value: userReward.completedDates, icon: Flame, color: 'text-orange-500' },
            { label: 'Miles Earned', value: userReward.totalMiles, icon: Award, color: 'text-blue-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gray-50 ${stat.color}`}><stat.icon size={20} /></div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Trophy size={20} className="text-yellow-500"/> Badges</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {BADGES.map(badge => {
              const isEarned = userReward.badges.includes(badge.id);
              return (
                <div key={badge.id} className={`min-w-[120px] p-4 rounded-2xl border transition-all ${isEarned ? 'bg-white border-yellow-200 shadow-md' : 'bg-gray-50 border-transparent opacity-40 grayscale'}`}>
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="text-xs font-bold truncate">{badge.name}</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Log */}
        <div>
          <h3 className="text-lg font-bold mb-3">Activity Log</h3>
          <div className="space-y-3">
            {userReward.history.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Chưa có hoạt động nào.</p>
              </div>
            ) : (
              userReward.history.map(log => (
                <div key={log.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-50">
                  <div>
                    <p className="text-sm font-medium">{log.reason}</p>
                    <p className="text-[10px] text-gray-400">{log.timestamp}</p>
                  </div>
                  <span className="text-green-500 font-bold text-sm">+{log.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Lịch sử Miles 📝</h2>
      <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
        {userReward.history.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Chưa có hoạt động nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userReward.history.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100"><Award className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <p className="font-medium text-slate-800">{log.reason}</p>
                    <p className="text-xs text-slate-500">{log.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{log.amount} Miles</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-pink-200">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">W</div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Widget Date</h1>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
          <MapPin className="w-4 h-4 text-pink-500" /> {location}
        </div>
      </header>

      <main className="max-w-md mx-auto w-full p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'explore' && renderExplore()}
          {activeTab === 'wallet' && renderDateMiles()}
          {activeTab === 'history' && renderHistory()}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-40">
        <div className="max-w-md mx-auto px-6 py-3 flex justify-between items-center">
          {[
            { id: 'home', icon: Home, label: 'Trang chủ' },
            { id: 'explore', icon: Compass, label: 'Khám phá' },
            { id: 'history', icon: History, label: 'Lịch sử' },
            { id: 'wallet', icon: Trophy, label: 'Date Milestones' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={cn("flex flex-col items-center gap-1 p-2 transition-all duration-200", isActive ? "text-purple-600" : "text-slate-400 hover:text-slate-600")}>
                <div className="relative">
                  <Icon className={cn("w-6 h-6", isActive && "fill-purple-50")} />
                  {isActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full" />}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedCombo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
              {paymentSuccess ? (
                <div className="p-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Đã thanh toán!</h3>
                  <p className="text-slate-600 font-medium">Đi chơi thôi! 🎉</p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Thanh toán</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">✕</button>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Combo đang chọn</p>
                    <p className="font-bold text-slate-800 text-lg mb-4">{selectedCombo.theme}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <span className="text-slate-600 font-medium">Tổng tiền</span>
                      <span className="text-xl font-bold text-slate-900">{formatVND(selectedCombo.totalCost)}</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 mb-6 border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"><Trophy className="w-4 h-4 text-purple-600" /></div>
                      <div>
                        <p className="font-semibold text-purple-900">Date Miles</p>
                        <p className="text-xs text-purple-600">Hiện tại: {userReward.totalMiles} Miles • Level {userReward.level}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={handlePayment} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/25 transition-all active:scale-[0.98]">
                    Thanh Toán Ngay
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* Ride Modal */}
      <AnimatePresence>
        {rideModalLoc && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center p-4">
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Gọi xe đến</h3>
                  <p className="text-sm text-slate-500">{rideModalLoc.name}</p>
                </div>
                <button onClick={() => setRideModalLoc(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <button onClick={() => handleRide('grab', rideModalLoc.name, rideModalLoc.lat, rideModalLoc.lng)} className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-4 rounded-2xl font-bold transition-colors flex items-center justify-between px-6">
                  <span className="flex items-center gap-2"><Car className="w-5 h-5" /> Đặt Grab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => handleRide('be', rideModalLoc.name, rideModalLoc.lat, rideModalLoc.lng)} className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-4 rounded-2xl font-bold transition-colors flex items-center justify-between px-6">
                  <span className="flex items-center gap-2"><Car className="w-5 h-5" /> Đặt Be</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => handleRide('xanhsm', rideModalLoc.name, rideModalLoc.lat, rideModalLoc.lng)} className="w-full bg-cyan-50 hover:bg-cyan-100 text-cyan-700 py-4 rounded-2xl font-bold transition-colors flex items-center justify-between px-6">
                  <span className="flex items-center gap-2"><Car className="w-5 h-5" /> Đặt Xanh SM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real Image Preview Modal */}
      <AnimatePresence>
        {realImageLoc && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
              <div className="flex justify-between items-start p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-800 line-clamp-1 pr-4">{realImageLoc.name}</h3>
                  {realImageLoc.desc && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{realImageLoc.desc}</p>}
                </div>
                <button onClick={() => setRealImageLoc(null)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 shrink-0 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              
              <div className="w-full aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {isRealImgLoading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                    <span className="text-sm font-medium animate-pulse">Đang tải ảnh chất lượng cao...</span>
                  </div>
                ) : (
                  <>
                    <img 
                      src={realImgUrls[currentImgIndex] || ''} 
                      alt={`${realImageLoc.name} - ảnh ${currentImgIndex + 1}`} 
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    
                    {/* Nút lùi */}
                    {currentImgIndex > 0 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => prev - 1); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    
                    {/* Nút tiến */}
                    {currentImgIndex < realImgUrls.length - 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(prev => prev + 1); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}

                    {/* Dấu chấm chỉ báo */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/20 px-2 py-1.5 rounded-full backdrop-blur-sm">
                      {realImgUrls.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
                      ))}
                    </div>

                    {/* Overlay Source Meta */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10">
                      <MapIcon className="w-3 h-3 text-white" />
                      <span className="text-[10px] text-white font-medium">{currentImgIndex === 0 ? 'Ảnh gốc' : 'Ảnh tham khảo'}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-4 bg-white">
                <p className="text-xs text-slate-500 text-center mb-3">
                  {isRealImgLoading 
                    ? "Vui lòng xem qua không gian quán trước khi quyết định di chuyển nhé." 
                    : "Đây là hình ảnh thực tế của địa điểm này! Bạn đã sẵn sàng xuất phát chưa?"}
                </p>
                
                <a 
                  href={realImageLoc.mapsUri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    isRealImgLoading 
                      ? "bg-slate-100 text-slate-400 pointer-events-none" 
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
                  )}
                >
                  <MapPin className="w-4 h-4" />
                  Mở định vị trên Google Maps
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Chat FAB */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full p-4 shadow-lg shadow-pink-500/30 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Bot className="w-6 h-6 animate-bounce" />
      </button>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-[70] flex flex-col bg-white sm:max-w-md sm:mx-auto sm:h-[80vh] sm:mt-[10vh] sm:rounded-3xl sm:shadow-2xl sm:overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Trợ lý AI Hẹn Hò</h3>
                  <p className="text-xs text-white/80">Online • gemini-2.5-pro</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'} gap-2 maxWidth-[85%]`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl text-sm ${msg.role === 'model' ? 'bg-white text-slate-800 shadow-sm rounded-tl-none border border-slate-100' : 'bg-pink-500 text-white shadow-md shadow-pink-500/20 rounded-tr-none'}`}>
                    {msg.text.split('\\n').map((line, i) => <p key={i} className="min-h-[1em]">{line}</p>)}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex justify-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-3 bg-white rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-2 pl-4 focus-within:ring-2 ring-pink-500/20 focus-within:border-pink-300 transition-all">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Hỏi AI tư vấn nhanh..."
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isChatting || !chatInput.trim()}
                  className="bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 text-white rounded-full p-2 transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <AIMonitor />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
