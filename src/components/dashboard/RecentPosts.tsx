// src/components/dashboard/RecentPosts.tsx
// 생동감 있는 최근 글 목록

import { FileText, PenTool, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// 예시 데이터 - 실제로는 API에서 가져올 데이터
const dummyPosts: { 
  id: number; 
  title: string; 
  status: string; 
  createdAt: string;
  restaurant: string;
}[] = [
  // 빈 배열로 시작하여 empty state 보여주기
]

const getStatusStyle = (status: string) => {
  switch (status) {
    case '작성 중':
      return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
    case '완료':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
    case '발행':
      return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
    default:
      return 'bg-gradient-to-r from-slate-500 to-slate-700 text-white shadow-md'
  }
}

export default function RecentPosts() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
      {/* 헤더 */}
      <div className="relative px-6 py-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-green-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-3 text-purple-600" />
            최근 작성한 글
          </h3>
          {dummyPosts.length > 0 && (
            <Link href="/posts" className="flex items-center text-sm text-purple-600 hover:text-purple-700 font-semibold group">
              전체보기 
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          )}
        </div>
        
        {/* 장식적 요소 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6">
        {dummyPosts.length === 0 ? (
          /* Empty State - 개선된 디자인 */
          <div className="text-center py-16 relative">
            {/* 배경 장식 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="text-xl font-bold text-slate-900 mb-3">아직 작성한 글이 없습니다</div>
              <div className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                AI를 활용해 첫 번째 맛집 리뷰를 작성해보세요.<br />
                사진 몇 장으로 완성도 높은 블로그 글을 만들 수 있어요!
              </div>
              <Link href="/write">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <PenTool className="w-5 h-5 mr-2" />
                  글쓰기 시작하기
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* 글 목록 */
          <div className="space-y-4">
            {dummyPosts.map((post, index) => (
              <div
                key={post.id}
                className="group p-4 border border-green-100 rounded-xl hover:shadow-lg hover:border-lime-200 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-white to-emerald-50/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-base font-semibold text-slate-900 group-hover:text-purple-700 transition-colors duration-200">
                        {post.title}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="font-medium">{post.restaurant}</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
            
            {/* 더보기 링크 */}
            <div className="pt-4 border-t border-green-100">
              <Link href="/posts" className="flex items-center justify-center py-3 text-base text-purple-600 hover:text-purple-700 font-semibold group">
                모든 글 보기 
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}