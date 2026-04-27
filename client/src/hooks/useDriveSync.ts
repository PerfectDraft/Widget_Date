import { useState, useCallback, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { getDatabaseFileId, createDatabaseFile, readDatabase, writeDatabase, AppDatabase } from '../services/driveService';

export function useDriveSync(
  combos: any[],
  userReward: { miles: number; completedDates: number; badges: string[] },
  chatMessages: { role: string; text: string }[],
  setCombos: (combos: any[]) => void,
  setUserReward: (reward: any) => void,
  setChatMessages: (msgs: any[]) => void
) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);
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
      let currentFileId = await getDatabaseFileId(accessToken);
      
      if (!currentFileId) {
        // Create new empty DB
        const initialData: AppDatabase = { 
          combos: [], 
          userReward: { miles: 0, completedDates: 0, badges: [] },
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
        }
      }
      
      setFileId(currentFileId);
      setIsInitializing(false);
    };

    initializeDrive();
  }, [accessToken]); // run once on login

  // Auto-sync modified data (debounced)
  useEffect(() => {
    if (!accessToken || !fileId || isInitializing) return;

    const timeout = setTimeout(async () => {
      setIsSyncing(true);
      const dataToSave: AppDatabase = { combos, userReward, chatMessages };
      await writeDatabase(accessToken, fileId, dataToSave);
      setIsSyncing(false);
    }, 5000); // 5 seconds debounce

    return () => clearTimeout(timeout);
  }, [combos, userReward, chatMessages, accessToken, fileId, isInitializing]);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.appdata openid email profile',
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem('google_access_token', tokenResponse.access_token);
    },
    onError: (error) => console.error('Login Failed:', error),
  });

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('google_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  const logout = () => {
    setAccessToken(null);
    setFileId(null);
    setUserIdentifier(null);
    localStorage.removeItem('google_access_token');

    // Reset app state to clear sensitive data
    setCombos([]);
    setUserReward({ miles: 0, completedDates: 0, badges: [] });
    setChatMessages([
      { role: 'model', text: 'Chào đằng ấy 👋! Mình là trợ lý AI Hẹn Hò. Đằng ấy muốn ăn món Việt, đồ Âu sang chảnh, hay đi một nơi nào đó thật Chill? Cứ tâm sự chi tiết ở đây nha!' }
    ]);
  };

  return {
    login,
    logout,
    isLoggedIn: !!accessToken,
    userIdentifier,
    isSyncing,
    isInitializing
  };
}
