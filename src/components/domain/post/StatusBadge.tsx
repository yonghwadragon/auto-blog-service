// auto-blog-service/src/components/table/StatusBadge.tsx
// StatusBadge 컴포넌트: 다양한 상태를 시각적으로 표시하는 배지를 렌더링합니다.

'use client';

import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'pending' | 'draft' | 'published' | 'scheduled';
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'soft';
}

export default function StatusBadge({ 
  status, 
  children, 
  size = 'md', 
  variant = 'soft' 
}: StatusBadgeProps) {
  const getStatusStyles = () => {
    const baseStyles = {
      success: {
        solid: 'bg-green-600 text-white border-green-600',
        outline: 'bg-transparent text-green-600 border-green-600',
        soft: 'bg-green-50 text-green-700 border-green-200'
      },
      error: {
        solid: 'bg-red-600 text-white border-red-600',
        outline: 'bg-transparent text-red-600 border-red-600',
        soft: 'bg-red-50 text-red-700 border-red-200'
      },
      warning: {
        solid: 'bg-yellow-600 text-white border-yellow-600',
        outline: 'bg-transparent text-yellow-600 border-yellow-600',
        soft: 'bg-yellow-50 text-yellow-700 border-yellow-200'
      },
      info: {
        solid: 'bg-blue-600 text-white border-blue-600',
        outline: 'bg-transparent text-blue-600 border-blue-600',
        soft: 'bg-blue-50 text-blue-700 border-blue-200'
      },
      pending: {
        solid: 'bg-gray-600 text-white border-gray-600',
        outline: 'bg-transparent text-gray-600 border-gray-600',
        soft: 'bg-gray-50 text-gray-700 border-gray-200'
      },
      draft: {
        solid: 'bg-gray-600 text-white border-gray-600',
        outline: 'bg-transparent text-gray-600 border-gray-600',
        soft: 'bg-gray-50 text-gray-700 border-gray-200'
      },
      published: {
        solid: 'bg-green-600 text-white border-green-600',
        outline: 'bg-transparent text-green-600 border-green-600',
        soft: 'bg-green-50 text-green-700 border-green-200'
      },
      scheduled: {
        solid: 'bg-purple-600 text-white border-purple-600',
        outline: 'bg-transparent text-purple-600 border-purple-600',
        soft: 'bg-purple-50 text-purple-700 border-purple-200'
      }
    };

    return baseStyles[status][variant];
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getStatusIcon = () => {
    const iconClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    
    switch (status) {
      case 'success':
      case 'published':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pending':
        return (
          <svg className={`${iconClass} animate-spin`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'draft':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'scheduled':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <span className={`
      inline-flex items-center gap-1 font-medium rounded-full border
      ${getStatusStyles()}
      ${getSizeStyles()}
    `}>
      {getStatusIcon()}
      {children}
    </span>
  );
}