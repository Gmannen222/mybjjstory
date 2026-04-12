export interface FeedbackTemplate {
  id: string
  label: string
  message: string
}

export const feedbackTemplates: Record<string, FeedbackTemplate[]> = {
  bug: [
    { id: 'bug_ack', label: 'Kvitter (feil)', message: 'Takk for at du meldte fra om feilen! Vi har registrert den og ser på den.' },
    { id: 'bug_fixed', label: 'Fikset', message: 'Takk for at du meldte fra! Feilen er nå rettet. Gi beskjed om du opplever det igjen.' },
    { id: 'bug_info', label: 'Trenger mer info', message: 'Takk for rapporten! Kan du beskrive litt mer hva som skjedde? Gjerne hvilken side du var på og hva du prøvde å gjøre.' },
  ],
  suggestion: [
    { id: 'sug_thanks', label: 'Takk for forslag', message: 'Takk for forslaget! Vi tar det med i vurderingen for fremtidige oppdateringer.' },
    { id: 'sug_planned', label: 'Planlagt', message: 'Flott forslag! Dette er noe vi allerede har planer om å implementere. Følg med!' },
  ],
  wish: [
    { id: 'wish_noted', label: 'Notert', message: 'Takk for innspillet! Vi noterer ønsket for fremtidig utvikling.' },
    { id: 'wish_planned', label: 'Planlagt', message: 'Godt innspill! Dette er faktisk noe vi jobber med. Følg med for oppdateringer!' },
  ],
  other: [
    { id: 'other_thanks', label: 'Takk', message: 'Takk for tilbakemeldingen! Vi setter pris på at du tar deg tid.' },
  ],
  _common: [
    { id: 'ack', label: 'Vi ser på den', message: 'Takk for tilbakemeldingen! Vi har mottatt den og ser på den.' },
    { id: 'resolved', label: 'Løst', message: 'Vi har sett på tilbakemeldingen din og løst saken. Takk for hjelpen!' },
  ],
}

export function getTemplatesForType(type: string): FeedbackTemplate[] {
  return [...(feedbackTemplates[type] || []), ...feedbackTemplates._common]
}
