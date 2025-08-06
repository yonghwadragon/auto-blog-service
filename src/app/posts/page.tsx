// ===== 4. src/app/posts/page.tsx =====
'use client'

import { useAuthStore } from '@/store/authStore'
import PostsList from '@/components/posts/PostsList'
import PostsHeader from '@/components/posts/PostsHeader'
import PostsFilters from '@/components/posts/PostsFilters'
import AuthRequiredMessage from '@/components/auth/AuthRequiredMessage'

export default function PostsPage() {
  const { isAuthenticated, isLoading } = useAuthStore()

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthRequiredMessage />
  }

  return (
    <div className="space-y-6">
      <PostsHeader />
      <PostsFilters />
      <PostsList />
    </div>
  )
}