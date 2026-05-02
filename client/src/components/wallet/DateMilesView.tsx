import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Award, Target, Flame, Trophy } from 'lucide-react';
import type { UserReward } from '../../types';
import { MILESTONE_LEVELS, BADGES } from '../../data/constants';
import vi from '../../locales/vi.json';

interface Props { userReward: UserReward; }

export function DateMilesView({ userReward }: Props) {
  const t = vi.wallet;
  const currentLevel = [...MILESTONE_LEVELS].reverse().find(l => userReward.totalMiles >= l.min) || MILESTONE_LEVELS[0];
  const nextLevel = MILESTONE_LEVELS.find(l => l.min > userReward.totalMiles);
  const progressPercent = nextLevel ? ((userReward.totalMiles - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <motion.div 
      key="wallet" 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 pb-20"
    >
      <h1 className="sr-only">{t.title}</h1>

      {/* Hero Card - Custom Gradient Card (No glass-card class to preserve gradient vibrancy) */}
      <div 
        className={`bg-gradient-to-br ${currentLevel.color} rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-white/10`}
        role="region"
        aria-label="Thông tin thứ hạng hiện tại"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">{t.title}</span>
            <span className="text-3xl filter drop-shadow-md" aria-hidden="true">{currentLevel.icon}</span>
          </div>
          <h2 className="text-4xl font-black mb-1 font-[var(--font-family-headline-md)]">
            {userReward.totalMiles} <span className="text-sm font-medium opacity-70 tracking-normal">{t.miles}</span>
          </h2>
          <p className="text-white/80 text-xs font-medium mt-1">
            {t.rank}: <span className="text-white font-bold">{currentLevel.name}</span> {nextLevel ? `→ ${nextLevel.name} (${nextLevel.min} ${t.miles})` : `— ${t.max_level}`}
          </p>
          <div className="mt-6 bg-white/20 rounded-full h-1.5 overflow-hidden" role="progressbar" aria-valuenow={userReward.totalMiles} aria-valuemin={currentLevel.min} aria-valuemax={nextLevel?.min || userReward.totalMiles}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ duration: 1, ease: "circOut" }}
              className="bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] rounded-full h-full" 
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-3">
        <Stat 
          icon={<Target className="w-5 h-5 text-primary" aria-hidden="true" />} 
          label={t.dates} 
          value={userReward.completedDates} 
        />
        {/* TODO: Make streak dynamic */}
        <Stat 
          icon={<Flame className="w-5 h-5 text-primary" aria-hidden="true" />} 
          label={t.streak} 
          value={
            <span className="flex items-center justify-center gap-1">
              3 <Flame className="w-4 h-4 text-primary fill-primary" />
            </span>
          } 
        />
        <Stat 
          icon={<Award className="w-5 h-5 text-primary" aria-hidden="true" />} 
          label={t.badges} 
          value={userReward.badges.length} 
        />
      </div>

      {/* Badges Grid Section */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2 font-[var(--font-family-headline-md)]">
          <Trophy className="w-5 h-5 text-primary" aria-hidden="true" /> {t.badges_title}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map(b => {
            const earned = userReward.badges.includes(b.id);
            return (
              <div 
                key={b.id} 
                className={`rounded-2xl p-3 text-center transition-all duration-300 border ${
                  earned 
                    ? 'bg-primary/10 border-primary/20 text-primary shadow-sm' 
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant opacity-60 grayscale'
                }`}
                role="img"
                aria-label={`${b.name}: ${earned ? 'Đã đạt được' : 'Chưa đạt được'} - ${b.desc}`}
              >
                <div className="text-2xl mb-1 filter drop-shadow-sm" aria-hidden="true">{b.icon}</div>
                <p className="text-xs font-bold text-on-surface">{b.name}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5 leading-tight">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="glass-card p-4 text-center flex flex-col items-center gap-1 transition-transform hover:scale-[1.02]">
      <div className="flex justify-center mb-1 bg-primary/10 w-10 h-10 rounded-full items-center">
        {icon}
      </div>
      <p className="text-xl font-bold text-on-surface">{value}</p>
      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">{label}</p>
    </div>
  );
}
