import { motion } from 'motion/react';
import type { UserReward } from '../../types';
import { MILESTONE_LEVELS, BADGES } from '../../data/constants';
import { useTranslation } from 'react-i18next';

interface Props {
  userReward: UserReward;
}

export function DateMilesView({ userReward }: Props) {
  const { t } = useTranslation();

  // Logic for progress
  const currentLevel = [...MILESTONE_LEVELS].reverse().find(l => userReward.totalMiles >= l.min) || MILESTONE_LEVELS[0];
  const nextLevel = MILESTONE_LEVELS.find(l => l.min > userReward.totalMiles);
  const progressPercent = nextLevel
    ? ((userReward.totalMiles - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;
  const pointsToNext = nextLevel ? nextLevel.min - userReward.totalMiles : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-background min-h-screen space-y-10 pb-32 px-6"
    >
      {/* Header */}
      <header className="pt-8 flex flex-col gap-1">
        <h1 
          className="text-[36px] font-black text-primary leading-tight tracking-tight"
          style={{ fontFamily: 'var(--font-family-headline-lg)' }}
        >
          {t('wallet.title')}
        </h1>
        <p className="text-on-surface-variant font-medium opacity-70">
          {t('common.your_romance_journey')}
        </p>
      </header>

      {/* Hero Score Card — Ultra Premium Glassmorphism */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-[44px] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-primary-fixed to-primary-container p-9 shadow-2xl border border-white/20">
          {/* Decorative Elements */}
          <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none rotate-12">
            <span className="material-symbols-outlined text-[240px] text-on-primary-container">
              workspace_premium
            </span>
          </div>
          <div className="absolute -left-12 -bottom-12 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[180px] text-on-primary-container">
              auto_awesome
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-full flex justify-between items-start">
              <div>
                <p className="text-label-sm font-black text-on-primary-container/60 uppercase tracking-[0.2em]">
                  {t('wallet.rank')}
                </p>
                <h3 
                  className="text-headline-md font-bold text-on-primary-container mt-1"
                  style={{ fontFamily: 'var(--font-family-headline-md)' }}
                >
                  {currentLevel.name}
                </h3>
              </div>
              <div className="bg-white/30 backdrop-blur-md p-3 rounded-2xl border border-white/40">
                <span className="material-symbols-outlined text-[32px] text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  stars
                </span>
              </div>
            </div>

            <div className="mt-8 mb-4">
              <h2 className="text-[84px] font-black text-on-primary-container leading-none tracking-tighter drop-shadow-sm">
                {userReward.totalMiles}
              </h2>
              <p className="text-center text-label-md font-bold text-on-primary-container/80 uppercase tracking-widest mt-2">
                {t('wallet.miles')}
              </p>
            </div>

            <div className="w-full mt-6 space-y-4">
              {/* Progress Container */}
              <div className="space-y-2">
                <div className="flex justify-between text-label-sm font-black text-on-primary-container/80">
                  <span>{currentLevel.name}</span>
                  <span>{nextLevel?.name || t('wallet.max_level')}</span>
                </div>
                
                <div className="h-4 bg-black/5 rounded-full p-1 overflow-hidden backdrop-blur-sm">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-on-primary via-on-primary to-on-primary/80 rounded-full shadow-inner"
                  />
                </div>
              </div>

              <p className="text-[13px] font-bold text-on-primary-container/70 text-center italic">
                {nextLevel ? `${pointsToNext} points to ${nextLevel.name}` : 'You are at the peak of romance!'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid — Glass Cards */}
      <section className="grid grid-cols-3 gap-5">
        <StatCard 
          icon="favorite" 
          value={userReward.completedDates} 
          label={t('wallet.dates')} 
          color="primary"
        />
        <StatCard 
          icon="local_fire_department" 
          value={userReward.streak} 
          label={t('wallet.streak')} 
          color="tertiary"
        />
        <StatCard 
          icon="workspace_premium" 
          value={userReward.badges.length} 
          label={t('wallet.badges')} 
          color="secondary"
        />
      </section>

      {/* Badges Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 
            className="text-headline-md font-bold text-on-surface"
            style={{ fontFamily: 'var(--font-family-headline-md)' }}
          >
            {t('wallet.badges_title')}
          </h3>
          <button className="text-label-md font-black text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-all">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {BADGES.map((badge) => (
            <BadgeCard 
              key={badge.id}
              icon={badge.icon}
              title={badge.name}
              description={badge.desc}
              isEarned={userReward.badges.includes(badge.id)}
            />
          ))}
          {/* Mock extra badges for visual completeness if needed */}
          {BADGES.length < 4 && (
            <>
              <BadgeCard 
                icon="🌙"
                title="Night Owl"
                description="Plan 5 evening dates."
                isEarned={false}
              />
              <BadgeCard 
                icon="🍴"
                title="Foodie"
                description="Try 5 different restaurants."
                isEarned={false}
              />
            </>
          )}
        </div>
      </section>
    </motion.div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: number; label: string; color: 'primary' | 'secondary' | 'tertiary' }) {
  const colorMap = {
    primary: 'text-primary bg-primary-container/20',
    secondary: 'text-secondary bg-secondary-container/30',
    tertiary: 'text-tertiary bg-tertiary-container/30'
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass-card rounded-[32px] p-6 flex flex-col items-center justify-center border-none shadow-lg"
    >
      <div className={`w-12 h-12 rounded-2xl ${colorMap[color]} flex items-center justify-center mb-3`}>
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <span className="text-headline-md font-black text-on-surface leading-none">
        {value}
      </span>
      <span className="text-[10px] font-black text-on-surface-variant/60 mt-2 uppercase tracking-[0.2em]">
        {label}
      </span>
    </motion.div>
  );
}

function BadgeCard({ icon, title, description, isEarned }: { 
  icon: string; title: string; description: string; isEarned: boolean;
}) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`glass-card rounded-[40px] p-7 flex flex-col items-center text-center border-none transition-all duration-500 shadow-md ${!isEarned ? 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100' : 'ring-2 ring-primary-fixed'}`}
    >
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-5 relative ${isEarned ? 'bg-gradient-to-br from-primary-fixed to-primary-container/40' : 'bg-surface-container-high'}`}>
        <span className="text-[40px] leading-none select-none z-10 drop-shadow-sm">
          {icon}
        </span>
        {isEarned && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-20"
          >
            <span className="material-symbols-outlined text-[18px] font-black">check</span>
          </motion.div>
        )}
      </div>
      <h4 className="text-label-md font-black text-on-surface tracking-tight">{title}</h4>
      <p className="text-[11px] leading-[1.5] text-on-surface-variant mt-2 font-semibold line-clamp-2">
        {description}
      </p>
    </motion.div>
  );
}


