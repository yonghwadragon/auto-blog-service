// auto-blog-service/src/components/form/Toggle.tsx
// Toggle 컴포넌트: ON/OFF 상태를 전환하는 토글 스위치를 렌더링합니다.

'use client';

import React from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  labelPosition?: 'left' | 'right';
  showLabels?: boolean;
  onLabel?: string;
  offLabel?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  error,
  className = '',
  size = 'md',
  color = 'blue',
  labelPosition = 'right',
  showLabels = false,
  onLabel = 'ON',
  offLabel = 'OFF',
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  // 크기별 스타일
  const sizeStyles = {
    sm: {
      container: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      container: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      container: 'w-14 h-8',
      thumb: 'w-6 h-6',
      translate: 'translate-x-6',
    },
  };

  // 색상별 스타일
  const colorStyles = {
    blue: checked ? 'bg-blue-600' : 'bg-gray-200',
    green: checked ? 'bg-green-600' : 'bg-gray-200',
    red: checked ? 'bg-red-600' : 'bg-gray-200',
    yellow: checked ? 'bg-yellow-600' : 'bg-gray-200',
    purple: checked ? 'bg-purple-600' : 'bg-gray-200',
  };

  const currentSize = sizeStyles[size];
  const currentColor = colorStyles[color];

  const toggleElement = (
    <div className="flex items-center space-x-3">
      {/* 왼쪽 라벨 */}
      {showLabels && (
        <span className={`text-sm ${checked ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
          {offLabel}
        </span>
      )}

      {/* 토글 스위치 */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative inline-flex items-center ${currentSize.container} rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${currentColor}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
      >
        <span
          className={`
            ${currentSize.thumb} bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out
            ${checked ? currentSize.translate : 'translate-x-0.5'}
          `}
        />
      </button>

      {/* 오른쪽 라벨 */}
      {showLabels && (
        <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          {onLabel}
        </span>
      )}
    </div>
  );

  const labelElement = (
    <div className="flex-1">
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {label}
        </span>
      )}
      {description && (
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
          {description}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {labelPosition === 'left' && labelElement}
      {toggleElement}
      {labelPosition === 'right' && labelElement}
    </div>
  );
};

export default Toggle;