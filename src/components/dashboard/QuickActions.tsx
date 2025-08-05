// src/components/dashboard/QuickActions.tsx
// 생동감 있는 빠른 작업 메뉴

import { Button } from '@/components/ui/button'
import { PenTool, FileText, Settings, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const actions = [
  {
    title: '새 글 쓰기',
    description: '사진으로 맛집 리뷰 작성',
    href: '/write',
    icon: Plus,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    primary: true,
  },
  {
    title: '글 관리',
    description: '작성한 글 확인',
    href: '/posts',
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    primary: false,
  },
  {
    title: '설정',
    description: '계정 및 API 설정',
    href: '/settings',
    icon: Settings,
    gradient: 'from-emerald-600 to-emerald-500',
    bgGradient: 'from-emerald-50 to-emerald-100',
    primary: false,
  },
]

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-green-100">
        <h3 className="text-lg font-bold text-slate-900 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          빠른 작업
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {actions.map((action, index) => (
          <Link key={action.href} href={action.href} className="block group">
            <div 
              className={`relative p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-green-100 bg-gradient-to-r ${action.bgGradient} hover:shadow-${action.primary ? 'green' : 'blue'}-200/50`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 호버 시 배경 효과 */}
              <div className="absolute inset-0 bg-white/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${action.gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 ml-4">
                  <div className="text-base font-semibold text-slate-900 group-hover:text-slate-800">
                    {action.title}
                  </div>
                  <div className="text-sm text-slate-600 mt-0.5">
                    {action.description}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* 하단 장식 */}
      <div className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
    </div>
  )
}