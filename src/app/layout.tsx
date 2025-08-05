// ===== 1. src/app/layout.tsx =====
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '네이버 블로그 자동화',
  description: 'AI로 똑똑한 블로그를 쉽고 빠르게 작성해보세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}