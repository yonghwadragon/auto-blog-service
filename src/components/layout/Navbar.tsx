// ===== 7. src/components/layout/Navbar.tsx =====
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, User, Settings } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: '대시보드' },
    { href: '/posts', label: '작성한 글' },
    { href: '/write', label: '글쓰기' },
    { href: '/settings', label: '설정' },
  ]

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">네이버 블로그 자동화</h1>
          </div>
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
        <nav className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`py-4 border-b-2 font-medium text-sm ${
                pathname === item.href
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}