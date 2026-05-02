import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useLocale } from '../../hooks/useLocale';

export interface DateEntry {
  id: string;
  title: string;
  dateLabel: string;
  location: string;
  imageUrl?: string;
  status: 'confirmed' | 'pending';
  partnerName: string;
  partnerAvatar?: string;
  typeIcon: string;
  isPast?: boolean;
}

export interface HistoryViewProps {
  upcomingDates?: DateEntry[];
  pastDates?: DateEntry[];
}

const MOCK_UPCOMING: DateEntry[] = [
  {
    id: '1',
    title: 'Dinner at Nấm',
    dateLabel: '19:00 • Today',
    location: 'No. 5, Ngõ 1, Tràng Tiền, Hanoi',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDThobcMZGjX_If3Qr6FYEFJTP8aAnkaNVIEV9mm11zhX8lMzTKdkbH3lQyJffAGc8jKkvPalyKtPB-fx_ud4wmKl85pl8G2QKS2-YrovpCoHUtGR3Rfq5OIgCXHSPo54pJvaLl-GlsKBa5Y1bIHet4ydfyiMU-6za_qkvp3uB-1AJLgvAHORwxzW6G9swJUrX8DBGKKp0_DSys9Dv99Jc8m409Ri-GUsKFVjKqPiNstr72kIoLPkxSFrtgL0z8PsulkIW7fovNUe6',
    status: 'confirmed',
    partnerName: 'Minh Anh',
    partnerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs0MbF0SW4wg0y239gznRKNkV2_70V08BE2XnQ47KE5h2sCkkkf1PdyvQGkLgx_oGK7pqAmoQMjtvSuILye_RosX35YgJW5c3s_XVyJCrUtFF2U4TAJImErmB8zt4Y0xCUvAfKY_SeQqAgM_L-QsnH-5ssOwj2J76IXIKkD_MAswG00aEtjBXbVrf1B7aN6s033RdnjqxGIYqJXsXfwuwUuBFSqp-yCpoDlockf50is5KGo2_Wpk9zzvXBVeF_An1twKAbbwOZrK2Y',
    typeIcon: 'restaurant'
  },
  {
    id: '2',
    title: 'West Lake Walk',
    dateLabel: '21:30 • Sep 14',
    location: 'Thanh Nien Street, Ba Dinh, Hanoi',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBclEuSDE1MldGa7UQejM-cMgl_Sb9ajVBixCArfS4RI-XOjyZDAAO-m9szfe7pd78s_KsQ_szEvhZfvnmVYJH5567wYGyLZ4tv3fh4jSSTDJBaXPlbsCw-O0lJZnJ_D2mD_DDSKGqS4gmrB0qh9jW6nWSI8gjU7BPIxIIwtCyLgmGL1uHt8m818w_ReXhKhlWlcn1llRCuxM45S48Z9se3OyuW9U4Umyw437D3FuUZ_2QqalyXKwIbF0jr9iqArxiRx4SLv7Xi6yOF',
    status: 'pending',
    partnerName: 'Minh Anh',
    partnerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBojnTPGX0bsTo6guSI3OZ86sVRPKlQ0f4HONgNxpp4VC_SncgSCgP6V2mJVS5QfONmPR-nCrNcZP9THWp5jS-hZYXwnWrgurnrnI6RH5M6Tr1iLJ6h2kyjIKFLNokOXJh2aaObQIAIUL4UWvMaJ0IAzhsWtVVRSggQArOecY5QequivReGsSYsMCXboiCwnJwoUZ1euGHQa_5j6WjDxi8tm7Xi1HC2Vj8_pEr3X2-6sFub6ZFIyax85jB5zv4RdnLKNRGhshdgyi_D',
    typeIcon: 'directions_walk'
  },
  {
    id: '3',
    title: 'Morning Coffee',
    dateLabel: '08:00 • Sep 13',
    location: 'The Note Coffee, Hoan Kiem, Hanoi',
    status: 'confirmed',
    partnerName: 'Minh Anh',
    partnerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs0MbF0SW4wg0y239gznRKNkV2_70V08BE2XnQ47KE5h2sCkkkf1PdyvQGkLgx_oGK7pqAmoQMjtvSuILye_RosX35YgJW5c3s_XVyJCrUtFF2U4TAJImErmB8zt4Y0xCUvAfKY_SeQqAgM_L-QsnH-5ssOwj2J76IXIKkD_MAswG00aEtjBXbVrf1B7aN6s033RdnjqxGIYqJXsXfwuwUuBFSqp-yCpoDlockf50is5KGo2_Wpk9zzvXBVeF_An1twKAbbwOZrK2Y',
    typeIcon: 'local_cafe'
  },
  {
    id: '4',
    title: 'Late Night Movie',
    dateLabel: '22:00 • Sep 15',
    location: 'CGV Vincom Center, Dong Da, Hanoi',
    status: 'pending',
    partnerName: 'Minh Anh',
    partnerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs0MbF0SW4wg0y239gznRKNkV2_70V08BE2XnQ47KE5h2sCkkkf1PdyvQGkLgx_oGK7pqAmoQMjtvSuILye_RosX35YgJW5c3s_XVyJCrUtFF2U4TAJImErmB8zt4Y0xCUvAfKY_SeQqAgM_L-QsnH-5ssOwj2J76IXIKkD_MAswG00aEtjBXbVrf1B7aN6s033RdnjqxGIYqJXsXfwuwUuBFSqp-yCpoDlockf50is5KGo2_Wpk9zzvXBVeF_An1twKAbbwOZrK2Y',
    typeIcon: 'movie'
  }
];

