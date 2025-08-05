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
    <Card className="mb-8 shadow-none border-0 bg-transparent">
    <CardHeader className="bg-transparent px-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">빠른 작업</CardTitle>
    </CardHeader>
    <CardContent className="px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {actions.map((action) => (
            <Link key={action.href} href={action.href}>
            <div className="bg-white rounded-2xl shadow group transition ring-1 ring-green-100 hover:ring-green-400 hover:shadow-lg cursor-pointer flex flex-col items-center p-7 h-full border border-green-100">
                <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 group-hover:bg-green-600 transition">
                <action.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-center flex flex-col flex-1">
                <div className="font-bold text-lg text-gray-900 mb-0.5">{action.title}</div>
                <div className="text-[15px] text-gray-500">{action.description}</div>
                </div>
            </div>
            </Link>
        ))}
        </div>
    </CardContent>
    </Card>
  )
}