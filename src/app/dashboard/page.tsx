// src/app/dashboard/page.tsx
// 개선된 생동감 있는 대시보드 페이지

import StatsOverview from '@/components/dashboard/StatsOverview'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentPosts from '@/components/dashboard/RecentPosts'

const stats = [
  { label: '전체 글', value: 0 },
  { label: '작성 중', value: 0 },
  { label: '완료', value: 0 },
  { label: '발행', value: 0 },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* 헤더 영역 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                블로그 자동화 대시보드
              </h1>
              <p className="text-slate-600 mt-2">AI로 맛집 블로그를 쉽고 빠르게 작성해보세요</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-slate-500">
                {new Date().toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <StatsOverview />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
            <div className="lg:col-span-2">
              <RecentPosts />
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className="mt-16 py-8 text-center">
        <p className="text-sm text-slate-500">© 2024 네이버 블로그 자동화. 맛집 블로거를 위한 AI 도구.</p>
      </div>
    </div>
  )
}