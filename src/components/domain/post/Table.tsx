// auto-blog-service\src\components\domain\post\Table.tsx
// Table 컴포넌트: 데이터를 표 형식으로 표시하는 재사용 가능한 테이블을 렌더링합니다.

'use client';

import { ReactNode, useState } from 'react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T, K = string | number> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  selectedRows?: K[];
  onRowSelect?: (selectedRows: K[]) => void;
  rowKey?: keyof T | ((record: T) => K);
  onRowClick?: (record: T, index: number) => void;
  className?: string;
}

export default function Table<T extends Record<string, any>, K extends string | number = string | number>({
  columns,
  data,
  loading = false,
  emptyMessage = '데이터가 없습니다.',
  onSort,
  sortKey,
  sortDirection,
  selectedRows = [],
  onRowSelect,
  rowKey,
  onRowClick,
  className = ''
}: TableProps<T, K>) {
  const [internalSortKey, setInternalSortKey] = useState<string>('');
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('asc');

  const currentSortKey = sortKey !== undefined ? sortKey : internalSortKey;
  const currentSortDirection = sortDirection !== undefined ? sortDirection : internalSortDirection;

  const handleSort = (key: string) => {
    const newDirection = currentSortKey === key && currentSortDirection === 'asc' ? 'desc' : 'asc';
    
    if (onSort) {
      onSort(key, newDirection);
    } else {
      setInternalSortKey(key);
      setInternalSortDirection(newDirection);
    }
  };

  const getRowKey = (record: T, index: number): K => {
    if (rowKey) {
      return typeof rowKey === 'function' ? rowKey(record) : record[rowKey] as K;
    }
    return index as K;
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onRowSelect) return;

    if (checked) {
      const allKeys = data.map((record, index) => getRowKey(record, index));
      onRowSelect(allKeys);
    } else {
      onRowSelect([]);
    }
  };

  const handleSelectRow = (key: K, checked: boolean) => {
    if (!onRowSelect) return;

    if (checked) {
      onRowSelect([...selectedRows, key]);
    } else {
      onRowSelect(selectedRows.filter(selectedKey => selectedKey !== key));
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  const getSortIcon = (columnKey: string) => {
    if (currentSortKey !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return currentSortDirection === 'asc' ? (
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
    <div className={`overflow-hidden bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onRowSelect && (
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.width ? `w-[${column.width}]` : ''}`}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={column.sortable ? () => handleSort(String(column.key)) : undefined}
                >
                  <div className={`flex items-center gap-1 ${
                    column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'
                  }`}>
                    <span>{column.title}</span>
                    {column.sortable && getSortIcon(String(column.key))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (onRowSelect ? 1 : 0)} className="text-center py-6 text-sm text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onRowSelect ? 1 : 0)} className="text-center py-6 text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRows.includes(key);

                return (
                  <tr
                    key={String(key)}
                    onClick={() => onRowClick?.(record, index)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {onRowSelect && (
                      <td className="w-12 px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(key, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = record[column.key as keyof T];
                      return (
                        <td
                          key={String(column.key)}
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${
                            column.align === 'right'
                              ? 'text-right'
                              : column.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          }`}
                        >
                          {column.render ? column.render(value, record, index) : value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}