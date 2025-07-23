// auto-blog-service/src/components/hooks/usePagination.ts
// usePagination 훅: 페이지네이션 로직 및 상태를 관리하는 커스텀 훅입니다.

'use client';

import { useState, useMemo, useCallback } from 'react';

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface PaginationInfo {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startItem: number;
  endItem: number;
}

export interface UsePaginationReturn extends PaginationState, PaginationInfo {
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setTotalItems: (totalItems: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  reset: () => void;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
  initialTotalItems?: number;
}

export function usePagination({
  initialPage = 1,
  initialItemsPerPage = 10,
  initialTotalItems = 0
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [currentPage, setCurrentPageState] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);
  const [totalItems, setTotalItemsState] = useState(initialTotalItems);

  // 계산된 값들
  const paginationInfo = useMemo((): PaginationInfo => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startItem = totalItems > 0 ? startIndex + 1 : 0;
    const endItem = totalItems > 0 ? endIndex + 1 : 0;

    return {
      totalPages,
      startIndex,
      endIndex,
      hasNextPage,
      hasPreviousPage,
      startItem,
      endItem
    };
  }, [currentPage, itemsPerPage, totalItems]);

  // 페이지 설정 함수들
  const setCurrentPage = useCallback((page: number) => {
    const maxPage = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const validPage = Math.max(1, Math.min(page, maxPage));
    setCurrentPageState(validPage);
  }, [totalItems, itemsPerPage]);

  const setItemsPerPage = useCallback((newItemsPerPage: number) => {
    const validItemsPerPage = Math.max(1, newItemsPerPage);
    
    // 현재 첫 번째 아이템의 인덱스를 계산
    const currentFirstItemIndex = (currentPage - 1) * itemsPerPage;
    
    // 새로운 itemsPerPage로 해당 아이템이 포함될 페이지 계산
    const newPage = Math.floor(currentFirstItemIndex / validItemsPerPage) + 1;
    
    setItemsPerPageState(validItemsPerPage);
    setCurrentPage(newPage);
  }, [currentPage, itemsPerPage, setCurrentPage]);

  const setTotalItems = useCallback((newTotalItems: number) => {
    const validTotalItems = Math.max(0, newTotalItems);
    setTotalItemsState(validTotalItems);
    
    // 현재 페이지가 새로운 총 페이지 수를 초과하는 경우 조정
    const newTotalPages = Math.max(1, Math.ceil(validTotalItems / itemsPerPage));
    if (currentPage > newTotalPages) {
      setCurrentPageState(newTotalPages);
    }
  }, [currentPage, itemsPerPage]);

  // 네비게이션 함수들
  const nextPage = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage, setCurrentPage]);

  const previousPage = useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [currentPage, setCurrentPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  const goToLastPage = useCallback(() => {
    const lastPage = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    setCurrentPage(lastPage);
  }, [totalItems, itemsPerPage, setCurrentPage]);

  const reset = useCallback(() => {
    setCurrentPageState(initialPage);
    setItemsPerPageState(initialItemsPerPage);
    setTotalItemsState(initialTotalItems);
  }, [initialPage, initialItemsPerPage, initialTotalItems]);

  return {
    // State
    currentPage,
    itemsPerPage,
    totalItems,
    
    // Computed values
    ...paginationInfo,
    
    // Actions
    setCurrentPage,
    setItemsPerPage,
    setTotalItems,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    reset
  };
}

// 배열 데이터를 페이지네이션하는 훅
export interface UseArrayPaginationReturn<T> extends Omit<UsePaginationReturn, 'totalItems'> {
  currentData: T[];
  totalItems: number;
}

export function useArrayPagination<T>(
  data: T[],
  options: Omit<UsePaginationOptions, 'initialTotalItems'> = {}
): UseArrayPaginationReturn<T> {
  const pagination = usePagination({
    ...options,
    initialTotalItems: data.length
  });

  // 데이터가 변경될 때마다 총 아이템 수 업데이트
  useState(() => {
    pagination.setTotalItems(data.length);
  });

  // 현재 페이지의 데이터 계산
  const currentData = useMemo(() => {
    const { startIndex, endIndex } = pagination;
    return data.slice(startIndex, endIndex + 1);
  }, [data, pagination.startIndex, pagination.endIndex]);

  return {
    ...pagination,
    currentData,
    totalItems: data.length
  };
}