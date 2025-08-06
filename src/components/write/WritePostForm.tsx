 'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePostStore } from '@/store/postStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useHydration } from '@/hooks/useHydration'
import { Send, Settings, FileText, PenTool, Zap, Eye, CheckCircle, AlertCircle, Upload, X, Camera } from 'lucide-react'                               

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

    // 알림 상태
    const [showNotification, setShowNotification] = useState(false)
    
    // 현재 진행 단계 (1: 기본 정보, 2: 사진 업로드, 3: 콘텐츠 생성, 4: 미리보기)
    const [currentStep, setCurrentStep] = useState(1)
    
    // 사진 업로드 상태
    const [uploadedPhotos, setUploadedPhotos] = useState<Array<{
      id: string;
      file: File;
      url: string;
      memo: string;
    }>>([])
    const [isDragOver, setIsDragOver] = useState(false)

    /** 임시저장 */
    const handleSavePost = () => {
      const post = {
        id: Date.now(),
        ...newPost,
        status: 'writing' as const,
        createdAt: new Date().toISOString(),
        image: null,
      }
      addPost(post)
      
      // 성공 알림 표시
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }

    /** 다음 단계로 진행 */
    const handleNextStep = () => {
      if (currentStep === 1) {
        // 1단계에서는 기본 필드만 검증하고 2단계로 이동
        if (!newPost.title.trim()) {
          alert('작업 이름을 입력해주세요.')
          return
        }
        if (!newPost.tags.trim()) {
          alert('블로그 글 제목을 입력해주세요.')
          return
        }
        if (!newPost.category.trim()) {
          alert('위치를 선택해주세요.')
          return
        }
        if (!newPost.publishType.trim()) {
          alert('발행 유형을 선택해주세요.')
          return
        }
        
        // 2단계로 이동
        setCurrentStep(2)
        return
      }
      
      if (currentStep === 4) {
        // 마지막 단계에서 모든 필드 검증 후 완료
        if (!newPost.content.trim()) {
          alert('내용을 입력해주세요.')
          return
        }
        if (!newPost.selectedNaverAccount.trim()) {
          alert('네이버 계정을 선택해주세요.')
          return
        }

        const post = {
          id: Date.now(),
          ...newPost,
          status: 'completed' as const,
          createdAt: new Date().toISOString(),
          image: null,
        }
        addPost(post)
        router.push('/posts')
        return
      }
      
      // 중간 단계들은 단순히 다음 단계로 이동
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }

    /** Gemini API로 내용 생성(예시) */
    const handleGenerateWithAI = async () => {
      if (!geminiApiKey) {
        // alert 대신 상태 표시로 처리
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

    /** 사진 업로드 핸들러 */
    const handlePhotoUpload = (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))
      
      imageFiles.forEach(file => {
        const id = Date.now() + Math.random().toString()
        const url = URL.createObjectURL(file)
        
        setUploadedPhotos(prev => [...prev, {
          id,
          file,
          url,
          memo: ''
        }])
      })
    }

    /** 드래그 오버 핸들러 */
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(true)
    }

    /** 드래그 리브 핸들러 */
    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
    }

    /** 드롭 핸들러 */
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handlePhotoUpload(files)
      }
    }

    /** 파일 선택 핸들러 */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handlePhotoUpload(files)
      }
    }

    /** 사진 삭제 */
    const removePhoto = (id: string) => {
      setUploadedPhotos(prev => {
        const photoToRemove = prev.find(p => p.id === id)
        if (photoToRemove) {
          URL.revokeObjectURL(photoToRemove.url)
        }
        return prev.filter(p => p.id !== id)
      })
    }

    /** 사진 메모 업데이트 */
    const updatePhotoMemo = (id: string, memo: string) => {
      setUploadedPhotos(prev => 
        prev.map(photo => 
          photo.id === id ? { ...photo, memo } : photo
        )
      )
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          맞춤 블로그 글 작성
        </h2>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          {/* 데스크톱 버전 - 가로 연결선 */}
          <div className="hidden md:block mb-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                {[
                  { num: 1, title: '기본 정보', desc: '작성할 주제와\n글 입력하기\n세요' },
                  { num: 2, title: '사진 업로드', desc: '사진과 메\n모를 추가\n하세요' },
                  { num: 3, title: '콘텐츠 생성', desc: 'AI로 블로그\n글을 생성하\n세요' },
                  { num: 4, title: '미리보기', desc: '작성 결과를 확인하\n고' }
                ].map((step, idx) => (
                  <div key={`desktop-step-${step.num}`} className="flex items-center">
                    <div className="text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                          step.num === currentStep
                            ? 'bg-green-600 text-white'
                            : step.num < currentStep
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step.num}
                      </div>
                      <div className={`text-xs font-medium mb-1 ${
                        step.num === currentStep ? 'text-green-800' : 
                        step.num < currentStep ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs whitespace-pre-line leading-tight ${
                        step.num === currentStep ? 'text-green-700' : 
                        step.num < currentStep ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {step.desc}
                      </div>
                    </div>
                    {idx < 3 && <div key={`desktop-connector-${step.num}`} className="w-16 h-px bg-gray-300 mx-4" />}
                  </div>
                ))}
              </div>
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
                <div key={`mobile-step-${step.num}`} className="text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 mx-auto ${
                      step.num === currentStep
                        ? 'bg-green-600 text-white'
                        : step.num < currentStep
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.num}
                  </div>
                  <div className={`text-xs font-medium mb-1 ${
                    step.num === currentStep ? 'text-green-800' : 
                    step.num < currentStep ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-xs leading-tight ${
                    step.num === currentStep ? 'text-green-700' : 
                    step.num < currentStep ? 'text-green-500' : 'text-gray-500'
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
          {/* 2단계: 사진 업로드 */}
          {currentStep === 2 && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">사진 업로드</h3>
                <p className="text-gray-600 mb-6">맛집의 사진들을 업로드하고 각각에 대한 메모를 추가해보세요.</p>
                
                {/* 드래그 앤 드롭 영역 */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    isDragOver
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    사진을 드래그하여 업로드하세요
                  </h4>
                  <p className="text-gray-600 mb-4">
                    또는 아래 버튼을 클릭하여 파일을 선택하세요
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 cursor-pointer inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    파일 선택
                  </label>
                </div>

                {/* 업로드된 사진 목록 */}
                {uploadedPhotos.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      업로드된 사진 ({uploadedPhotos.length}장)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploadedPhotos.map((photo) => (
                        <div key={photo.id} className="bg-white rounded-lg border p-4">
                          <div className="relative">
                            <img
                              src={photo.url}
                              alt="업로드된 사진"
                              className="w-full h-48 object-cover rounded-lg mb-3"
                            />
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              사진 설명
                            </label>
                            <textarea
                              value={photo.memo}
                              onChange={(e) => updatePhotoMemo(photo.id, e.target.value)}
                              placeholder="이 사진에 대한 설명을 입력하세요..."
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              rows={3}
                              style={{ fontSize: '16px' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* 1단계와 3,4단계: 기존 폼 */}
          {currentStep !== 2 && (
            <>
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
                블로그 글 제목 *
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
                발행 유형 *
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
              내용 *
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
            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={handleGenerateWithAI}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                AI로 내용 생성
              </button>
              
              {/* API 키 상태 표시 */}
              {geminiApiKey ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">사용가능합니다</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">설정에서 API키를 등록해야합니다</span>
                </div>
              )}
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
                      네이버 계정 선택 * ({connectedAccounts.length}개 등록됨)
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
              프렌차이즈 매장입니다
            </label>
          </div>
          
          </>
          )}

          {/* 네비게이션 버튼 */}
          <div className="flex gap-3">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white text-gray-900"
                style={{ fontSize: '16px' }}
              >
                이전 단계
              </button>
            ) : (
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white text-gray-900"
                style={{ fontSize: '16px' }}
              >
                이전
              </button>
            )}
            <button
              onClick={handleSavePost}
              className="px-6 py-3 border border-blue-300 rounded-lg hover:bg-blue-50 bg-white text-blue-600"
              style={{ fontSize: '16px' }}
            >
              임시저장
            </button>
            <button
              onClick={handleNextStep}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              {currentStep === 4 ? '완료' : '다음 단계'}
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* 임시저장 성공 알림 */}
          {showNotification && (
            <div className="fixed top-4 right-4 z-50 animate-in fade-in duration-300">
              <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">임시저장되었습니다</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }