import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  loc: { name: string; mapsUri: string; desc?: string; imageUrl?: string } | null;
  onClose: () => void;
}

// Curated Unsplash photo sets per category
const CATEGORY_PHOTOS: Record<string, string[]> = {
  cafe: [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80',
  ],
  bar: [
    'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&q=80',
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&q=80',
    'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80',
  ],
  park: [
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80',
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80',
    'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80',
  ],
  cinema: [
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&q=80',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    'https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?w=800&q=80',
  ],
};

function getImagesForLocation(name: string, desc?: string): string[] {
  const hint = `${name} ${desc || ''}`.toLowerCase();
  if (hint.includes('cafe') || hint.includes('cà phê') || hint.includes('coffee') || hint.includes('trà')) return CATEGORY_PHOTOS.cafe;
  if (hint.includes('bar') || hint.includes('pub') || hint.includes('beer') || hint.includes('rooftop')) return CATEGORY_PHOTOS.bar;
  if (hint.includes('phim') || hint.includes('cinema') || hint.includes('cgv') || hint.includes('lotte')) return CATEGORY_PHOTOS.cinema;
  if (hint.includes('park') || hint.includes('công viên') || hint.includes('hồ') || hint.includes('lake')) return CATEGORY_PHOTOS.park;
  if (hint.includes('restaurant') || hint.includes('nhà hàng') || hint.includes('quán') || hint.includes('bún') || hint.includes('phở')) return CATEGORY_PHOTOS.restaurant;
  return CATEGORY_PHOTOS.default;
}

// Extracts lh3.googleusercontent.com CDN URL embedded in Google Maps imageUrl field
function extractRealGooglePhoto(imageUrl?: string): string | null {
  if (!imageUrl) return null;
  const match = imageUrl.match(/https:%2F%2Flh3\.googleusercontent\.com%2F[^!"&]+/i)
    || imageUrl.match(/(https:\/\/lh3\.googleusercontent\.com\/[^"\s]+)/i);
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match[0]);
    // Remove size suffix (=w86-h86-k-no) and request larger size
    return decoded.replace(/=w\d+-h\d+.*$/, '=w800-h600-k-no');
  } catch {
    return null;
  }
}

export function ImageViewer({ loc, onClose }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!loc) return;
    setCurrentIdx(0);
    const realPhoto = extractRealGooglePhoto(loc.imageUrl);
    const fallbacks = getImagesForLocation(loc.name, loc.desc);
    setImages(realPhoto ? [realPhoto, ...fallbacks] : fallbacks);
  }, [loc]);

  if (!loc) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        <h3 className="text-white font-bold text-lg mb-2 text-center">{loc.name}</h3>
        {loc.desc && <p className="text-white/70 text-sm text-center mb-4">{loc.desc}</p>}

        <div className="relative">
          <img
            src={images[currentIdx]}
            alt={loc.name}
            className="w-full h-80 object-cover rounded-2xl"
            onError={e => { (e.target as HTMLImageElement).src = CATEGORY_PHOTOS.default[0]; }}
          />
          {images.length > 1 && (
            <>
              <button onClick={() => setCurrentIdx(i => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setCurrentIdx(i => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"><ChevronRight className="w-5 h-5" /></button>
              <div className="flex justify-center gap-2 mt-3">{images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === currentIdx ? 'bg-white' : 'bg-white/30'}`} />)}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
