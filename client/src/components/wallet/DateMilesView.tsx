import { motion } from 'motion/react';
import type { UserReward } from '../../types';
import { MILESTONE_LEVELS, BADGES } from '../../data/constants';
import vi from '../../locales/vi.json';

interface Props {
  userReward: UserReward;
}

export function DateMilesView({ userReward }: Props) {
  const t = vi.wallet;
  
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
      className="bg-background min-h-screen space-y-8 pb-32"
    >
      {/* Header */}
      <header className="pt-6">
        <h1 className="text-headline-lg font-bold text-primary">Date Miles</h1>
        <p className="text-body-md text-secondary mt-1">Your romance journey</p>
      </header>

      {/* Hero Score Card */}
      <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-primary-fixed to-primary-container p-8 shadow-xl">
        {/* Background Medal Decoration */}
        <div className="absolute -right-4 -top-4 opacity-15 pointer-events-none">
          <span className="material-symbols-outlined text-[160px] text-on-primary-container">
            workspace_premium
          </span>
        </div>

        <div className="relative z-10">
          <p className="text-label-md font-bold text-on-primary-container/80 uppercase tracking-[0.1em]">
            TOTAL SCORE
          </p>
          <h2 className="text-[64px] font-black text-on-primary-container leading-tight mt-1 tracking-tight">
            {userReward.totalMiles}
          </h2>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-label-md font-bold text-on-primary-container">
              <span>{currentLevel.name}</span>
              <span>{nextLevel?.name || 'Master'}</span>
            </div>
            
            {/* Custom Progress Bar */}
            <div className="h-2.5 bg-on-primary/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="h-full bg-on-primary rounded-full"
              />
            </div>

            <p className="text-label-sm font-bold text-on-primary-container/70 text-right">
              {nextLevel ? `${pointsToNext} to next rank` : 'Maximum rank reached'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-3 gap-4">
        <StatCard 
          icon="favorite" 
          value={userReward.completedDates} 
          label="Dates" 
          iconClass="text-primary-container"
        />
        <StatCard 
          icon="local_fire_department" 
          value={userReward.streak} 
          label="Streak" 
          iconClass="text-tertiary-container"
        />
        <StatCard 
          icon="workspace_premium" 
          value={userReward.badges.length} 
          label="Badge" 
          iconClass="text-secondary-container"
        />
      </section>

      {/* Badges Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-headline-md font-bold text-on-surface">Badges</h3>
          <button className="text-label-md font-bold text-primary hover:opacity-80 transition-opacity">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {BADGES.map((badge, idx) => (
            <BadgeCard 
              key={badge.id}
              icon={badge.icon}
              title={badge.name}
              description={badge.desc}
              isEarned={userReward.badges.includes(badge.id)}
              tintClass={idx === 0 ? 'bg-primary-container/20' : idx === 1 ? 'bg-tertiary-container/20' : 'bg-surface-container-high'}
            />
          ))}
          {/* Mock extra badges to match design image if constant list is short */}
          {BADGES.length < 4 && (
            <>
              <BadgeCard 
                icon="🌙"
                title="Night Owl"
                description="Plan 5 evening dates."
                isEarned={false}
                tintClass="bg-surface-container-high"
              />
              <BadgeCard 
                icon="🍴"
                title="Foodie"
                description="Try 5 different restaurants."
                isEarned={false}
                tintClass="bg-surface-container-high"
              />
            </>
          )}
        </div>
      </section>
    </motion.div>
  );
}

function StatCard({ icon, value, label, iconClass }: { icon: string; value: number; label: string; iconClass: string }) {
  return (
    <div className="glass-card rounded-[32px] p-5 flex flex-col items-center justify-center border-none">
      <span className={`material-symbols-outlined text-[28px] mb-2 ${iconClass}`}>
        {icon}
      </span>
      <span className="text-[28px] font-black text-on-surface leading-none">
        {value}
      </span>
      <span className="text-label-sm font-bold text-on-surface-variant mt-2 uppercase tracking-wider opacity-70">
        {label}
      </span>
    </div>
  );
}

function BadgeCard({ icon, title, description, isEarned, tintClass }: { 
  icon: string; title: string; description: string; isEarned: boolean; tintClass: string 
}) {
  return (
    <div className={`glass-card rounded-[40px] p-6 flex flex-col items-center text-center border-none ${!isEarned ? 'opacity-60' : ''}`}>
      <div className={`w-20 h-20 rounded-full ${tintClass} flex items-center justify-center mb-4`}>
        {/* If icon is an emoji, wrap it; if it's a material icon name, use span */}
        <span className="text-[32px] leading-none select-none">
          {icon}
        </span>
      </div>
      <h4 className="text-label-md font-bold text-on-surface">{title}</h4>
      <p className="text-[12px] leading-[1.4] text-on-surface-variant mt-1.5 font-medium">
        {description}
      </p>
    </div>
  );
}

