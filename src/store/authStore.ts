import { create, StateCreator } from 'zustand'
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

const authStore: StateCreator<AuthState> = (set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user: User | null) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false
  }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    isLoading: false
  })
})

export const useAuthStore = create<AuthState>()(
  persist(authStore, {
    name: 'auth-storage',
    partialize: (state) => ({ 
      isAuthenticated: state.isAuthenticated
    }),
  })
)