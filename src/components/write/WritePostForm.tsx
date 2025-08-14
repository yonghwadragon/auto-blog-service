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

    // Python 스크립트 실행 상태
    const [isRunningScript, setIsRunningScript] = useState(false)
    const [scriptMessage, setScriptMessage] = useState('')
    const [progress, setProgress] = useState(0)
    const [taskId, setTaskId] = useState('')
    const [errorDetails, setErrorDetails] = useState('')

    /** 작업 상태 폴링 */
    const pollTaskStatus = async (taskId: string) => {
      const maxAttempts = 120 // 2분 동안 폴링
      let attempts = 0
      
      const poll = async () => {
        attempts++
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL || 'https://naver-blog-server.onrender.com'}/api/blog/task/${taskId}`)
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          
          const data = await response.json()
          
          // 진행률 업데이트
          setProgress(data.progress || 0)
          
          // 상태별 메시지 설정
          if (data.status === 'pending') {
            setScriptMessage('작업 대기 중...')
          } else if (data.status === 'in_progress') {
            setScriptMessage('네이버 블로그 포스팅 진행 중...')
          } else if (data.status === 'completed') {
            setScriptMessage('네이버 블로그 포스팅 완료!')
            setProgress(100)
            
            // 포스트를 완료 상태로 저장
            const post = {
              id: Date.now(),
              ...newPost,
              status: 'published' as const,
              createdAt: new Date().toISOString(),
              image: null,
            }
            addPost(post)
            
            // 3초 후 포스트 목록으로 이동
            setTimeout(() => {
              router.push('/posts')
            }, 3000)
            
            setIsRunningScript(false)
            return
          } else if (data.status === 'failed') {
            setScriptMessage('포스팅 실패')
            setErrorDetails(data.error || '알 수 없는 오류가 발생했습니다.')
            setProgress(0)
            setIsRunningScript(false)
            return
          }
          
          // 최대 시도 횟수 체크
          if (attempts >= maxAttempts) {
            setScriptMessage('작업 시간 초과')
            setErrorDetails('작업이 너무 오래 걸리고 있습니다. 다시 시도해주세요.')
            setIsRunningScript(false)
            return
          }
          
          // 1초 후 다시 폴링
          setTimeout(poll, 1000)
          
        } catch (error) {
          console.error('폴링 오류:', error)
          
          if (attempts >= maxAttempts) {
            setScriptMessage('연결 오류')
            setErrorDetails('서버와의 연결에 문제가 발생했습니다.')
            setIsRunningScript(false)
            return
          }
          
          // 오류 시 2초 후 재시도
          setTimeout(poll, 2000)
        }
      }
      
      poll()
    }

    /** Python 스크립트 실행 */
    const handleRunPythonScript = async () => {
      setIsRunningScript(true)
      setScriptMessage('작업 시작 중...')
      setProgress(0)
      setErrorDetails('')
      
      // 선택된 네이버 계정 정보 가져오기
      const selectedAccount = naverAccounts.find(account => account.id === newPost.selectedNaverAccount)
      
      if (!selectedAccount) {
        setScriptMessage('네이버 계정을 찾을 수 없습니다')
        setErrorDetails('선택된 네이버 계정 정보가 올바르지 않습니다.')
        setIsRunningScript(false)
        return
      }
      
      if (!selectedAccount.email) {
        setScriptMessage('계정 정보 부족')
        setErrorDetails('네이버 계정 정보가 선택되지 않았습니다.')
        setIsRunningScript(false)
        return
      }
      
      try {
        const response = await fetch('/api/run-python-script', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postData: {
              title: newPost.tags, // tags가 실제 블로그 제목
              content: newPost.content,
              category: newPost.category,
              tags: newPost.tags
            },
            naverAccount: {
              id: selectedAccount.email
              // No password needed for manual login
            }
          })
        })

        const result = await response.json()
        
        if (result.task_id) {
          // 작업 ID 저장하고 폴링 시작
          setTaskId(result.task_id)
          setScriptMessage('작업이 시작되었습니다')
          setProgress(5)
          
          // 상태 폴링 시작
          pollTaskStatus(result.task_id)
        } else {
          throw new Error(result.message || '작업 생성에 실패했습니다')
        }
        
      } catch (error) {
        console.error('API 호출 실패:', error)
        setScriptMessage('요청 실패')
        setErrorDetails(`서버와의 통신 중 오류가 발생했습니다.\n오류: ${error instanceof Error ? error.message : String(error)}`)
        setIsRunningScript(false)
      }
    }

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
        // 마지막 단계에서 모든 필드 검증 후 Python 스크립트 실행
        if (!newPost.content.trim()) {
          alert('내용을 입력해주세요.')
          return
        }
        if (!newPost.selectedNaverAccount.trim()) {
          alert('네이버 계정을 선택해주세요.')
          return
        }
        
        // Python 스크립트 실행
        handleRunPythonScript()
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
<span className="whitespace-nowrap">AI로 내용 생성</span>
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
                  <span className="text-sm whitespace-nowrap">설정 API키 등록 필요</span>
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
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                className="px-4 sm:px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white text-gray-900"
                style={{ fontSize: '16px' }}
              >
<span className="whitespace-nowrap">이전 단계</span>
              </button>
            ) : (
              <button
                onClick={() => router.back()}
                className="px-4 sm:px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white text-gray-900"
                style={{ fontSize: '16px' }}
              >
<span className="whitespace-nowrap">이전</span>
              </button>
            )}
            <button
              onClick={handleSavePost}
              className="px-4 sm:px-6 py-3 border border-blue-300 rounded-lg hover:bg-blue-50 bg-white text-blue-600"
              style={{ fontSize: '16px' }}
            >
<span className="whitespace-nowrap">임시저장</span>
            </button>
            <button
              onClick={handleNextStep}
              disabled={isRunningScript}
              className={`${
                isRunningScript 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center gap-2`}
            >
              <span className="whitespace-nowrap">
                {isRunningScript 
                  ? '포스팅 중...' 
                  : (currentStep === 4 ? '완료' : '다음 단계')
                }
              </span>
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* 임시저장 성공 알림 */}
          {showNotification && (
            <div className="fixed top-4 right-4 z-50 animate-in fade-in duration-300">
              <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium whitespace-nowrap">임시저장되었습니다</span>
              </div>
            </div>
          )}

          {/* 개선된 진행률 표시 모달 */}
          {scriptMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  {/* 제목 */}
                  <div className="flex items-center gap-3 mb-4">
                    {scriptMessage.includes('완료') ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : scriptMessage.includes('실패') || errorDetails ? (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {scriptMessage.includes('완료') ? '포스팅 완료' : 
                       scriptMessage.includes('실패') || errorDetails ? '포스팅 실패' : '네이버 블로그 포스팅'}
                    </h3>
                  </div>

                  {/* 상태 메시지 */}
                  <p className="text-gray-600 mb-4">{scriptMessage}</p>

                  {/* 진행률 바 */}
                  {isRunningScript && !errorDetails && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">진행률</span>
                        <span className="text-sm font-medium text-gray-700">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 오류 세부사항 */}
                  {errorDetails && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-red-800 mb-2">오류 세부사항:</h4>
                      <pre className="text-sm text-red-700 whitespace-pre-wrap">{errorDetails}</pre>
                    </div>
                  )}

                  {/* 작업 ID (디버깅용) */}
                  {taskId && (
                    <div className="text-xs text-gray-400 mb-4">
                      작업 ID: {taskId}
                    </div>
                  )}

                  {/* 버튼 */}
                  <div className="flex gap-3">
                    {(scriptMessage.includes('완료') || errorDetails) && (
                      <button
                        onClick={() => {
                          setScriptMessage('')
                          setErrorDetails('')
                          setProgress(0)
                          setTaskId('')
                        }}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                      >
                        닫기
                      </button>
                    )}
                    
                    {errorDetails && (
                      <button
                        onClick={() => {
                          setScriptMessage('')
                          setErrorDetails('')
                          setProgress(0)
                          setTaskId('')
                          handleRunPythonScript()
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        다시 시도
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }