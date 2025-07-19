// auto-blog-service\src\components\feedback\ToastContainer.tsx
// ToastContainer 컴포넌트: Toast 메시지들을 관리하고 표시하는 컨테이너를 렌더링합니다.

'use client';

import React from 'react';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
        />
      ))}
    </div>
  );
};

export default ToastContainer;