// ===== 2. src/app/page.tsx (루트 - 대시보드로 리다이렉트) =====
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}