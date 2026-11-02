import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isTokenExpired: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<{ error: AuthError | Error | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if active JWT session has passed expiry
  const isTokenExpired = useMemo(() => {
    if (!session?.expires_at) return false;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return session.expires_at < nowInSeconds;
  }, [session]);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Session verification warning:', error.message);
        setUser(null);
        setSession(null);
      } else {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    } catch (err) {
      console.error('Failed to verify session security state:', err);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Secure Session Retrieval
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('Security verification error:', error);
        setUser(null);
        setSession(null);
      } else {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      }
      setLoading(false);
    });

    // 2. Continuous State Listener (Tokens, Login, Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        // Clear potential residual storage to prevent session fixation
        try {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              localStorage.removeItem(key);
            }
          });
        } catch {
          // LocalStorage fallback
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Secure Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (!error && data?.session) {
        setSession(data.session);
        setUser(data.user);
      }
      return { error };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Authentication request failed');
      return { error };
    }
  };

  // Secure Sign Up
  const signUp = async (email: string, password: string) => {
    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
      });

      if (!error && data?.session) {
        setSession(data.session);
        setUser(data.user);
      }
      return { error };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Registration request failed');
      return { error };
    }
  };

  // Secure Sign Out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      return { error };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign out request failed');
      setUser(null);
      setSession(null);
      return { error };
    }
  };

  const contextValue = useMemo(() => ({
    user,
    session,
    loading,
    isTokenExpired,
    signIn,
    signUp,
    signOut,
    refreshSession,
  }), [user, session, loading, isTokenExpired, refreshSession]);

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
}

// Hook consumer
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within a secure <AuthProvider>');
  }
  return context;
}