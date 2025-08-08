'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { getFirebaseErrorMessage } from '@/lib/auth-helpers'
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  // 이메일 검증
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return '이메일을 입력해주세요.'
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다.'
    return ''
  }

  // 비밀번호 검증 (강한 규칙 적용)
  const validatePassword = (password: string) => {
    if (!password) return '비밀번호를 입력해주세요.'
    if (password.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.'
    if (!/(?=.*[a-z])/.test(password)) return '소문자를 포함해야 합니다.'
    if (!/(?=.*[A-Z])/.test(password)) return '대문자를 포함해야 합니다.'
    if (!/(?=.*\d)/.test(password)) return '숫자를 포함해야 합니다.'
    if (!/(?=.*[@$!%*?&])/.test(password)) return '특수문자(@$!%*?&)를 포함해야 합니다.'
    return ''
  }

  // 비밀번호 확인 검증
  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return '비밀번호 확인을 입력해주세요.'
    if (password !== confirmPassword) return '비밀번호가 일치하지 않습니다.'
    return ''
  }

  // 실시간 검증
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    let error = ''
    if (field === 'email') {
      error = validateEmail(value)
    } else if (field === 'password') {
      error = validatePassword(value)
      // 비밀번호가 변경되면 확인 비밀번호도 다시 검증
      if (formData.confirmPassword) {
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: validateConfirmPassword(value, formData.confirmPassword)
        }))
      }
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(formData.password, value)
    }
    
    setValidationErrors(prev => ({ ...prev, [field]: error }))
  }

  // 모바일 또는 배포 환경 감지 함수
  const shouldUseRedirect = () => {
    // 임시로 모든 환경에서 팝업 방식 사용 (리다이렉트 URI 설정 문제 해결을 위해)
    // 배포 환경에서는 항상 리다이렉트 사용 (COOP 정책 때문)
    // if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    //   return true
    // }
    // 모바일 기기에서만 리다이렉트 사용
    return typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // 페이지 로드 시 리다이렉트 결과 확인
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          setUser(result.user)
          setSuccess('Google 로그인 성공!')
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        }
      } catch (error: any) {
        console.error('Google Redirect Error:', error)
        setError(getFirebaseErrorMessage(error.code))
      }
    }

    handleRedirectResult()
  }, [router, setUser])

  // Google 로그인 처리 (모바일/데스크톱 구분)
  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const provider = new GoogleAuthProvider()
      
      if (shouldUseRedirect()) {
        // 배포 환경 및 모바일에서는 리다이렉트 방식 사용
        await signInWithRedirect(auth, provider)
        // 리다이렉트는 페이지를 새로고침하므로 여기서는 처리하지 않음
      } else {
        // 로컬 개발 환경 데스크톱에서만 팝업 방식 사용
        const userCredential = await signInWithPopup(auth, provider)
        setUser(userCredential.user)
        setSuccess('Google 로그인 성공!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error: any) {
      console.error('Google Auth Error:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        setError('로그인이 취소되었습니다.')
      } else if (error.code === 'auth/popup-blocked') {
        setError('팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.')
      } else {
        setError(getFirebaseErrorMessage(error.code))
      }
    } finally {
      // 리다이렉트 방식이 아닌 경우에만 로딩 해제
      if (!shouldUseRedirect()) {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // 제출 전 최종 검증
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    let confirmPasswordError = ''
    
    if (!isLogin) {
      confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)
    }

    if (emailError || passwordError || confirmPasswordError) {
      setValidationErrors({
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      })
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // 로그인
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
        setUser(userCredential.user)
        setSuccess('로그인 성공!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        // 회원가입
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        setUser(userCredential.user)
        setSuccess('회원가입 성공!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error: any) {
      console.error('Firebase Auth Error:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        customData: error.customData
      })
      
      // 특별한 경우들 처리
      if (error.code === 'auth/configuration-not-found') {
        setError('Firebase Authentication이 설정되지 않았습니다. 관리자에게 문의하세요.')
      } else if (error.code === 'auth/api-key-not-valid') {
        setError('Firebase API 키가 올바르지 않습니다. 관리자에게 문의하세요.')
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('이메일/비밀번호 로그인이 비활성화되어 있습니다. 관리자에게 문의하세요.')
      } else {
        setError(getFirebaseErrorMessage(error.code))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity min-w-0 flex-1">
              <div className="bg-green-600 text-white p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-base sm:text-xl font-semibold text-gray-900 whitespace-nowrap truncate">네이버 블로그 자동화</h1>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1 sm:gap-2 whitespace-nowrap text-sm sm:text-base flex-shrink-0"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">대시보드로 돌아가기</span>
              <span className="sm:hidden">돌아가기</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? '로그인' : '회원가입'}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base px-2">
              {isLogin ? '계정에 로그인하여 블로그 자동화를 시작하세요' : '새 계정을 만들어 시작하세요'}
            </p>
          </div>

          {/* 알림 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-800 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <style jsx>{`
              input::placeholder {
                color: #9ca3af !important;
                opacity: 1 !important;
              }
              input::-webkit-input-placeholder {
                color: #9ca3af !important;
              }
              input::-moz-placeholder {
                color: #9ca3af !important;
                opacity: 1 !important;
              }
              input:-ms-input-placeholder {
                color: #9ca3af !important;
              }
            `}</style>
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="이메일을 입력하세요"
                  style={{ 
                    fontSize: '16px',
                    WebkitAppearance: 'none',
                    WebkitBorderRadius: '8px',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              {!isLogin && (
                <div className="mb-2 text-xs text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    <span>비밀번호:</span>
                    <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      8자+
                    </span>
                    <span className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      소문자
                    </span>
                    <span className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      대문자
                    </span>
                    <span className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      숫자
                    </span>
                    <span className={/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      특수문자
                    </span>
                  </div>
                </div>
              )}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="비밀번호를 입력하세요"
                  style={{ 
                    fontSize: '16px',
                    WebkitAppearance: 'none',
                    WebkitBorderRadius: '8px',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 (회원가입 시만) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="비밀번호를 다시 입력하세요"
                    style={{ 
                      fontSize: '16px',
                      WebkitAppearance: 'none',
                      WebkitBorderRadius: '8px'
                    }}
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
            </button>
          </form>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>

          {/* Google 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full py-3 px-4 border border-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 ${
              loading
                ? 'bg-gray-100 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50'
            } text-gray-700`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? '처리 중...' : 'Google로 계속하기'}
          </button>

          {/* 로그인/회원가입 전환 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setSuccess('')
                setFormData({ email: '', password: '', confirmPassword: '' })
                setValidationErrors({ email: '', password: '', confirmPassword: '' })
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}