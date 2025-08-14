import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Post } from '@/types'

interface PostStore {
  posts: Post[]
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void
  updatePost: (id: number, updates: Partial<Post>) => void
  deletePost: (id: number) => void
  getPostById: (id: number) => Post | undefined
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      posts: [],

      addPost: (postData) => {
        const newPost: Post = {
          ...postData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          posts: [newPost, ...state.posts]
        }))
      },

      updatePost: (id, updates) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, ...updates } : post
          )
        }))
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id)
        }))
      },

      getPostById: (id) => {
        return get().posts.find((post) => post.id === id)
      },
    }),
    {
      name: 'post-storage',
    }
  )
)