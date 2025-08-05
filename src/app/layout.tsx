// src/app/layout.tsx
// 공통 레이아웃(Header, Sidebar, Footer 포함)

'use client';

import React from 'react';
import '../styles/globals.css';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="h-screen flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}