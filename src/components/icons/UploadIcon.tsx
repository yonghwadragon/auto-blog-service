//auto-blog-service\src\components\icons\UploadIcon.tsx
// UploadIcon 컴포넌트: 파일 업로드 기능을 나타내는 아이콘을 렌더링합니다.

import React from 'react';

interface UploadIconProps {
  size?: number;
  className?: string;
  variant?: 'outline' | 'filled' | 'cloud' | 'plus';
  animated?: boolean;
}

export const UploadIcon: React.FC<UploadIconProps> = ({ 
  size = 24, 
  className = '',
  variant = 'outline',
  animated = false
}) => {
  const animationClass = animated ? 'animate-bounce' : '';

  if (variant === 'filled') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${animationClass} ${className}`}
      >
        <path d="M12 2L7 7h3v7h4V7h3l-5-5z"/>
        <path d="M19 18v1c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-1h2v1h10v-1h2z"/>
      </svg>
    );
  }

  if (variant === 'cloud') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${animationClass} ${className}`}
      >
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        <polyline points="16,16 12,12 8,16"/>
        <line x1="12" y1="12" x2="12" y2="21"/>
      </svg>
    );
  }

  if (variant === 'plus') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${animationClass} ${className}`}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    );
  }

  // Default outline variant
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${animationClass} ${className}`}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7,10 12,5 17,10"/>
      <line x1="12" y1="5" x2="12" y2="15"/>
    </svg>
  );
};

export default UploadIcon;