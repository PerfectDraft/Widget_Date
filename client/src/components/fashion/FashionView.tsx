import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { OUTFITS, STYLES, GENDERS } from '../../data/outfits';
import type { Outfit } from '../../data/outfits';
import { cn } from '../../lib/utils';

const formatVND = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const STYLE_ICONS: Record<string, string> = {
  'Old Money': 'diamond',
  'Vintage': 'auto_awesome',
  'Streetwear': 'local_fire_department',
  'Trendy': 'trending_up',
  'Minimalism': 'blur_on',
};

const GENDER_LABEL: Record<string, string> = {
  Male: 'Nam',
  Female: 'Nữ',
  Unisex: 'Unisex',
};

// Keyword map: style + gender → Pexels search query
const PEXELS_QUERY: Record<string, Record<string, string>> = {
  'Old Money':  { Male: 'elegant men suit fashion', Female: 'elegant women luxury dress' },
  'Vintage':    { Male: 'vintage men retro fashion', Female: 'vintage women retro floral dress' },
  'Streetwear': { Male: 'streetwear men hoodie urban', Female: 'streetwear women oversized urban' },
  'Trendy':     { Male: 'trendy men modern fashion', Female: 'trendy women chic modern outfit' },
  'Minimalism': { Male: 'minimalist men clean fashion', Female: 'minimalist women simple outfit' },
};

function getQuery(outfit: Outfit): string {
  return PEXELS_QUERY[outfit.style]?.[outfit.gender] ?? 'fashion outfit';
}

// Simple in-memory cache: query → photo url
const imageCache: Record<string, string> = {};

function useOutfitImage(outfit: Outfit) {
  const query = getQuery(outfit);
  // Use outfit.id as page offset (1-5) so same query yields different photos per outfit
  const page = ((outfit.id - 1) % 5) + 1;
  const cacheKey = `${query}__${page}`;

  const [imgUrl, setImgUrl] = useState<string | null>(imageCache[cacheKey] ?? null);
  const [loading, setLoading] = useState(!imageCache[cacheKey]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (imageCache[cacheKey]) {
      setImgUrl(imageCache[cacheKey]);
      setLoading(false);
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch(`/api/pexels-image?query=${encodeURIComponent(query)}&page=${page}`)
      .then(r => r.json())
      .then(data => {
        const url = data.photos?.[0]?.url ?? null;
        if (url) imageCache[cacheKey] = url;
        setImgUrl(url);
      })
      .catch(() => setImgUrl(null))
      .finally(() => setLoading(false));
  }, [cacheKey, query, page]);

  return { imgUrl, loading };
}

function OutfitCard({ outfit, onClick }: { outfit: Outfit; onClick: () => void }) {
  const { imgUrl, loading } = useOutfitImage(outfit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-95"
    >
      <div className="relative h-44 bg-surface-container overflow-hidden">
        {loading && (
          <div className="w-full h-full flex items-center justify-center animate-pulse bg-surface-container-high">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">checkroom</span>
          </div>
        )}
        {!loading && imgUrl && (
          <img src={imgUrl} alt={outfit.description} className="w-full h-full object-cover" />
        )}
        {!loading && !imgUrl && (
          <div className="w-full h-full flex items-center justify-center bg-surface-container">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20" style={{ fontVariationSettings: "'FILL' 1" }}>checkroom</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="bg-surface-container-lowest/90 text-[10px] font-bold text-primary px-2 py-0.5 rounded-full shadow-sm">{outfit.style}</span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-surface-container-lowest/90 text-[10px] font-medium text-on-surface-variant px-2 py-0.5 rounded-full shadow-sm">{GENDER_LABEL[outfit.gender]}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-on-surface line-clamp-2 mb-2">{outfit.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">{formatVND(outfit.rentPrice)}<span className="text-on-surface-variant/50 font-normal">/thuê</span></span>
          <span className="material-symbols-outlined text-on-surface-variant/30 text-[18px]">chevron_right</span>
        </div>
      </div>
    </motion.div>
  );
}

export function FashionView() {
  const [activeStyle, setActiveStyle] = useState('Tất cả');
  const [activeGender, setActiveGender] = useState('Tất cả');
  const [selected, setSelected] = useState<Outfit | null>(null);

  const filtered = useMemo(() => {
    return OUTFITS.filter(o => {
      const styleMatch = activeStyle === 'Tất cả' || o.style === activeStyle;
      const genderMatch = activeGender === 'Tất cả' || o.gender === activeGender;
      return styleMatch && genderMatch;
    });
  }, [activeStyle, activeGender]);

  const selectedImgQuery = selected ? getQuery(selected) : '';
  const selectedPage = selected ? ((selected.id - 1) % 5) + 1 : 1;
  const selectedCacheKey = `${selectedImgQuery}__${selectedPage}`;
  const selectedImgUrl = selected ? (imageCache[selectedCacheKey] ?? null) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-background pb-24"
      id="main-content"
    >
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-4 pt-12 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>checkroom</span>
          <h1 className="text-xl font-bold text-on-surface">Phong cách</h1>
        </div>
        <p className="text-xs text-on-surface-variant/60 mb-3">Gợi ý outfit hẹn hò · Thuê hoặc mua ngay</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {STYLES.map(s => (
            <button key={s} onClick={() => setActiveStyle(s)}
              className={cn('flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                activeStyle === s ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high')}
            >
              {s !== 'Tất cả' && <span className="material-symbols-outlined text-[14px]">{STYLE_ICONS[s]}</span>}
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          {GENDERS.map(g => (
            <button key={g} onClick={() => setActiveGender(g)}
              className={cn('px-3 py-1 rounded-full text-xs font-medium transition-all',
                activeGender === g ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high')}
            >
              {g === 'Male' ? 'Nam' : g === 'Female' ? 'Nữ' : g}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-3 pb-1">
        <span className="text-xs text-on-surface-variant/50">{filtered.length} outfit</span>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        {filtered.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} onClick={() => setSelected(outfit)} />
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-surface rounded-t-3xl w-full max-w-md pb-10 overflow-hidden"
          >
            <div className="relative h-56 bg-surface-container overflow-hidden">
              {selectedImgUrl ? (
                <img src={selectedImgUrl} alt={selected.description} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant/20" style={{ fontVariationSettings: "'FILL' 1" }}>checkroom</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selected.style}</span>
                <span className="text-xs text-on-surface-variant">{GENDER_LABEL[selected.gender]}</span>
              </div>
              <p className="text-base font-semibold text-on-surface mb-4">{selected.description}</p>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 bg-primary/5 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-on-surface-variant/60 mb-0.5">Giá thuê</p>
                  <p className="text-sm font-bold text-primary">{formatVND(selected.rentPrice)}</p>
                </div>
                <div className="flex-1 bg-surface-container rounded-xl p-3 text-center">
                  <p className="text-[10px] text-on-surface-variant/60 mb-0.5">Style</p>
                  <p className="text-sm font-bold text-on-surface">{selected.style}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <a href={selected.imageUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">photo_library</span>
                  Xem ảnh Pinterest
                </a>
                <a href={selected.buyLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30">
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  Mua trên Shopee
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
