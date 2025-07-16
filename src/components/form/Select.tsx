'use client';

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
  size = 'md',
}) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // 기본 스타일
  const baseSelectStyles = 'w-full border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none pr-8';

  // 상태별 스타일
  const getSelectStyles = () => {
    if (error) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    }
    if (disabled) {
      return 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed';
    }
    return 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500';
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

      {/* 셀렉트 컨테이너 */}
      <div className="relative">
        <select
          value={value}
          onChange={handleSelectChange}
          disabled={disabled}
          required={required}
          className={`
            ${baseSelectStyles}
            ${sizeStyles[size]}
            ${getSelectStyles()}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {/* 드롭다운 아이콘 */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
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

export default Select;
