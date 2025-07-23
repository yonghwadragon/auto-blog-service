// auto-blog-service\src\components\domain\write\WriteForm.tsx
// WriteForm 컴포넌트: 블로그 글 작성에 필요한 입력 필드와 기능을 포함하는 폼을 렌더링합니다.

import React from "react";
import HtmlPreview from "@/components/form/HtmlPreview";
import Textarea from "@/components/form/Textarea";

const WriteForm: React.FC = () => {
  return (
    <div>
      <h2>글 작성</h2>
      <Textarea name="content" placeholder="내용을 입력하세요" />
      <HtmlPreview htmlContent="<p>미리보기 영역</p>" />
    </div>
  );
};

export default WriteForm;
