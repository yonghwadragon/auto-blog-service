// auto-blog-service/src/components/form/Textarea.tsx
// Textarea 컴포넌트: 다양한 기능을 가진 텍스트 영역 입력 필드를 렌더링합니다.

'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
  showCharCount?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  value = '',
  onChange,
  onBlur,
  onFocus,
  placeholder,
  disabled = false,
  required = false,
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  maxLength,
  resize = 'vertical',
  autoResize = false,
  showCharCount = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, autoResize]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // 최대 길이 체크
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  // 기본 스타일
  const baseStyles = 'w-full border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 px-4 py-2.5 text-sm';

  // resize 스타일
  const resizeStyles = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  // 상태별 스타일
  const getTextareaStyles = () => {
    if (error) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    }
    if (isFocused) {
      return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500';
    }
    if (disabled) {
      return 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed';
    }
    return 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500';
  };

  // 문자 수 색상
  const getCharCountColor = () => {
    if (!maxLength) return 'text-gray-500';
    const percentage = (value.length / maxLength) * 100;
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    return 'text-gray-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 텍스트 영역 */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={autoResize ? 1 : rows}
        maxLength={maxLength}
        className={`
          ${baseStyles} 
          ${getTextareaStyles()}
          ${resizeStyles[resize]}
          ${autoResize ? 'overflow-hidden' : ''}
        `}
      />

      {/* 하단 정보 */}
      <div className="mt-1 flex justify-between items-center">
        <div className="flex-1">
          {/* 에러 메시지 */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          
          {/* 도움말 텍스트 */}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>

        {/* 문자 수 표시 */}
        {showCharCount && (
          <div className={`text-sm ${getCharCountColor()}`}>
            {value.length}
            {maxLength && `/${maxLength}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Textarea;