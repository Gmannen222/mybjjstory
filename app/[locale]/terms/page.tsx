import Link from 'next/link'

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Vilkår for bruk</h1>
      <p className="text-sm text-muted mb-8">Sist oppdatert: 9. april 2026</p>

      <div className="prose prose-invert space-y-6 text-muted">
        <h2 className="text-xl font-bold text-foreground">1. Aksept av vilkår</h2>
        <p>
          Ved å bruke MyBJJStory godtar du disse vilkårene. Hvis du ikke godtar
          vilkårene, kan du ikke bruke tjenesten.
        </p>

        <h2 className="text-xl font-bold text-foreground">2. Tjenestebeskrivelse</h2>
        <p>
          MyBJJStory er en gratis treningsapp for utøvere innen brasiliansk jiu-jitsu.
          Tjenesten lar deg logge treninger, dokumentere graderinger, laste opp media
          og dele med fellesskapet.
        </p>

        <h2 className="text-xl font-bold text-foreground">3. Brukerkonto</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Du logger inn via Google-konto</li>
          <li>Du er ansvarlig for aktiviteten på din konto</li>
          <li>Du kan slette kontoen din når som helst</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground">4. Brukerinnhold</h2>
        <p>Du beholder eierskapet til alt innhold du laster opp. Ved å dele innhold gir du MyBJJStory en begrenset rett til å vise innholdet i tjenesten.</p>
        <p>Du er ansvarlig for at innhold du deler:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Ikke krenker andres rettigheter</li>
          <li>Ikke er ulovlig, truende eller støtende</li>
          <li>Ikke inneholder spam eller reklame</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground">5. Akseptabel bruk</h2>
        <p>Du forplikter deg til å ikke:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Misbruke tjenesten eller andre brukere</li>
          <li>Forsøke å få uautorisert tilgang til systemer</li>
          <li>Bruke tjenesten til kommersielle formål uten avtale</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground">6. Tilgjengelighet</h2>
        <p>
          Vi tilstreber høy oppetid, men garanterer ikke uavbrutt tilgang.
          Tjenesten kan endres eller avsluttes med rimelig varsel.
        </p>

        <h2 className="text-xl font-bold text-foreground">7. Ansvarsbegrensning</h2>
        <p>
          MyBJJStory tilbys &ldquo;som den er&rdquo;. Vi er ikke ansvarlige for tap
          av data eller skade som følge av bruk av tjenesten.
        </p>

        <h2 className="text-xl font-bold text-foreground">8. Kontakt</h2>
        <p>
          Spørsmål om vilkårene? Kontakt oss på{' '}
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
