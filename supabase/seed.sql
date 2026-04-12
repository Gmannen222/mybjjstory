-- Seed data for MyBJJStory demo
-- Note: These posts need real user IDs. Run after creating test accounts.

-- Demo posts for the feed (requires at least one user in profiles)
-- Run manually after first user has signed up:

-- INSERT INTO public.posts (user_id, content, post_type, created_at)
-- SELECT id, 'Fantastisk treningsøkt i dag! Drillet armbar fra guard i 30 minutter 🥋', 'text', now() - interval '1 hour'
-- FROM public.profiles LIMIT 1;

-- INSERT INTO public.posts (user_id, content, post_type, created_at)
-- SELECT id, 'Fikk endelig blått belte etter 2 år med konsistent trening! Tusen takk til instruktøren min 🏅', 'text', now() - interval '3 hours'
-- FROM public.profiles LIMIT 1;

-- INSERT INTO public.posts (user_id, content, post_type, created_at)
-- SELECT id, 'Tips til nybegynnere: fokuser på posisjon før submission. Det endret spillet mitt fullstendig.', 'text', now() - interval '1 day'
-- FROM public.profiles LIMIT 1;

-- For å kjøre seed etter at en bruker har registrert seg, bruk:
-- npx supabase db query --linked < supabase/seed.sql

-- ============================================================
-- ACADEMIES SEED
-- 71 Norwegian BJJ academies imported from TheBjjStory
-- Safe to re-run: ON CONFLICT DO NOTHING
-- ============================================================

