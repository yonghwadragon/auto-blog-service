// src/components/dashboard/QuickActions.tsx
// 대시보드 빠른 작업 버튼 영역

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PenTool, FileText, Settings } from 'lucide-react'

const actions = [
  {
    title: '새 글 쓰기',
    description: '사진 업로드 후 AI 글 작성',
    href: '/write',
    icon: PenTool,
  },
  {
    title: '작성한 글 보기',
    description: '작성한 글 전체 확인',
    href: '/posts',
    icon: FileText,
  },
  {
    title: '설정',
    description: '네이버 계정 및 Gemini API',
    href: '/settings',
    icon: Settings,
  },
]

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>빠른 작업</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button variant="outline" className="w-full h-auto flex flex-col items-center p-6 space-y-2">
              <action.icon className="w-6 h-6 mb-2" />
              <span className="font-semibold">{action.title}</span>
              <span className="text-sm text-gray-500 text-center">{action.description}</span>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}