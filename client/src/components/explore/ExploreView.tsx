import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, extractPlaceImage } from '../../lib/utils';
import { calculateDistance, getTrends } from '../../services/api';
import { REAL_LOCATIONS } from '../../data/locations';
import { MOVIES } from '../../data/movies';
import { CategoryDetailView } from './CategoryDetailView';
import { useLocale } from '../../hooks/useLocale';
import type { LocationItem, TrendItem, Combo, ComboSlot } from '../../types';

interface Props {
  showToast: (msg: string) => void;
  setRideModalLoc: (v: { name: string; lat: number; lng: number } | null) => void;
  setRealImageLoc: (v: { name: string; mapsUri: string; desc?: string; imageUrl?: string } | null) => void;
  formatVND: (n: number) => string;
  onAddToCombo: (loc: LocationItem) => void;
  savedPlacesCount: number;
  activeCombo: Combo | null;
  comboSlots: ComboSlot[];
}


export function ExploreView({ showToast, setRideModalLoc, setRealImageLoc, formatVND, onAddToCombo, savedPlacesCount, activeCombo, comboSlots }: Props) {
  const { t } = useLocale();
  const CATEGORIES = [t.explore.all_category, ...Array.from(new Set(REAL_LOCATIONS.map(loc => loc.category).filter(Boolean)))] as string[];
  
  const CATEGORY_GRID = [
    { label: t.explore.categories_dinner, icon: 'dinner_dining', gradient: 'from-rose-600 to-orange-500' },
    { label: t.explore.categories_cafe, icon: 'local_cafe', gradient: 'from-amber-700 to-yellow-500' },
    { label: t.explore.categories_walk, icon: 'directions_walk', gradient: 'from-emerald-700 to-teal-500' },
  ] as const;

  const [activeCategory, setActiveCategory] = useState<string>(t.explore.all_category);
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicPlaces, setDynamicPlaces] = useState<LocationItem[]>(REAL_LOCATIONS);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [visibleItemsCount, setVisibleItemsCount] = useState(5);
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [selectedCategoryGrid, setSelectedCategoryGrid] = useState<typeof CATEGORY_GRID[number] | null>(null);

  // Reset visible items when search or category changes
  useEffect(() => {
    setVisibleItemsCount(5);
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    let mounted = true;
    getTrends().then(data => {
      if (mounted) setTrends(data);
    }).catch(err => {
      console.error('Failed to fetch trends:', err);
    });
    return () => { mounted = false; };
  }, []);

  const handleFetchPlaces = () => {
    const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isSecureContext) { setSearchError(t.explore.search_error_secure); showToast(t.explore.search_error_secure); return; }
    if (!navigator.geolocation) { showToast(t.explore.search_error_support); return; }

    setLoadingPlaces(true);
    setSearchError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const sorted = [...REAL_LOCATIONS].map(loc => ({
          ...loc,
          distance: calculateDistance(lat, lng, loc.lat, loc.lng)
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
        setDynamicPlaces(sorted.slice(0, 15));
        setLoadingPlaces(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        const msgs: Record<number, string> = { 
          1: t.explore.search_error_denied, 
          2: t.explore.search_error_unknown, 
          3: t.explore.search_error_timeout 
        };
        const errorMsg = msgs[err.code] || t.explore.search_error_generic;
        setSearchError(errorMsg); 
        showToast(errorMsg); 
        setLoadingPlaces(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const filteredPlaces = useMemo(() => {
    let places = [...dynamicPlaces];
    if (activeCategory !== t.explore.all_category) {
      places = places.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      places = places.filter(p => p.name.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q) || p.theme?.toLowerCase().includes(q));
    }
    return places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [dynamicPlaces, activeCategory, searchQuery, t]);

  const toggleFavorite = (id: string | number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast(t.explore.favorite_remove); }
      else { next.add(id); showToast(t.explore.favorite_add); }
      return next;
    });
  };

  return (
    <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-background min-h-screen pb-24" id="main-content">
      <header className="sticky top-0 z-30 glass-card px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-headline-md font-bold text-on-surface" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
            {t.explore.title}
          </h1>
          <button 
            onClick={handleFetchPlaces} 
            disabled={loadingPlaces} 
            className="bg-primary-container/40 p-2.5 rounded-full hover:bg-primary-container/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t.explore.get_location}
          >
            {loadingPlaces ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-primary text-[20px]">my_location</span>
            )}
          </button>
        </div>

        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]" aria-hidden="true">search</span>
          <input
            type="text"
            aria-label={t.explore.search_button}
            placeholder={t.explore.search_placeholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low pl-12 pr-12 py-3 rounded-full text-on-surface placeholder:text-on-surface-variant/40 border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={() => showToast(t.explore.toast_filters_hint)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-container-high p-1.5 rounded-full cursor-pointer hover:bg-primary-container/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t.explore.advanced_filters}
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">tune</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scroll-hidden -mx-6 px-6 pb-1" role="tablist">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              role="tab"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-5 py-2 rounded-full text-label-md font-semibold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container/40'
              )}
              aria-selected={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {searchError && <p className="text-error text-xs px-6 pt-2" role="alert">{searchError}</p>}

      <main className="px-6 space-y-8 mt-6">
        <section aria-labelledby="map-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="map-heading" className="text-on-surface font-bold text-body-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">location_on</span>
              {t.explore.recent_places}
            </h2>
            <button onClick={handleFetchPlaces} className="text-primary text-label-md font-bold flex items-center gap-1 cursor-pointer hover:underline">
              {t.explore.view_all}
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
            </button>
          </div>
          <div className="rounded-[28px] overflow-hidden shadow-lg border border-outline-variant/20 h-44 bg-surface-container">
            <iframe
              title={t.explore.recent_places}
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

        <section aria-labelledby="suggestions-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="suggestions-heading" className="text-on-surface font-bold text-body-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">recommend</span>
              {t.explore.suggestions}
            </h2>
            <span className="text-on-surface-variant text-label-sm">{filteredPlaces.length} {t.explore.places_suffix}</span>
          </div>

          <div className="space-y-5">
            {filteredPlaces.slice(0, visibleItemsCount).map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
                className="glass-card rounded-[28px] overflow-hidden border-none"
                role="article"
              >
                <div className="relative h-44 bg-gradient-to-br from-primary/20 via-surface-container to-secondary/20 overflow-hidden">
                  {extractPlaceImage(loc.imageUrl) && (
                    <img
                      src={extractPlaceImage(loc.imageUrl)}
                      alt={loc.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" aria-hidden="true" />
                  <button
                    onClick={() => toggleFavorite(loc.id)}
                    className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={favorites.has(loc.id) ? t.explore.favorite_remove : t.explore.favorite_add}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={favorites.has(loc.id) ? { fontVariationSettings: "'FILL' 1", color: '#e11d48' } : { color: '#6b7280' }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-on-surface text-body-lg truncate">{loc.name}</h3>
                      <p className="text-on-surface-variant text-label-sm mt-0.5 truncate">{loc.address}</p>
                    </div>
                    <div 
                      className="flex items-center gap-1 bg-primary-fixed/60 text-primary px-2.5 py-1 rounded-full text-label-sm font-bold shrink-0 ml-2"
                      role="img"
                      aria-label={t.explore.star_rating.replace('{rating}', String(loc.rating))}
                    >
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">star</span>
                      {loc.rating}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                    {loc.distance !== undefined && loc.distance !== 999 && (
                      <span className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">near_me</span>
                        {loc.distance.toFixed(1)} km
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">payments</span>
                      {formatVND(loc.price || loc.cost || 0)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2" role="list" aria-label={t.explore.tags_label}>
                    {loc.category && (
                      <span className="bg-tertiary-fixed/40 text-on-tertiary-fixed text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        #{loc.category}
                      </span>
                    )}
                    {loc.theme?.split(',').slice(0, 2).map(t_tag => (
                      <span key={t_tag.trim()} className="bg-primary-container/30 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        #{t_tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onAddToCombo(loc)}
                      className={cn(
                        "flex-1 py-2.5 rounded-full text-label-md font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        activeCombo && comboSlots.every(s => s !== null)
                          ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                          : 'bg-primary text-on-primary hover:scale-[1.02] active:scale-[0.98]'
                      )}
                      disabled={!!(activeCombo && comboSlots.every(s => s !== null))}
                    >
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
                      {activeCombo
                        ? comboSlots.every(s => s !== null) ? t.explore.combo_full : t.explore.add_to_combo
                        : `${t.explore.in_combo}${savedPlacesCount > 0 ? ` (${savedPlacesCount})` : ''}`
                      }
                    </button>
                    <button
                      onClick={() => setRideModalLoc({ name: loc.name, lat: loc.lat || 0, lng: loc.lng || 0 })}
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`${t.explore.call_ride} ${loc.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">local_taxi</span>
                    </button>
                    <button
                      onClick={() => setRealImageLoc({ name: loc.name, mapsUri: loc.mapsLink || loc.mapsUri || '', desc: loc.theme || loc.category, imageUrl: loc.imageUrl })}
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`${t.explore.view_real_image} ${loc.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">image</span>
                    </button>
                    <a
                      href={loc.mapsLink || loc.mapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + (loc.address || ''))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-surface-container-high text-on-surface-variant p-2.5 rounded-full transition-colors hover:bg-primary-container/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center"
                      aria-label={`${t.explore.open_maps} ${loc.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">map</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPlaces.length > visibleItemsCount && (
            <button
              onClick={() => setVisibleItemsCount(prev => prev + 5)}
              className="w-full mt-4 py-3 rounded-full border border-outline-variant/30 text-primary font-bold text-label-md flex items-center justify-center gap-2 hover:bg-primary-container/20 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">expand_more</span>
              {t.explore.view_more_places.replace('{count}', String(Math.min(5, filteredPlaces.length - visibleItemsCount)))}
            </button>
          )}
        </section>

        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-on-surface font-bold text-body-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">category</span>
            {t.explore.categories}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORY_GRID.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategoryGrid(cat)}
                className={cn(
                  'rounded-[24px] h-28 flex flex-col items-start justify-end p-4 bg-gradient-to-br text-white transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  cat.gradient
                )}
              >
                <span className="material-symbols-outlined text-[28px] mb-1 opacity-90" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{cat.icon}</span>
                <span className="font-bold text-label-md">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="movies-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="movies-heading" className="text-on-surface font-bold text-body-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">movie</span>
              {t.explore.movies_today}
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scroll-hidden -mx-6 px-6 pb-2">
            {MOVIES.map(m => (
              <div key={m.id} className="glass-card rounded-[24px] p-4 min-w-[200px] max-w-[200px] shrink-0 space-y-2 border-none" role="article">
                <div className="text-3xl" aria-hidden="true">{m.icon}</div>
                <h3 className="font-bold text-on-surface text-body-md line-clamp-1">{m.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-label-sm font-bold text-primary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">star</span>
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

        <section aria-labelledby="trends-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="trends-heading" className="text-on-surface font-bold text-body-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">trending_up</span>
              {t.explore.hot_trend}
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scroll-hidden -mx-6 px-6 pb-2">
            {trends.map(tr => (
              <div key={tr.id} className="glass-card rounded-[24px] p-4 min-w-[180px] max-w-[180px] shrink-0 space-y-2 border-none" role="article">
                <div className="text-3xl" aria-hidden="true">{tr.icon}</div>
                <h3 className="font-bold text-on-surface text-label-md line-clamp-2">{tr.name}</h3>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full inline-block", tr.badgeColor)}>{tr.badge}</span>
                <p className="text-on-surface-variant text-label-sm line-clamp-2">{tr.desc}</p>
                <p className="text-on-surface font-bold text-label-sm">{tr.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

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
            activeCombo={activeCombo}
            comboSlots={comboSlots}
          />
        )}
      </AnimatePresence>

      {activeCombo && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <div className="glass-card rounded-2xl px-4 py-3 border border-primary/30 shadow-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">target</span>
            <div className="flex-1 min-w-0">
              <p className="text-label-sm font-bold text-on-surface truncate">{activeCombo.theme} {activeCombo.icon}</p>
              <p className="text-[11px] text-on-surface-variant">{comboSlots.filter(s => s !== null).length}/{comboSlots.length} {t.explore.selected_places}</p>
            </div>
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-[11px]">{comboSlots.filter(s => s !== null).length}/{comboSlots.length}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
