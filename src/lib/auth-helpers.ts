import { auth } from './firebase'
import { User } from 'firebase/auth'

// 이메일 검증 함수
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 비밀번호 강도 검사
export const isStrongPassword = (password: string): boolean => {
  // 최소 8자, 대소문자, 숫자, 특수문자 포함
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// 사용자 권한 확인
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser
}

// 사용자 정보 안전하게 가져오기
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// 사용자 UID 안전하게 가져오기
export const getCurrentUserUID = (): string | null => {
  return auth.currentUser?.uid || null
}

// 로그인 시도 제한 (간단한 클라이언트 사이드 제한)
const loginAttempts: { [key: string]: { count: number; lastAttempt: number } } = {}

export const checkLoginAttempts = (email: string): boolean => {
  const maxAttempts = 5
  const lockoutTime = 15 * 60 * 1000 // 15분

  const userAttempts = loginAttempts[email]
  if (!userAttempts) return true

  const now = Date.now()
  if (now - userAttempts.lastAttempt > lockoutTime) {
    // 잠금 시간이 지나면 초기화
    delete loginAttempts[email]
    return true
  }

  return userAttempts.count < maxAttempts
}

export const recordLoginAttempt = (email: string, success: boolean) => {
  if (success) {
    // 성공시 기록 삭제
    delete loginAttempts[email]
  } else {
    // 실패시 카운트 증가
    const now = Date.now()
    if (loginAttempts[email]) {
      loginAttempts[email].count++
      loginAttempts[email].lastAttempt = now
    } else {
      loginAttempts[email] = { count: 1, lastAttempt: now }
    }
  }
}

// Firebase 에러 메시지 한국어 변환
export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': '이미 사용중인 이메일입니다.',
    'auth/weak-password': '비밀번호가 너무 약합니다. (최소 6자)',
    'auth/invalid-email': '유효하지 않은 이메일 형식입니다.',
    'auth/user-not-found': '등록되지 않은 이메일입니다.',
    'auth/wrong-password': '비밀번호가 틀렸습니다.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/too-many-requests': '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
    'auth/user-disabled': '비활성화된 계정입니다.',
    'auth/operation-not-allowed': '이 로그인 방법은 허용되지 않습니다.',
    'auth/invalid-verification-code': '인증 코드가 올바르지 않습니다.',
    'auth/invalid-verification-id': '인증 ID가 올바르지 않습니다.',
  }
  
  return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.'
}