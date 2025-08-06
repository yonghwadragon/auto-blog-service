// ===== 11. src/components/posts/PostsHeader.tsx =====
'use client'

import { useRouter } from 'next/navigation'
import { usePostStore } from '@/store/postStore'
import { useHydration } from '@/hooks/useHydration'
import { Plus, RefreshCw } from 'lucide-react'

export default function PostsHeader() {
  const router = useRouter()
  const hydrated = useHydration()
  const { posts } = usePostStore()
  
  // hydration이 완료되지 않았거나 posts가 없으면 빈 배열 사용
  const safePosts = hydrated && posts ? posts : []

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">작성한 글</h1>
        <p className="text-gray-600">총 {safePosts.length}개의 글이 있습니다</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          새로고침
        </button>
        <button 
          onClick={() => router.push('/write')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 글 쓰기
        </button>
      </div>
    </div>
  )
}