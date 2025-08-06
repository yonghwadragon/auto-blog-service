// ===== 3. src/app/dashboard/page.tsx =====
'use client'

import { useAuthStore } from '@/store/authStore'
import StatsOverview from '@/components/dashboard/StatsOverview'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentPosts from '@/components/dashboard/RecentPosts'
import AuthRequiredMessage from '@/components/auth/AuthRequiredMessage'

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <AuthRequiredMessage />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">블로그 자동화 대시보드</h1>
        <p className="text-gray-600">AI로 똑똑한 블로그를 쉽고 빠르게 작성해보세요</p>
      </div>

      <StatsOverview />
      <QuickActions />
      <RecentPosts />
    </div>
  )
}