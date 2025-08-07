'use client'

import Link from 'next/link'
import { LogIn, Shield, User, FileText, Settings, PenTool } from 'lucide-react'

export default function AuthRequiredMessage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">블로그 자동화 대시보드</h1>
        <p className="text-gray-600">AI로 똑똑한 블로그를 쉽고 빠르게 작성해보세요</p>
      </div>

      {/* 로그인 안내 카드 */}
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          로그인이 필요합니다
        </h2>
        <p className="text-gray-600 mb-6">
          블로그 자동화 기능을 이용하려면 먼저 로그인해주세요.
        </p>
        <Link
          href="/auth"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-flex items-center gap-2 font-medium"
        >
          <LogIn className="w-4 h-4" />
          로그인하기
        </Link>
      </div>

      {/* 기능 미리보기 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: PenTool,
            title: '글쓰기',
            description: 'AI가 도와주는 자동 글쓰기',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            icon: FileText,
            title: '작성한 글',
            description: '내가 작성한 모든 글 관리',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          },
          {
            icon: Settings,
            title: '설정',
            description: 'API 키와 계정 설정',
            color: 'text-gray-600',
            bgColor: 'bg-gray-100'
          }
        ].map((feature) => (
          <div key={feature.title} className="bg-white rounded-lg shadow-sm border p-6 opacity-60">
            <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              로그인이 필요합니다
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}