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
    <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {/* Weather Banner */}
      <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          {weatherData ? (
            <>
              <div className="flex items-center justify-between">
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-white/10 flex items-center gap-2"><MapPin className="w-4 h-4" /> {weatherData.name}</span>
                <div className="flex items-center gap-2 text-sm font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 capitalize"><CloudRain className="w-4 h-4" /> {weatherData.weather[0]?.description}</div>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <h2 className="text-5xl font-extrabold leading-tight mb-1">{Math.round(weatherData.main.temp)}°C</h2>
                  <p className="text-white/90 text-sm font-medium">Cảm giác như {Math.round(weatherData.main.feels_like)}°C • Độ ẩm: {weatherData.main.humidity}%</p>
                </div>
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon}@2x.png`} alt="Thời tiết" className="w-20 h-20 -mb-2" />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-white/80"><span className="animate-pulse flex items-center gap-2"><Sun className="w-5 h-5" /> Đang lấy thông tin thời tiết...</span></div>
          )}
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-5 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={openChat}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="bg-red-100 p-2.5 rounded-2xl flex-shrink-0"><HeartCrack className="w-6 h-6 text-red-500" /></div>
          <div>
            <h3 className="text-red-800 font-bold mb-1">Cảnh báo: Tình cảm đang nguội lạnh! 🧊</h3>
            <p className="text-red-600 text-sm">Đã 18 ngày hai bạn chưa đi Date. Trò chuyện với AI để lên lịch hâm nóng tình cảm ngay nhé!</p>
            <button className="mt-3 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">Nhắn AI tư vấn gấp <ArrowRight className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      {/* Planner Form */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Lên lịch hẹn hò 💖</h2>
        <FormSection icon={<Wallet className="w-4 h-4 text-purple-500" />} label="Ngân sách">
          <div className="flex flex-wrap gap-2">
            {['200K', '500K', '1M', '2M', '5M+'].map(b => (
              <button key={b} onClick={() => setBudget(b)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", budget === b ? "bg-slate-900 text-white shadow-md scale-105" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>{b}</button>
            ))}
          </div>
        </FormSection>
        <FormSection icon={<Users className="w-4 h-4 text-pink-500" />} label="Đi cùng ai?">
          <div className="grid grid-cols-3 gap-2">
            {['Bạn bè', 'Người yêu', 'Gia đình'].map(c => (
              <button key={c} onClick={() => setCompanion(c)} className={cn("py-2.5 rounded-2xl text-sm font-medium transition-all border", companion === c ? "border-pink-500 bg-pink-50 text-pink-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>{c}</button>
            ))}
          </div>
        </FormSection>
        <FormSection icon={<Clock className="w-4 h-4 text-orange-500" />} label="Thời gian rảnh">
          <div className="flex items-center gap-3">
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
            <span className="text-slate-400">→</span>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
          </div>
        </FormSection>
        <FormSection icon={<Sparkles className="w-4 h-4 text-yellow-500" />} label="Sở thích">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isSelected = preferences.includes(cat);
              return (
                <button key={cat} onClick={() => setPreferences(isSelected ? preferences.filter(p => p !== cat) : [...preferences, cat])} className={cn("flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border", isSelected ? "border-purple-500 bg-purple-50 text-purple-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>{cat}</button>
              );
            })}
          </div>
        </FormSection>
        <button onClick={handleGenerate} disabled={isGenerating} className="w-full relative group overflow-hidden rounded-2xl p-[1px]">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition-colors">
            {isGenerating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles className="w-5 h-5" /></motion.div> : <><Zap className="w-5 h-5" /> Tạo Combo AI</>}
          </div>
        </button>
      </div>

      {/* Combo Results */}
      {combos.length > 0 && (
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-bold text-slate-800">Combo Đề Xuất ✨</h2>
          <div className="space-y-4">
            {combos.map((combo, idx) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={combo.id} className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-xl">{combo.icon}</div>
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
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" />
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold text-purple-600 mb-0.5">{act.time}</p>
                            <p className="font-medium text-slate-800">{act.name}</p>
                            {act.address && <p className="text-xs text-slate-600 mt-0.5">{act.address}</p>}
                            {act.distance && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {act.distance}</p>}
                          </div>
                          <p className="text-sm font-medium text-slate-600">{act.cost === 0 ? 'Miễn phí' : formatVND(act.cost)}</p>
                        </div>
                        {act.lat && act.lng && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1"><Car className="w-3 h-3" /> Giao thông đến đây</p>
                            <div className="flex gap-2">
                              <button onClick={() => setRideModalLoc({ name: act.name, lat: act.lat!, lng: act.lng! })} className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded-lg text-xs font-bold transition-colors">🚗 Gọi Xe</button>
                              {act.websiteUri && <a href={act.websiteUri} target="_blank" rel="noreferrer" className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-1.5 rounded-lg text-xs font-bold transition-colors text-center">🌐 Website</a>}
                            </div>
                          </div>
                        )}
                        {act.lat && act.lng && (
                          <a href={`https://www.google.com/maps/search/?api=1&query=${act.lat},${act.lng}`} target="_blank" rel="noreferrer" className="mt-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"><MapIcon className="w-3.5 h-3.5" /> Mở trong Google Maps</a>
                        )}
                      </div>
                    ))}
                  </div>
                  {combo.activities.length > 0 && (
                    <a href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(location)}&waypoints=${combo.activities.slice(0, -1).map(a => encodeURIComponent(`${a.name}, ${a.address || location}`)).join('|')}&destination=${encodeURIComponent(`${combo.activities[combo.activities.length - 1].name}, ${combo.activities[combo.activities.length - 1].address || location}`)}`} target="_blank" rel="noreferrer" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors mt-2 shadow-sm border border-blue-200">
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
}

function FormSection({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="space-y-3 mb-6">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">{icon} {label}</label>
      {children}
    </div>
  );
}
