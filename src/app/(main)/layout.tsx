'use client';

import React from 'react';
import Provider from '@/app/provider';
import AuthProtector from '@/components/authProtector';

export default function Mainlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProtector>
      <Provider>
        <main>{children}</main>
      </Provider>
    </AuthProtector>
  );
}