// auto-blog-service\src\app\posts\layout.tsx

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* 여기에 게시글 목록 공통 네비게이션이나 레이아웃 삽입 가능 */}
      {children}
    </section>
  );
}