// ===== 13. src/components/posts/PostsList.tsx =====
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePostStore } from '@/store/postStore'
import { FileText, Plus, Eye, Edit, Trash2, X } from 'lucide-react'

export default function PostsList() {
  const router = useRouter()
  const { posts, deletePost } = usePostStore()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null)

  const handleDeletePost = () => {
    if (deletingPostId !== null) {
      deletePost(deletingPostId)
    }
    setShowDeleteModal(false)
    setDeletingPostId(null)
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center shadow-sm border">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">작성한 글이 없습니다</h3>
        <p className="text-gray-500 mb-6">첫 번째 맛집 글을 AI로 작성해보세요!</p>
        <button 
          onClick={() => router.push('/write')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" />
          글쓰기 시작하기
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium text-gray-900">글 목록</h3>
      </div>
      <div className="divide-y">
        {posts.map(post => (
          <div key={post.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{post.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>{post.category}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    post.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status === 'published' ? '발행됨' : post.status === 'completed' ? '완료' : '작성중'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setDeletingPostId(post.id)
                    setShowDeleteModal(true)
                  }}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-6">
              {/* 모달 헤더 */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  글 삭제
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">
                    {deletingPostId ? posts.find(post => post.id === deletingPostId)?.title : ''}
                  </span> 글을 삭제하시겠습니까?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletingPostId(null)
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleDeletePost}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}