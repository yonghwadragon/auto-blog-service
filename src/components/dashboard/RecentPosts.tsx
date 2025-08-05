// src/components/dashboard/RecentPosts.tsx
// 최근 작성한 글 목록

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FileText, PenTool } from 'lucide-react'
import { Button } from '@/components/ui/button'

const dummyPosts = [
  { id: 1, title: '춘천 닭갈비 맛집 탐방', status: '작성중', createdAt: '2025-08-01' },
  { id: 2, title: '강릉 커피거리 리뷰', status: '완료', createdAt: '2025-07-28' },
]

export default function RecentPosts() {
  return (
    <Card className="mt-8 shadow-none border-0 bg-transparent">
    <CardHeader className="bg-transparent px-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">최근 작성한 글</CardTitle>
    </CardHeader>
    <CardContent className="px-0">
        {dummyPosts.length === 0 ? (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FileText className="w-8 h-8 text-green-500" />
            </div>
            <div className="font-semibold text-gray-900 mb-2 text-lg">아직 작성한 글이 없습니다</div>
            <div className="text-gray-500 mb-6">첫 번째 맛집 글을 AI로 작성해보세요!</div>
            <Link href="/write">
            <button className="px-5 py-2.5 rounded-full font-semibold text-white bg-green-500 hover:bg-green-600 shadow hover:shadow-md transition">
                <PenTool className="w-4 h-4 inline-block mr-2" />
                글쓰기 시작하기
            </button>
            </Link>
        </div>
        ) : (
        <div className="flex flex-col gap-4">
            {dummyPosts.map((post) => (
            <div
                key={post.id}
                className="bg-white rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center border border-green-100 shadow group hover:shadow-lg transition"
            >
                <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-base">{post.title}</span>
                    <span className="ml-2">
                    <span className="inline-block bg-green-100 text-green-700 rounded-full px-3 py-0.5 text-xs font-semibold">{post.status}</span>
                    </span>
                </div>
                <span className="text-xs text-gray-400">{post.createdAt}</span>
                </div>
                <div className="mt-4 md:mt-0">
                <Link href="/posts">
                    <button className="px-4 py-1.5 rounded-full font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition text-xs">전체 보기</button>
                </Link>
                </div>
            </div>
            ))}
        </div>
        )}
    </CardContent>
    </Card>
  )
}