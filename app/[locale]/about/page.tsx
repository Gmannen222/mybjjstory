import Link from 'next/link'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Om MyBJJStory</h1>

      <div className="mb-8 p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <p className="text-sm font-semibold text-amber-400 mb-1">Åpen beta</p>
        <p className="text-sm text-muted leading-relaxed">
          MyBJJStory er for øyeblikket i åpen betatesting. Alle er velkomne til å
          prøve appen gratis. Vi jobber kontinuerlig med forbedringer, og setter
          stor pris på tilbakemeldinger. Se{' '}
          <a href={`/${locale}/terms`} className="text-primary hover:underline">vilkårene</a>
          {' '}for informasjon om fremtidig prismodell og drift.
        </p>
      </div>

      <div className="prose prose-invert space-y-6 text-muted">
        <p className="text-lg text-foreground">
          MyBJJStory er en personlig treningsapp laget av og for utøvere innen
          brasiliansk jiu-jitsu.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8">Vår visjon</h2>
        <p>
          Hver BJJ-utøver har sin egen unike reise. Fra det første møtet med matta
          til graderinger, konkurranser og alt imellom. MyBJJStory gir deg verktøyene
          til å dokumentere og dele denne reisen.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8">Hva vi tilbyr</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Treningslogg med teknikker, varighet og notater</li>
          <li>Graderingsjournal med belteprogresjon</li>
          <li>Medieopplasting for bilder og video fra trening</li>
          <li>Sosial feed for å dele med BJJ-fellesskapet</li>
          <li>Installerbar mobilapp (PWA)</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mt-8">Del av TheBjjStory</h2>
        <p>
          MyBJJStory er en spin-off av{' '}
          <a
            href="https://thebjjstory.no"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            TheBjjStory.no
          </a>
          , som forteller den globale historien om BJJ med over 1 600 utøvere,
          stamtrær og tidslinje. Mens TheBjjStory handler om sportens historie,
          handler MyBJJStory om <strong className="text-foreground">din</strong> historie.
        </p>

        <h2 className="text-xl font-bold text-foreground mt-8">Kontakt</h2>
        <p>
          Har du spørsmål, tilbakemeldinger eller ideer? Ta kontakt på{' '}
          <a href="mailto:kontakt@mybjjstory.no" className="text-primary hover:underline">
            kontakt@mybjjstory.no
          </a>
        </p>
      </div>

      <div className="mt-12">
        <Link
          href={`/${locale}`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Tilbake til forsiden
        </Link>
      </div>
    </div>
  )
}
