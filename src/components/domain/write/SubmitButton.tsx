// auto-blog-service/src/components/domain/write/SubmitButton.tsx
// SubmitButton 컴포넌트: 글쓰기 폼 제출 버튼을 렌더링합니다.

import React from "react";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <button type="submit" disabled={isLoading}>
      {isLoading ? "작성 중..." : "작성하기"}
    </button>
  );
};

export default SubmitButton;
