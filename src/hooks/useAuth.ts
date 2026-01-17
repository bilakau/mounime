import { useState, useEffect, useCallback } from 'react';
import { ANIMEPLAY_API_BASE_URL } from '../constants';

interface AuthData {
  fid: string;
  refresh_token: string;
  auth_token: string;
  token_ajaib: string;
  expires_in: string;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthData | null>(() => {
    const saved = localStorage.getItem('animeplay_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const saveAuth = (data: AuthData) => {
    setAuth(data);
    localStorage.setItem('animeplay_auth', JSON.stringify(data));
  };

  const refreshToken = useCallback(async () => {
    if (!auth?.refresh_token) return null;

    try {
      const res = await fetch(`${ANIMEPLAY_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: auth.refresh_token,
          fid: auth.fid
        })
      });

      const json = await res.json();
      if (json.status === 'success' && json.data) {
        saveAuth(json.data);
        return json.data as AuthData;
      }
    } catch (error) {
      console.error('Refresh Token Error:', error);
    }
    return null;
  }, [auth]);

  // Optionally auto-refresh (not implemented here to avoid complexity, but could be added with a timeout)

  return {
    auth,
    saveAuth,
    refreshToken,
    isAuthenticated: !!auth?.auth_token
  };
};
