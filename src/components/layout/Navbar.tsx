// ===== 7. src/components/layout/Navbar.tsx =====
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, User, Settings, BarChart3, PenTool, Edit3 } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: '대시보드', icon: BarChart3 },
    { href: '/posts', label: '작성한 글', icon: FileText },
    { href: '/write', label: '글쓰기', icon: Edit3 },
    { href: '/settings', label: '설정', icon: Settings },
  ]

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">네이버 블로그 자동화</h1>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <User className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6">
        <nav className="flex space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 no-underline ${
                  pathname === item.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}