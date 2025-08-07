// ===== 17. src/components/settings/NaverAccountSettings.tsx =====
'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { User, Plus, Edit, Trash2, X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

export default function NaverAccountSettings() {
  const { naverAccounts, addNaverAccount, updateNaverAccount, deleteNaverAccount } = useSettingsStore()
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null)
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    alias: '',
    naverId: '',
    password: '',
    blogUrl: ''
  })

  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(naverAccounts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAccounts = naverAccounts.slice(startIndex, endIndex)

  const handleOpenModal = (editing = false, accountId?: string) => {
    setIsEditing(editing)
    setEditingAccountId(accountId || null)
    if (editing && accountId) {
      const account = naverAccounts.find(acc => acc.id === accountId)
      if (account) {
        setFormData({
          alias: account.alias,
          naverId: account.email,
          password: '',
          blogUrl: account.blogUrl || ''
        })
      }
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
    setShowSuccess(false)
    setEditingAccountId(null)
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
    
    if (isEditing && editingAccountId) {
      updateNaverAccount(editingAccountId, {
        alias: formData.alias,
        email: formData.naverId,
        blogUrl: formData.blogUrl,
        connected: true
      })
    } else {
      addNaverAccount({
        alias: formData.alias,
        email: formData.naverId,
        blogUrl: formData.blogUrl,
        connected: true
      })
    }
    
    setShowSuccess(true)
    // 3초 후 성공 메시지 숨기고 모달 닫기
    setTimeout(() => {
      setShowSuccess(false)
      handleCloseModal()
    }, 3000)
  }

  const handleDeleteAccount = () => {
    if (deletingAccountId) {
      deleteNaverAccount(deletingAccountId)
    }
    setShowDeleteModal(false)
    setDeletingAccountId(null)
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

      {naverAccounts.length > 0 ? (
        <>
          <div className="space-y-3">
            {currentAccounts.map(account => (
              <div key={account.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{account.alias}</span>
                      <span className="text-blue-600">{account.email}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      네이버 블로그: {account.blogUrl ? (
                        <span className="text-blue-600">블로그 방문하기</span>
                      ) : (
                        <span className="text-gray-400">URL 미설정</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs whitespace-nowrap">확인</span>
                    <button 
                      onClick={() => handleOpenModal(true, account.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setDeletingAccountId(account.id)
                        setShowDeleteModal(true)
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                총 {naverAccounts.length}개 중 {startIndex + 1}-{Math.min(endIndex, naverAccounts.length)}개 표시
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={`naver-accounts-pagination-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
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

              {/* 성공 메시지 */}
              {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    {isEditing ? '계정이 수정되었습니다.' : '계정이 저장되었습니다.'}
                  </span>
                </div>
              )}

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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base bg-white text-gray-900 placeholder-gray-500"
                    style={{ WebkitAppearance: 'none', fontSize: '16px' }}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base bg-white text-gray-900 placeholder-gray-500"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck="false"
                    inputMode="text"
                    style={{ WebkitAppearance: 'none', fontSize: '16px' }}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base bg-white text-gray-900 placeholder-gray-500"
                    autoComplete="off"
                    style={{ WebkitAppearance: 'none', fontSize: '16px' }}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base bg-white text-gray-900 placeholder-gray-500"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck="false"
                    inputMode="url"
                    style={{ WebkitAppearance: 'none', fontSize: '16px' }}
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

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-6">
              {/* 모달 헤더 */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  계정 삭제
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">
                    {deletingAccountId ? naverAccounts.find(acc => acc.id === deletingAccountId)?.alias : ''}
                  </span> 계정을 삭제하시겠습니까?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}