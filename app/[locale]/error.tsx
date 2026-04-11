'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-4xl">🥋</div>
        <h2 className="text-xl font-bold">Noe gikk galt</h2>
        <p className="text-muted text-sm">
          Vi beklager — en feil oppstod. Prøv igjen, og kontakt oss hvis problemet vedvarer.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors"
        >
          Prøv igjen
        </button>
      </div>
    </div>
  )
}
