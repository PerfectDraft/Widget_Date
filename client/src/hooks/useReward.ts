import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { UserReward } from '../types';
import { MILESTONE_LEVELS } from '../data/constants';

function calculateStreak(history: any[]): number {
  if (!history || history.length === 0) return 0;
  
  const dates = Array.from(new Set(
    history.map(h => {
      const d = new Date(h.timestamp);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    }).filter(Boolean) as string[]
  )).sort().reverse();
  
  if (dates.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (dates[0] !== today && dates[0] !== yesterday) return 0;
  
  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const d1 = new Date(dates[i]);
    const d2 = new Date(dates[i+1]);
    const diff = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export function useReward(showToast: (msg: string) => void) {
  const [userReward, setUserReward] = useState<UserReward>(() => {
    try {
      const saved = localStorage.getItem('user_reward');
      const data = saved ? JSON.parse(saved) : {
        totalMiles: 0,
        level: 'Newbie',
        completedDates: 0,
        badges: [],
        history: [],
        streak: 0
      };
      return { ...data, streak: calculateStreak(data.history) };
    } catch {
      return { totalMiles: 0, level: 'Newbie', completedDates: 0, badges: [], history: [], streak: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem('user_reward', JSON.stringify(userReward));
  }, [userReward]);

  const earnMiles = useCallback((amount: number, reason: string) => {
    setUserReward(prev => {
      const newMiles = prev.totalMiles + amount;
      const currentLevelObj = [...MILESTONE_LEVELS].reverse().find(l => newMiles >= l.min);
      const newLevel = currentLevelObj ? currentLevelObj.name : 'Newbie';

      if (newLevel !== prev.level) {
        showToast(`Level Up! Bạn đã đạt hạng ${newLevel}! ✨`);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }

      const newHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        reason,
        amount,
        timestamp: new Date().toISOString()
      };

      const newHistory = [newHistoryItem, ...prev.history].slice(0, 50);
      const newBadges = [...prev.badges];

      // Night Owl check (after 10 PM)
      const hour = new Date().getHours();
      if (hour >= 22 && !newBadges.includes('night_owl')) {
        newBadges.push('night_owl');
        showToast("Huy hiệu mới: Night Owl! 🦉");
      }

      // Combo King check (5 combos)
      const comboCount = newHistory.filter(h => h.reason.includes('Combo')).length;
      if (comboCount >= 5 && !newBadges.includes('combo_king')) {
        newBadges.push('combo_king');
        showToast("Huy hiệu mới: Combo King! 👑");
      }

      return {
        ...prev,
        totalMiles: newMiles,
        level: newLevel,
        history: newHistory,
        badges: newBadges,
        streak: calculateStreak(newHistory)
      };
    });
  }, [showToast]);

  const incrementDates = useCallback(() => {
    setUserReward(prev => {
      const newCount = prev.completedDates + 1;
      const newBadges = [...prev.badges];
      
      if (newCount >= 1 && !newBadges.includes('first_date')) {
        newBadges.push('first_date');
        showToast("Huy hiệu mới: First Date! 💝");
      }
      
      return { ...prev, completedDates: newCount, badges: newBadges };
    });
  }, [showToast]);

  return { userReward, setUserReward, earnMiles, incrementDates };
}
