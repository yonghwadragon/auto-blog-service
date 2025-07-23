// auto-blog-service\src\components\shared\ui\Input.tsx
// Input 컴포넌트: 다양한 타입과 기능을 가진 입력 필드를 렌더링합니다.

'use client';

import React, { useState } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  label,
  error,
  helperText,
  className = '',
  size = 'md',
  icon,
  iconPosition = 'left',
  clearable = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChange?.('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // 입력 필드 기본 스타일
  const baseInputStyles = 'w-full border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

  // 상태별 스타일
  const getInputStyles = () => {
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

  // 아이콘 스타일
  const iconStyles = 'absolute top-1/2 transform -translate-y-1/2 text-gray-400';

  // 패스워드 아이콘
  const PasswordIcon = () => (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {showPassword ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.12 15.12M19.367 18.364L5.636 5.636" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  // 클리어 버튼
  const ClearButton = () => (
    <button
      type="button"
      onClick={handleClear}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 입력 컨테이너 */}
      <div className="relative">
        {/* 왼쪽 아이콘 */}
        {icon && iconPosition === 'left' && (
          <div className={`${iconStyles} left-3`}>
            {icon}
          </div>
        )}

        {/* 입력 필드 */}
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${baseInputStyles} 
            ${sizeStyles[size]} 
            ${getInputStyles()}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${clearable && value ? 'pr-10' : ''}
          `}
        />

        {/* 오른쪽 아이콘 */}
        {icon && iconPosition === 'right' && !clearable && type !== 'password' && (
          <div className={`${iconStyles} right-3`}>
            {icon}
          </div>
        )}

        {/* 패스워드 표시/숨김 버튼 */}
        {type === 'password' && <PasswordIcon />}

        {/* 클리어 버튼 */}
        {clearable && value && type !== 'password' && <ClearButton />}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* 도움말 텍스트 */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;