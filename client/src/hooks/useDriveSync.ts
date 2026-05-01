import { useState, useCallback, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { getDatabaseFileId, createDatabaseFile, readDatabase, writeDatabase, AppDatabase } from '../services/driveService';
import { Combo, UserReward } from '../types';

export function useDriveSync(
  combos: Combo[],
  userReward: UserReward,
  chatMessages: { role: string; text: string }[],
  setCombos: (combos: Combo[]) => void,
  setUserReward: (reward: UserReward) => void,
  setChatMessages: (msgs: { role: string; text: string }[]) => void,
  preferences: string[] = []
) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Fetch User Info to get stable ID (email/sub)
  useEffect(() => {
    if (!accessToken) {
      setUserIdentifier(null);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserIdentifier(data.sub || data.email);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };
    fetchUserInfo();
  }, [accessToken]);

  // Initial load when logged in
  useEffect(() => {
    if (!accessToken) return;

    const initializeDrive = async () => {
      setIsInitializing(true);
      try {
        let currentFileId = await getDatabaseFileId(accessToken);
        
        if (!currentFileId) {
          // Create new empty DB
          const initialData: AppDatabase = { 
            combos: [], 
            userReward: { totalMiles: 0, completedDates: 0, badges: [], level: 'Fledgling', history: [] },
            chatMessages: []
          };
          currentFileId = await createDatabaseFile(accessToken, initialData);
        } else {
          // Load existing DB
          const dbData = await readDatabase(accessToken, currentFileId);
          if (dbData) {
            if (dbData.combos) setCombos(dbData.combos);
            if (dbData.userReward) setUserReward(dbData.userReward);
            if (dbData.chatMessages) setChatMessages(dbData.chatMessages);
            if (dbData.phoneNumber) setPhoneNumber(dbData.phoneNumber);
          }
        }
        
        setFileId(currentFileId);
      } catch (err) {
        console.error('Failed to initialize Drive sync:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDrive();
  }, [accessToken]); // run once on login

  // Auto-sync modified data (debounced)
  useEffect(() => {
    if (!accessToken || !fileId || isInitializing) return;

    const timeout = setTimeout(async () => {
      setIsSyncing(true);
      try {
        const dataToSave: AppDatabase = { phoneNumber: phoneNumber || '', combos, userReward, chatMessages };
        await writeDatabase(accessToken, fileId, dataToSave);

        // Sync to Server (W6)
        if (phoneNumber) {
          try {
            const { syncUser } = await import('../services/api');
            await syncUser({
              phone: phoneNumber,
              googleId: userIdentifier || undefined,
              preferences,
              lastTab: 'home' // default or current active tab
            });
          } catch (err) {
            console.warn('Server sync failed:', err);
          }
        }
      } catch (err) {
        console.error('Background sync failed:', err);
      } finally {
        setIsSyncing(false);
      }
    }, 5000); // 5 seconds debounce

    return () => clearTimeout(timeout);
  }, [combos, userReward, chatMessages, phoneNumber, accessToken, fileId, isInitializing, userIdentifier, preferences]);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.appdata openid email profile',
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      try {
        localStorage.setItem('google_access_token', tokenResponse.access_token);
      } catch (err) {
        console.warn('Failed to save token to localStorage:', err);
      }
    },
    onError: (error) => console.error('Login Failed:', error),
  });

  // Restore session on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('google_access_token');
      if (savedToken) {
        setAccessToken(savedToken);
      }
    } catch (err) {
      console.warn('Failed to read token from localStorage:', err);
    }
  }, []);

  const logout = () => {
    setAccessToken(null);
    setFileId(null);
    setUserIdentifier(null);
    setPhoneNumber(null);
    try {
      localStorage.removeItem('google_access_token');
    } catch (err) {
      console.warn('Failed to remove token from localStorage:', err);
    }

    // Reset app state to clear sensitive data
    setCombos([]);
    setUserReward({ totalMiles: 0, completedDates: 0, badges: [], level: 'Fledgling', history: [] });
    setChatMessages([
      { role: 'model', text: 'Chào đằng ấy 👋! Mình là trợ lý AI Hẹn Hò. Đằng ấy muốn ăn món Việt, đồ Âu sang chảnh, hay đi một nơi nào đó thật Chill? Cứ tâm sự chi tiết ở đây nha!' }
    ]);
  };

  return {
    login,
    logout,
    isLoggedIn: !!accessToken,
    userIdentifier,
    phoneNumber,
    setPhoneNumber,
    isSyncing,
    isInitializing
  };
}
