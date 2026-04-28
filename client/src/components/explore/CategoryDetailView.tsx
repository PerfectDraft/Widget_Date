import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { cn, extractPlaceImage } from '../../lib/utils';
import { calculateDistance } from '../../services/api';
import { REAL_LOCATIONS } from '../../data/locations';
import type { LocationItem, Combo, ComboSlot } from '../../types';

interface Props {
  categoryLabel: string;
  categoryIcon: string;
  categoryGradient: string;
  onBack: () => void;
  showToast: (msg: string) => void;
  setRideModalLoc: (v: { name: string; lat: number; lng: number } | null) => void;
  setRealImageLoc: (v: { name: string; mapsUri: string; desc?: string; imageUrl?: string } | null) => void;
  formatVND: (n: number) => string;
  onAddToCombo: (loc: LocationItem) => void;
  savedPlacesCount: number;
  activeCombo: Combo | null;
  comboSlots: ComboSlot[];
}

type SortMode = 'best' | 'rating' | 'distance';

const CATEGORY_MAP: Record<string, (loc: LocationItem) => boolean> = {
  'Ăn tối': (loc) => loc.category === 'Food' || loc.theme?.toLowerCase().includes('ăn') || false,
  'Cafe & Chill': (loc) => loc.category === 'Cafe',
  'Đi dạo': (loc) => loc.theme?.toLowerCase().includes('lãng mạn') || loc.theme?.toLowerCase().includes('dạo') || false,
  'Xem phim': (loc) => loc.category === 'Entertainment' || loc.theme?.toLowerCase().includes('phim') || false,
};

export function CategoryDetailView({
  categoryLabel, categoryIcon, categoryGradient, onBack,
  showToast, setRideModalLoc, setRealImageLoc, formatVND, onAddToCombo, savedPlacesCount,
  activeCombo, comboSlots
}: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('best');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  // Get user location
  const handleGetLocation = () => {
    if (!navigator.geolocation) { showToast('Trình duyệt không hỗ trợ định vị!'); return; }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLoadingLoc(false); showToast('Đã lấy vị trí!'); },
      () => { setLoadingLoc(false); showToast('Không lấy được vị trí'); },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const places = useMemo(() => {
    const filterFn = CATEGORY_MAP[categoryLabel] || (() => true);
    let filtered = REAL_LOCATIONS.filter(filterFn);

    // Attach distance if user coords available
    if (userCoords) {
      filtered = filtered.map(p => ({
        ...p,
        distance: p.lat && p.lng ? calculateDistance(userCoords.lat, userCoords.lng, p.lat, p.lng) : 999
      })) as LocationItem[];
    }

    // Sort
    switch (sortMode) {
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'distance':
        return filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      case 'best':
      default: {
        // Best choice: weighted combination
        return filtered.sort((a, b) => {
          const scoreA = (a.rating || 0) * 2 - (a.distance || 50) * 0.5;
          const scoreB = (b.rating || 0) * 2 - (b.distance || 50) * 0.5;
          return scoreB - scoreA;
        });
      }
    }
  }, [categoryLabel, sortMode, userCoords]);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className={cn('px-6 pt-6 pb-8 bg-gradient-to-br text-white', categoryGradient)}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Epilogue, sans-serif' }}>{categoryLabel}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[40px] opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>{categoryIcon}</span>
            <p className="text-white/80 text-sm">{places.length} địa điểm được tìm thấy</p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="px-6 py-4 flex items-center gap-2 flex-wrap">
          <span className="text-on-surface-variant text-label-sm font-bold mr-1">Sắp xếp:</span>
          {([
            { mode: 'best' as SortMode, label: '⭐ Best Choice', desc: 'Gần + Sao cao' },
            { mode: 'rating' as SortMode, label: '📊 Rate sao', desc: 'Cao → Thấp' },
            { mode: 'distance' as SortMode, label: '📍 Khoảng cách', desc: 'Gần → Xa' },
          ]).map(s => (
            <button
              key={s.mode}
              onClick={() => setSortMode(s.mode)}
              className={cn(
                'px-4 py-2 rounded-full text-label-sm font-semibold transition-all cursor-pointer',
                sortMode === s.mode
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container/40'
              )}
            >
              {s.label}
            </button>
          ))}

          {!userCoords && (
            <button
              onClick={handleGetLocation}
              disabled={loadingLoc}
              className="ml-auto px-3 py-2 rounded-full bg-primary-container/40 text-primary text-label-sm font-bold flex items-center gap-1 cursor-pointer"
            >
              {loadingLoc ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[16px]">my_location</span>
              )}
              Lấy vị trí
            </button>
          )}
        </div>

        {sortMode === 'distance' && !userCoords && (
          <p className="px-6 text-xs text-amber-600 -mt-2 mb-2">⚠️ Bấm "Lấy vị trí" để sắp xếp theo khoảng cách chính xác</p>
        )}

        {/* Place Cards */}
        <div className="px-6 space-y-4">
          {places.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] opacity-40 block mb-3">search_off</span>
              <p className="font-bold">Chưa có địa điểm nào</p>
              <p className="text-label-sm mt-1">Danh mục này sẽ sớm được cập nhật!</p>
            </div>
          ) : (
            places.map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
                className="glass-card rounded-[24px] overflow-hidden border-none"
              >
                {/* Cover */}
                <div className="relative h-36 bg-gradient-to-br from-primary/20 via-surface-container to-secondary/20 overflow-hidden">
                  {extractPlaceImage(loc.imageUrl) && (
                    <img
                      src={extractPlaceImage(loc.imageUrl)}
                      alt={loc.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-label-sm font-bold text-[#1F1B17]">{loc.rating}</span>
                  </div>
                  {/* Rank badge for top 3 */}
                  {i < 3 && sortMode === 'best' && (
                    <div className="absolute top-3 left-3 z-20 bg-primary text-on-primary w-7 h-7 rounded-full flex items-center justify-center text-label-sm font-black shadow-md">
                      {i + 1}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <h3 className="font-bold text-on-surface text-body-lg">{loc.name}</h3>
                  <p className="text-on-surface-variant text-label-sm truncate">{loc.address}</p>

                  <div className="flex items-center gap-2 text-label-sm text-on-surface-variant flex-wrap">
                    {loc.distance !== undefined && loc.distance !== 999 && (
                      <span className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[14px]">near_me</span>
                        {loc.distance.toFixed(1)} km
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">payments</span>
                      {formatVND(loc.price || loc.cost || 0)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onAddToCombo(loc)}
                      className={`flex-1 py-2.5 rounded-full text-label-md font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeCombo && comboSlots.every(s => s !== null)
                          ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                          : 'bg-primary text-on-primary hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      disabled={!!(activeCombo && comboSlots.every(s => s !== null))}
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      {activeCombo
                        ? comboSlots.every(s => s !== null) ? 'Đã đủ' : 'Thêm vào Combo'
                        : `Combo${savedPlacesCount > 0 ? ` (${savedPlacesCount})` : ''}`
                      }
                    </button>
                    <button
                      onClick={() => setRideModalLoc({ name: loc.name, lat: loc.lat || 0, lng: loc.lng || 0 })}
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                    </button>
                    <button
                      onClick={() => setRealImageLoc({ name: loc.name, mapsUri: loc.mapsLink || loc.mapsUri || '', desc: loc.theme || loc.category, imageUrl: loc.imageUrl })}
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">image</span>
                    </button>
                    <a
                      href={loc.mapsLink || loc.mapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + (loc.address || ''))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">map</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
