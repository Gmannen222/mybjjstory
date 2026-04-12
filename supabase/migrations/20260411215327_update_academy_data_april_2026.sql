-- ============================================================
-- ACADEMY DATA UPDATE — April 2026
-- Updated from current academy website research
-- ============================================================

-- Agder: Arendal BJJ — new address, now Frontline Academy affiliated
UPDATE public.academies SET
  address = 'Gaselia 12, Arendal',
  affiliation = 'Frontline Academy'
WHERE id = 'arendal_bjj';

-- Agder: Kristiansand BJJ — rebranded to Kristiansand Grappling, Team Carvalho
UPDATE public.academies SET
  name = 'Kristiansand Grappling',
  affiliation = 'Team Carvalho'
WHERE id = 'kristiansand_bjj';

-- Agder: Kristiansand Kampsport Senter — Roy Dean Academy affiliation
UPDATE public.academies SET
  affiliation = 'Roy Dean Academy'
WHERE id = 'kristiansand_kampsport_senter';

-- Agder: Flekkerøy Kampsport Klubb — does NOT offer BJJ (Kali Sikaran/kickboxing only)
UPDATE public.academies SET
  address = 'Sildenestangen 50, 4625 Kristiansand',
  is_active = false
WHERE id = 'flekkeroy_kampsport_klubb';

-- Innlandet: Kimura Gjøvik — has own website now, updated address
UPDATE public.academies SET
  website_url = 'https://kimuragjovik.no',
  address = 'Storgata 20, 2815 Gjøvik'
WHERE id = 'kimura_gjovik';

-- Innlandet: Kimura Lillehammer — rebranded, moved
UPDATE public.academies SET
  name = 'Tvekamp Kimura Lillehammer',
  address = 'Slipervegen 2, 2609 Lillehammer'
WHERE id = 'kimura_lillehammer';

-- Møre og Romsdal: Storm BJJ — confirmed address
UPDATE public.academies SET
  address = 'Kråmyrvegen 3, 6007 Ålesund'
WHERE id = 'storm_brazilian_jiu_jitsu';

-- Møre og Romsdal: Molde Kampsportsenter — Roy Dean Academy, address spelling
UPDATE public.academies SET
  address = 'Plutovegen 1, 6419 Molde',
  affiliation = 'Roy Dean Academy'
WHERE id = 'molde_kampsportsenter';

-- Nordland: Bodø Jiu-jitsu — street number added, Team Trondheim BJJ
UPDATE public.academies SET
  address = 'Kongsdatterveien 24, 8028 Bodø',
  affiliation = 'Team Trondheim BJJ'
WHERE id = 'bodo_jiu_jitsu';

-- Nordland: Bodø MMA — moved to BBGym Bodø location
UPDATE public.academies SET
  address = 'Langstranda 5, 8003 Bodø'
WHERE id = 'bodo_mma';

-- Nordland: Lofoten Kampsport — Team Trondheim BJJ affiliation
UPDATE public.academies SET
  affiliation = 'Team Trondheim BJJ'
WHERE id = 'lofoten_kampsport';

-- Nordland: Vesterålen Jiu Jitsu — trains at Sortlandshallen
UPDATE public.academies SET
  address = 'Sortlandshallen, 8400 Sortland'
WHERE id = 'vesteralen_jiu_jitsu';

-- Oslo: Grip Gym — Shooters MMA affiliation
UPDATE public.academies SET
  affiliation = 'Shooters MMA'
WHERE id = 'grip_gym';

-- Oslo: Jiu-Jitsu Collective — now has address (opened Dec 2025)
UPDATE public.academies SET
  address = 'Trondheimsveien 137, 5. etasje, 0570 Oslo'
WHERE id = 'jiu_jitsu_collective';

-- Oslo: Mudo Gym Ulsrud — rebranded to Friendly Treningssenter
UPDATE public.academies SET
  name = 'Friendly Treningssenter',
  website_url = 'https://friendlyfitness.no/steder/ulsrud/',
  affiliation = NULL
WHERE id = 'mudo_gym_ulsrud';

-- Oslo: Ryen Kampsport — Roger Gracie Academy affiliation
UPDATE public.academies SET
  affiliation = 'Roger Gracie Academy'
WHERE id = 'ryen_kampsport';

-- Rogaland: Herjer MMA — website rebranded, address updated
UPDATE public.academies SET
  website_url = 'https://herjer.no',
  address = 'Longhammarvegen 25, 5536 Haugesund'
WHERE id = 'herjer_mma';

