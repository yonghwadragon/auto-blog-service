'use client'

import { useState, useEffect } from 'react'
import { updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { useHydration } from '@/hooks/useHydration'
import { User, Mail, Calendar, Clock, Edit3, Save, X } from 'lucide-react'

export default function UserProfile() {
  const hydrated = useHydration()
  const { user, setUser } = useAuthStore()
  const [isEditingName, setIsEditingName] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 초기값 설정
  useEffect(() => {
    if (user?.displayName) {
      setNewDisplayName(user.displayName)
    } else if (user?.email) {
      setNewDisplayName(user.email.split('@')[0])
    }
  }, [user])

  // hydration이 완료되지 않았으면 로딩 표시
  if (!hydrated) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-600">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  // 가입일과 최근 로그인 포맷팅
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return '정보 없음'
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 닉네임 변경
  const handleUpdateDisplayName = async () => {
    if (!auth.currentUser || !newDisplayName.trim()) return
    
    setIsLoading(true)
    try {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName.trim()
      })
      // 실시간으로 사용자 상태 업데이트
      setUser(auth.currentUser)
      setIsEditingName(false)
    } catch (error) {
      console.error('닉네임 변경 오류:', error)
      alert('닉네임 변경에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-gray-600" />
        사용자 정보
      </h3>

      <div className="space-y-6">
        {/* 이메일 정보 */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">이메일</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
        </div>

        {/* 닉네임 */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-600 mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600">닉네임</p>
            {isEditingName ? (
              <div className="mt-1 space-y-2">
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="닉네임 입력"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleUpdateDisplayName}
                    disabled={isLoading || !newDisplayName.trim()}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-sm">저장</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false)
                      setNewDisplayName(user.displayName || user.email?.split('@')[0] || '')
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm">취소</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <p className="font-medium text-gray-900 truncate">
                  {user.displayName || user.email?.split('@')[0] || '사용자'}
                </p>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-gray-600 hover:text-green-600 flex-shrink-0"
                  title="닉네임 수정"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 가입일 */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">가입일</p>
            <p className="font-medium text-gray-900">
              {formatDate(user.metadata?.creationTime || null)}
            </p>
          </div>
        </div>

        {/* 최근 로그인 */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">최근 로그인</p>
            <p className="font-medium text-gray-900">
              {formatDate(user.metadata?.lastSignInTime || null)}
            </p>
          </div>
        </div>

        {/* 추가 기능 (나중에 구현) */}
        <div className="border-t pt-6">
          <p className="text-gray-500 text-sm">
            비밀번호 변경과 계정 탈퇴 기능은 곧 추가될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  )
}