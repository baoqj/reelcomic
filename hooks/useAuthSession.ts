import { useCallback, useEffect, useState } from 'react';
import { AuthUser } from '../types';

interface AuthSessionResponse {
  authenticated: boolean;
  user: AuthUser | null;
}

export const useAuthSession = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const payload = (await response.json()) as AuthSessionResponse;
      setUser(payload.authenticated ? payload.user : null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await refresh();
      if (mounted) setLoading(false);
    };
    run();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  return { user, loading, refresh };
};
