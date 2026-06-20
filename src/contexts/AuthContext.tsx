import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { LKUser } from '@/types/lk';
import { lkLogin } from '@/api/lkClient';

interface AuthContextValue {
  token: string | null;
  user: LKUser | null;
  login: (email: string, password: string) => Promise<LKUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Глобальные ссылки, чтобы lkClient.ts мог получить токен и вызвать logout
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
    console.log('AUTH login() called', { email });
    const res = await lkLogin(email, password);
    console.log('AUTH login() result', res);

    setToken(res.token);
    setUser(res.user);
    _tokenRef = res.token;

    console.log('AUTH token set to', _tokenRef);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    console.log('AUTH logout() called');
    setToken(null);
    setUser(null);
    _tokenRef = null;
  }, []);

  // Сохраняем ссылку, чтобы triggerLogout() мог вызвать logout()
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