INSERT INTO achievements (id, name, description, category, icon, sort_order) VALUES
  ('first_feedback', 'Lagspiller', 'Ga din første tilbakemelding', 'social', 'speech', 60),
  ('feedback_5', 'Tilbakemeldingsmaskin', 'Ga 5 tilbakemeldinger', 'social', 'speech', 61),
  ('feedback_10', 'Mentor', 'Ga 10 tilbakemeldinger', 'social', 'speech', 62),
  ('first_sparring', 'Første runde', 'Logget din første sparring-runde', 'social', 'handshake', 63),
  ('sparring_50', 'Sparringpartner', '50 sparring-runder logget', 'social', 'handshake', 64),
  ('sparring_100', 'Sparringveteran', '100 sparring-runder logget', 'social', 'handshake', 65),
  ('first_post', 'Første innlegg', 'Delte ditt første innlegg', 'social', 'megaphone', 66),
  ('posts_10', 'Aktiv deler', '10 innlegg delt', 'social', 'megaphone', 67)
ON CONFLICT (id) DO NOTHING;
