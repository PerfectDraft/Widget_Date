import { useState, useCallback, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Wallet, Users, Clock, Sparkles, Zap, Heart, MapPin, ArrowRight, HeartCrack, CloudRain, Sun, Car, Image as ImageIcon, Map as MapIcon, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateCombos } from '../../services/api';
import { SAMPLE_COMBOS } from '../../data/constants';
import { REAL_LOCATIONS } from '../../data/locations';
import type { Combo } from '../../types';

interface Props {
  weatherData: any;
  showToast: (msg: string) => void;
  setSelectedCombo: (c: Combo) => void;
  setShowPaymentModal: (v: boolean) => void;
  setRideModalLoc: (v: { name: string; lat: number; lng: number } | null) => void;
  setRealImageLoc: (v: { name: string; mapsUri: string; desc?: string; imageUrl?: string } | null) => void;
  combos: Combo[];
  setCombos: (c: Combo[]) => void;
  openChat: () => void;
  formatVND: (n: number) => string;
  location: string;
}

export function HomeView({ weatherData, showToast, setSelectedCombo, setShowPaymentModal, setRideModalLoc, setRealImageLoc, combos, setCombos, openChat, formatVND, location }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [budget, setBudget] = useState('500K');
  const [companion, setCompanion] = useState('Người yêu');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('22:00');
  const [preferences, setPreferences] = useState<string[]>(['Cafe']);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      showToast('AI đang tìm và thiết kế các combo thật cho bạn...');
      const liveCombos = await generateCombos({ location, budget, companion, startTime, endTime, preferences });
      setCombos(liveCombos);
    } catch (error: any) {
      const errMsg = error.message || '';
      showToast(errMsg.includes('[FALLBACK LỖI AI]') ? 'Mạng AI bị nghẽn (429)! Dùng Combo mẫu tạm nha! 🥲' : 'Có lỗi định dạng AI. Tạm thời hiển thị combo mẫu!');
      setCombos(SAMPLE_COMBOS);
    } finally {
      setIsGenerating(false);
    }
  }, [location, budget, companion, startTime, endTime, preferences, showToast]);

  const categories = Array.from(new Set(REAL_LOCATIONS.map(loc => loc.category).filter(Boolean))) as string[];

  return (
    <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-6 space-y-8 mt-6 pb-12">
      {/* Weather Banner */}
      <section className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-lg p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-2 rounded-full text-purple-800">
            <Sun className="w-5 h-5" />
          </div>
          <div>
          {weatherData ? (
            <>
              <h2 className="text-gray-900 font-bold text-base">{weatherData.name} • {Math.round(weatherData.main.temp)}°C, <span className="capitalize">{weatherData.weather[0]?.description}</span></h2>
              <p className="text-gray-500 text-xs">Cảm giác {Math.round(weatherData.main.feels_like)}°C • Độ ẩm {weatherData.main.humidity}%</p>
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <span className="animate-pulse flex items-center gap-2"><Sun className="w-4 h-4" /> Đang lấy thông tin...</span>
            </div>
          )}
          </div>
        </div>
        <div className="text-rose-700 font-bold text-sm flex items-center gap-1">
           {weatherData && <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon}@2x.png`} alt="Thời tiết" className="w-8 h-8" />}
        </div>
      </section>

      {/* Warning Banner */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm bg-red-50 rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={openChat}>
        <div className="relative z-10 flex items-start gap-4">
          <div className="bg-red-50 p-2.5 rounded-full flex-shrink-0"><HeartCrack className="w-6 h-6 text-red-600" /></div>
          <div>
            <h3 className="text-red-600 font-bold mb-1">Cảnh báo: Tình cảm đang nguội lạnh! 🧊</h3>
            <p className="text-red-700 text-sm">Đã 18 ngày hai bạn chưa đi Date. Trò chuyện với AI để lên lịch hâm nóng tình cảm ngay nhé!</p>
            <button className="mt-3 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">Nhắn AI tư vấn gấp <ArrowRight className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      {/* Planner Form */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-rose-700" />
          <h2 className="text-xl font-bold text-gray-900">Lên lịch hẹn hò AI</h2>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-gray-900 font-semibold flex items-center gap-2"><Wallet className="w-5 h-5 text-gray-900" /> Ngân sách</label>
          <div className="flex flex-wrap gap-2">
            {['200K', '500K', '1M', '2M', '5M+'].map(b => (
              <button key={b} onClick={() => setBudget(b)} className={cn("px-5 py-2 rounded-full font-medium transition-colors cursor-pointer", budget === b ? "bg-rose-700 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-rose-100 hover:text-rose-800")}>{b}</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-gray-900 font-semibold flex items-center gap-2"><Heart className="w-5 h-5 text-gray-900" /> Người đi cùng</label>
          <div className="flex flex-wrap gap-2">
            {['Bạn bè', 'Người yêu', 'Gia đình'].map(c => (
              <button key={c} onClick={() => setCompanion(c)} className={cn("px-5 py-2 rounded-full font-medium transition-colors cursor-pointer", companion === c ? "bg-rose-700 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-rose-100 hover:text-rose-800")}>{c}</button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-gray-900 font-semibold flex items-center gap-2"><Clock className="w-5 h-5 text-gray-900" /> Khung giờ</label>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm p-4 rounded-lg">
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500">Từ</p>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-transparent border-none text-center text-lg font-bold text-gray-900 p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-50" />
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500">Đến</p>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-transparent border-none text-center text-lg font-bold text-gray-900 p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-50" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-gray-900 font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-gray-900" /> Sở thích</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isSelected = preferences.includes(cat);
              return (
                <button key={cat} onClick={() => setPreferences(isSelected ? preferences.filter(p => p !== cat) : [...preferences, cat])} className={cn("px-4 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition-colors", isSelected ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50")}>#{cat}</button>
              );
            })}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-5 rounded-full bg-rose-700 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 mt-4 cursor-pointer">
           {isGenerating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles className="w-6 h-6" /></motion.div> : <><Zap className="w-6 h-6" /> Tạo Combo AI</>}
        </button>
      </section>

      {/* Combo Results */}
      {combos.length > 0 && (
        <section className="space-y-6 mt-12">
          <h3 className="text-xl font-bold text-gray-900">Combo Đề Xuất</h3>
          <div className="space-y-6">
            {combos.map((combo, idx) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={combo.id} className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col shadow-lg">
                <div className="relative h-56 w-full">
                  <img alt={combo.theme} className="w-full h-full object-cover" src={combo.activities.find(act => act.imageUrl)?.imageUrl || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80"} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Heart className="w-4 h-4 text-purple-600 fill-purple-600" />
                    <span className="font-bold text-gray-900 text-xs">{combo.score}/10</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <h4 className="text-2xl font-bold text-white drop-shadow-md">Combo {combo.theme}</h4>
                      <div className="text-white/90 font-medium drop-shadow-md flex items-center gap-1">{combo.icon}</div>
                    </div>
                    <div className="bg-rose-700 px-4 py-2 rounded-xl shadow-md">
                      <p className="text-white font-bold text-xl leading-none">{formatVND(combo.totalCost)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 bg-white/50">
                  <div className="space-y-4 relative">
                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-200 border-l-2 border-dashed border-rose-700/50"></div>
                    {combo.activities.map((act, i) => (
                      <div key={i} className="flex gap-4 items-start relative z-10 p-3 rounded-xl hover:bg-gray-100 transition-colors group">
                         <div className={cn("size-8 rounded-full text-white flex items-center justify-center border-4 border-white shadow-sm shrink-0 mt-0.5", i % 2 === 0 ? "bg-rose-700" : "bg-purple-600")}>
                           <span className="text-[14px] font-bold">{i + 1}</span>
                         </div>
                         <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <p className={cn("text-xs font-bold mb-0.5", i % 2 === 0 ? "text-rose-700" : "text-purple-600")}>{act.time}</p>
                              <p className="text-sm font-bold text-gray-500">{act.cost === 0 ? 'Miễn phí' : formatVND(act.cost)}</p>
                           </div>
                           <p className={cn("font-bold text-gray-900 transition-colors", i % 2 === 0 ? "group-hover:text-rose-700" : "group-hover:text-purple-600")}>{act.name}</p>
                           {act.address && <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {act.address}</p>}
                           
                           <div className="mt-3 flex flex-wrap gap-2">
                              {act.lat && act.lng && (
                                 <button onClick={() => setRideModalLoc({ name: act.name, lat: act.lat!, lng: act.lng! })} className="cursor-pointer bg-gray-50 text-gray-900 py-1.5 px-3 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-1 border border-gray-200">
                                   <Car className="w-3 h-3" /> Gọi Xe
                                 </button>
                              )}
                              {act.lat && act.lng && (
                                 <a href={`https://www.google.com/maps/search/?api=1&query=${act.lat},${act.lng}`} target="_blank" rel="noreferrer" className="bg-emerald-50 text-emerald-700 py-1.5 px-3 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 border border-emerald-200">
                                   <MapIcon className="w-3 h-3" /> Bản Đồ
                                 </a>
                              )}
                              {act.imageUrl && (
                                 <button onClick={() => setRealImageLoc({ name: act.name, mapsUri: act.websiteUri || '', desc: act.address, imageUrl: act.imageUrl })} className="cursor-pointer bg-amber-50 text-amber-700 py-1.5 px-3 rounded-full text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 border border-amber-200">
                                   <ImageIcon className="w-3 h-3" /> Xem Ảnh
                                 </button>
                              )}
                              {act.websiteUri && (
                                 <a href={act.websiteUri} target="_blank" rel="noreferrer" className="bg-blue-50 text-blue-600 py-1.5 px-3 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 border border-blue-200">
                                   <ExternalLink className="w-3 h-3" /> Website
                                 </a>
                              )}
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>

                  {combo.activities.length > 0 && (
                    <a href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(location)}&waypoints=${combo.activities.slice(0, -1).map(a => encodeURIComponent(`${a.name}, ${a.address || location}`)).join('|')}&destination=${encodeURIComponent(`${combo.activities[combo.activities.length - 1].name}, ${combo.activities[combo.activities.length - 1].address || location}`)}`} target="_blank" rel="noreferrer" className="w-full py-4 rounded-full bg-gray-50 text-gray-900 font-bold text-base border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                      <MapIcon className="w-5 h-5" /> Lộ Trình
                    </a>
                  )}
                  <button onClick={() => { setSelectedCombo(combo); setShowPaymentModal(true); }} className="cursor-pointer w-full py-4 rounded-full bg-rose-50 text-rose-700 font-bold text-base border-2 border-rose-200 hover:bg-rose-700 hover:text-white transition-all">
                    Chọn Combo Này
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
