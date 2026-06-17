import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LKUser } from '@/types/lk';
import { lkLogin } from '@/api/lkClient';

interface AuthContextValue {
  token: string | null;
  user: LKUser | null;
  login: (email: string, password: string) => Promise<LKUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

let _logoutRef: (() => void) | null = null;
let _tokenRef: string | null = null;

export function getAuthToken() {
  return _tokenRef;
}
export function triggerLogout() {
  _logoutRef?.();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<LKUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const res = await lkLogin(email, password);
    setToken(res.token);
    setUser(res.user);
    _tokenRef = res.token;
    return res.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    _tokenRef = null;
  }, []);

  _logoutRef = logout;

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
