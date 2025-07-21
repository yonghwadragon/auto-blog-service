// auto-blog-service\src\app\settings\layout.tsx

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* 설정 관련 공통 UI (탭 등) */}
      {children}
    </section>
  );
}