import { type Combo, type Activity } from '../../types';
import { Sparkles, HeartCrack, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface ComboListProps {
  combos: Combo[];
  isLoading: boolean;
  error: string | null;
  onSelectCombo: (combo: Combo) => void;
  onSelectVenue?: (venue: Activity) => void;
  onRetry?: () => void;
  formatVND: (n: number) => string;
}

export function ComboList({ combos, isLoading, error, onSelectCombo, onSelectVenue, onRetry, formatVND }: ComboListProps) {
  // 1. Loading State
  if (isLoading) {
    return (
      <section className="space-y-6 pb-12 mt-8">
        <h3 className="text-headline-md font-bold text-on-surface">Combo Đề Xuất</h3>
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col border border-white/40 shadow-lg animate-pulse">
          <div className="h-56 w-full bg-surface-container-high"></div>
          <div className="p-6 space-y-6 bg-surface/50">
            <div className="space-y-4">
              <div className="h-16 bg-surface-container-highest rounded-xl"></div>
              <div className="h-16 bg-surface-container-highest rounded-xl"></div>
            </div>
            <div className="h-14 bg-surface-container-highest rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <section className="space-y-6 pb-12 mt-8">
        <div className="glass-card rounded-2xl p-6 border border-error-container bg-error-container text-on-error-container text-center">
          <HeartCrack className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-headline-md font-bold mb-2">Oops! Có lỗi xảy ra</h3>
          <p className="text-body-md mb-6">{error}</p>
          {onRetry && (
             <button 
               onClick={onRetry}
               className="bg-error text-on-error px-6 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto cursor-pointer"
             >
               <RefreshCcw className="w-4 h-4" /> Thử lại
             </button>
          )}
        </div>
      </section>
    );
  }

  // 3. Empty State
  if (!combos || combos.length === 0) {
    return (
      <section className="space-y-6 pb-12 mt-8">
        <div className="glass-card rounded-2xl p-8 border border-white/40 shadow-sm text-center">
          <div className="size-16 rounded-full bg-primary-container mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-on-primary-container" />
          </div>
          <h3 className="text-headline-md font-bold text-on-surface mb-2">Chưa có combo nào</h3>
          <p className="text-body-md text-on-surface-variant mb-6">
            Chưa có combo, hãy bấm Tạo Combo AI
          </p>
        </div>
      </section>
    );
  }

  // 4. Success State
  return (
    <section className="space-y-6 pb-12 mt-8">
      <h3 className="text-headline-md font-bold text-on-surface">Combo Đề Xuất</h3>
      
      <div className="space-y-6">
        {combos.map((combo, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }} 
            key={combo.id} 
            className="glass-card rounded-2xl overflow-hidden flex flex-col border border-white/40 shadow-lg"
          >
            {/* Hero Image */}
            <div className="relative h-56 w-full">
              <img 
                alt={combo.theme} 
                className="w-full h-full object-cover" 
                src={combo.activities.find(act => act.imageUrl)?.imageUrl || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80"} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold text-on-surface text-label-sm">{combo.score}/10</span>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h4 className="text-headline-lg font-bold text-white drop-shadow-md flex items-center gap-2">
                    {combo.theme} {combo.icon}
                  </h4>
                  <p className="text-white/90 font-medium drop-shadow-md">Lãng mạn & Nhẹ nhàng</p>
                </div>
                <div className="bg-primary px-4 py-2 rounded-xl shadow-md">
                  <p className="text-white font-bold text-headline-md leading-none">{formatVND(combo.totalCost)}</p>
                </div>
              </div>
            </div>

            {/* Activities Timeline */}
            <div className="p-6 space-y-6 bg-surface/50">
              <div className="space-y-4 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-outline-variant border-l-2 border-dashed border-primary/50"></div>
                
                {combo.activities.map((act, i) => {
                  const isPrimary = i % 2 === 0;
                  const dotColorClass = isPrimary ? "bg-primary" : "bg-tertiary";
                  const textColorClass = isPrimary ? "text-primary" : "text-tertiary";
                  const groupHoverClass = isPrimary ? "group-hover:text-primary" : "group-hover:text-tertiary";

                  return (
                    <div 
                      key={i} 
                      className="flex gap-4 items-start relative z-10 p-3 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group"
                      onClick={() => onSelectVenue && onSelectVenue(act)}
                    >
                      <div className={`size-8 rounded-full ${dotColorClass} text-white flex items-center justify-center border-4 border-surface shadow-sm shrink-0 mt-0.5`}>
                        <span className="text-[14px] font-bold">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className={`text-label-sm ${textColorClass} font-bold mb-0.5`}>{act.time}</p>
                          <p className="text-sm font-bold text-outline">{act.cost === 0 ? 'Miễn phí' : formatVND(act.cost)}</p>
                        </div>
                        <p className={`font-bold text-on-surface ${groupHoverClass} transition-colors`}>{act.name}</p>
                        <p className="text-label-sm text-on-surface-variant line-clamp-1">{act.address}</p>
                      </div>
                      <span className={`material-symbols-outlined text-outline-variant ${groupHoverClass} self-center transition-colors`}>chevron_right</span>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => onSelectCombo(combo)}
                className="w-full py-4 rounded-full bg-primary/10 text-primary font-bold text-body-md border-2 border-primary/20 hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
              >
                Select This Combo
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
