'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function AuthProtector({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, phase, logout } = useAuth();
  const router = useRouter();

  // 認証フェーズがunauthenticatedに変わった時にログインページにリダイレクトする
  useEffect(() => {
    if (phase === 'unauthenticated') {
      router.push('/login');
    }
  }, [phase, router]);

  useEffect(() => {
    const isVerified = async () => {
      try {
        const response = await fetch('/api/verify', { method: 'POST' });
        if (!response.ok)
          throw new Error(`Token verification failed: ${response.status}`);
        return true;
      } catch {
        logout();
        return false;
      }
    };
    isVerified();
  }, []);

  // 認証フェーズがinitializingまたはlogging-in中はローディング画面を表示
  if (phase === 'initializing' || phase === 'logging-in') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // トークンエラーの場合
  if (phase === 'token-failed') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          セッションエラーが発生しました。
        </Typography>
        <Typography variant="body1">
          トークンの設定に失敗しました。ログインし直してください。
        </Typography>
      </Box>
    );
  }

  // ログイン、認証が完了した時にのみ要素を表示
  if (phase === 'authenticated' && user) {
    return <>{children}</>;
  }
}