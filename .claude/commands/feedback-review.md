Hent alle tilbakemeldinger fra brukere og gi en strukturert gjennomgang.

## Steg

1. Kjør denne kommandoen for å hente alle tilbakemeldinger med brukerinfo:

```
npx supabase db query --linked "SELECT f.id, f.type, f.message, f.status, f.admin_note, f.admin_reply, f.contact_email, f.created_at, p.display_name, p.belt_rank FROM feedback f LEFT JOIN profiles p ON f.user_id = p.id ORDER BY CASE f.status WHEN 'new' THEN 1 WHEN 'read' THEN 2 WHEN 'resolved' THEN 3 END, f.created_at DESC"
```

2. Presenter tilbakemeldingene i denne strukturen:

### Oversikt
- Totalt antall tilbakemeldinger
- Fordeling per status (ny/lest/løst)
- Fordeling per type (forslag/ønske/feil/annet)

### Nye tilbakemeldinger (krever handling)
Gå gjennom hver ny tilbakemelding og vurder:
- **Feilrapporter (bug)**: Undersøk om feilen kan reproduseres i koden. Sjekk relevante filer og gi konkret analyse av årsak + forslag til fix.
- **Forslag/ønsker**: Vurder gjennomførbarhet, estimert kompleksitet (liten/middels/stor), og om det passer med eksisterende arkitektur.
- **Annet**: Kategoriser og vurder om det krever handling.

### Anbefalte handlinger
Lag en prioritert liste over hva som bør gjøres:
1. Kritiske feil som bør fikses umiddelbart
2. Viktige forslag som gir verdi
3. Ting som kan vente

### Foreslåtte admin-svar
For hver ny tilbakemelding, foreslå et kort, vennlig svar på norsk som kan sendes tilbake til brukeren.

## Viktig
- Analyser feilrapporter ved å faktisk lese relevant kode i prosjektet
- Bruk norsk i all output
- Vær konkret og handlingsrettet, ikke generell
