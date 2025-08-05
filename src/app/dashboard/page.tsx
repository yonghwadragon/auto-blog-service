// src/app/dashboard/page.tsx
// 대시보드 페이지 (shadcn/ui Card 적용)

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle>{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <QuickActions />
      <RecentPosts />
    </div>
  )
}