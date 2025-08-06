'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
          <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              전역 오류 발생
            </h2>
            <p className="text-gray-600 mb-6">
              애플리케이션에 심각한 오류가 발생했습니다.
            </p>
            <div className="space-x-4">
              <button
                onClick={reset}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                다시 시도
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}