export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 mb-6">
          요청하신 페이지가 존재하지 않습니다.
        </p>
        <a
          href="/dashboard"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
        >
          대시보드로 이동
        </a>
      </div>
    </div>
  )
}