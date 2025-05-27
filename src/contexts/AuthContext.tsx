'use client'

import {onAuthStateChanged, signInWithEmailAndPassword, signOut, User} from "firebase/auth"
import React, {createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";

type AuthPhase =
  | 'initializing' // Firebase認証チェック中
  | 'logging-in' // ログイン処理中
  | 'authenticated' // ログイン成功・トークンセット完了
  | 'unauthenticated' // 未ログイン or ログアウト
  | 'token-failed'; // 認証済だがトークンセット失敗

interface AuthContextProps {
  user: User | null;
  phase: AuthPhase;
  login: (
    email: string, 
    password: string,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [phase, setphase] = useState<AuthPhase>('initializing');
  const phaseRef = useRef<AuthPhase>('initializing');

  // フェーズ状態を同時に更新するユーティリティ
  const updatePhase = (nextPhase: AuthPhase) => {
    setphase(nextPhase);
    phaseRef.current = nextPhase;
  };

  // FirebaseのIDトークンをサーバーに送信（Cookieに保存させる）
  const setAuthToken = async (user: User): Promise<boolean> => {
    try {
      const token = await user.getIdToken(true);
      const response = await fetch('/api/token/set-token', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error(`Token set failed: ${response.status}`);
      return true;
    } catch (error) {
      console.error('[AuthContext] setAuthToken error:', error);
      return false;
    }
  };

  // 認証トークンをクッキーから削除するAPIを呼び出す関数
  const removeAuthToken = async () => {
    await fetch('/api/token/remove-token', { method: 'POST' });
  };

  // 10分毎にトークンを更新
  useEffect(() => {
    if (!user) return;
    const refreshIntervalMinute = 10;

    const tokenRefreshInterval = setInterval(
      async () => {
        try {
          await setAuthToken(user);
        } catch {
          setUser(null);
          await removeAuthToken();
        }
      },
      1000 * 60 * refreshIntervalMinute,
    );

    return () => clearInterval(tokenRefreshInterval);
  }, [user]);

  // 認証状態の変更を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (phaseRef.current === 'logging-in') return;

      if (user) {
        setUser(user);
        const tokenSet = await setAuthToken(user);
        updatePhase(tokenSet ? 'authenticated' : 'token-failed');
        if (!tokenSet) await removeAuthToken;
      } else {
        setUser(null);
        updatePhase('unauthenticated');
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // ログイン処理
  const login = async(
    email:string,
    password:string
  ): Promise<{success: boolean; error?: string}> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const tokenSet = await setAuthToken(userCredential.user);

      setUser(userCredential.user);
      updatePhase(tokenSet ? 'authenticated' : 'token-failed');
      if (!tokenSet) await removeAuthToken();
      return tokenSet
        ? {
            success: true,
          }
        : {
            success: false,
            error:
              'トークンの設定に失敗しました。システム管理者に連絡してください。',
          };

    } catch (error) {
      console.error('[AuthContext] login error:', error);
      updatePhase('unauthenticated');
      return {
        success: false,
        error:
          'ログインに失敗しました。メールアドレスまたはパスワードをご確認ください。',
      };
    }
  }

  const logout = async() => {
    try {
      await signOut(auth);
      setUser(null);

      await removeAuthToken()
      updatePhase('unauthenticated')
    } catch (error) {
      console.error('[AuthContext] logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        phase,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('認証コンテキストが初期化されていません。');
  }
  return context;
}