// ===== 3. src/app/dashboard/page.tsx =====
import StatsOverview from '@/components/dashboard/StatsOverview'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentPosts from '@/components/dashboard/RecentPosts'

export default function DashboardPage() {
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