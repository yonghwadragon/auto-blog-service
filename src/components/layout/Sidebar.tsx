// src/components/layout/Sidebar.tsx
// 사이드바 네비게이션 (shadcn/ui Button, lucide-react 아이콘 사용)

import Link from 'next/link'
import { Home, FileText, PenTool, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { name: '대시보드', href: '/dashboard', icon: Home },
  { name: '작성한 글', href: '/posts', icon: FileText },
  { name: '글쓰기', href: '/write', icon: PenTool },
  { name: '설정', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 text-xl font-bold border-b">네이버 블로그 자동화</div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <item.icon className="w-5 h-5" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}