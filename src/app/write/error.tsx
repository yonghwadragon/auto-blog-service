'use client'

export default function WriteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          글쓰기 페이지 오류
        </h2>
        <p className="text-gray-600 mb-6">
          글쓰기 페이지를 불러오는 중 문제가 발생했습니다.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            다시 시도
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            대시보드로 이동
          </button>
        </div>
      </div>
    </div>
  )
}