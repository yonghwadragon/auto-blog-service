// auto-blog-service/src/components/hooks/useModal.ts
// useModal 훅: 모달의 열림/닫힘 상태 및 관련 기능을 관리하는 커스텀 훅입니다.

'use client';

import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export interface UseModalReturn {
  isOpen: boolean;
  data: any;
  open: (data?: any) => void;
  close: () => void;
  toggle: () => void;
}

export function useModal(initialState: boolean = false): UseModalReturn {
  const [state, setState] = useState<ModalState>({
    isOpen: initialState,
    data: null
  });

  const open = useCallback((data?: any) => {
    setState({
      isOpen: true,
      data
    });
  }, []);

  const close = useCallback(() => {
    setState({
      isOpen: false,
      data: null
    });
  }, []);

  const toggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    open,
    close,
    toggle
  };
}

// 다중 모달 관리를 위한 훅
export interface ModalConfig {
  [key: string]: ModalState;
}

export interface UseMultiModalReturn {
  modals: ModalConfig;
  open: (modalKey: string, data?: any) => void;
  close: (modalKey: string) => void;
  toggle: (modalKey: string) => void;
  closeAll: () => void;
  isAnyOpen: boolean;
}

export function useMultiModal(initialModals: string[] = []): UseMultiModalReturn {
  const [modals, setModals] = useState<ModalConfig>(() => {
    return initialModals.reduce((acc, key) => {
      acc[key] = { isOpen: false, data: null };
      return acc;
    }, {} as ModalConfig);
  });

  const open = useCallback((modalKey: string, data?: any) => {
    setModals(prev => ({
      ...prev,
      [modalKey]: {
        isOpen: true,
        data
      }
    }));
  }, []);

  const close = useCallback((modalKey: string) => {
    setModals(prev => ({
      ...prev,
      [modalKey]: {
        isOpen: false,
        data: null
      }
    }));
  }, []);

  const toggle = useCallback((modalKey: string) => {
    setModals(prev => ({
      ...prev,
      [modalKey]: {
        isOpen: !prev[modalKey]?.isOpen,
        data: prev[modalKey]?.data || null
      }
    }));
  }, []);

  const closeAll = useCallback(() => {
    setModals(prev => {
      const newModals = { ...prev };
      Object.keys(newModals).forEach(key => {
        newModals[key] = { isOpen: false, data: null };
      });
      return newModals;
    });
  }, []);

  const isAnyOpen = Object.values(modals).some(modal => modal.isOpen);

  return {
    modals,
    open,
    close,
    toggle,
    closeAll,
    isAnyOpen
  };
}

// 확인 모달 전용 훅
export interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface UseConfirmModalReturn {
  isOpen: boolean;
  options: ConfirmModalOptions | null;
  confirm: (options: ConfirmModalOptions) => Promise<boolean>;
  close: () => void;
}

export function useConfirmModal(): UseConfirmModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmModalOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((confirmOptions: ConfirmModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(confirmOptions);
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    // 애니메이션 시간을 고려해서 options 초기화
    setTimeout(() => {
      setOptions(null);
    }, 300);
  }, [resolvePromise]);

  const handleConfirm = useCallback(async () => {
    if (options?.onConfirm) {
      await options.onConfirm();
    }
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
    setTimeout(() => {
      setOptions(null);
    }, 300);
  }, [options, resolvePromise]);

  const handleCancel = useCallback(() => {
    if (options?.onCancel) {
      options.onCancel();
    }
    close();
  }, [options, close]);

  return {
    isOpen,
    options: options ? {
      ...options,
      onConfirm: handleConfirm,
      onCancel: handleCancel
    } : null,
    confirm,
    close
  };
}