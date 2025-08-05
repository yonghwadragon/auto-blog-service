// src/components/settings/GeminiSettings.tsx
// Google Gemini API 키 입력·저장 컴포넌트 (키 보기 토글 포함)

'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { Settings, Eye, EyeOff } from 'lucide-react'

export default function GeminiSettings() {
  const { geminiApiKey, setGeminiApiKey } = useSettingsStore()
  const [showKey, setShowKey] = useState(false) // 👀 키 표시 토글 상태

  /** API 키 저장 */
  const handleSaveApiKey = () => {
    if (geminiApiKey.trim()) {
      alert('API 키가 저장되었습니다!')
    } else {
      alert('API 키를 입력해주세요.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Google Gemini API 설정
        </h2>
      </div>

      {/* 발급 방법 안내 */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-900 mb-2">API 키 발급 방법</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Google AI Studio (makersuite.google.com) 접속</li>
          <li>Google 계정으로 로그인</li>
          <li>“Get API Key” 버튼 클릭</li>
          <li>API 키 생성 후 복사</li>
          <li>아래 입력창에 붙여넣기</li>
        </ol>
      </div>

      {/* 입력 영역 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gemini API 키 *
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="AIzaSy..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowKey((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleSaveApiKey}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          API 키 저장
        </button>
      </div>
    </div>
  )
}