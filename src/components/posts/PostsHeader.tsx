// ===== 11. src/components/posts/PostsHeader.tsx =====
'use client'

import { useRouter } from 'next/navigation'
import { usePostStore } from '@/store/postStore'
import { Plus } from 'lucide-react'

export default function PostsHeader() {
  const router = useRouter()
  const { posts } = usePostStore()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">작성한 글</h1>
        <p className="text-gray-600">총 {posts.length}개의 글이 있습니다</p>
      </div>
      <button 
        onClick={() => router.push('/write')}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        새 글 쓰기
      </button>
    </div>
  )
}