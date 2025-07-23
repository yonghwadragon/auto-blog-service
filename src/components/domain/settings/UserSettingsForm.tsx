// auto-blog-service/src/components/domain/settings/UserSettingsForm.tsx
// UserSettingsForm 컴포넌트: 사용자 설정 정보를 편집하는 폼을 렌더링합니다.

import React from "react";
import Toggle from "@/components/shared/ui/Toggle";

const UserSettingsForm: React.FC = () => {
  return (
    <form>
      <h2>사용자 설정</h2>
      <label>
        공개 여부
        <Toggle />
      </label>
    </form>
  );
};

export default UserSettingsForm;
