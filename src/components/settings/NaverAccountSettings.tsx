// ===== 17. src/components/settings/NaverAccountSettings.tsx =====
'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { User, Plus, Edit, Trash2, X } from 'lucide-react'

export default function NaverAccountSettings() {
  const { naverAccount, setNaverAccount } = useSettingsStore()
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    alias: '',
    naverId: '',
    password: '',
    blogUrl: ''
  })

  const handleOpenModal = (editing = false) => {
    setIsEditing(editing)
    if (editing) {
      setFormData({
        alias: '메인',
        naverId: naverAccount.email,
        password: '',
        blogUrl: 'https://blog.naver.com/' + naverAccount.email
      })
    } else {
      setFormData({
        alias: '',
        naverId: '',
        password: '',
        blogUrl: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      alias: '',
      naverId: '',
      password: '',
      blogUrl: ''
    })
  }

  const handleSave = () => {
    if (!formData.alias.trim() || !formData.naverId.trim() || !formData.password.trim()) {
      alert('필수 입력 항목을 모두 입력해주세요.')
      return
    }
    
    setNaverAccount({
      email: formData.naverId,
      connected: true
    })
    
    alert('네이버 계정이 저장되었습니다!')
    handleCloseModal()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">네이버 계정 관리</h2>
        </div>
        <button 
          onClick={() => handleOpenModal(false)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
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
              <button 
                onClick={() => handleOpenModal(true)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
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
          <button 
            onClick={() => handleOpenModal(false)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-700 flex items-center gap-2 mx-auto"
          >
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

      {/* 모달창 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? '네이버 계정 수정' : '네이버 계정 추가'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 폼 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    계정 별칭 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 메인 계정"
                    value={formData.alias}
                    onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    네이버 아이디 *
                  </label>
                  <input
                    type="text"
                    placeholder="네이버 아이디"
                    value={formData.naverId}
                    onChange={(e) => setFormData(prev => ({ ...prev, naverId: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호 *
                  </label>
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    블로그 URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://blog.naver.com/your-id"
                    value={formData.blogUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, blogUrl: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {isEditing ? '수정' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}