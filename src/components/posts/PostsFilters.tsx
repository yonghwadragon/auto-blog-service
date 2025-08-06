// ===== 12. src/components/posts/PostsFilters.tsx =====
'use client'

import { Search } from 'lucide-react'

export default function PostsFilters() {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="작성명이나 제목으로 검색"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          style={{ WebkitAppearance: 'none', fontSize: '16px' }}
        />
      </div>
      <select className="px-4 py-2 border border-gray-300 rounded-lg">
        <option>모든 상태</option>
        <option>작성중</option>
        <option>완료</option>
        <option>발행됨</option>
      </select>
      <select className="px-4 py-2 border border-gray-300 rounded-lg">
        <option>최신순</option>
        <option>오래된순</option>
      </select>
    </div>
  )
}