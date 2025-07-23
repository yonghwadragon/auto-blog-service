// auto-blog-service/src/components/feedback/LoadingSpinner.tsx
// LoadingSpinner 컴포넌트: 로딩 상태를 시각적으로 표시하는 스피너를 렌더링합니다.

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  variant = 'spinner',
  className = ''
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'secondary':
        return 'text-purple-600';
      case 'white':
        return 'text-white';
      case 'gray':
        return 'text-gray-500';
      default:
        return 'text-blue-600';
    }
  };

  const baseClasses = `${getSizeClass()} ${getColorClass()} ${className}`;

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${getSizeClass()} ${getColorClass()} bg-current rounded-full animate-pulse`}
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${baseClasses} animate-pulse`}>
        <div className="w-full h-full bg-current rounded-full opacity-75" />
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex space-x-1 items-end ${className}`}>
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-1 ${getColorClass()} bg-current rounded-sm animate-pulse`}
            style={{
              height: `${12 + (index % 2) * 8}px`,
              animationDelay: `${index * 0.1}s`,
              animationDuration: '1.2s'
            }}
          />
        ))}
      </div>
    );
  }

  // Default spinner variant
  return (
    <svg
      className={`animate-spin ${baseClasses}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// 전체 페이지 로딩 오버레이
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}> = ({ isLoading, message = '로딩 중...', children }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// 인라인 로딩 (버튼 등에서 사용)
export const InlineLoader: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}> = ({ isLoading, children, loadingText }) => {
  return (
    <>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="small" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingSpinner;