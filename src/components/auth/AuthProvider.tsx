'use client'

import { useEffect } from 'react'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { useHydration } from '@/hooks/useHydration'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useHydration()
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    if (!hydrated) return
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 닉네임이 없으면 이메일 앞부분으로 기본 설정
        if (!user.displayName && user.email) {
          try {
            const defaultDisplayName = user.email.split('@')[0]
            await updateProfile(user, {
              displayName: defaultDisplayName
            })
            // 업데이트된 사용자 정보를 다시 가져오기
            await user.reload()
            setUser(auth.currentUser)
          } catch (error) {
            console.error('기본 닉네임 설정 오류:', error)
            setUser(user)
          }
        } else {
          setUser(user)
        }
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [setUser, setLoading, hydrated])

  return <>{children}</>
}