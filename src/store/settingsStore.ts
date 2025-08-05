// ===== 19. src/store/settingsStore.ts =====
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NaverAccount {
  email: string
  connected: boolean
}

interface SettingsStore {
  geminiApiKey: string
  naverAccount: NaverAccount
  setGeminiApiKey: (key: string) => void
  setNaverAccount: (account: NaverAccount) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      naverAccount: { email: '@yongyonghwa', connected: true },
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setNaverAccount: (account) => set({ naverAccount: account }),
    }),
    {
      name: 'settings-store',
    }
  )
)