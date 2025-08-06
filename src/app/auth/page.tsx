'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
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
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">네이버 블로그 자동화</h1>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              대시보드로 돌아가기
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
            <p className="text-gray-600">
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