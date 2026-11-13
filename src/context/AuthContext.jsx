import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const current = await authService.getCurrentUser();
      if (current) {
        setUser(current);
        setProfile(await profileService.getProfile(current.id));
      }
      setLoading(false);
    })();
  }, []);

  const register = useCallback((data) => authService.register(data), []);

  const login = useCallback(async (email, password) => {
    const u = await authService.login(email, password);
    setUser(u);
    setProfile(await profileService.getProfile(u.id));
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  }, []);

  const saveProfile = useCallback(
    async (data) => {
      const p = await profileService.saveProfile(user.id, data);
      setProfile(p);
      return p;
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, profile, loading, register, login, logout, saveProfile, setProfile }),
    [user, profile, loading, register, login, logout, saveProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
