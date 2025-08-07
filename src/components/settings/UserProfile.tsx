'use client'

import { useState, useEffect } from 'react'
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { useHydration } from '@/hooks/useHydration'
import { getFirebaseErrorMessage } from '@/lib/auth-helpers'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, Clock, Edit3, Save, X, Lock, Shield, AlertTriangle } from 'lucide-react'

export default function UserProfile() {
  const hydrated = useHydration()
  const { user, setUser, logout } = useAuthStore()
  const router = useRouter()
  
  const [isEditingName, setIsEditingName] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // 비밀번호 변경 상태
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  
  // 계정 탈퇴 상태
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  // 비밀번호 검증 함수
  const validatePassword = (password: string): string => {
    if (!password) return '비밀번호를 입력해주세요.'
    if (password.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.'
    if (!/(?=.*[a-z])/.test(password)) return '소문자를 포함해야 합니다.'
    if (!/(?=.*[A-Z])/.test(password)) return '대문자를 포함해야 합니다.'
    if (!/(?=.*\d)/.test(password)) return '숫자를 포함해야 합니다.'
    if (!/(?=.*[@$!%*?&])/.test(password)) return '특수문자(@$!%*?&)를 포함해야 합니다.'
    return ''
  }

  // 비밀번호 변경
  const handleChangePassword = async () => {
    if (!auth.currentUser || !user?.email) return

    setPasswordError('')
    setPasswordSuccess('')

    // 비밀번호 검증
    const newPasswordError = validatePassword(passwordData.newPassword)
    if (newPasswordError) {
      setPasswordError(newPasswordError)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('새 비밀번호는 현재 비밀번호와 달라야 합니다.')
      return
    }

    setIsLoading(true)
    try {
      // 현재 비밀번호로 재인증
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      
      // 비밀번호 변경
      await updatePassword(auth.currentUser, passwordData.newPassword)
      
      setPasswordSuccess('비밀번호가 성공적으로 변경되었습니다.')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setIsChangingPassword(false)
      
      setTimeout(() => setPasswordSuccess(''), 3000)
    } catch (error: any) {
      console.error('비밀번호 변경 오류:', error)
      setPasswordError(getFirebaseErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  // 계정 탈퇴
  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return

    setDeleteError('')

    // 이메일 로그인 사용자는 비밀번호 필요
    if (!isGoogleUser && !deleteConfirmPassword) {
      setDeleteError('현재 비밀번호를 입력해주세요.')
      return
    }

    setIsDeletingAccount(true)
    try {
      // 이메일 로그인 사용자만 재인증 필요
      if (!isGoogleUser && user?.email) {
        const credential = EmailAuthProvider.credential(user.email, deleteConfirmPassword)
        await reauthenticateWithCredential(auth.currentUser, credential)
      }
      
      // 계정 삭제
      await deleteUser(auth.currentUser)
      
      // 로컬 상태 정리
      logout()
      
      // 로그인 페이지로 리다이렉트
      router.push('/auth')
    } catch (error: any) {
      console.error('계정 삭제 오류:', error)
      setDeleteError(getFirebaseErrorMessage(error.code))
    } finally {
      setIsDeletingAccount(false)
    }
  }

  // Google 로그인 사용자 확인
  const isGoogleUser = user?.providerData?.[0]?.providerId === 'google.com'

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

        {/* 성공/에러 메시지 */}
        {passwordSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm">{passwordSuccess}</span>
          </div>
        )}

        {/* 비밀번호 변경 (이메일 로그인 사용자만) */}
        {!isGoogleUser && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-600" />
                비밀번호 변경
              </h4>
              <button
                onClick={() => {
                  setIsChangingPassword(!isChangingPassword)
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordError('')
                  setPasswordSuccess('')
                }}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                {isChangingPassword ? '취소' : '변경하기'}
              </button>
            </div>

            {isChangingPassword && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-red-800 text-sm">{passwordError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="현재 비밀번호를 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    새 비밀번호
                  </label>
                  <div className="mb-2 text-xs text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      <span>필요 조건:</span>
                      <span className={passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        8자+
                      </span>
                      <span className={/(?=.*[a-z])/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                        소문자
                      </span>
                      <span className={/(?=.*[A-Z])/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                        대문자
                      </span>
                      <span className={/(?=.*\d)/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                        숫자
                      </span>
                      <span className={/(?=.*[@$!%*?&])/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                        특수문자
                      </span>
                    </div>
                  </div>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="새 비밀번호를 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="새 비밀번호를 다시 입력하세요"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? '변경 중...' : '비밀번호 변경'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Google 로그인 사용자 안내 */}
        {isGoogleUser && (
          <div className="border-t pt-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 text-sm font-medium">Google 계정으로 로그인</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Google 계정으로 로그인하신 경우 비밀번호 변경은 Google 계정 설정에서 가능합니다.
              </p>
            </div>
          </div>
        )}

        {/* 계정 탈퇴 */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              계정 탈퇴
            </h4>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              계정 탈퇴
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            계정을 탈퇴하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </p>

          {showDeleteConfirm && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="mb-4">
                <h5 className="font-medium text-red-900 mb-2">정말로 계정을 탈퇴하시겠습니까?</h5>
                <p className="text-red-800 text-sm">이 작업은 되돌릴 수 없습니다. 모든 데이터가 삭제됩니다.</p>
              </div>

              {deleteError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800 text-sm">{deleteError}</span>
                </div>
              )}

              {!isGoogleUser && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    현재 비밀번호를 입력해주세요
                  </label>
                  <input
                    type="password"
                    value={deleteConfirmPassword}
                    onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="현재 비밀번호"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount || (!isGoogleUser && !deleteConfirmPassword)}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isDeletingAccount ? '탈퇴 처리 중...' : '계정 탈퇴 확인'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmPassword('')
                    setDeleteError('')
                  }}
                  className="flex-1 py-3 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}