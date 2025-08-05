// src/components/settings/GeminiSettings.tsx
// Google Gemini API 키 입력·저장 컴포넌트 (키 보기 토글 포함)

'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { Settings, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function GeminiSettings() {
  const { geminiApiKey, setGeminiApiKey } = useSettingsStore()
  const [showKey, setShowKey] = useState(false) // 👀 키 표시 토글 상태
  const [showTempSuccess, setShowTempSuccess] = useState(false) // 3초 후 사라지는 메시지
  const [showPermanentSuccess, setShowPermanentSuccess] = useState(false) // 계속 표시되는 메시지

  /** API 키 저장 */
  const handleSaveApiKey = () => {
    if (geminiApiKey.trim()) {
      setShowTempSuccess(true)
      setShowPermanentSuccess(true)
      // 3초 후 임시 메시지만 숨기기
      setTimeout(() => setShowTempSuccess(false), 3000)
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

      {/* 성공 메시지 - 라벨 위쪽 (3초 후 사라짐) */}
      {showTempSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">API 키가 성공적으로 저장되었습니다.</span>
        </div>
      )}

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

        {/* 성공 메시지 - 버튼 아래쪽 (계속 표시) */}
        {showPermanentSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">
              API 키가 설정되어 있습니다. 이제 AI 콘텐츠 생성 기능을 사용할 수 있습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}