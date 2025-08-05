// ===== 17. src/components/settings/NaverAccountSettings.tsx =====
'use client'

import { useSettingsStore } from '@/store/settingsStore'
import { User, Plus, Edit, Trash2 } from 'lucide-react'

export default function NaverAccountSettings() {
  const { naverAccount } = useSettingsStore()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">네이버 계정 관리</h2>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          계정 추가
        </button>
      </div>

      {naverAccount.connected ? (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">메인</span>
                <span className="text-blue-600">{naverAccount.email}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                네이버 블로그: <span className="text-blue-600">블로그 방문하기</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">확인</span>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">등록된 계정이 없습니다</p>
          <p className="text-gray-400 text-sm">네이버 계정을 추가하여 블로그 자동화를 시작하세요</p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-700 flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            첫 번째 계정 추가
          </button>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <p className="text-yellow-800 text-sm">
          <strong>보안 안내:</strong> 계정 정보는 안전하게 암호화되어 저장됩니다. 본인 계정만 사용하시기 바랍니다.
        </p>
      </div>
    </div>
  )
}