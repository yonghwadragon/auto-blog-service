// ===== 7. src/components/layout/Navbar.tsx =====
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { FileText, User, Settings, BarChart3, PenTool, Edit3, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, isLoading, logout, user } = useAuthStore()

  const navItems = [
    { href: '/dashboard', label: '대시보드', icon: BarChart3 },
    { href: '/posts', label: '작성한 글', icon: FileText },
    { href: '/write', label: '글쓰기', icon: Edit3 },
    { href: '/settings', label: '설정', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      logout()
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Navely</h1>
          </Link>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* 환영 메시지 - 클릭 시 사용자 정보로 이동 */}
                <Link href="/settings" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">
                    {user?.displayName && (
                      <span className="text-green-600 font-medium">
                        {user.displayName}님
                      </span>
                    )}
                    {!user?.displayName && user?.email && (
                      <span className="text-green-600 font-medium">
                        {user.email.split('@')[0]}님
                      </span>
                    )}
                    <span className="ml-1">
                      <span className="font-medium">Navely</span>에 오신 것을 환영합니다!
                    </span>
                  </span>
                </Link>
                
                {/* 모바일용 간단 표시 - 클릭 시 사용자 정보로 이동 */}
                <Link href="/settings" className="sm:hidden flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {user?.displayName || user?.email?.split('@')[0] || '사용자'}님
                  </span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm whitespace-nowrap">로그아웃</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm">로그인</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6">
        <nav className="flex space-x-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 no-underline whitespace-nowrap ${
                  pathname === item.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="sm:inline hidden">{item.label}</span>
                <span className="sm:hidden inline text-xs">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}