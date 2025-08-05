// ===== 20. src/types/index.ts =====
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

export interface NaverAccount {
  email: string
  connected: boolean
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}