import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types/db';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  /** Бичих эрхтэй эсэх — RLS мөн үүнийг сервер талд дахин шалгана. */
  canEdit: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  // Тохируулаагүй үед сүлжээний дуудлага хийхгүй: anon key байхгүй тул
  // getSession нь байхгүй хост руу оролдож, дэлгэц түгждэг байсан.
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Сешн солигдох бүрд profile-оо дахин уншина (эрх өөрчлөгдсөн байж болно).
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (!session) {
      setProfile(null);
      return;
    }

    let active = true;
    void supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setProfile((data as Profile | null) ?? null);
      });

    return () => {
      active = false;
    };
  }, [session]);

  const value: AuthState = {
    session,
    profile,
    loading,
    canEdit: profile?.role === 'admin' || profile?.role === 'editor',
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth нь AuthProvider дотор байх ёстой');
  return ctx;
}
