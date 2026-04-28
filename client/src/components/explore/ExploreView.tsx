import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { calculateDistance, getTrends } from '../../services/api';
import { REAL_LOCATIONS } from '../../data/locations';
import { MOVIES } from '../../data/movies';
import { CategoryDetailView } from './CategoryDetailView';
import type { LocationItem, TrendItem } from '../../types';

interface Props {
  showToast: (msg: string) => void;
  setRideModalLoc: (v: { name: string; lat: number; lng: number } | null) => void;
  setRealImageLoc: (v: { name: string; mapsUri: string; desc?: string; imageUrl?: string } | null) => void;
  formatVND: (n: number) => string;
  onAddToCombo: (loc: LocationItem) => void;
  savedPlacesCount: number;
}

const CATEGORIES = ['Tất cả', 'Cafe', 'Food', 'Lãng mạn', 'Sang trọng'] as const;

const CATEGORY_GRID = [
  { label: 'Ăn tối', icon: 'dinner_dining', gradient: 'from-rose-600 to-orange-500' },
  { label: 'Cafe & Chill', icon: 'local_cafe', gradient: 'from-amber-700 to-yellow-500' },
  { label: 'Đi dạo', icon: 'directions_walk', gradient: 'from-emerald-700 to-teal-500' },
  { label: 'Xem phim', icon: 'movie', gradient: 'from-slate-800 to-slate-600' },
] as const;

