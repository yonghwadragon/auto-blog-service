// ===== 15. src/components/settings/SettingsTabs.tsx =====
'use client'

import { useState } from 'react'
import GeminiSettings from './GeminiSettings'
import NaverAccountSettings from './NaverAccountSettings'
import UserProfile from './UserProfile'

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: '사용자 정보' },
    { id: 'gemini', label: 'Gemini API' },
    { id: 'naver', label: '네이버 계정' },
  ]

  return (
    <>
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 ${
              activeTab === tab.id
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'profile' && <UserProfile />}
        {activeTab === 'gemini' && <GeminiSettings />}
        {activeTab === 'naver' && <NaverAccountSettings />}
      </div>
    </>
  )
}