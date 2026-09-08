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

const TOKEN_STORAGE_KEY = 'lk_token';
const USER_STORAGE_KEY = 'lk_user';

function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function readStoredUser(): LKUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LKUser;
  } catch {
    return null;
  }
}

// Глобальные ссылки, чтобы lkClient.ts мог получить токен и вызвать logout.
// Инициализируются из localStorage сразу при загрузке модуля (не только
// при монтировании AuthProvider), чтобы getAuthToken() отдавал верный
// токен даже если вызван раньше первого рендера AuthProvider.
let _logoutRef: (() => void) | null = null;
let _tokenRef: string | null = readStoredToken();

export function getAuthToken() {
  return _tokenRef;
}

export function triggerLogout() {
  _logoutRef?.();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const [user, setUser] = useState<LKUser | null>(() => readStoredUser());

  const login = useCallback(async (email: string, password: string) => {
    const res = await lkLogin(email, password);

    localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));

    setToken(res.token);
    setUser(res.user);
    _tokenRef = res.token;

    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

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
