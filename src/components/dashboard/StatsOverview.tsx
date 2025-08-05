// src/components/dashboard/StatsOverview.tsx
// 생동감 있는 통계 현황 카드

import { FileText, Clock, CheckCircle, Send } from 'lucide-react'

const stats = [
  { 
    label: '전체 글', 
    value: 0, 
    icon: FileText, 
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-emerald-50 to-emerald-100',
    shadowColor: 'shadow-emerald-200'
  },
  { 
    label: '작성 중', 
    value: 0, 
    icon: Clock, 
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-100',
    shadowColor: 'shadow-amber-200'
  },
  { 
    label: '완료', 
    value: 0, 
    icon: CheckCircle, 
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-100',
    shadowColor: 'shadow-green-200'
  },
  { 
    label: '발행', 
    value: 0, 
    icon: Send, 
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-100',
    shadowColor: 'shadow-purple-200'
  },
]

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative bg-white rounded-2xl p-6 shadow-lg ${stat.shadowColor} hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-green-100 overflow-hidden group`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* 배경 그라디언트 */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
          
          {/* 장식적 원형 */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold text-slate-700">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}