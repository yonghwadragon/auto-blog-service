import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from 'firebase/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false
      }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false
      })
    }),
    {
      name: 'auth-storage',
      // user 객체는 직렬화가 복잡하므로 isAuthenticated만 저장
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated
      }),
      // hydration 안전성을 위한 설정
      skipHydration: true,
    }
  )
)