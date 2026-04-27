import { useState, useCallback, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { getDatabaseFileId, createDatabaseFile, readDatabase, writeDatabase, AppDatabase } from '../services/driveService';

export function useDriveSync(
  combos: any[],
  userReward: { miles: number; completedDates: number; badges: string[] },
  setCombos: (combos: any[]) => void,
  setUserReward: (reward: any) => void
) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Initial load when logged in
  useEffect(() => {
    if (!accessToken) return;

    const initializeDrive = async () => {
      setIsInitializing(true);
      let currentFileId = await getDatabaseFileId(accessToken);
      
      if (!currentFileId) {
        // Create new empty DB
        const initialData: AppDatabase = { combos: [], userReward: { miles: 0, completedDates: 0, badges: [] } };
        currentFileId = await createDatabaseFile(accessToken, initialData);
      } else {
        // Load existing DB
        const dbData = await readDatabase(accessToken, currentFileId);
        if (dbData) {
          if (dbData.combos) setCombos(dbData.combos);
          if (dbData.userReward) setUserReward(dbData.userReward);
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
      const dataToSave: AppDatabase = { combos, userReward };
      await writeDatabase(accessToken, fileId, dataToSave);
      setIsSyncing(false);
    }, 5000); // 5 seconds debounce

    return () => clearTimeout(timeout);
  }, [combos, userReward, accessToken, fileId, isInitializing]);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.appdata openid email profile',
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      // Optional: you can store the ID Token or Access Token in localStorage
      localStorage.setItem('google_access_token', tokenResponse.access_token);
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  // Try to restore session on mount (Note: access tokens expire in 1 hour usually. 
  // For standard implementation, we shouldn't persist access token forever, 
  // but for simplicity we can try to reuse it until it gets a 401).
  useEffect(() => {
    const savedToken = localStorage.getItem('google_access_token');
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  const logout = () => {
    setAccessToken(null);
    setFileId(null);
    localStorage.removeItem('google_access_token');
  };

  return {
    login,
    logout,
    isLoggedIn: !!accessToken,
    isSyncing,
    isInitializing
  };
}
