// src/components/layout/Header.tsx
// 상단 헤더 (shadcn/ui Button, lucide-react 아이콘 사용)

import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">대시보드</h1>
      <div className="flex gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}