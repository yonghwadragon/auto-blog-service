// ===== 5. src/app/write/page.tsx =====
'use client'

import { useAuthStore } from '@/store/authStore'
import WritePostForm from '@/components/write/WritePostForm'
import AuthRequiredMessage from '@/components/auth/AuthRequiredMessage'

export default function WritePage() {
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
    <div className="max-w-4xl mx-auto">
      <WritePostForm />
    </div>
  )
}