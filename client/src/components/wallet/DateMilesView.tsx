import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Award, Target, Flame, Trophy } from 'lucide-react';
import type { UserReward } from '../../types';
import { MILESTONE_LEVELS, BADGES } from '../../data/constants';
import vi from '../../locales/vi.json';

interface Props { userReward: UserReward; }

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
};

export function DateMilesView({ userReward }: Props) {
  const t = vi.wallet;
  const currentLevel = [...MILESTONE_LEVELS].reverse().find(l => userReward.totalMiles >= l.min) || MILESTONE_LEVELS[0];
  const nextLevel = MILESTONE_LEVELS.find(l => l.min > userReward.totalMiles);
  const progressPercent = nextLevel ? ((userReward.totalMiles - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 style={srOnlyStyle}>{t.title}</h1>

      <div 
        className={`bg-gradient-to-br ${currentLevel.color} rounded-3xl p-6 text-white shadow-lg relative overflow-hidden`}
        role="region"
        aria-label="Thông tin thứ hạng hiện tại"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white/80 uppercase tracking-widest">{t.title}</span>
            <span className="text-3xl" aria-hidden="true">{currentLevel.icon}</span>
          </div>
          <h2 className="text-4xl font-extrabold mb-1">
            {userReward.totalMiles} <span className="text-lg font-normal opacity-80">{t.miles}</span>
          </h2>
          <p className="text-white/80 text-sm">
            {t.rank}: {currentLevel.name} {nextLevel ? `→ ${nextLevel.name} (${nextLevel.min} ${t.miles})` : `— ${t.max_level}`}
          </p>
          <div className="mt-4 bg-white/20 rounded-full h-2.5" role="progressbar" aria-valuenow={userReward.totalMiles} aria-valuemin={currentLevel.min} aria-valuemax={nextLevel?.min || userReward.totalMiles}>
            <div className="bg-white rounded-full h-2.5 transition-all" style={{ width: `${Math.min(progressPercent, 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={<Target className="w-5 h-5 text-blue-500" aria-hidden="true" />} label={t.dates} value={userReward.completedDates} />
        <Stat icon={<Flame className="w-5 h-5 text-orange-500" aria-hidden="true" />} label={t.streak} value="3 🔥" />
        <Stat icon={<Award className="w-5 h-5 text-yellow-500" aria-hidden="true" />} label={t.badges} value={userReward.badges.length} />
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" aria-hidden="true" /> {t.badges_title}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map(b => {
            const earned = userReward.badges.includes(b.id);
            return (
              <div 
                key={b.id} 
                className={`rounded-2xl p-3 text-center border transition-opacity ${earned ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100 opacity-50'}`}
                role="img"
                aria-label={`${b.name}: ${earned ? 'Đã đạt được' : 'Chưa đạt được'} - ${b.desc}`}
              >
                <div className="text-2xl mb-1" aria-hidden="true">{b.icon}</div>
                <p className="text-xs font-bold text-slate-700">{b.name}</p>
                <p className="text-[10px] text-slate-400">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center border border-slate-100">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 uppercase tracking-tight">{label}</p>
    </div>
  );
}
