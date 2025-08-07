// ===== 19. src/store/settingsStore.ts =====
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NaverAccount {
  id: string
  alias: string
  email: string
  blogUrl?: string
  connected: boolean
}

interface SettingsStore {
  geminiApiKey: string
  naverAccounts: NaverAccount[]
  setGeminiApiKey: (key: string) => void
  addNaverAccount: (account: Omit<NaverAccount, 'id'>) => void
  updateNaverAccount: (id: string, account: Partial<NaverAccount>) => void
  deleteNaverAccount: (id: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      naverAccounts: [{ id: '1', alias: '메인', email: '@yongyonghwa', connected: true }],
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      addNaverAccount: (account) => set((state) => ({
        naverAccounts: [...state.naverAccounts, { ...account, id: Date.now().toString() }]
      })),
      updateNaverAccount: (id, updatedAccount) => set((state) => ({
        naverAccounts: state.naverAccounts.map(acc => 
          acc.id === id ? { ...acc, ...updatedAccount } : acc
        )
      })),
      deleteNaverAccount: (id) => set((state) => ({
        naverAccounts: state.naverAccounts.filter(acc => acc.id !== id)
      })),
    }),
    {
      name: 'settings-store',
      skipHydration: true,
    }
  )
)