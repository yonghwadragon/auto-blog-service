// auto-blog-service\src\app\write\layout.tsx

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* 예: 글쓰기 가이드나 툴바 등 삽입 가능 */}
      {children}
    </section>
  );
}