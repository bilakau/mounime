import { ANIMEPLAY_API_BASE_URL } from '../constants';

export const getAuthHeaders = () => {
  const saved = localStorage.getItem('animeplay_auth');
  if (!saved) return {};
  
  try {
    const auth = JSON.parse(saved);
    return {
      'Authorization': `Bearer ${auth.auth_token}`,
      'x-token-ajaib': auth.token_ajaib,
      'x-fid': auth.fid
    };
  } catch (e) {
    return {};
  }
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  let response = await fetch(url, {
    ...options,
    headers
  });

  // Automatic refresh on 401
  if (response.status === 401) {
    const saved = localStorage.getItem('animeplay_auth');
    if (saved) {
      const auth = JSON.parse(saved);
      try {
        const refreshRes = await fetch(`${ANIMEPLAY_API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: auth.refresh_token, fid: auth.fid })
        });
        
        const refreshJson = await refreshRes.json();
        if (refreshJson.status === 'success' && refreshJson.data) {
          localStorage.setItem('animeplay_auth', JSON.stringify(refreshJson.data));
          
          // Retry original request with new tokens
          const newHeaders = {
            ...getAuthHeaders(),
            ...(options.headers || {})
          };
          response = await fetch(url, {
            ...options,
            headers: newHeaders
          });
        }
      } catch (e) {
        console.error('Auto-refresh failed', e);
      }
    }
  }

  return response;
};
