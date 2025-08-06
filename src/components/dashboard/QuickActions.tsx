// ===== 9. src/components/dashboard/QuickActions.tsx =====
'use client'

import { useRouter } from 'next/navigation'
import { FileText, Upload, Settings } from 'lucide-react'

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ComponentType<any>
  onClick: () => void
  color: string
}

const QuickActionCard = ({ title, description, icon: Icon, onClick, color }: QuickActionCardProps) => (
  <div 
    className="bg-white rounded-lg p-6 shadow-sm border cursor-pointer hover:shadow-md hover:bg-gray-300 transition-all duration-200"
    onClick={onClick}
  >
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
)

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      id: 'write',
      title: "새 글 쓰기",
      description: "새 글을 업로드하고 새로 작성 글을 생성하세요",
      icon: FileText,
      color: "bg-green-500",
      onClick: () => router.push('/write')
    },
    {
      id: 'posts',
      title: "작성한 글 보기",
      description: "지금까지 작성한 모든 글을 확인하세요",
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => router.push('/posts')
    },
    {
      id: 'settings',
      title: "설정",
      description: "네이버 계정과 Gemini API를 설정하세요",
      icon: Settings,
      color: "bg-gray-500",
      onClick: () => router.push('/settings')
    }
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <QuickActionCard
            key={action.id}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            onClick={action.onClick}
          />
        ))}
      </div>
    </div>
  )
}