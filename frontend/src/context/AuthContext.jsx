import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../api/users.js';

const STORAGE_KEY = 'heavenhub_user';
const EMAIL_KEY = 'heavenhub_email';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());

  const persistUser = useCallback((next) => {
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EMAIL_KEY);
    }
    setUser(next);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const dto = await loginUser({ email, password });
      localStorage.setItem(EMAIL_KEY, email);
      persistUser(dto);
      return dto;
    },
    [persistUser],
  );

  const register = useCallback(
    async (payload) => {
      const dto = await registerUser(payload);
      localStorage.setItem(EMAIL_KEY, payload.email);
      persistUser(dto);
      return dto;
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.id),
      role: user?.role ?? null,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook colocated with provider for this app. */
// eslint-disable-next-line react-refresh/only-export-components -- useAuth must live next to AuthProvider
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
