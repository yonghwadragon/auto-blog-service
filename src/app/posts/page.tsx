// ===== 4. src/app/posts/page.tsx =====
'use client'

import { useAuthStore } from '@/store/authStore'
import PostsList from '@/components/posts/PostsList'
import PostsHeader from '@/components/posts/PostsHeader'
import PostsFilters from '@/components/posts/PostsFilters'
import AuthRequiredMessage from '@/components/auth/AuthRequiredMessage'

export default function PostsPage() {
  const { isAuthenticated } = useAuthStore()

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