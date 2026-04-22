import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPlaceImage } from '../../services/api';

interface Props {
  loc: { name: string; mapsUri: string; desc?: string } | null;
  onClose: () => void;
}

export function ImageViewer({ loc, onClose }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loc) return;
    setCurrentIdx(0);
    setLoading(true);
    setImages([]);

    fetchPlaceImage(loc.mapsUri)
      .then(url => {
        const primary = url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80';
        setImages([primary, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80']);
      })
      .catch(() => setImages(['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80']))
      .finally(() => setLoading(false));
  }, [loc]);

  if (!loc) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
        <h3 className="text-white font-bold text-lg mb-2 text-center">{loc.name}</h3>
        {loc.desc && <p className="text-white/70 text-sm text-center mb-4">{loc.desc}</p>}

        {loading ? (
          <div className="h-64 bg-slate-800 rounded-2xl flex items-center justify-center text-white/50 animate-pulse">Đang tải ảnh...</div>
        ) : (
          <div className="relative">
            <img src={images[currentIdx]} alt={loc.name} className="w-full h-80 object-cover rounded-2xl" />
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentIdx(i => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setCurrentIdx(i => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"><ChevronRight className="w-5 h-5" /></button>
                <div className="flex justify-center gap-2 mt-3">{images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === currentIdx ? 'bg-white' : 'bg-white/30'}`} />)}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
