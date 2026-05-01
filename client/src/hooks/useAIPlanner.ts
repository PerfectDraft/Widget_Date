import { useState, useCallback } from 'react';
import { generateCombos, ApiError } from '../services/api';
import { SAMPLE_COMBOS } from '../data/constants';
import type { Combo } from '../types';

interface UseAIPlannerProps {
  location: string;
  showToast: (msg: string) => void;
  initialCombos?: Combo[];
  externalPreferences?: string[];
  setExternalPreferences?: (p: string[]) => void;
}

export function useAIPlanner({ 
  location, 
  showToast, 
  initialCombos = [],
  externalPreferences,
  setExternalPreferences
}: UseAIPlannerProps) {
  // Form State
  const [budget, setBudget] = useState('500K');
  const [companion, setCompanion] = useState('Người yêu');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('22:00');
  
  // Use external preferences if provided, otherwise local state
  const [localPreferences, setLocalPreferences] = useState<string[]>(['Cafe']);
  const preferences = externalPreferences || localPreferences;
  const setPreferences = setExternalPreferences || setLocalPreferences;
  
  // Data State
  const [combos, setCombos] = useState<Combo[]>(initialCombos);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      showToast('AI đang tìm và thiết kế các combo thật cho bạn...');
      const liveCombos = await generateCombos({ location, budget, companion, startTime, endTime, preferences });
      setCombos(liveCombos);
    } catch (err: unknown) {
      let friendlyError = "Có lỗi khi tạo combo. Thử lại nhé.";
      
      if (err instanceof ApiError) {
        if (err.status === 429 || err.message.includes('limit exceeded') || err.message.includes('[FALLBACK LỖI AI]')) {
          friendlyError = "Bạn đã hết lượt dùng AI. Đăng nhập Google Drive để có thêm lượt nhé!";
        }
      } else if (err instanceof Error) {
        if (err.message.includes('[FALLBACK LỖI AI]')) {
          friendlyError = "Bạn đã hết lượt dùng AI. Đăng nhập Google Drive để có thêm lượt nhé!";
        }
      }
      
      setError(friendlyError);
      showToast(friendlyError);
      setCombos(SAMPLE_COMBOS);
    } finally {
      setIsLoading(false);
    }
  }, [location, budget, companion, startTime, endTime, preferences, showToast]);

  return {
    formState: {
      budget, setBudget,
      companion, setCompanion,
      startTime, setStartTime,
      endTime, setEndTime,
      preferences, setPreferences
    },
    dataState: {
      combos, setCombos,
      isLoading,
      error
    },
    actions: {
      generate
    }
  };
}