INSERT INTO public.academies (id, name, city, region, country, country_code, website_url, address, affiliation, is_active, lat, lng)
VALUES
-- Agder
('arendal_bjj', 'Arendal BJJ', 'Arendal', 'Agder', 'Norway', 'NO', 'https://arendalbjj.no', 'Gaselia 12, Arendal', 'Frontline Academy', true, 58.451557, 8.751574),
('kristiansand_bjj', 'Kristiansand Grappling', 'Kristiansand', 'Agder', 'Norway', 'NO', 'https://kbjj.no', 'Møllevannsveien 36, 4616 Kristiansand', 'Team Carvalho', true, 58.146924, 7.972723),
('kristiansand_kampsport_senter', 'Kristiansand Kampsport Senter', 'Kristiansand', 'Agder', 'Norway', 'NO', 'https://kristiansandkampsport.no', 'Ægirs vei 10, 4632 Kristiansand', 'Roy Dean Academy', true, 58.154541, 8.029484),
('flekkeroy_kampsport_klubb', 'Flekkerøy Kampsport Klubb', 'Flekkerøy', 'Agder', 'Norway', 'NO', 'https://flekkeroykampsport.no', 'Sildenestangen 50, 4625 Kristiansand', NULL, false, 58.075961, 7.976698),
-- Innlandet
('hadeland_kampsport', 'Hadeland Kampsport', 'Brandbu', 'Innlandet', 'Norway', 'NO', 'https://hadelandkampsport.no', 'Storlinna 73, 2760 Brandbu', NULL, true, 60.416386, 10.516669),
('kimura_gjovik', 'Kimura Gjøvik', 'Gjøvik', 'Innlandet', 'Norway', 'NO', 'https://kimuragjovik.no', 'Storgata 20, 2815 Gjøvik', 'Kimura BJJ', true, 60.793799, 10.688725),
('kimura_hamar', 'Kimura Hamar', 'Hamar', 'Innlandet', 'Norway', 'NO', 'https://kimurahamar.net', 'Grønnegata 55, 2317 Hamar', 'Kimura BJJ', true, 60.794641, 11.074265),
('kimura_lillehammer', 'Tvekamp Kimura Lillehammer', 'Lillehammer', 'Innlandet', 'Norway', 'NO', 'https://kimuralillehammer.net', 'Slipervegen 2, 2609 Lillehammer', 'Kimura BJJ', true, 61.133341, 10.426586),
-- Møre og Romsdal
('house_of_motion', 'House of Motion', 'Ålesund', 'Møre og Romsdal', 'Norway', 'NO', 'https://facebook.com/houseofmotionaalesund', 'Kråmyrvegen 3, 6007 Ålesund', NULL, true, 62.476072, 6.192768),
('alesund_brazilian_jiu_jitsu', 'Ålesund Brazilian Jiu Jitsu', 'Ålesund', 'Møre og Romsdal', 'Norway', 'NO', 'https://aabjj.no', 'Grensegata 5, 6003 Ålesund', NULL, true, 62.472774, 6.166681),
('storm_brazilian_jiu_jitsu', 'Storm Brazilian Jiu Jitsu', 'Ålesund', 'Møre og Romsdal', 'Norway', 'NO', 'https://stormbjjaalesund.no', 'Kråmyrvegen 3, 6007 Ålesund', NULL, true, 62.480236, 6.555074),
('molde_kampsportsenter', 'Molde Kampsportsenter', 'Molde', 'Møre og Romsdal', 'Norway', 'NO', 'https://moldekampsportsenter.no', 'Plutovegen 1, 6419 Molde', 'Roy Dean Academy', true, 62.601626, 8.138621),
('novus_academy_molde', 'Novus Academy Molde', 'Molde', 'Møre og Romsdal', 'Norway', 'NO', 'https://novusmolde.no', 'Fannestrandvegen 134, 6419 Molde', 'Novus Academy', true, 62.741958, 7.230942),
-- Nordland
('bodo_jiu_jitsu', 'Bodø Jiu-jitsu', 'Bodø', 'Nordland', 'Norway', 'NO', 'https://bodojiujitsu.no', 'Kongsdatterveien 24, 8028 Bodø', 'Team Trondheim BJJ', true, 67.289589, 14.584150),
('bodo_mma', 'Bodø MMA', 'Bodø', 'Nordland', 'Norway', 'NO', 'https://facebook.com/mmabodo', 'Langstranda 5, 8003 Bodø', NULL, true, 67.297581, 14.397332),
('lofoten_kampsport', 'Lofoten Kampsport', 'Kabelvåg', 'Nordland', 'Norway', 'NO', 'https://facebook.com/LofotenKampsport', 'Kong Øysteins Hall, 8300 Kabelvåg', 'Team Trondheim BJJ', true, 68.208103, 14.465912),
('vesteralen_jiu_jitsu', 'Vesterålen Jiu Jitsu', 'Sortland', 'Nordland', 'Norway', 'NO', 'https://facebook.com/sortlandjudoklubb', 'Sortlandshallen, 8400 Sortland', NULL, true, 68.695856, 15.416357),
-- Oslo
('frontline_academy_hasle', 'Frontline Academy Hasle', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://frontlineacademy.no', 'Eikenga 27, 0579 Oslo', 'Frontline Academy', true, 59.926132, 10.802388),
('frontline_academy_majorstua', 'Frontline Academy Majorstua', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://frontlineacademy.no', 'Bogstadveien 27B, 0355 Oslo', 'Frontline Academy', true, 59.926457, 10.721426),
('frontline_muay_thai', 'Frontline Muay Thai', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://frontlinemuaythai.no', 'Dronning Margretes Vei 11, 0663 Oslo', NULL, true, 59.920375, 10.805235),
('grip_gym', 'Grip Gym', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://gripgym.no', 'Mandalls gate 18, 0190 Oslo', 'Shooters MMA', true, 59.910608, 10.762669),
('jiu_jitsu_collective', 'Jiu-Jitsu Collective', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://bjjc.no', 'Trondheimsveien 137, 5. etasje, 0570 Oslo', NULL, true, 59.913330, 10.738970),
('mudo_gym_carl_berner', 'Mudo Gym Carl Berner', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://mudogym.no/gym/carlberner', 'Hasleveien 15B, 0571 Oslo', 'Mudo Gym', true, 59.928498, 10.780833),
('mudo_gym_ulsrud', 'Friendly Treningssenter', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://friendlyfitness.no/steder/ulsrud/', 'John G. Mattesons vei 4, 0687 Oslo', NULL, true, 59.892039, 10.854197),
('oslo_fight_center', 'Oslo Fight Center', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://oslofightcenter.no', 'Grenseveien 74, 0653 Oslo', NULL, true, 59.917217, 10.800656),
('ryen_kampsport', 'Ryen Kampsport', 'Oslo', 'Oslo', 'Norway', 'NO', 'https://ryenkampsport.no', 'Ryensvingen 15, 0680 Oslo', 'Roger Gracie Academy', true, 59.891840, 10.808130),
-- Rogaland
('herjer_mma', 'Herjer MMA', 'Haugesund', 'Rogaland', 'Norway', 'NO', 'https://herjer.no', 'Longhammarvegen 25, 5536 Haugesund', NULL, true, 59.394195, 5.328349),
('jitsulab', 'JitsuLab', 'Bryne', 'Rogaland', 'Norway', 'NO', 'https://jitsulab.no', 'Jupitervegen 2, 4340 Bryne', NULL, true, 58.735597, 5.640124),
('jaeren_wulfing', 'Jæren Wulfing', 'Bryne', 'Rogaland', 'Norway', 'NO', 'https://jærenwulfing.no', 'Sandtangen 2, 4340 Bryne', 'Wulfing Academy', true, 58.736584, 5.651110),
('kampsporthuset', 'Kampsporthuset', 'Stavanger', 'Rogaland', 'Norway', 'NO', 'https://kampsporthuset.no', 'Hinnasvingene 55, 4020 Stavanger', NULL, true, 58.921583, 5.724322),
('kimura_egersund', 'Kimura Egersund', 'Egersund', 'Rogaland', 'Norway', 'NO', 'https://facebook.com/kimuraegersund', 'Espelandshallen, Sjukehusveien 16, 4373 Egersund', 'Kimura BJJ', true, 58.451512, 6.000755),
('kimura_naerbo', 'Kimura Nærbø', 'Nærbø', 'Rogaland', 'Norway', 'NO', 'https://facebook.com/kimuranarboe', 'Torlandsvegen 8, 4365 Nærbø', 'Kimura BJJ', true, 58.670380, 5.640866),
('kimura_sauda', 'Kimura Sauda', 'Sauda', 'Rogaland', 'Norway', 'NO', 'https://instagram.com/saudabjj', 'Vangen 6, 4200 Sauda', 'Kimura BJJ', true, 59.704566, 6.462094),
('oxygym', 'Oxygym', 'Sandnes', 'Rogaland', 'Norway', 'NO', 'https://oxygym.no', 'Langgata 91, 4306 Sandnes', NULL, true, 58.855999, 5.740603),
('wulfing_academy', 'Wulfing Academy', 'Haugesund', 'Rogaland', 'Norway', 'NO', 'https://wulfingacademy.no', 'Haraldsgata 125, 5527 Haugesund', 'Wulfing Academy', true, 59.412285, 5.270223),
('xfit', 'XFIT Stavanger', 'Stavanger', 'Rogaland', 'Norway', 'NO', 'https://xfit-stavanger.no', 'Lars Hertervigs gate 3, 4005 Stavanger', NULL, true, 58.969838, 5.728900),
-- Troms og Finnmark
('batalje_jiu_jitsu', 'Batalje Jiu-jitsu', 'Tromsø', 'Troms og Finnmark', 'Norway', 'NO', 'https://batalje.no', 'Grønnegata 86, 9008 Tromsø', NULL, true, 69.653481, 18.958623),
('tromso_kampsportklubb', 'Tromsø Kampsportklubb', 'Tromsø', 'Troms og Finnmark', 'Norway', 'NO', 'https://tromsokampsportklubb.com', 'Storgata 5, 9008 Tromsø', NULL, true, 69.645506, 18.950452),
('tromso_top_team', 'Tromsø Top Team', 'Tromsø', 'Troms og Finnmark', 'Norway', 'NO', 'https://tromsotopteam.no', 'Ringveien 1, 9018 Tromsø', NULL, true, 69.651635, 18.955859),
-- Trøndelag
('evolve_academy_trondheim', 'Evolve Academy Trondheim', 'Trondheim', 'Trøndelag', 'Norway', 'NO', 'https://evolveacademy.no', 'Båtsmannsgata 4, 7042 Trondheim', NULL, true, 63.439114, 10.415564),
('levanger_judoklubb_og_bjj', 'Levanger Judo og BJJ', 'Levanger', 'Trøndelag', 'Norway', 'NO', 'https://levangerjudoklubb.com', 'Skoleparken 10, 7604 Levanger', NULL, true, 63.748057, 11.316888),
('trondheim_bjj', 'Team Trondheim BJJ', 'Trondheim', 'Trøndelag', 'Norway', 'NO', 'https://trondheim-bjj.no', 'Haakon VII''s gt 13, 7041 Trondheim', NULL, true, 63.430448, 10.395212),
-- Vestfold og Telemark
('gfteam_sandefjord', 'Sandefjord Kampsport', 'Sandefjord', 'Vestfold og Telemark', 'Norway', 'NO', 'https://sandefjordkampsport.no', 'Krokemoveien 63, 3224 Sandefjord', 'GFTeam', true, 59.135058, 10.177387),
('gfteam_telemark', 'GFTeam Telemark', 'Bø i Telemark', 'Vestfold og Telemark', 'Norway', 'NO', 'https://gfteamtelemark.no', 'Sandavegen 8, 3800 Bø i Telemark', 'GFTeam', true, 59.414604, 9.084866),
('gladiator_gym', 'Gladiator Gym', 'Holmestrand', 'Vestfold og Telemark', 'Norway', 'NO', 'https://gladiator-gym.no', 'Bentsrudsvingen 6, 3083 Holmestrand', NULL, false, 59.488940, 10.296860),
('larvik_combat_center', 'Larvik Combat Center', 'Larvik', 'Vestfold og Telemark', 'Norway', 'NO', 'https://larvikcombatcenter.no', 'Lerkelundveien 1, 3262 Larvik', NULL, true, 59.046842, 10.057349),
('larvik_kampsport', 'Larvik Kampsport', 'Larvik', 'Vestfold og Telemark', 'Norway', 'NO', 'https://larvikkampsport.com', 'Ahlefeldsgate 1, 3262 Larvik', 'Team Valhall', true, 59.096731, 10.021930),
('team_spirit_kampsportsenter', 'Team Spirit Kampsportsenter', 'Tønsberg', 'Vestfold og Telemark', 'Norway', 'NO', 'https://tskampsport.com', 'Bullsgt. 2B, 3110 Tønsberg', NULL, true, 59.354980, 10.282049),
('orion_mma', 'Orion MMA Academy', 'Tønsberg', 'Vestfold og Telemark', 'Norway', 'NO', 'https://orionmma.no', 'Makeveien 2, 3112 Tønsberg', NULL, true, 59.684279, 9.651007),
-- Vestland
('10th_planet_jiu_jitsu_bergen', '10th Planet Jiu Jitsu Bergen', 'Bergen', 'Vestland', 'Norway', 'NO', 'https://10pbergen.com', 'Tidemanns gate 11, 5005 Bergen', '10th Planet Jiu-Jitsu', true, 60.394306, 5.325919),
('bergen_grappling', 'Bergen Grappling', 'Bergen', 'Vestland', 'Norway', 'NO', 'https://bergengrappling.com', 'Vestre Strømkaien 1, 5008 Bergen', 'BJJ Globetrotters', true, 60.389034, 5.330965),
('frontline_academy_bergen', 'Frontline Academy Bergen', 'Bergen', 'Vestland', 'Norway', 'NO', 'https://frontlinebergen.no', 'Nygårdsgaten 94, 2. etasje, 5008 Bergen', 'Frontline Academy', true, 60.385162, 5.331841),
('sotra_kampsportklubb', 'Sotra Kampsportklubb', 'Steinsland', 'Vestland', 'Norway', 'NO', 'https://sotrakampsport.no', 'Bergsleitet 22, 5379 Steinsland', NULL, true, 59.118152, 5.639975),
-- Viken
('asker_judoklubb', 'Asker Judoklubb', 'Nesbru', 'Viken', 'Norway', 'NO', 'https://askerjudo.no', 'Vogellund 24, 1493 Nesbru', NULL, true, 59.852788, 10.483449),
('baerum_ju_jitsu_klubb', 'Bærum Ju Jitsu Klubb', 'Bærum', 'Viken', 'Norway', 'NO', 'https://bjjk.no', 'Gamle Ringeriksvei 6, 1369 Stabekk', NULL, false, 59.928964, 10.499711),
('drobak_bjj', 'Drøbak BJJ', 'Drøbak', 'Viken', 'Norway', 'NO', 'https://drobakbjj.no', 'Storgata 16, 1440 Drøbak', NULL, true, 59.661623, 10.629913),
('frontline_academy_drammen', 'Frontline Academy Drammen', 'Drammen', 'Viken', 'Norway', 'NO', 'https://frontlineacademy.no', 'Ingeniør Rybergsgate 101, 3027 Drammen', 'Frontline Academy', true, 59.743117, 10.160608),
('gracie_allegiance_norway', 'Gracie Allegiance Norway', 'Sandvika', 'Viken', 'Norway', 'NO', 'https://gracieallegiance.no', 'Malmskriverveien 11, 1337 Sandvika', 'Gracie Jiu-Jitsu', true, 59.892591, 10.527151),
('ippon_judoklubb', 'Ippon Judo & BJJ', 'Bekkestua', 'Viken', 'Norway', 'NO', 'https://ippon.no', 'Haukeveien 12, 1357 Bekkestua', NULL, true, 59.921616, 10.584623),
('modum_kampsport', 'Modum Kampsport', 'Geithus', 'Viken', 'Norway', 'NO', 'https://modumkampsport.no', 'Gravfossveien 5E, 3360 Geithus', 'BJJ Globetrotters', true, 59.928981, 9.966058),
('mudo_gym_vestby', 'Mudo Gym Vestby', 'Vestby', 'Viken', 'Norway', 'NO', 'https://mudogym.no/gym/vestby', 'Senterveien 6, 1540 Vestby', 'Mudo Gym', true, 59.603163, 10.742228),
('nesodden_grappling', 'Nesodden Grappling', 'Nesoddtangen', 'Viken', 'Norway', 'NO', 'https://nesoddengrappling.no', 'Hellvikskogvei 2, 1454 Nesoddtangen', 'Team Carvalho', true, 59.856145, 10.661621),
('novus_academy_lillestrom', 'Novus Academy Lillestrøm', 'Lillestrøm', 'Viken', 'Norway', 'NO', 'https://novusacademy.no', 'Elvesvingen 23, 2003 Lillestrøm', 'Novus Academy', true, 59.915540, 11.217035),
('novus_academy_lorenskog', 'Novus Academy Lørenskog', 'Lørenskog', 'Viken', 'Norway', 'NO', 'https://novusacademy.no', 'Boecks gate 12, 1473 Lørenskog', 'Novus Academy', true, 59.930283, 10.945011),
('rambukk', 'Rambukk', 'Råholt', 'Viken', 'Norway', 'NO', 'https://rambukken.no', 'Trondheimsvegen 266, 2070 Råholt', 'Checkmat', true, 60.285875, 11.170737),
('drammen_kampsport', 'Drammen Kampsportsenter', 'Drammen', 'Viken', 'Norway', 'NO', 'https://kampsportsenteret.com', NULL, NULL, true, 59.696494, 10.175642),
('frontline_muay_thai_jessheim', 'Frontline Muay Thai Jessheim', 'Jessheim', 'Viken', 'Norway', 'NO', 'https://fmtjessheim.no', 'Valhallavegen 10a, 2060 Gardermoen', 'Frontline Academy', true, 60.141512, 11.175152),
('moss_jiu_jitsu', 'Moss Jiu-jitsu', 'Moss', 'Viken', 'Norway', 'NO', 'https://moss-tkd.no', 'Rabekkgata 5, 1523 Moss', NULL, true, 59.414668, 10.659658),
('fit_for_fight', 'Fit for Fight', 'Borgenhaugen', 'Viken', 'Norway', 'NO', 'https://fitforfight.com', 'Snekkerstubakken 26, 1738 Borgenhaugen', NULL, true, 59.266906, 11.177367),
('sentrum_sarpsborg', 'Sentrum Kampsport Sarpsborg', 'Sarpsborg', 'Viken', 'Norway', 'NO', 'https://sentrumkampsport.no', 'Vestengveien 40, 1725 Sarpsborg', NULL, true, 59.254955, 11.229781),
('halden_combat', 'Heat Halden', 'Halden', 'Viken', 'Norway', 'NO', 'https://heathalden.no', NULL, 'Gracie Jiu-Jitsu', true, 59.068056, 11.537191)
ON CONFLICT (id) DO NOTHING;
