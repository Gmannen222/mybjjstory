# MyBJJStory — Helhetlig forbedring

Vi skal ta en helhetlig gjennomgang av MyBJJStory og løfte appen fra MVP til noe som virkelig skiller seg ut. Bruk `/build-feature` for å bygge features end-to-end med agent-teamet, og `/team-review` for kvalitetssjekk underveis.

Start med å lese CLAUDE.md, memory-filer og gjeldende kodebase for kontekst.

---

## 1. Forenkle navigasjonen

Dagens struktur har 4 hovedtabs + 5 items i "Mer"-meny. Det er for mye. Foreslå en ny informasjonsarkitektur:

**Vurder denne retningen:**
- **Trening** — treningslogg, kalender, statistikk (hovedfeature)
- **Fremgang** — gradering, beltehistorikk, sparring-utvikling, statistikk over tid
- **Sosialt** — feed, akademier, sparringspartnere
- **Profil** — personlig info, skader (flyttes hit), innstillinger, feedback

Skader er en profil-ting, ikke en hovedfeature. Gradering og fremgang henger sammen. Evaluer hva som gir mening og implementer ny navigasjonsstruktur.

---

## 2. Sparringsevaluering (ny feature)

Brukere skal kunne evaluere sparringsøkter med partnere:

- Etter en treningsøkt kan du legge til sparringsrunder
- Velg partner (fra følger-liste eller søk)
- Evaluer på flere akser: intensitet, teknikk, flyt, læring, stemning
- Skala 1-5 eller emoji-basert
- Partneren kan se evalueringen **kun hvis du deler den** (opt-in)
- Over tid: se utvikling med hver partner (graf/trend)
- "Mine sparringspartnere" — oversikt med antall runder, siste sparring, gjennomsnittscore

### Personvern-regler:
- Evalueringer er PRIVATE som default
- Du velger aktivt å dele med partneren
- Partneren kan ikke se din score før du deler
- RLS må sikre dette strengt

---

## 3. Ekstern data-integrasjon

Undersøk og planlegg integrasjoner med treningsplattformer:

### Garmin Connect
- Hent treningsdata via Garmin API (puls, varighet, kaloriforbruk)
- Match BJJ-økter med Garmin-aktiviteter basert på tidspunkt
- Vis pulsdata og intensitetssoner i treningsloggen

### Apple Health (HealthKit)
- Les treningsdata fra Apple Health via PWA/web API
- Puls, steg, søvn — vis som kontekst rundt treningsøkter
- Undersøk begrensninger for PWA vs native app

### Samsung Health
- Tilsvarende som Apple Health
- Undersøk API-tilgjengelighet

### Google Fit
- Kan være enkleste integrasjon (vi bruker Google OAuth allerede)
- Puls, aktiviteter, søvndata

**Leveranse:** En teknisk plan for hver integrasjon med realistisk vurdering av hva som er mulig i en PWA. Implementer den/de som er mest realistiske.

---

## 4. Fremgangsvisning og statistikk

Bygg en dedikert "Fremgang"-seksjon som viser utvikling over tid:

- **Treningsfrekvens** — graf over uker/måneder, streak-teller
- **Teknikk-utvikling** — hvilke teknikker trener du mest, utvikling over tid
- **Sparring-trender** — utvikling med faste partnere
- **Beltehistorikk** — tidslinje fra hvitt til nåværende belte
- **Konkurranseresultater** — medaljestatistikk, plasserings-trend
- **Skadehistorikk** — tidslinje, mønster (gjentakende skader?)
- **Sammenligning** — "denne måneden vs forrige", "dette året vs i fjor"

---

## 5. Forbedre treningsloggen

Gjør treningsloggen rikere:

- **Effort/intensitet-rating** — hvor hard var økten (RPE-skala eller enkel 1-5)
- **Treningstyper** — gi, nogi, open mat, privattimer, seminar, konkurranse-prep
- **Notater med tags** — fritekst-notater med mulighet for #tags
- **Sparringsrunder** — koble til sparringsevaluering (punkt 2)
- **Kroppsvekt** — valgfritt felt for de som følger vektklasse
- **Humør før/etter** — enkel emoji-velger

---

## 6. Generelle UX-forbedringer

- Gå gjennom alle tomme tilstander — motiverende tekst og illustrasjoner
- Loading-skjeletter på alle sider som henter data
- Offline-support — lagre treningsøkt lokalt hvis ingen nettforbindelse
- Onboarding-flow — guide nye brukere gjennom første treningsøkt
- Eksport-funksjon — eksporter treningsdata som CSV/PDF

---

## Prioritering

Bruk `/backlog` for å la product-owner prioritere. Foreslått rekkefølge:

1. **Navigasjonsforenkling** — påvirker alt annet, gjør først
2. **Forbedre treningsloggen** — kjernefeature, mest brukt
3. **Sparringsevaluering** — unik differensiator
4. **Fremgangsvisning** — gir verdi til eksisterende data
5. **Ekstern integrasjon** — research + implementer det som er realistisk
6. **UX-forbedringer** — løpende

Kjør `/team-review` etter hver feature-blokk for kvalitetssikring.
