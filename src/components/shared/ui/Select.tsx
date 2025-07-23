// auto-blog-service\src\components\shared\ui\Select.tsx                                           │        
// Select 컴포넌트: 드롭다운 선택 상자를 렌더링합니다.

'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  required = false,
  label,
  error,
  helperText,
  className = '',
  size = 'md',
  searchable = false,
  clearable = false,
  multiple = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (value ? value.split(',') : []) : []
  );
  
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 필터링
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // 선택된 옵션 찾기
  const selectedOption = options.find(opt => opt.value === value);

  // 단일 선택 처리
  const handleSelectOption = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      
      setSelectedValues(newValues);
      onChange?.(newValues.join(','));
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // 클리어 처리
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      setSelectedValues([]);
      onChange?.('');
    } else {
      onChange?.('');
    }
  };

  // 기본 스타일
  const baseStyles = 'relative w-full border rounded-md transition-colors duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1';

  // 상태별 스타일
  const getSelectStyles = () => {
    if (error) {
      return 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500';
    }
    if (isOpen) {
      return 'border-blue-500 focus-within:border-blue-500 focus-within:ring-blue-500';
    }
    if (disabled) {
      return 'border-gray-200 bg-gray-50 cursor-not-allowed';
    }
    return 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-blue-500';
  };

  // 다중 선택 라벨 표시
  const renderMultipleLabels = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length}개 선택됨`;
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

      {/* 선택 컨테이너 */}
      <div ref={selectRef} className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            ${baseStyles} 
            ${sizeStyles[size]} 
            ${getSelectStyles()}
            ${disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'}
            flex items-center justify-between
          `}
        >
          {/* 검색 가능한 입력 */}
          {searchable && isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색..."
              className="flex-1 outline-none bg-transparent"
              autoFocus
            />
          ) : (
            /* 선택된 값 표시 */
            <span className={`flex-1 ${!value && !multiple ? 'text-gray-500' : ''}`}>
              {multiple 
                ? renderMultipleLabels()
                : selectedOption?.label || placeholder
              }
            </span>
          )}

          {/* 버튼들 */}
          <div className="flex items-center space-x-1">
            {/* 클리어 버튼 */}
            {clearable && (value || selectedValues.length > 0) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* 드롭다운 화살표 */}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 드롭다운 옵션 */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 text-sm">
                {searchTerm ? '검색 결과가 없습니다' : '옵션이 없습니다'}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => !option.disabled && handleSelectOption(option.value)}
                  className={`
                    px-4 py-2 cursor-pointer text-sm transition-colors duration-150
                    ${option.disabled 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-900 hover:bg-gray-100'
                    }
                    ${multiple && selectedValues.includes(option.value) 
                      ? 'bg-blue-50 text-blue-600' 
                      : ''
                    }
                    ${!multiple && option.value === value 
                      ? 'bg-blue-50 text-blue-600' 
                      : ''
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {multiple && selectedValues.includes(option.value) && (
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
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