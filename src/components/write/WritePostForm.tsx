 'use client'


  import { useState } from 'react'
  import { useRouter } from 'next/navigation'
  import { usePostStore } from '@/store/postStore'
  import { useSettingsStore } from '@/store/settingsStore'
  import { useHydration } from '@/hooks/useHydration'
  import { Send, Settings, FileText, PenTool, Zap, Eye } from 'lucide-react'                               

  export default function WritePostForm() {
    const router = useRouter()
    const hydrated = useHydration()
    const { addPost } = usePostStore()
    const { geminiApiKey, naverAccounts } = useSettingsStore()

    // 새 글 상태
    const [newPost, setNewPost] = useState({
      title: '',
      content: '',
      category: '춘천',
      tags: '',
      publishType: '즉시발행',
      selectedNaverAccount: '',
    })

    /** 글 저장 */
    const handleCreatePost = () => {
      const post = {
        id: Date.now(),
        ...newPost,
        status: 'writing' as const,
        createdAt: new Date().toISOString(),
        image: null,
      }
      addPost(post)
      router.push('/posts')
    }

    /** Gemini API로 내용 생성(예시) */
    const handleGenerateWithAI = async () => {
      if (!geminiApiKey) {
        alert('Gemini API 키를 먼저 설정해주세요.')
        return
      }
      setNewPost((prev) => ({
        ...prev,
        content: `AI가 생성한 샘플 콘텐츠입니다.

${prev.title}에 대한 흥미로운 내용을 작성했습니다. 이는 실제 Gemini API 연동 시 자동으로 생성될 내용의 예시입니다.

주요 포인트:
- 관련성 높은 정보 제공
- 독자 친화적인 구성
- SEO 최적화된 내용`,
      }))
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          맞춤 블로그 글 작성
        </h2>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          {/* 데스크톱 버전 */}
          <div className="hidden md:flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              {[
                { num: 1, title: '기본 정보', desc: '작성할 주제와\n글 입력하기\n세요' },
                { num: 2, title: '사진 업로드', desc: '사진과 메\n모를 추가\n하세요' },
                { num: 3, title: '콘텐츠 생성', desc: 'AI로 블로그\n글을 생성하\n세요' },
                { num: 4, title: '미리보기', desc: '작성 결과를 확인하\n고' }
              ].map((step, idx) => (
                <div key={`step-${step.num}-${idx}`} className="flex items-center">
                  <div className="text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                        idx === 0
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.num}
                    </div>
                    <div className={`text-xs font-medium mb-1 ${
                      idx === 0 ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs whitespace-pre-line leading-tight ${
                      idx === 0 ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {step.desc}
                    </div>
                  </div>
                  {idx < 3 && <div key={`connector-${idx}`} className="w-16 h-px bg-gray-300 mx-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* 모바일 버전 - 2x2 그리드 */}
          <div className="md:hidden mb-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: 1, title: '기본 정보', desc: '작성할 주제와 글 입력하기 세요' },
                { num: 2, title: '사진 업로드', desc: '사진과 메모를 추가하세요' },
                { num: 3, title: '콘텐츠 생성', desc: 'AI로 블로그 글을 생성하세요' },
                { num: 4, title: '미리보기', desc: '작성 결과를 확인하고' }
              ].map((step, idx) => (
                <div key={`mobile-step-${step.num}-${idx}`} className="text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 mx-auto ${
                      idx === 0
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.num}
                  </div>
                  <div className={`text-xs font-medium mb-1 ${
                    idx === 0 ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-xs leading-tight ${
                    idx === 0 ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-6">
          {/* 1) 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                작업 이름 *
              </label>
              <input
                type="text"
                placeholder="예: 춘천맛집 리뷰"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                style={{ WebkitAppearance: 'none', fontSize: '16px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                블로그 글 제목
              </label>
              <input
                type="text"
                placeholder="자동 생성됩니다 (직접 입력 가능)"
                value={newPost.tags}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, tags: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                style={{ WebkitAppearance: 'none', fontSize: '16px' }}
              />
            </div>
          </div>

          {/* 2) 위치 & 발행 유형 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                위치 *
              </label>
              <select
                value={newPost.category}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                style={{ WebkitAppearance: 'none', fontSize: '16px' }}
              >
                <option>춘천</option>
                <option>강릉</option>
                <option>서울</option>
                <option>부산</option>
                <option>대구</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                발행 유형
              </label>
              <select
                value={newPost.publishType}
                onChange={(e) =>
                  setNewPost((prev) => ({
                    ...prev,
                    publishType: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                style={{ WebkitAppearance: 'none', fontSize: '16px' }}
              >
                <option>즉시발행</option>
                <option>예약발행</option>
                <option>임시저장</option>
              </select>
            </div>
          </div>

          {/* 3) 본문 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              placeholder="AI가 자동으로 생성할 내용을 입력하거나 직접 작성하세요"
              value={newPost.content}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              style={{ WebkitAppearance: 'none', fontSize: '16px' }}
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleGenerateWithAI}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                AI로 내용 생성
              </button>
            </div>
          </div>

          {/* 4) 네이버 계정 선택 */}
          {(() => {
            const safeNaverAccounts = hydrated && naverAccounts ? naverAccounts : []
            const connectedAccounts = safeNaverAccounts.filter(account => account.connected)
            
            if (connectedAccounts.length === 0) {
              return (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>네이버 계정 선택:</strong> 등록된 네이버 계정이 없습니다.
                    설정 탭에서 계정을 추가하세요.
                  </p>
                </div>
              )
            } else {
              return (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-green-800 text-sm font-medium">
                      네이버 계정 선택 ({connectedAccounts.length}개 등록됨)
                    </p>
                  </div>
                  <select
                    value={newPost.selectedNaverAccount}
                    onChange={(e) =>
                      setNewPost((prev) => ({ ...prev, selectedNaverAccount: e.target.value }))
                    }
                    className="w-full p-3 border border-green-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    style={{ WebkitAppearance: 'none', fontSize: '16px' }}
                  >
                    <option value="">발행할 네이버 계정을 선택하세요</option>
                    {connectedAccounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.alias} ({account.email})
                        {account.blogUrl ? ` - ${account.blogUrl}` : ' - URL 미설정'}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }
          })()}

          <div className="flex items-center">
            <input type="checkbox" id="agree" className="mr-2" />
            <label htmlFor="agree" className="text-sm text-gray-600">
              콘텐츠가 이용약관에 맞춰 제공
            </label>
          </div>

          {/* 5) 네비게이션 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white text-gray-900"
              style={{ fontSize: '16px' }}
            >
              이전 단계
            </button>
            <button
              onClick={handleCreatePost}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              다음 단계
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }