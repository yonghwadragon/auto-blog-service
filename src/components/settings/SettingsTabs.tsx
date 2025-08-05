// ===== 15. src/components/settings/SettingsTabs.tsx =====
'use client'

import { useState } from 'react'
import GeminiSettings from './GeminiSettings'
import NaverAccountSettings from './NaverAccountSettings'

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('gemini')

  const tabs = [
    { id: 'gemini', label: 'Gemini API' },
    { id: 'naver', label: '네이버 계정' },
    { id: 'general', label: '기본 설정' },
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
        {activeTab === 'gemini' && <GeminiSettings />}
        {activeTab === 'naver' && <NaverAccountSettings />}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">기본 설정</h3>
            <p className="text-gray-600">기본 설정 옵션들이 여기에 표시됩니다.</p>
          </div>
        )}
      </div>
    </>
  )
}