import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          Innlogging feilet
        </h1>
        <p className="text-muted">
          Noe gikk galt under innloggingen. Prøv igjen.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors"
        >
          Tilbake til forsiden
        </Link>
      </div>
    </div>
  )
}
