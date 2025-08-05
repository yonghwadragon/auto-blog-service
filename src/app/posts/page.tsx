// ===== 4. src/app/posts/page.tsx =====
import PostsList from '@/components/posts/PostsList'
import PostsHeader from '@/components/posts/PostsHeader'
import PostsFilters from '@/components/posts/PostsFilters'

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <PostsHeader />
      <PostsFilters />
      <PostsList />
    </div>
  )
}