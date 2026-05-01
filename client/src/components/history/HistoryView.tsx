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
  }
];

const MOCK_PAST: DateEntry[] = [];


function DateItem({ day, date, active }: { day: string; date: string; active?: boolean }) {
  const content = (
    <>
      <span className="text-xs font-medium uppercase leading-tight">{day}</span>
      <span className="text-2xl font-bold leading-tight mt-1">{date}</span>
    </>
  );

  return (
    <button 
      aria-current={active ? "date" : undefined}
      className={cn(
        "flex flex-col items-center min-w-[64px] py-4 rounded-[24px] shrink-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2",
        active 
          ? "bg-pink-500/90 text-white shadow-lg shadow-pink-500/30 border border-pink-400/50" 
          : "glass-panel text-stone-700 hover:scale-105"
      )}
    >
      {content}
    </button>
  );
}

export function HistoryView({ upcomingDates = MOCK_UPCOMING, pastDates = MOCK_PAST }: HistoryViewProps) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const { t } = useLocale();

  const currentDates = tab === 'upcoming' ? upcomingDates : pastDates;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="pb-32"
    >
      <h1 className="sr-only">{t.history.title}</h1>

      <header className="glass-panel font-['Epilogue'] tracking-tight docked full-width top-0 sticky z-50 rounded-b-3xl border-t-0 border-x-0 border-white/40">
        <div className="flex justify-between items-center px-6 py-4 w-full mx-auto">
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              aria-label={t.history.avatar_alt}
            >
              <img 
                alt={t.history.avatar_alt || "User Avatar"} 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfzO86RwwwsuM8iEO1FzR2l8osSHy9xlX1vt7ez3W_g1--8nud3XmPJbbQIf7o3K01fvh5jVBQtQyRT3jqigT813QQwK08bZ6iAM30xg3DbrM-zhoS-SHKZ0cKbhclT8ZRU5Upx2eDIEBVI0KZyDjktvpbUfWk7ug2lowR1BB9413kljJ6d-QqsdSS9Hmz524HRyJ07Aqmfpzcn6yy0efOW9SxBUhAzHYZBQFh0y0-DXIRVW9RiK47CJn0c7He79SPjue18zUB-sKC"
              />
            </button>
            <span className="text-2xl font-bold text-pink-500 italic drop-shadow-sm">{t.common.app_name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-pink-500 hover:bg-white/60 transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              aria-label={t.history.calendar_label}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_month</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 pt-2">
        <div className="flex p-1.5 glass-panel rounded-full mb-10 mt-6" role="tablist">
          <button 
            role="tab"
            aria-selected={tab === 'upcoming'}
            aria-controls="timeline-panel"
            onClick={() => setTab('upcoming')}
            className={cn(
              "flex-1 py-3 text-sm font-bold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400",
              tab === 'upcoming' ? "bg-white/80 text-pink-500 shadow-md scale-[1.02]" : "text-stone-500 hover:text-pink-400"
            )}
          >
            {t.history.upcoming}
          </button>
          <button 
            role="tab"
            aria-selected={tab === 'past'}
            aria-controls="timeline-panel"
            onClick={() => setTab('past')}
            className={cn(
              "flex-1 py-3 text-sm font-bold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400",
              tab === 'past' ? "bg-white/80 text-pink-500 shadow-md scale-[1.02]" : "text-stone-500 hover:text-pink-400"
            )}
          >
            {t.history.past}
          </button>
        </div>

        <section className="mb-10" aria-labelledby="month-heading">
          <div className="flex justify-between items-center mb-5">
            <h2 id="month-heading" className="text-2xl font-bold text-stone-800 drop-shadow-sm font-['Epilogue']">{t.history.september_2024}</h2>
            <div className="flex gap-2">
              <button 
                aria-label={t.history.prev_month}
                className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-pink-500 hover:bg-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button 
                aria-label={t.history.next_month}
                className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-pink-500 hover:bg-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            <DateItem day="T2" date="12" active />
            <DateItem day="T3" date="13" />
            <DateItem day="T4" date="14" />
            <DateItem day="T5" date="15" />
            <DateItem day="T6" date="16" />
          </div>
        </section>

        <section id="timeline-panel" role="tabpanel" className="relative" aria-label={t.history.timeline_label}>
          <div className="absolute left-6 top-6 bottom-0 w-1 bg-gradient-to-b from-pink-300/60 via-pink-300/30 to-transparent rounded-full -ml-[1.5px]" aria-hidden="true"></div>
          
          {currentDates.length === 0 ? (
             <div className="text-center py-16 text-stone-500 font-medium glass-panel rounded-3xl mx-4">{t.history.no_dates}</div>
          ) : (
            currentDates.map((item, index) => {
              const localizedTitle = item.title === 'Dinner at Nấm' ? t.history.nam_nam : (item.title === 'West Lake Walk' ? t.history.west_lake : item.title);
              const localizedLocation = item.location.includes('Tràng Tiền') ? t.history.nam_location : (item.location.includes('Thanh Nien Street') ? t.history.west_lake_location : item.location);
              const localizedDate = item.dateLabel.replace('Today', t.history.today).replace('Sep 14', t.history.sep_14);

              return (
                <div key={item.id} className={cn("relative flex gap-5 mb-8", index > 0 && "opacity-95")} role="article">
                  <div className={cn(
                    "z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md border-2",
                    item.status === 'confirmed' ? "bg-white border-pink-400 text-pink-500" : "glass-panel border-white/60 text-stone-400"
                  )} aria-hidden="true">
                    <span className="material-symbols-outlined text-[22px]">{item.typeIcon}</span>
                  </div>
                  
                  <div className="flex-1 glass-panel p-5 rounded-3xl hover:bg-white/50 transition-colors duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={cn(
                          "text-xs uppercase tracking-wider font-bold mb-1 block",
                          item.status === 'confirmed' ? "text-pink-500" : "text-stone-500"
                        )}>{localizedDate}</span>
                        <h3 className="text-xl font-bold text-stone-800 font-['Epilogue'] leading-tight group-hover:text-pink-600 transition-colors">
                          {localizedTitle}
                        </h3>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-xl text-[10px] font-bold uppercase shadow-sm border",
                        item.status === 'confirmed' ? "bg-green-100/80 text-green-700 border-green-200" : "bg-stone-100/80 text-stone-600 border-stone-200"
                      )}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-stone-600 mb-4 bg-white/30 rounded-xl p-2.5 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[18px] text-pink-400" aria-hidden="true">location_on</span>
                      <span className="text-sm font-medium leading-tight">
                        {localizedLocation}
                      </span>
                    </div>
                    
                    {item.imageUrl && (
                      <div className="h-36 w-full rounded-2xl mb-4 overflow-hidden shadow-sm border border-white/60 relative group-hover:shadow-md transition-shadow">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" aria-hidden="true"></div>
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={item.imageUrl} alt={localizedTitle} />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2.5 bg-white/40 py-1.5 px-3 rounded-full backdrop-blur-sm border border-white/50">
                        {item.partnerAvatar && (
                          <img 
                            alt={item.partnerName} 
                            className="w-7 h-7 rounded-full border-2 border-pink-300 object-cover shadow-sm" 
                            src={item.partnerAvatar} 
                          />
                        )}
                        <span className="text-sm font-bold text-stone-700">{item.partnerName}</span>
                      </div>
                      <button className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400",
                        item.status === 'confirmed' 
                          ? "glass-button-primary" 
                          : "glass-button"
                      )}>
                        {t.common.details}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </motion.div>
  );
}
