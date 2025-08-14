// ===== BACKUP: Supabase version of postStore.ts =====
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { Post } from '@/types'

interface PostStore {
  posts: Post[]
  loading: boolean
  error: string | null
  
  // CRUD operations
  fetchPosts: (userId: string) => Promise<void>
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Post | null>
  updatePost: (id: number, updates: Partial<Post>) => Promise<void>
  deletePost: (id: number) => Promise<void>
  
  // Local state management
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearPosts: () => void
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearPosts: () => set({ posts: [] }),

  fetchPosts: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedPosts: Post[] = data.map(post => ({
        id: post.id,
        user_id: post.user_id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        publishType: post.publish_type,
        status: post.status,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        image: post.image
      }))

      set({ posts: formattedPosts, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  addPost: async (postData) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: postData.user_id,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          tags: postData.tags,
          publish_type: postData.publishType,
          status: postData.status,
          image: postData.image
        })
        .select()
        .single()

      if (error) throw error

      const newPost: Post = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
        publishType: data.publish_type,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        image: data.image
      }

      set(state => ({ 
        posts: [newPost, ...state.posts], 
        loading: false 
      }))
      
      return newPost
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      return null
    }
  },

  updatePost: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updateData: any = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.content !== undefined) updateData.content = updates.content
      if (updates.category !== undefined) updateData.category = updates.category
      if (updates.tags !== undefined) updateData.tags = updates.tags
      if (updates.publishType !== undefined) updateData.publish_type = updates.publishType
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.image !== undefined) updateData.image = updates.image

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      set(state => ({
        posts: state.posts.map(post =>
          post.id === id ? { ...post, ...updates } : post
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  deletePost: async (id) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        posts: state.posts.filter(post => post.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  }
}))