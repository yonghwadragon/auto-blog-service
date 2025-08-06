// ===== 8. src/components/dashboard/StatsOverview.tsx =====
'use client'

import { usePostStore } from '@/store/postStore'
import { useHydration } from '@/hooks/useHydration'
import { FileText, Clock, CheckCircle, Send } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: React.ComponentType<any>
  color: string
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 text-sm">{title}</span>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
)

export default function StatsOverview() {
  const hydrated = useHydration()
  const { posts } = usePostStore()
  
  // hydration이 완료되지 않았거나 posts가 없으면 빈 배열 사용
  const safePosts = hydrated && posts ? posts : []

  const stats = {
    total: safePosts.length,
    writing: safePosts.filter(p => p.status === 'writing').length,
    completed: safePosts.filter(p => p.status === 'completed').length,
    published: safePosts.filter(p => p.status === 'published').length
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="전체 글" value={stats.total} icon={FileText} color="text-blue-600" />
      <StatCard title="작성 중" value={stats.writing} icon={Clock} color="text-yellow-600" />
      <StatCard title="완료" value={stats.completed} icon={CheckCircle} color="text-green-600" />
      <StatCard title="발행" value={stats.published} icon={Send} color="text-purple-600" />
    </div>
  )
}