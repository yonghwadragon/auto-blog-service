// ===== 6. src/app/settings/page.tsx =====
'use client'

import { useAuthStore } from '@/store/authStore'
import SettingsTabs from '@/components/settings/SettingsTabs'
import AuthRequiredMessage from '@/components/auth/AuthRequiredMessage'

export default function SettingsPage() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <AuthRequiredMessage />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600">네이버 계정과 AI 설정을 관리하세요</p>
      </div>
      <SettingsTabs />
    </div>
  )
}