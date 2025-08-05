// ===== 18. src/store/postStore.ts =====
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Post {
  id: number
  title: string
  content: string
  category: string
  tags: string
  publishType: string
  status: 'writing' | 'completed' | 'published'
  createdAt: string
  image: string | null
}

interface PostStore {
  posts: Post[]
  addPost: (post: Post) => void
  updatePost: (id: number, post: Partial<Post>) => void
  deletePost: (id: number) => void
}

export const usePostStore = create<PostStore>()(
  persist(
    (set) => ({
      posts: [],
      addPost: (post) =>
        set((state) => ({
          posts: [...state.posts, post],
        })),
      updatePost: (id, updatedPost) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, ...updatedPost } : post
          ),
        })),
      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        })),
    }),
    {
      name: 'post-store',
    }
  )
)