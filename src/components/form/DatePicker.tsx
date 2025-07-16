// auto-blog-service/src/components/form/DatePicker.tsx
// DatePicker 컴포넌트: 날짜와 시간을 선택할 수 있는 UI를 제공합니다.

'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value?: string; // ISO 문자열 또는 YYYY-MM-DD 형식
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  minDate?: string;
  maxDate?: string;
  showTime?: boolean;
  format?: 'date' | 'datetime' | 'time';
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = '날짜를 선택하세요',
  disabled = false,
  required = false,
  label,
  error,
  helperText,
  className = '',
  minDate,
  maxDate,
  showTime = false,
  format = 'date',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [timeValue, setTimeValue] = useState({
    hours: selectedDate?.getHours() || 0,
    minutes: selectedDate?.getMinutes() || 0,
  });

  const datePickerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 날짜 포맷팅
  const formatDate = (date: Date | null, includeTime: boolean = false) => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    let formatted = `${year}-${month}-${day}`;
    
    if (includeTime || showTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      formatted += ` ${hours}:${minutes}`;
    }
    
    return formatted;
  };

  // 표시용 날짜 포맷팅
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    let formatted = `${year}년 ${month}월 ${day}일`;
    
    if (showTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      formatted += ` ${hours}:${minutes}`;
    }
    
    return formatted;
  };

  // 월 이동
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  // 날짜 선택
  const selectDate = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (showTime) {
      newDate.setHours(timeValue.hours);
      newDate.setMinutes(timeValue.minutes);
    }
    
    setSelectedDate(newDate);
    
    // 시간 선택이 없으면 바로 닫기
    if (!showTime) {
      setIsOpen(false);
    }
    
    onChange?.(formatDate(newDate, showTime));
  };

  // 시간 변경
  const changeTime = (type: 'hours' | 'minutes', value: number) => {
    setTimeValue(prev => ({ ...prev, [type]: value }));
    
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (type === 'hours') newDate.setHours(value);
      if (type === 'minutes') newDate.setMinutes(value);
      
      setSelectedDate(newDate);
      onChange?.(formatDate(newDate, true));
    }
  };

  // 현재 월의 날짜들 생성
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const currentMonth = firstDay.getMonth();

    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = day.getMonth() === currentMonth;
      const isToday = day.toDateString() === new Date().toDateString();
      const isSelected = !!(selectedDate && day.toDateString() === selectedDate.toDateString());
      const isDisabled = 
        !!((minDate && day < new Date(minDate)) ||
        (maxDate && day > new Date(maxDate)));

      days.push({
        date: day,
        day: day.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 기본 스타일
  const baseStyles = 'w-full border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 px-4 py-2.5 text-sm';

  // 상태별 스타일
  const getInputStyles = () => {
    if (error) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    }
    if (isOpen) {
      return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500';
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

      {/* 날짜 선택 컨테이너 */}
      <div ref={datePickerRef} className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            ${baseStyles} 
            ${getInputStyles()}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            flex items-center justify-between
          `}
        >
          <span className={selectedDate ? '' : 'text-gray-500'}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* 달력 */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
            {/* 월 네비게이션 */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => changeMonth('prev')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-lg font-semibold">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </div>
              <button
                type="button"
                onClick={() => changeMonth('next')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => day.isCurrentMonth && !day.isDisabled && selectDate(day.day)}
                  disabled={day.isDisabled}
                  className={`
                    text-center text-sm py-2 rounded transition-colors
                    ${day.isCurrentMonth 
                      ? day.isSelected 
                        ? 'bg-blue-600 text-white' 
                        : day.isToday 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-900 hover:bg-gray-100'
                      : 'text-gray-300'
                    }
                    ${day.isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                >
                  {day.day}
                </button>
              ))}
            </div>

            {/* 시간 선택 */}
            {showTime && (
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">시간:</label>
                  <select
                    value={timeValue.hours}
                    onChange={(e) => changeTime('hours', parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500">:</span>
                  <select
                    value={timeValue.minutes}
                    onChange={(e) => changeTime('minutes', parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="ml-auto px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
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

export default DatePicker;