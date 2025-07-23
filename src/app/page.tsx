//auto-blog-service\src\app\page.tsx
// 메인 페이지: AI 블로그 자동 작성 서비스의 사용자 인터페이스를 렌더링합니다.

'use client';

import { useState } from 'react';
import Input from '@/components/shared/ui/Input';
import Textarea from '@/components/domain/write/Textarea';
import Select from '@/components/shared/ui/Select';
import Toggle from '@/components/domain/settings/Toggle';
import DatePicker from '@/components/shared/ui/DatePicker';
import ImageUploader from '@/components/domain/write/ImageUploader';
import Button from '@/components/shared/ui/Button';
import HtmlPreview from '@/components/domain/write/HtmlPreview';
import LoadingSpinner from '@/components/shared/feedback/LoadingSpinner';
import FullscreenModal from '@/components/shared/modal/FullscreenModal';
import { useToast } from '@/components/shared/hooks/useToast';
import { useModal } from '@/components/shared/hooks/useModal';
import { generateBlogContent } from '@/components/lib/gemini';

// 로컬 타입 정의 - 정확한 리터럴 유니온 타입 사용
interface BlogFormData {
  title: string;
  description: string;
  category: string;
  tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'humorous';
  length: 'short' | 'medium' | 'long';
  isPublic: boolean;
  includeImages: boolean;
  publishDate: string; // DatePicker에서 string을 기대하므로 string으로 변경
  images: File[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    description: '',
    category: '',
    tone: 'professional',
    length: 'medium',
    isPublic: true,
    includeImages: false,
    publishDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식으로 초기화
    images: []
  });

  // Toast 상태 관리
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: 'success'|'error'|'info'}>>([]);
  
  const showToast = (message: string, type: 'success'|'error'|'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  // Modal 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // 카테고리 옵션
  const categoryOptions = [
    { value: 'tech', label: '기술' },
    { value: 'lifestyle', label: '라이프스타일' },
    { value: 'business', label: '비즈니스' },
    { value: 'travel', label: '여행' },
    { value: 'food', label: '음식' },
    { value: 'health', label: '건강' },
    { value: 'education', label: '교육' },
    { value: 'entertainment', label: '엔터테인먼트' }
  ];

  // 톤 옵션
  const toneOptions: { value: string; label: string }[] = [
    { value: 'professional', label: '전문적' },
    { value: 'casual', label: '캐주얼' },
    { value: 'friendly', label: '친근한' },
    { value: 'formal', label: '공식적' },
    { value: 'humorous', label: '유머러스' }
  ];

  // 길이 옵션
  const lengthOptions: { value: string; label: string }[] = [
    { value: 'short', label: '짧게 (500자 이내)' },
    { value: 'medium', label: '보통 (1000자 내외)' },
    { value: 'long', label: '길게 (2000자 이상)' }
  ];

  // 폼 데이터 업데이트
  const updateFormData = (field: keyof BlogFormData, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (images: any[]) => {
    // images가 ImageFile[]일 경우 실제 파일만 추출해서 저장
    const files = images.map(img => img.file);
    updateFormData('images', files);
  };

  // 블로그 글 생성
  const handleGenerateBlog = async () => {
    // 필수 필드 검증
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('제목과 설명을 모두 입력해주세요.', 'error');
      return;
    }

    if (!formData.category) {
      showToast('카테고리를 선택해주세요.', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const apiResult = await generateBlogContent({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tone: formData.tone,
        length: formData.length,
        includeImages: formData.includeImages
      });

      if (apiResult.success && apiResult.content) {
        setGeneratedContent(apiResult.content);
        showToast('블로그 글이 성공적으로 생성되었습니다!', 'success');
      } else {
        throw new Error(apiResult.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Blog generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : '블로그 글 생성 중 오류가 발생했습니다. 다시 시도해주세요.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 전체보기 모달 열기
  const handleOpenFullscreen = () => {
    if (generatedContent) {
      openModal();
    }
  };

  // 폼 리셋
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      tone: 'professional',
      length: 'medium',
      isPublic: true,
      includeImages: false,
      publishDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식으로 초기화
      images: []
    });
    setGeneratedContent('');
    showToast('폼이 초기화되었습니다.', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 AI 블로그 자동 작성 서비스
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            간단한 정보 입력만으로 전문적인 블로그 글을 자동으로 생성하세요
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 폼 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              📝 블로그 정보 입력
            </h2>
            
            <div className="space-y-6">
              {/* 제목 */}
              <Input
                label="제목"
                placeholder="블로그 글 제목을 입력하세요"
                value={formData.title}
                onChange={(value: string) => updateFormData('title', value)}
                required
              />

              {/* 설명 */}
              <Textarea
                label="설명"
                placeholder="블로그 글에 대한 간단한 설명이나 원하는 내용을 입력하세요"
                value={formData.description}
                onChange={(value: string) => updateFormData('description', value)}
                rows={4}
                required
              />

              {/* 카테고리 */}
              <Select
                label="카테고리"
                options={categoryOptions}
                value={formData.category}
                onChange={(value: string) => updateFormData('category', value)}
                placeholder="카테고리를 선택하세요"
                required
              />

              {/* 톤 - 타입 안전성을 위한 타입 캐스팅 */}
              <Select
                label="톤 & 스타일"
                options={toneOptions}
                value={formData.tone}
                onChange={(value: string) => updateFormData('tone', value as BlogFormData['tone'])}
              />

              {/* 길이 - 타입 안전성을 위한 타입 캐스팅 */}
              <Select
                label="글 길이"
                options={lengthOptions}
                value={formData.length}
                onChange={(value: string) => updateFormData('length', value as BlogFormData['length'])}
              />

              {/* 공개 설정 */}
              <Toggle
                label="공개 설정"
                description="글을 공개적으로 게시할지 선택하세요"
                checked={formData.isPublic}
                onChange={(checked: boolean) => updateFormData('isPublic', checked)}
              />

              {/* 이미지 포함 여부 */}
              <Toggle
                label="이미지 포함"
                description="AI가 이미지 추천을 포함한 글을 작성합니다"
                checked={formData.includeImages}
                onChange={(checked: boolean) => updateFormData('includeImages', checked)}
              />

              {/* 발행일 - string 타입으로 처리 */}
              <DatePicker
                label="발행일"
                value={formData.publishDate}
                onChange={(date) => updateFormData('publishDate', typeof date === 'string' ? date : date.toISOString().split('T')[0])}
              />

              {/* 이미지 업로더 (이미지 포함이 체크된 경우) */}
              {formData.includeImages && (
                <ImageUploader
                  label="참고 이미지 (선택사항)"
                  onImagesChange={handleImageUpload}
                  maxFiles={3}
                />
              )}

              {/* 액션 버튼들 */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleGenerateBlog}
                  disabled={isLoading}
                  className="flex-1"
                  variant="primary"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner />
                      <span className="ml-2">생성 중...</span>
                    </div>
                  ) : (
                    '✨ 작성하기'
                  )}
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isLoading}
                >
                  🔄 초기화
                </Button>
              </div>
            </div>
          </div>

          {/* 결과 미리보기 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                👀 미리보기
              </h2>
              {generatedContent && (
                <Button
                  onClick={handleOpenFullscreen}
                  variant="outline"
                >
                  🔍 전체보기
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <LoadingSpinner />
                <p className="mt-4 text-lg">AI가 블로그 글을 작성하고 있습니다...</p>
                <p className="text-sm mt-2">잠시만 기다려주세요 ⏳</p>
              </div>
            ) : generatedContent ? (
              <div className="h-96">
                <HtmlPreview 
                  content={generatedContent}
                  className="h-full"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-lg font-medium">생성된 블로그 글이 여기에 표시됩니다</p>
                <p className="text-sm mt-2">좌측 폼을 작성하고 '작성하기' 버튼을 눌러보세요</p>
              </div>
            )}
          </div>
        </div>

        {/* Toast 알림 */}
        {toasts.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium ${
                  toast.type === 'success' ? 'bg-green-500' :
                  toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                {toast.message}
              </div>
            ))}
          </div>
        )}

        {/* 전체보기 모달 */}
        <FullscreenModal
          isOpen={isOpen}
          onClose={closeModal}
          title={`📖 ${formData.title || '생성된 블로그 글'}`}
        >
          <HtmlPreview content={generatedContent} />
        </FullscreenModal>

        {/* 추가 정보 섹션 */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              🚀 서비스 특징
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">AI 기반 자동 생성</h4>
                <p className="text-gray-600">최신 AI 기술로 고품질 블로그 글을 자동 생성합니다</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">빠른 생성 속도</h4>
                <p className="text-gray-600">몇 초 만에 완성된 블로그 글을 확인할 수 있습니다</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">다양한 스타일</h4>
                <p className="text-gray-600">원하는 톤과 스타일로 맞춤형 콘텐츠를 생성합니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}