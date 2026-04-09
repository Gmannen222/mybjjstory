import Link from 'next/link'

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Personvernregler</h1>
      <p className="text-sm text-muted mb-8">Sist oppdatert: 9. april 2026</p>

      <div className="prose prose-invert space-y-6 text-muted">
        <h2 className="text-xl font-bold text-foreground">1. Hvem er vi</h2>
        <p>
          MyBJJStory er en treningsapp for utøvere innen brasiliansk jiu-jitsu.
          Tjenesten drives av MyBJJStory og er en del av TheBjjStory-familien.
        </p>

        <h2 className="text-xl font-bold text-foreground">2. Hvilke data samler vi inn</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-foreground">Kontoinformasjon:</strong> Navn, e-postadresse og profilbilde via Google-innlogging</li>
          <li><strong className="text-foreground">Profildata:</strong> Brukernavn, belte, akademi, bio — det du selv oppgir</li>
          <li><strong className="text-foreground">Treningsdata:</strong> Treningsøkter, teknikker, notater, graderinger</li>
          <li><strong className="text-foreground">Media:</strong> Bilder og videoer du laster opp</li>
          <li><strong className="text-foreground">Sosial aktivitet:</strong> Innlegg, kommentarer, reaksjoner</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground">3. Hvordan bruker vi dataene</h2>
        <p>Vi bruker dataene dine utelukkende for å:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Gi deg tilgang til tjenestens funksjoner</li>
          <li>Vise treningsstatistikk og progresjon</li>
          <li>Muliggjøre sosiale funksjoner (feed, kommentarer)</li>
        </ul>
        <p>Vi selger aldri dataene dine til tredjeparter.</p>

        <h2 className="text-xl font-bold text-foreground">4. Datalagring</h2>
        <p>
          Data lagres sikkert via Supabase (PostgreSQL) med kryptert overføring (TLS).
          Media lagres i Supabase Storage med tilgangskontroll.
        </p>

        <h2 className="text-xl font-bold text-foreground">5. Dine rettigheter</h2>
        <p>Du har rett til å:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Se all data vi har om deg</li>
          <li>Rette feil i dine data</li>
          <li>Slette kontoen din og all tilhørende data</li>
          <li>Eksportere dine data</li>
        </ul>

        <h2 className="text-xl font-bold text-foreground">6. Synlighet</h2>
        <p>
          Treningsloggen din er privat som standard. Du velger selv hva som deles
          med fellesskapet. Profilen din er skjult med mindre du aktivt velger å
          gjøre den offentlig.
        </p>

        <h2 className="text-xl font-bold text-foreground">7. Kontakt</h2>
        <p>
          For spørsmål om personvern, kontakt oss på{' '}
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
