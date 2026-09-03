import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '../lib/auth/client';
import { fetchSession, login as apiLogin, logout as apiLogout, signup as apiSignup } from '../lib/auth/client';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (args: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function formatAuthError(code?: string): string {
  switch (code) {
    case 'invalid_credentials':
      return 'Incorrect email or password.';
    case 'email_taken':
      return 'An account with this email already exists. Sign in instead.';
    case 'Password must be at least 8 characters':
      return 'Password must be at least 8 characters.';
    case 'Enter a valid email address':
      return 'Enter a valid email address.';
    default:
      return code ?? 'Something went wrong. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const sessionUser = await fetchSession();
    setUser(sessionUser);
  }, []);

  useEffect(() => {
    let active = true;
    fetchSession()
      .then((sessionUser) => {
        if (active) setUser(sessionUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    if (result.user) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: formatAuthError(result.error) };
  }, []);

  const signup = useCallback(
    async (args: { email: string; password: string; firstName?: string; lastName?: string }) => {
      const result = await apiSignup(args);
      if (result.user) {
        setUser(result.user);
        return { ok: true };
      }
      return { ok: false, error: formatAuthError(result.error) };
    },
    []
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      signup,
      logout,
      refreshSession
    }),
    [user, isLoading, login, signup, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
