// src/components/dashboard/RecentPosts.tsx
// 최근 작성한 글 목록

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const dummyPosts = [
  { id: 1, title: '춘천 닭갈비 맛집 탐방', status: '작성중', createdAt: '2025-08-01' },
  { id: 2, title: '강릉 커피거리 리뷰', status: '완료', createdAt: '2025-07-28' },
]

export default function RecentPosts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 작성한 글</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dummyPosts.length === 0 ? (
          <p className="text-gray-500">아직 작성한 글이 없습니다</p>
        ) : (
          dummyPosts.map((post) => (
            <div key={post.id} className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">{post.title}</span>
              <Badge>{post.status}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}