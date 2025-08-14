// ===== 20. src/types/index.ts =====
export interface Post {
  id: number
  user_id?: string
  title: string
  content: string
  category: string
  tags: string
  publishType: string
  status: 'writing' | 'completed' | 'published'
  createdAt: string
  updatedAt?: string
  image: string | null
}

export interface PythonJob {
  id: number
  user_id: string
  post_ids: number[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress_current: number
  progress_total: number
  error_message?: string
  started_at?: string
  completed_at?: string
  created_at: string
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