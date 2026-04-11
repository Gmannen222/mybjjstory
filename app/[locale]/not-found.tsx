import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-4xl">🤔</div>
        <h2 className="text-xl font-bold">Fant ikke siden</h2>
        <p className="text-muted text-sm">
          Denne siden finnes ikke — kanskje den ble flyttet eller slettet.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors"
        >
          Gå til forsiden
        </Link>
      </div>
    </div>
  )
}
