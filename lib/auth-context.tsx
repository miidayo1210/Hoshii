'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  nickname?: string;
  ageGroup?: string;
  gender?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, nickname?: string, ageGroup?: string, gender?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Supabaseが設定されていない場合は認証チェックをスキップ
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (!isSupabaseConfigured) {
      console.log('Supabase not configured, skipping auth check');
      setLoading(false);
      return;
    }

    // タイムアウト設定（5秒後に強制的にloadingをfalseにする）
    const timeoutId = setTimeout(() => {
      console.log('Auth check timeout, setting loading to false');
      setLoading(false);
    }, 5000);

    // Supabaseの認証状態を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log('認証状態変更:', event, session?.user?.email);
        clearTimeout(timeoutId); // タイムアウトをクリア
        
        if (session?.user) {
          console.log('ユーザーセッション確認:', session.user.email);
          // ユーザープロフィールを取得
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            console.log('プロフィール取得成功:', profile);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              nickname: profile.nickname,
              ageGroup: profile.age_group,
              gender: profile.gender,
              name: profile.name
            });
          } else {
            console.log('プロフィールなし、基本情報のみ設定');
            // プロフィールがない場合は基本情報のみ
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || ''
            });
          }
        } else {
          console.log('セッションなし、ユーザーをnullに設定');
          setUser(null);
        }
      } catch (error) {
        console.error('認証状態チェックエラー:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('ログイン開始:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('ログインエラー:', error);
        throw error;
      }
      console.log('ログイン成功');
    } catch (error) {
      console.error('ログインエラー:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, nickname?: string, ageGroup?: string, gender?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: nickname || email.split('@')[0],
            nickname: nickname,
            age_group: ageGroup,
            gender: gender
          }
        }
      });

      if (error) throw error;

      // プロフィールを手動で作成（トリガーが動作しない場合のバックアップ）
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            name: nickname || email.split('@')[0],
            nickname: nickname,
            age_group: ageGroup,
            gender: gender
          });

        if (profileError) {
          console.warn('プロフィール作成エラー:', profileError);
        }
      }
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
