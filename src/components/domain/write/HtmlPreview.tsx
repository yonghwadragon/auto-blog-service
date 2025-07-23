// auto-blog-service/src/components/form/HtmlPreview.tsx
// HtmlPreview 컴포넌트: HTML 콘텐츠를 안전하게 미리보기로 렌더링합니다.

import React, { useState, useEffect } from 'react';

interface HtmlPreviewProps {
  content: string;
  title?: string;
  isLoading?: boolean;
  className?: string;
  onContentChange?: (content: string) => void;
  editable?: boolean;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({
  content,
  title = "미리보기",
  isLoading = false,
  className = "",
  onContentChange,
  editable = false
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  const handleSave = () => {
    if (onContentChange) {
      onContentChange(editContent);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <div className={`border border-gray-300 rounded-lg p-6 bg-white ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">콘텐츠를 생성하고 있습니다...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-lg p-6 bg-white ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {editable && content && (
          <div className="flex gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                편집
              </button>
            )}
          </div>
        )}
      </div>

      {!content && !isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📝</div>
            <p>아직 생성된 콘텐츠가 없습니다.</p>
            <p className="text-sm mt-1">제목과 설명을 입력하고 '자동 생성' 버튼을 클릭하세요.</p>
          </div>
        </div>
      ) : editMode ? (
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm"
            placeholder="HTML 콘텐츠를 입력하세요..."
          />
          <div className="text-sm text-gray-600">
            * HTML 태그를 직접 편집할 수 있습니다.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div 
            className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-64"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="text-sm text-gray-600">
            * 위 내용은 실제 블로그에 게시될 HTML 콘텐츠입니다.
          </div>
        </div>
      )}
    </div>
  );
};

export default HtmlPreview;