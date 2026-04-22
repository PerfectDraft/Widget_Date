import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { UserReward } from '../types';
import { MILESTONE_LEVELS } from '../data/constants';

export function useReward(showToast: (msg: string) => void) {
  const [userReward, setUserReward] = useState<UserReward>(() => {
    try {
      const saved = localStorage.getItem('user_reward');
      return saved ? JSON.parse(saved) : {
        totalMiles: 0,
        level: 'Newbie',
        completedDates: 0,
        badges: ['first_date'],
        history: []
      };
    } catch {
      return { totalMiles: 0, level: 'Newbie', completedDates: 0, badges: ['first_date'], history: [] };
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

      return {
        ...prev,
        totalMiles: newMiles,
        level: newLevel,
        history: [{
          id: Math.random().toString(36).substr(2, 9),
          reason,
          amount,
          timestamp: new Date().toLocaleString('vi-VN')
        }, ...prev.history].slice(0, 10)
      };
    });
  }, [showToast]);

  const incrementDates = useCallback(() => {
    setUserReward(prev => ({ ...prev, completedDates: prev.completedDates + 1 }));
  }, []);

  return { userReward, earnMiles, incrementDates };
}
