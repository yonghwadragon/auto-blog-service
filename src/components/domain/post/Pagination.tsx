// auto-blog-service/src/components/table/Pagination.tsx
// Pagination 컴포넌트: 데이터 목록의 페이지네이션 컨트롤을 렌더링합니다.

'use client';

import { useMemo } from 'react';
import Button from '../../shared/ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPerPage?: boolean;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  totalItems?: number;
  perPageOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPerPage = false,
  itemsPerPage = 10,
  onItemsPerPageChange,
  totalItems,
  perPageOptions = [5, 10, 20, 50, 100]
}: PaginationProps) {
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const delta = 2; // 현재 페이지 주변에 보여줄 페이지 수

    if (totalPages <= 7) {
      // 페이지가 7개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 첫 페이지
      pages.push(1);

      if (currentPage <= delta + 1) {
        // 시작 부분
        for (let i = 2; i <= Math.min(delta + 3, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > delta + 3) {
          pages.push('...');
        }
      } else if (currentPage >= totalPages - delta) {
        // 끝 부분
        if (totalPages > delta + 3) {
          pages.push('...');
        }
        for (let i = Math.max(totalPages - delta - 2, 2); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // 중간 부분
        pages.push('...');
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i);
        }
        pages.push('...');
      }

      // 마지막 페이지
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  if (totalPages <= 1 && !showPerPage) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
      {/* 아이템 정보 및 페이지당 항목 수 선택 */}
      <div className="flex items-center gap-4">
        {totalItems && (
          <div className="text-sm text-gray-700">
            총 <span className="font-medium">{totalItems}</span>개 중{' '}
            <span className="font-medium">{startItem}</span>-
            <span className="font-medium">{endItem}</span>개 표시
          </div>
        )}

        {showPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-700">
              페이지당:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {perPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 페이지네이션 버튼 */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* 이전 페이지 버튼 */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>

          {/* 페이지 번호 버튼들 */}
          {pageNumbers.map((pageNumber, index) => (
            <div key={index}>
              {pageNumber === '...' ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <Button
                  type="button"
                  variant={pageNumber === currentPage ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber as number)}
                  className="px-3 py-1 min-w-[32px]"
                >
                  {pageNumber}
                </Button>
              )}
            </div>
          ))}

          {/* 다음 페이지 버튼 */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}