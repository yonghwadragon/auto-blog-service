// auto-blog-service\src\components\domain\post\TableRow.tsx
// TableRow 컴포넌트: 테이블 내의 개별 행을 렌더링합니다.

'use client';

import { ReactNode } from 'react';

interface TableRowProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
}

export default function TableRow({
  children,
  selected = false,
  onClick,
  className = '',
  hover = true
}: TableRowProps) {
  return (
    <tr
      className={`
        ${hover ? 'hover:bg-gray-50' : ''}
        ${selected ? 'bg-blue-50 border-blue-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

// TableCell 컴포넌트도 함께 제공
interface TableCellProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  width?: string;
  colSpan?: number;
  rowSpan?: number;
}

export function TableCell({
  children,
  align = 'left',
  className = '',
  width,
  colSpan,
  rowSpan
}: TableCellProps) {
  const getAlignClass = () => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${getAlignClass()} ${className}`}
      style={width ? { width } : undefined}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {children}
    </td>
  );
}

// TableHeader 컴포넌트
interface TableHeaderProps {
  children: ReactNode;
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
  align?: 'left' | 'center' | 'right';
  className?: string;
  width?: string;
}

export function TableHeader({
  children,
  sortable = false,
  onSort,
  sortDirection = null,
  align = 'left',
  className = '',
  width
}: TableHeaderProps) {
  const getAlignClass = () => {
    switch (align) {
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  const getSortIcon = () => {
    if (!sortable) return null;

    if (sortDirection === null) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  return (
    <th
      className={`
        px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50
        ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
        ${className}
      `}
      style={width ? { width } : undefined}
      onClick={sortable ? onSort : undefined}
    >
      <div className={`flex items-center gap-1 ${getAlignClass()}`}>
        {children}
        {getSortIcon()}
      </div>
    </th>
  );
}