export function ExploreView({ showToast, setRideModalLoc, setRealImageLoc, formatVND, onAddToCombo, savedPlacesCount }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicPlaces, setDynamicPlaces] = useState<LocationItem[]>(REAL_LOCATIONS);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<'places' | 'movies' | 'trends' | null>('places');
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [selectedCategoryGrid, setSelectedCategoryGrid] = useState<typeof CATEGORY_GRID[number] | null>(null);

  // Fetch trends on mount
  useMemo(() => {
    getTrends().then(setTrends).catch(err => console.error('Failed to fetch trends:', err));
  }, []);

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

  const filteredPlaces = useMemo(() => {
    let places = [...dynamicPlaces];
    if (activeCategory !== 'Tất cả') {
      if (activeCategory === 'Lãng mạn') {
        places = places.filter(p => p.theme?.toLowerCase().includes('lãng mạn') || p.theme?.toLowerCase().includes('romantic'));
      } else if (activeCategory === 'Sang trọng') {
        places = places.filter(p => p.theme?.toLowerCase().includes('sang trọng') || (p.price && p.price >= 500000));
      } else {
        places = places.filter(p => p.category === activeCategory);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      places = places.filter(p => p.name.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q) || p.theme?.toLowerCase().includes(q));
    }
    return places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [dynamicPlaces, activeCategory, searchQuery]);

  const toggleFavorite = (id: string | number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast('Đã bỏ yêu thích'); }
      else { next.add(id); showToast('Đã thêm vào yêu thích ♥'); }
      return next;
    });
  };

  return (
    <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-background min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-card px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-headline-md font-bold text-on-surface" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
            Khám phá
          </h1>
          <button onClick={handleFetchPlaces} disabled={loadingPlaces} className="bg-primary-container/40 p-2.5 rounded-full hover:bg-primary-container/60 transition-colors cursor-pointer">
            {loadingPlaces ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-primary text-[20px]">my_location</span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Tìm địa điểm lãng mạn..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low pl-12 pr-12 py-3 rounded-full text-on-surface placeholder:text-on-surface-variant/40 border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={() => showToast('Bộ lọc nâng cao — Sử dụng "Khám phá theo danh mục" bên dưới!')}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-container-high p-1.5 rounded-full cursor-pointer hover:bg-primary-container/40 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">tune</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scroll-hidden -mx-6 px-6 pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-5 py-2 rounded-full text-label-md font-semibold whitespace-nowrap transition-all cursor-pointer',
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container/40'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {searchError && <p className="text-error text-xs px-6 pt-2">{searchError}</p>}

      <main className="px-6 space-y-8 mt-6">
        {/* Map Preview Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-on-surface font-bold text-body-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              Địa điểm gần đây
            </h2>
            <button onClick={handleFetchPlaces} className="text-primary text-label-md font-bold flex items-center gap-1 cursor-pointer hover:underline">
              XEM TẤT CẢ
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <div className="rounded-[28px] overflow-hidden shadow-lg border border-outline-variant/20 h-44 bg-surface-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.4170942006!2d105.75612349141834!3d21.02273870409085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1710385000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* Place Cards Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-on-surface font-bold text-body-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>recommend</span>
              Gợi ý cho bạn
            </h2>
            <span className="text-on-surface-variant text-label-sm">{filteredPlaces.length} địa điểm</span>
          </div>

          <div className="space-y-5">
            {filteredPlaces.slice(0, 6).map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
                className="glass-card rounded-[28px] overflow-hidden border-none"
              >
                {/* Cover Image */}
                <div
                  className="relative h-44 bg-gradient-to-br from-primary/20 via-surface-container to-secondary/20 bg-cover bg-center"
                  style={loc.imageUrl ? { backgroundImage: `url(${loc.imageUrl})` } : undefined}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(loc.id)}
                    className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={favorites.has(loc.id) ? { fontVariationSettings: "'FILL' 1", color: '#e11d48' } : { color: '#6b7280' }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-on-surface text-body-lg truncate">{loc.name}</h3>
                      <p className="text-on-surface-variant text-label-sm mt-0.5 truncate">{loc.address}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary-fixed/60 text-primary px-2.5 py-1 rounded-full text-label-sm font-bold shrink-0 ml-2">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {loc.rating}
                    </div>
                  </div>

                  {/* Distance + Price */}
                  <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {loc.category && (
                      <span className="bg-tertiary-fixed/40 text-on-tertiary-fixed text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        #{loc.category}
                      </span>
                    )}
                    {loc.theme?.split(',').slice(0, 2).map(t => (
                      <span key={t.trim()} className="bg-primary-container/30 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        #{t.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onAddToCombo(loc)}
                      className="flex-1 bg-primary text-on-primary py-2.5 rounded-full text-label-md font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      Combo{savedPlacesCount > 0 ? ` (${savedPlacesCount})` : ''}
                    </button>
                    <button
                      onClick={() => setRideModalLoc({ name: loc.name, lat: loc.lat || 0, lng: loc.lng || 0 })}
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer"
                      aria-label="Gọi xe"
                    >
                      <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                    </button>
                    <button
                      onClick={() => setRealImageLoc({ name: loc.name, mapsUri: loc.mapsLink || loc.mapsUri || '', desc: loc.theme || loc.category, imageUrl: loc.imageUrl })}
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer"
                      aria-label="Xem ảnh"
                    >
                      <span className="material-symbols-outlined text-[18px]">image</span>
                    </button>
                    <a
                      href={loc.mapsLink || loc.mapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + (loc.address || ''))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer"
                      aria-label="Mở Google Maps"
                    >
                      <span className="material-symbols-outlined text-[18px]">map</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPlaces.length > 6 && (
            <button
              onClick={() => setExpandedSection(expandedSection === 'places' ? null : 'places')}
              className="w-full mt-4 py-3 rounded-full border border-outline-variant/30 text-primary font-bold text-label-md flex items-center justify-center gap-2 hover:bg-primary-container/20 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
              Xem thêm {filteredPlaces.length - 6} địa điểm
            </button>
          )}
        </section>

        {/* Category Grid */}
        <section>
          <h2 className="text-on-surface font-bold text-body-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
            Khám phá theo danh mục
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORY_GRID.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategoryGrid(cat)}
                className={cn(
                  'rounded-[24px] h-28 flex flex-col items-start justify-end p-4 bg-gradient-to-br text-white transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-lg',
                  cat.gradient
                )}
              >
                <span className="material-symbols-outlined text-[28px] mb-1 opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                <span className="font-bold text-label-md">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Movies Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-on-surface font-bold text-body-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
              Phim hay hôm nay
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scroll-hidden -mx-6 px-6 pb-2">
            {MOVIES.map(m => (
              <div key={m.id} className="glass-card rounded-[24px] p-4 min-w-[200px] max-w-[200px] shrink-0 space-y-2 border-none">
                <div className="text-3xl">{m.icon}</div>
                <h3 className="font-bold text-on-surface text-body-md line-clamp-1">{m.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-label-sm font-bold text-primary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {m.rating}
                  </span>
                  <span className="text-[10px] font-bold bg-primary-fixed text-primary px-2 py-0.5 rounded-full">{m.badge}</span>
                </div>
                <p className="text-on-surface-variant text-label-sm line-clamp-1">{m.genre}</p>
                <p className="text-on-surface font-bold text-label-sm">{m.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trends Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-on-surface font-bold text-body-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              Hot Trend hôm nay
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scroll-hidden -mx-6 px-6 pb-2">
            {trends.map(t => (
              <div key={t.id} className="glass-card rounded-[24px] p-4 min-w-[180px] max-w-[180px] shrink-0 space-y-2 border-none">
                <div className="text-3xl">{t.icon}</div>
                <h3 className="font-bold text-on-surface text-label-md line-clamp-2">{t.name}</h3>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full inline-block", t.badgeColor)}>{t.badge}</span>
                <p className="text-on-surface-variant text-label-sm line-clamp-2">{t.desc}</p>
                <p className="text-on-surface font-bold text-label-sm">{t.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Category Detail Overlay */}
      <AnimatePresence>
        {selectedCategoryGrid && (
          <CategoryDetailView
            categoryLabel={selectedCategoryGrid.label}
            categoryIcon={selectedCategoryGrid.icon}
            categoryGradient={selectedCategoryGrid.gradient}
            onBack={() => setSelectedCategoryGrid(null)}
            showToast={showToast}
            setRideModalLoc={setRideModalLoc}
            setRealImageLoc={setRealImageLoc}
            formatVND={formatVND}
            onAddToCombo={onAddToCombo}
            savedPlacesCount={savedPlacesCount}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