const MOCK_PAST: DateEntry[] = [];

// TODO: Connect to real date filter logic — currently visual-only
function DateItem({ day, date, active, onClick }: { day: string; date: string; active?: boolean; onClick?: () => void }) {
  return (
    <div 
      aria-current={active ? "date" : undefined}
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={cn(
        "flex flex-col items-center min-w-[64px] py-4 rounded-[20px] shrink-0 transition-all border cursor-pointer active:scale-95",
        active 
          ? "bg-primary text-on-primary shadow-md shadow-primary/20 border-primary/30" 
          : "bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:border-primary/40"
      )}
    >
      <span className="text-xs font-medium uppercase leading-tight">{day}</span>
      <span className="text-2xl font-bold leading-tight mt-1">{date}</span>
    </div>
  );
}

function DateDetailModal({ item, onClose }: { item: DateEntry; onClose: () => void }) {
  const { t } = useLocale();
  
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-surface-container-lowest rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl z-10"
      >
        <div className="h-48 w-full relative">
          {item.imageUrl ? (
            <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[64px]">{item.typeIcon}</span>
            </div>
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-headline-sm font-bold text-on-surface" style={{ fontFamily: 'var(--font-family-headline-md)' }}>
                {item.title}
              </h2>
              <p className="text-primary font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">event</span>
                {item.dateLabel}
              </p>
            </div>
            <span className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold uppercase border shadow-sm",
              item.status === 'confirmed' 
                ? "bg-tertiary-fixed/40 text-on-tertiary-fixed border-tertiary/30" 
                : "bg-surface-container-high text-on-surface-variant border-outline-variant/30"
            )}>
              {item.status === 'confirmed' ? t.history.status_confirmed : t.history.status_pending}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t.explore.open_maps}</p>
                <p className="text-on-surface font-medium">{item.location}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary">favorite</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t.history.partner}</p>
                <div className="flex items-center gap-2">
                  {item.partnerAvatar && (
                    <img src={item.partnerAvatar} className="w-6 h-6 rounded-full border border-outline-variant/30" alt="" />
                  )}
                  <p className="text-on-surface font-medium">{item.partnerName}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">{t.history.notes}</p>
              <p className="text-sm text-on-surface leading-relaxed">
                Buổi hẹn hò tuyệt vời tại không gian lãng mạn. Đừng quên mang theo quà nhé!
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow active:scale-[0.98]"
          >
            {t.common.cancel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function HistoryView({ upcomingDates = MOCK_UPCOMING, pastDates = MOCK_PAST }: HistoryViewProps) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedDay, setSelectedDay] = useState<string>('12');
  const [detailItem, setDetailItem] = useState<DateEntry | null>(null);
  const [monthOffset, setMonthOffset] = useState<number>(0);
  const { t } = useLocale();

  const currentDates = (tab === 'upcoming' ? upcomingDates : pastDates).filter(item => {
    if (selectedDay === '12') return item.dateLabel.includes('Today') || item.dateLabel.includes('Sep 12');
    return item.dateLabel.includes(`Sep ${selectedDay}`);
  });

  return (
    <div className="bg-background min-h-screen pb-24">
      <h1 className="sr-only">{t.history.title}</h1>

      <header className="sticky top-0 z-30 glass-card px-6 py-4 rounded-none border-t-0 border-x-0">
        <div className="flex items-center justify-between mb-4">
          <div className="text-headline-md font-bold text-on-surface"
               style={{ fontFamily: 'var(--font-family-headline-md)' }}>
            {t.history.title}
          </div>
          <button 
            className="bg-primary-container/40 p-2.5 rounded-full hover:bg-primary-container/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t.history.calendar_label}
          >
            <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
          </button>
        </div>
        
        <div className="flex gap-2" role="tablist">
          {(['upcoming', 'past'] as const).map(tabId => (
            <button
              key={tabId}
              role="tab"
              aria-selected={tab === tabId}
              aria-controls="timeline-panel"
              onClick={() => setTab(tabId)}
              className={cn(
                'px-5 py-2 rounded-full text-label-md font-semibold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                tab === tabId
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container/40'
              )}
            >
              {tabId === 'upcoming' ? t.history.upcoming : t.history.past}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 pt-6">
        <section className="mb-10" aria-labelledby="month-heading">
          <div className="flex justify-between items-center mb-5">
            <h2 id="month-heading" 
                className="text-on-surface font-bold text-body-lg flex items-center gap-2"
                style={{ fontFamily: 'var(--font-family-headline-md)' }}>
              <span className="material-symbols-outlined text-primary text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true">
                calendar_month
              </span>
              {t.history.month_8}, 2024
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setMonthOffset(prev => prev - 1)}
                aria-label={t.history.prev_month}
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-primary hover:bg-primary-container/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button 
                onClick={() => setMonthOffset(prev => prev + 1)}
                aria-label={t.history.next_month}
                className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-primary hover:bg-primary-container/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[
              { d: 'T2', n: '12' },
              { d: 'T3', n: '13' },
              { d: 'T4', n: '14' },
              { d: 'T5', n: '15' },
              { d: 'T6', n: '16' }
            ].map(item => (
              <DateItem 
                key={item.n}
                day={item.d} 
                date={item.n} 
                active={selectedDay === item.n}
                onClick={() => setSelectedDay(item.n)}
              />
            ))}
          </div>
        </section>

        <section id="timeline-panel" role="tabpanel" className="relative" aria-label={t.history.timeline_label}>
          <div className="absolute left-6 top-6 bottom-0 w-1 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full -ml-[1.5px]" aria-hidden="true"></div>
          
          {currentDates.length === 0 ? (
            <div className="glass-card rounded-[28px] p-8 text-center space-y-4 mx-4">
              <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-primary text-[32px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                  {tab === 'upcoming' ? 'event_upcoming' : 'history'}
                </span>
              </div>
              <p className="text-on-surface font-bold text-body-lg"
                 style={{ fontFamily: 'var(--font-family-headline-md)' }}>
                {t.history.no_dates}
              </p>
              <p className="text-on-surface-variant text-label-sm">
                {tab === 'upcoming' ? t.history.no_upcoming_hint : t.history.no_past_hint}
              </p>
            </div>
          ) : (
            currentDates.map((item, index) => {
              const localizedTitle = item.title === 'Dinner at Nấm' ? t.history.nam_nam : (item.title === 'West Lake Walk' ? t.history.west_lake : item.title);
              const localizedLocation = item.location.includes('Tràng Tiền') ? t.history.nam_location : (item.location.includes('Thanh Nien Street') ? t.history.west_lake_location : item.location);
              const localizedDate = item.dateLabel.replace('Today', t.history.today).replace('Sep 14', t.history.sep_14);

              return (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 30 }}
                  className={cn("relative flex gap-5 mb-8")} 
                  role="article"
                >
                  <div className={cn(
                    "z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md border-2 transition-all",
                    item.status === 'confirmed' 
                      ? "bg-primary-container border-primary text-primary" 
                      : "bg-surface-container-high border-outline-variant/30 text-on-surface-variant"
                  )} aria-hidden="true">
                    <span className="material-symbols-outlined text-[22px]">{item.typeIcon}</span>
                  </div>
                  
                  <div className="flex-1 glass-card p-5 rounded-[28px] border-none hover:bg-surface-container-low transition-colors duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={cn(
                          "text-xs uppercase tracking-wider font-bold mb-1 block",
                          item.status === 'confirmed' ? "text-primary" : "text-on-surface-variant"
                        )}>{localizedDate}</span>
                        <h3 className="text-body-lg font-bold text-on-surface leading-tight group-hover:text-primary transition-colors"
                            style={{ fontFamily: 'var(--font-family-headline-md)' }}>
                          {localizedTitle}
                        </h3>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[11px] font-bold uppercase shadow-sm border",
                        item.status === 'confirmed' 
                          ? "bg-tertiary-fixed/40 text-on-tertiary-fixed border-tertiary/30" 
                          : "bg-surface-container-high text-on-surface-variant border-outline-variant/30"
                      )}>
                        {item.status === 'confirmed' ? t.history.status_confirmed : t.history.status_pending}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-on-surface-variant mb-4 bg-surface-container-low/50 rounded-xl p-2.5 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">location_on</span>
                      <span className="text-sm font-medium leading-tight">
                        {localizedLocation}
                      </span>
                    </div>
                    
                    {item.imageUrl && (
                      <div className="h-36 w-full rounded-2xl mb-4 overflow-hidden shadow-sm border border-outline-variant/20 relative group-hover:shadow-md transition-shadow">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" aria-hidden="true"></div>
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={item.imageUrl} alt={localizedTitle} />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2.5 bg-surface-container-low/50 py-1.5 px-3 rounded-full backdrop-blur-sm border border-outline-variant/20">
                        {item.partnerAvatar && (
                          <img 
                            alt={item.partnerName} 
                            className="w-7 h-7 rounded-full border-2 border-primary-container object-cover shadow-sm" 
                            src={item.partnerAvatar} 
                          />
                        )}
                        <span className="text-sm font-bold text-on-surface">{item.partnerName}</span>
                      </div>
                      <button 
                        onClick={() => setDetailItem(item)}
                        className={cn(
                          "px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          item.status === 'confirmed' 
                            ? "bg-primary text-on-primary" 
                            : "bg-surface-container-high text-on-surface-variant hover:bg-primary-container/30"
                        )}
                      >
                        {t.common.details}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </section>
      </main>

      {/* Detail Modal */}
      {detailItem && (
        <DateDetailModal 
          item={detailItem} 
          onClose={() => setDetailItem(null)} 
        />
      )}
    </div>
  );
}
