import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '@/services/authService';
import type { Profile } from '@/typings/Profile';

interface AuthContextType {
  isAuthenticated: boolean;
  checkingAuth: boolean;
  user: Profile | null;
  setUser: (user: Profile | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AuthService.me();
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await AuthService.login({ email, password });

    const userData = await AuthService.me();
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkingAuth, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
