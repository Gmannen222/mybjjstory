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
      <p className="text-sm text-muted mb-8">Sist oppdatert: 10. april 2026</p>

      <div className="prose prose-invert space-y-6 text-muted">
        <h2 className="text-xl font-bold text-foreground">1. Aksept av vilkår</h2>
        <p>
          Ved å bruke MyBJJStory godtar du disse vilkårene. Hvis du ikke godtar
          vilkårene, kan du ikke bruke tjenesten.
        </p>

        <h2 className="text-xl font-bold text-foreground">2. Tjenestebeskrivelse</h2>
        <p>
          MyBJJStory er en treningsapp for utøvere innen brasiliansk jiu-jitsu.
          Tjenesten lar deg logge treninger, dokumentere graderinger, laste opp media
          og dele med fellesskapet.
        </p>

        <h2 className="text-xl font-bold text-foreground">3. Driftsform og prismodell</h2>
        <p>
          MyBJJStory er under betatesting og tilbys gratis i denne perioden.
          Vi forbeholder oss retten til å:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Innføre betaling for deler av eller hele tjenesten</li>
          <li>Endre funksjoner, innhold og tilgjengelighet</li>
          <li>Stenge tjenesten midlertidig eller permanent</li>
        </ul>
        <p>
          Dersom tjenesten endres til betaling eller legges ned, vil vi varsle
          registrerte brukere via e-post med rimelig frist, og gi mulighet til å
          laste ned egne data.
        </p>

        <h2 className="text-xl font-bold text-foreground">4. Brukerkonto</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Du logger inn via Google-konto</li>
          <li>Du er ansvarlig for aktiviteten på din konto</li>
          <li>Du kan slette kontoen din og all tilknyttet data når som helst</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground">5. Brukerinnhold</h2>
        <p>Du beholder eierskapet til alt innhold du laster opp. Ved å dele innhold gir du MyBJJStory en begrenset rett til å vise innholdet i tjenesten.</p>
        <p>Du er ansvarlig for at innhold du deler:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Ikke krenker andres rettigheter</li>
          <li>Ikke er ulovlig, truende eller støtende</li>
          <li>Ikke inneholder spam eller reklame</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground">6. Akseptabel bruk</h2>
        <p>Du forplikter deg til å ikke:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Misbruke tjenesten eller andre brukere</li>
          <li>Forsøke å få uautorisert tilgang til systemer</li>
          <li>Bruke tjenesten til kommersielle formål uten avtale</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground">7. Tilgjengelighet og dataintegritet</h2>
        <p>
          Vi tilstreber høy oppetid og sikker lagring av dine data, men kan ikke
          garantere dette under betatesting. Tjenesten kan oppleve nedetid, feil
          eller tap av data. Vi anbefaler ikke å bruke tjenesten som eneste kilde
          til lagring av viktige data i betaperioden.
        </p>

        <h2 className="text-xl font-bold text-foreground">8. Ansvarsbegrensning</h2>
        <p>
          MyBJJStory tilbys &ldquo;som den er&rdquo; uten noen form for garanti.
          Vi er ikke ansvarlige for tap av data, inntekter eller annen skade som
          følge av bruk av tjenesten.
        </p>

        <h2 className="text-xl font-bold text-foreground">9. Endringer i vilkår</h2>
        <p>
          Vi kan oppdatere disse vilkårene. Vesentlige endringer varsles via e-post
          eller tydelig melding i appen. Fortsatt bruk av tjenesten etter endringer
          innebærer aksept av de nye vilkårene.
        </p>

        <h2 className="text-xl font-bold text-foreground">10. Kontakt</h2>
        <p>
          Spørsmål om vilkårene? Kontakt oss på{' '}
          <a href="mailto:admin@mybjjstory.no" className="text-primary hover:underline">
            admin@mybjjstory.no
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