-- Rogaland: XFIT — domain changed, name updated
UPDATE public.academies SET
  name = 'XFIT Stavanger',
  website_url = 'https://xfit-stavanger.no'
WHERE id = 'xfit';

-- Troms og Finnmark: Batalje Jiu-jitsu — moved to Grønnegata 86
UPDATE public.academies SET
  address = 'Grønnegata 86, 9008 Tromsø'
WHERE id = 'batalje_jiu_jitsu';

-- Trøndelag: Levanger — minor name update
UPDATE public.academies SET
  name = 'Levanger Judo og BJJ'
WHERE id = 'levanger_judoklubb_og_bjj';

-- Trøndelag: Trondheim BJJ — branded as Team Trondheim BJJ
UPDATE public.academies SET
  name = 'Team Trondheim BJJ'
WHERE id = 'trondheim_bjj';

-- Vestfold og Telemark: GFTeam Sandefjord — rebranded, moved, new website
UPDATE public.academies SET
  name = 'Sandefjord Kampsport',
  website_url = 'https://sandefjordkampsport.no',
  address = 'Krokemoveien 63, 3224 Sandefjord'
WHERE id = 'gfteam_sandefjord';

-- Vestfold og Telemark: Gladiator Gym — BANKRUPT
UPDATE public.academies SET
  address = 'Bentsrudsvingen 6, 3083 Holmestrand',
  is_active = false
WHERE id = 'gladiator_gym';

-- Vestfold og Telemark: Larvik Kampsport — domain changed, Team Valhall
UPDATE public.academies SET
  website_url = 'https://larvikkampsport.com',
  affiliation = 'Team Valhall'
WHERE id = 'larvik_kampsport';

-- Vestfold og Telemark: Orion MMA — full name, city corrected, address found
UPDATE public.academies SET
  name = 'Orion MMA Academy',
  city = 'Tønsberg',
  address = 'Makeveien 2, 3112 Tønsberg'
WHERE id = 'orion_mma';

-- Vestland: Bergen Grappling — BJJ Globetrotters affiliation
UPDATE public.academies SET
  affiliation = 'BJJ Globetrotters'
WHERE id = 'bergen_grappling';

-- Viken: Bærum Ju Jitsu Klubb — NOT Brazilian Jiu-Jitsu (traditional JJN)
UPDATE public.academies SET
  address = 'Gamle Ringeriksvei 6, 1369 Stabekk',
  is_active = false
WHERE id = 'baerum_ju_jitsu_klubb';

-- Viken: Ippon Judoklubb — now also formally offers BJJ
UPDATE public.academies SET
  name = 'Ippon Judo & BJJ'
WHERE id = 'ippon_judoklubb';

-- Viken: Modum Kampsport — BJJ Globetrotters affiliation
UPDATE public.academies SET
  affiliation = 'BJJ Globetrotters'
WHERE id = 'modum_kampsport';

-- Viken: Nesodden Grappling — Team Carvalho affiliation
UPDATE public.academies SET
  affiliation = 'Team Carvalho'
WHERE id = 'nesodden_grappling';

-- Viken: Novus Academy Lørenskog — moved
UPDATE public.academies SET
  address = 'Boecks gate 12, 1473 Lørenskog'
WHERE id = 'novus_academy_lorenskog';

-- Viken: Rambukk — Checkmat affiliation
UPDATE public.academies SET
  affiliation = 'Checkmat'
WHERE id = 'rambukk';

-- Viken: Drammen Kampsport — correct name
UPDATE public.academies SET
  name = 'Drammen Kampsportsenter'
WHERE id = 'drammen_kampsport';

-- Viken: Frontline Muay Thai Jessheim — address found
UPDATE public.academies SET
  address = 'Valhallavegen 10a, 2060 Gardermoen'
WHERE id = 'frontline_muay_thai_jessheim';

-- Viken: Moss Jiu-jitsu — address found
UPDATE public.academies SET
  address = 'Rabekkgata 5, 1523 Moss'
WHERE id = 'moss_jiu_jitsu';

-- Viken: Sentrum Sarpsborg — correct name, address found
UPDATE public.academies SET
  name = 'Sentrum Kampsport Sarpsborg',
  address = 'Vestengveien 40, 1725 Sarpsborg'
WHERE id = 'sentrum_sarpsborg';

-- Viken: Halden Combat — rebranded to Heat Halden, Gracie affiliation
UPDATE public.academies SET
  name = 'Heat Halden',
  affiliation = 'Gracie Jiu-Jitsu'
WHERE id = 'halden_combat';
