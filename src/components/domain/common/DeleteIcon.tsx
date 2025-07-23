// auto-blog-service/src/components/icons/DeleteIcon.tsx
// DeleteIcon 컴포넌트: 삭제 기능을 나타내는 아이콘을 렌더링합니다.

import React from 'react';

interface DeleteIconProps {
  size?: number;
  className?: string;
  variant?: 'outline' | 'filled' | 'minimal';
  color?: 'default' | 'danger' | 'warning';
}

export const DeleteIcon: React.FC<DeleteIconProps> = ({ 
  size = 20, 
  className = '',
  variant = 'outline',
  color = 'default'
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'danger':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const colorClass = getColorClass();

  if (variant === 'filled') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${colorClass} ${className}`}
      >
        <path d="M3 6h18l-1.5 14.5c-.1 1.4-1.3 2.5-2.7 2.5H7.2c-1.4 0-2.6-1.1-2.7-2.5L3 6z"/>
        <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2h4v2H4V6h4z"/>
        <path d="M10 11v6m4-6v6"/>
      </svg>
    );
  }

  if (variant === 'minimal') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${colorClass} ${className}`}
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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
      className={`${colorClass} ${className}`}
    >
      <polyline points="3,6 5,6 21,6" />
      <path d="M19,6 L19,20 C19,21.1 18.1,22 17,22 L7,22 C5.9,22 5,21.1 5,20 L5,6" />
      <path d="M8,6 L8,4 C8,2.9 8.9,2 10,2 L14,2 C15.1,2 16,2.9 16,4 L16,6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
};

export default DeleteIcon;