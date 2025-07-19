// auto-blog-service/src/components/icons/LogoIcon.tsx
// LogoIcon 컴포넌트: 애플리케이션의 로고 아이콘을 렌더링합니다.

import React from 'react';

interface LogoIconProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'minimal' | 'colorful';
}

export const LogoIcon: React.FC<LogoIconProps> = ({ 
  size = 32, 
  className = '',
  variant = 'default' 
}) => {
  const getColors = () => {
    switch (variant) {
      case 'minimal':
        return {
          primary: 'currentColor',
          secondary: 'currentColor',
          accent: 'currentColor'
        };
      case 'colorful':
        return {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#06B6D4'
        };
      default:
        return {
          primary: '#1F2937',
          secondary: '#6B7280',
          accent: '#3B82F6'
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 메인 원형 배경 */}
      <circle
        cx="16"
        cy="16"
        r="14"
        fill={colors.primary}
        fillOpacity="0.1"
        stroke={colors.primary}
        strokeWidth="1.5"
      />
      
      {/* 블로그 아이콘 - 문서 형태 */}
      <rect
        x="9"
        y="8"
        width="14"
        height="16"
        rx="2"
        fill={colors.secondary}
        fillOpacity="0.2"
        stroke={colors.secondary}
        strokeWidth="1.2"
      />
      
      {/* 텍스트 라인들 */}
      <line
        x1="11"
        y1="12"
        x2="19"
        y2="12"
        stroke={colors.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="15"
        x2="21"
        y2="15"
        stroke={colors.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="18"
        x2="17"
        y2="18"
        stroke={colors.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* AI 스파크 효과 */}
      <circle
        cx="22"
        cy="10"
        r="1.5"
        fill={colors.accent}
      />
      <circle
        cx="24"
        cy="12"
        r="1"
        fill={colors.accent}
        fillOpacity="0.7"
      />
      <circle
        cx="20"
        cy="8"
        r="0.8"
        fill={colors.accent}
        fillOpacity="0.5"
      />
    </svg>
  );
};

export default LogoIcon;