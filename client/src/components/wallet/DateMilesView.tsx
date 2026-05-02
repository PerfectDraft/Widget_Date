import { type ReactNode } from 'react';
import { motion } from 'motion/react';
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
      className="space-y-[16px] pb-24"
    >
      {/* Header Text (Mobile) */}
      <div className="md:hidden pt-4 pb-2">
        <h1 className="font-[var(--font-family-headline-lg)] text-[32px] leading-[1.3] font-semibold text-[var(--color-primary)]">
          {t.title}
        </h1>
        <p className="font-[var(--font-family-body-md)] text-[16px] leading-[1.6] text-[var(--color-secondary)] mt-1">
          Hành trình hẹn hò của bạn
        </p>
      </div>

      {/* Hero Score Card */}
      <div className="bg-gradient-to-br from-[var(--color-primary-container)] to-[var(--color-primary-fixed-dim)] rounded-xl p-6 shadow-[0_4px_20px_rgba(244,167,185,0.15)] relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>military_tech</span>
        </div>
        
        <p className="font-[var(--font-family-label-md)] text-[14px] font-semibold text-[var(--color-on-primary-container)] opacity-80 uppercase tracking-widest">
          Tổng Điểm
        </p>
        <h2 className="font-[var(--font-family-headline-xl)] text-[40px] font-bold tracking-[-0.02em] text-[var(--color-on-primary-container)] mt-2">
          {userReward.totalMiles}
        </h2>
        
        <div className="mt-6">
          <div className="flex justify-between font-[var(--font-family-label-sm)] text-[12px] font-medium text-[var(--color-on-primary-container)] mb-2">
            <span>{currentLevel.name}</span>
            <span>{nextLevel ? nextLevel.name : 'MAX'}</span>
          </div>
          <div className="h-2 bg-[var(--color-surface)]/30 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ duration: 1, ease: "circOut" }}
              className="h-full bg-[var(--color-surface-container-lowest)] rounded-full"
            />
          </div>
          <p className="font-[var(--font-family-label-sm)] text-[12px] font-medium text-[var(--color-on-primary-container)]/70 mt-2 text-right">
            {nextLevel ? `${nextLevel.min - userReward.totalMiles} điểm để lên hạng` : t.max_level}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <Stat 
          icon="favorite" 
          iconColor="text-[var(--color-primary-container)]"
          label={t.dates} 
          value={userReward.completedDates} 
        />
        <Stat 
          icon="local_fire_department" 
          iconColor="text-[var(--color-tertiary-container)]"
          label={t.streak} 
          value={userReward.streak} 
        />
        <Stat 
          icon="workspace_premium" 
          iconColor="text-[var(--color-secondary-container)]"
          label={t.badges} 
          value={userReward.badges.length} 
        />
      </div>

      {/* Badges Section */}
      <div className="pt-[48px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[var(--font-family-headline-md)] text-[24px] font-semibold text-[var(--color-on-surface)]">
            {t.badges_title}
          </h3>
          <button className="font-[var(--font-family-label-md)] text-[14px] font-semibold text-[var(--color-primary)]">
            Xem Tất Cả
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {BADGES.map(b => {
            const earned = userReward.badges.includes(b.id);
            if (earned) {
              return (
                <div key={b.id} className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-primary-fixed)] rounded-lg p-4 flex flex-col items-center text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-primary-container)]/20 flex items-center justify-center mb-3 text-[32px]">
                    {b.icon}
                  </div>
                  <h4 className="font-[var(--font-family-label-md)] text-[14px] font-semibold text-[var(--color-on-surface)]">{b.name}</h4>
                  <p className="font-[var(--font-family-label-sm)] text-[12px] font-medium text-[var(--color-secondary)] mt-1">{b.desc}</p>
                </div>
              );
            } else {
              return (
                <div key={b.id} className="bg-[var(--color-surface-container)]/50 border border-[var(--color-outline-variant)]/30 rounded-lg p-4 flex flex-col items-center text-center opacity-70 grayscale">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-surface-variant)] flex items-center justify-center mb-3 text-[32px] opacity-70">
                    {b.icon}
                  </div>
                  <h4 className="font-[var(--font-family-label-md)] text-[14px] font-semibold text-[var(--color-on-surface-variant)]">{b.name}</h4>
                  <p className="font-[var(--font-family-label-sm)] text-[12px] font-medium text-[var(--color-secondary)] mt-1">{b.desc}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon, iconColor, label, value }: { icon: string; iconColor: string; label: string; value: ReactNode }) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-lg p-4 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <span className={`material-symbols-outlined mb-2 ${iconColor}`}>{icon}</span>
      <span className="font-[var(--font-family-headline-md)] text-[24px] font-semibold text-[var(--color-primary)]">{value}</span>
      <span className="font-[var(--font-family-label-sm)] text-[12px] font-medium text-[var(--color-secondary)] mt-1 text-center">{label}</span>
    </div>
  );
}
