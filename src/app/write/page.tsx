// ===== 5. src/app/write/page.tsx =====
'use client'

import { useAuthStore } from '@/store/authStore'
import WritePostForm from '@/components/write/WritePostForm'
import AuthRequiredMessage from '@/components/auth/AuthRequiredMessage'

export default function WritePage() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <AuthRequiredMessage />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <WritePostForm />
    </div>
  )
}