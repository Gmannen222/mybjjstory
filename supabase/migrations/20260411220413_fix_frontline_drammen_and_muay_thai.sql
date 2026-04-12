-- Frontline Academy Drammen — moved to Åssiden (was Gulskogen)
UPDATE public.academies SET
  address = 'Ingeniør Rybergsgate 101, 3027 Drammen'
WHERE id = 'frontline_academy_drammen';

-- Frontline Muay Thai is NOT part of Frontline Academy
UPDATE public.academies SET
  affiliation = NULL
WHERE id = 'frontline_muay_thai';
