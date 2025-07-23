// auto-blog-service\src\components\domain\settings\PasswordChangeModal.tsx
// PasswordChangeModal 컴포넌트: 사용자 비밀번호 변경 기능을 제공하는 모달 대화 상자를 렌더링합니다.

import React from "react";
import ConfirmModal from "@/components/modal/ConfirmModal";

const PasswordChangeModal: React.FC = () => {
  return (
    <ConfirmModal title="비밀번호 변경" onConfirm={() => {}}>
      새 비밀번호를 입력하세요.
    </ConfirmModal>
  );
};

export default PasswordChangeModal;
