import { useState } from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, Heart, Film, TrendingUp, Star, MapPin, Plus, Car, Image as ImageIcon, Navigation2, Sparkles, HeartCrack } from 'lucide-react';
import { cn } from '../../lib/utils';
import { calculateDistance } from '../../services/api';
import { REAL_LOCATIONS } from '../../data/locations';
import { TRENDS } from '../../data/trends';
import { MOVIES } from '../../data/movies';
import type { ExploreTab, LocationItem } from '../../types';

interface Props {
  showToast: (msg: string) => void;
  setRideModalLoc: (v: { name: string; lat: number; lng: number } | null) => void;
  setRealImageLoc: (v: { name: string; mapsUri: string; desc?: string } | null) => void;
  formatVND: (n: number) => string;
}

export function ExploreView({ showToast, setRideModalLoc, setRealImageLoc, formatVND }: Props) {
  const [exploreSubTab, setExploreSubTab] = useState<ExploreTab>('map');
  const [dynamicPlaces, setDynamicPlaces] = useState<LocationItem[]>(REAL_LOCATIONS);
  const [placesSort, setPlacesSort] = useState<'rating_desc' | 'rating_asc' | 'dist_asc' | 'dist_desc' | 'best_choice'>('rating_desc');
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [swipeIndex, setSwipeIndex] = useState(0);

  const handleFetchPlaces = () => {
    const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isSecureContext) { setSearchError('❌ Truy cập qua localhost:5173 để dùng Geolocation!'); showToast('❌ Truy cập qua localhost:5173!'); return; }
    if (!navigator.geolocation) { showToast('Trình duyệt không hỗ trợ định vị!'); return; }

    setLoadingPlaces(true);
    setSearchError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const placesWithDist = REAL_LOCATIONS.map(p => ({
          ...p, distance: p.lat && p.lng ? calculateDistance(lat, lng, p.lat, p.lng) : 999
        }));
        setDynamicPlaces(placesWithDist as LocationItem[]);
        setPlacesSort('best_choice');
        setLoadingPlaces(false);
        showToast('Đã tính toán khoảng cách thành công!');
      },
      (err) => {
        const msgs: Record<number, string> = { 1: '❌ Bạn đã từ chối cấp quyền vị trí.', 2: '❌ Không xác định được vị trí.', 3: '❌ Thời gian chờ định vị quá lâu.' };
        setSearchError(msgs[err.code] || 'Không lấy được vị trí.'); showToast(msgs[err.code] || 'Lỗi định vị'); setLoadingPlaces(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const getSortedPlaces = () => {
    const places = [...dynamicPlaces];
    if (placesSort === 'rating_desc') places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (placesSort === 'rating_asc') places.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    if (placesSort === 'dist_asc') places.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    if (placesSort === 'dist_desc') places.sort((a, b) => (b.distance || 0) - (a.distance || 0));
    if (placesSort === 'best_choice') places.sort((a, b) => ((b.rating || 0) * 10 - (b.distance || 999)) - ((a.rating || 0) * 10 - (a.distance || 999)));
    return places;
  };

  const tabs = [
    { id: 'map' as const, label: 'Bản Đồ', icon: MapIcon },
    { id: 'swipe' as const, label: 'Quẹt Thẻ', icon: Heart },
    { id: 'movies' as const, label: 'Phim', icon: Film },
    { id: 'trends' as const, label: 'Hot Trend', icon: TrendingUp },
  ];

  return (
    <motion.div key="explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setExploreSubTab(tab.id)} className={cn("flex-1 whitespace-nowrap px-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all", exploreSubTab === tab.id ? "bg-slate-900 text-white shadow-md" : tab.id === 'swipe' ? "text-pink-500 hover:text-pink-600 font-bold bg-pink-50" : "text-slate-500 hover:text-slate-700")}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {exploreSubTab === 'map' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <label className="text-sm font-bold text-slate-700 block">Vị trí của bạn</label>
            <button onClick={handleFetchPlaces} disabled={loadingPlaces} className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-slate-900/20">
              {loadingPlaces ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang định vị...</> : <><Navigation2 className="w-5 h-5" /> Sử dụng vị trí hiện tại</>}
            </button>
            {searchError && <p className="text-red-500 text-xs mt-2">{searchError}</p>}
          </div>
          <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-48 bg-slate-200">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.4170942006!2d105.75612349141834!3d21.02273870409085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1710385000000!5m2!1svi!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Địa điểm quanh đây</h3>
            <select value={placesSort} onChange={e => setPlacesSort(e.target.value as any)} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700">
              <option value="best_choice">Best Choice</option>
              <option value="rating_desc">Đánh giá cao nhất</option>
              <option value="rating_asc">Đánh giá thấp nhất</option>
              <option value="dist_asc">Gần nhất</option>
              <option value="dist_desc">Xa nhất</option>
            </select>
          </div>
          <div className="grid gap-4">
            {getSortedPlaces().map(loc => (
              <div key={loc.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div><h3 className="font-bold text-slate-800">{loc.name}</h3><p className="text-sm text-slate-500">{loc.address} • {loc.theme || loc.type || loc.category}</p></div>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold shrink-0"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {loc.rating}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <MapPin className="w-3 h-3" /> {loc.distance !== undefined && loc.distance !== 999 ? `Cách bạn ${loc.distance.toFixed(1)} km • ` : ''}Giá khoảng: {formatVND(loc.price || loc.cost || 0)}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button onClick={() => showToast('Đã thêm vào combo!')} className="bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Thêm Combo</button>
                  <button onClick={() => setRideModalLoc({ name: loc.name, lat: loc.lat || 0, lng: loc.lng || 0 })} className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"><Car className="w-3 h-3" /> Gọi Xe</button>
                  <button onClick={() => setRealImageLoc({ name: loc.name, mapsUri: loc.mapsLink || loc.mapsUri || '', desc: loc.theme || loc.category })} className="col-span-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-slate-200"><ImageIcon className="w-3 h-3" /> Xem Ảnh Thực Tế</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {exploreSubTab === 'swipe' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent flex items-center gap-2"><Sparkles className="w-5 h-5 text-pink-500" /> Date Matcher</h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-full">Tinder UX</span>
          </div>
          {swipeIndex >= REAL_LOCATIONS.length ? (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-3xl border text-center space-y-4 h-[450px]">
              <HeartCrack className="w-10 h-10 text-pink-500" />
              <h3 className="font-bold text-xl">Hết Thẻ Mất Rồi!</h3>
              <button onClick={() => setSwipeIndex(0)} className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold shadow-lg">Trộn Thẻ Vuốt Lại</button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border p-6 text-center space-y-4">
              <h3 className="font-bold text-lg text-slate-800">{REAL_LOCATIONS[swipeIndex]?.name}</h3>
              <p className="text-sm text-slate-500">{REAL_LOCATIONS[swipeIndex]?.address}</p>
              <div className="flex justify-center gap-6 mt-4">
                <button onClick={() => { setSwipeIndex(i => i + 1); }} className="w-14 h-14 rounded-full border-2 border-red-200 text-red-500 flex items-center justify-center text-2xl">✕</button>
                <button onClick={() => { showToast('Đã thả tim! 💖'); setSwipeIndex(i => i + 1); }} className="w-14 h-14 rounded-full border-2 border-emerald-200 text-emerald-500 flex items-center justify-center text-2xl">♥</button>
              </div>
              <p className="text-xs text-slate-400">{swipeIndex + 1} / {REAL_LOCATIONS.length}</p>
            </div>
          )}
        </motion.div>
      )}

      {exploreSubTab === 'movies' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {MOVIES.map(m => (
            <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="text-3xl">{m.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-slate-800">{m.name}</h3><span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{m.badge}</span></div>
                <p className="text-xs text-slate-500 mb-1">{m.theaters} • {m.genre}</p>
                <div className="flex items-center gap-2"><span className="text-xs font-bold text-yellow-600">⭐ {m.rating}</span><span className="text-xs font-bold text-slate-600">{m.price}</span></div>
                <p className="text-xs text-slate-400 mt-1 italic">{m.note}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {exploreSubTab === 'trends' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {TRENDS.map(t => (
            <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="text-3xl">{t.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-slate-800 text-sm">{t.name}</h3><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", t.badgeColor)}>{t.badge}</span></div>
                <p className="text-xs text-slate-500">{t.desc} • {t.price}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
