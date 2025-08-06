// ===== 10. src/components/dashboard/RecentPosts.tsx =====
'use client'

import { useRouter } from 'next/navigation'
import { usePostStore } from '@/store/postStore'
import { useHydration } from '@/hooks/useHydration'
import { FileText, RefreshCw } from 'lucide-react'

export default function RecentPosts() {
  const router = useRouter()
  const hydrated = useHydration()
  const { posts } = usePostStore()
  
  // hydration이 완료되지 않았거나 posts가 없으면 빈 배열 사용
  const safePosts = hydrated && posts ? posts : []
  
  // 최신순으로 정렬한 후 3개만 선택
  const recentPosts = safePosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">최근 작성한 글</h2>
        <button 
          className="text-green-600 hover:text-green-700 flex items-center gap-1"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="w-4 h-4" />
          새로고침
        </button>
      </div>
      
      {safePosts.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">아직 작성한 글이 없습니다</p>
          <p className="text-gray-400 text-sm">첫 번째 맛집 글을 AI로 작성해보세요!</p>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-700"
            onClick={() => router.push('/write')}
          >
            글쓰기 시작하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentPosts.map(post => (
            <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.category} • {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                post.status === 'published' ? 'bg-green-100 text-green-800' :
                post.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {post.status === 'published' ? '발행됨' : post.status === 'completed' ? '완료' : '작성중'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}