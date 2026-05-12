-- Seed 5 sample leagues
INSERT INTO leagues (id, name, tier, creator_id, ends_at)
VALUES 
  (gen_random_uuid(), 'Ligue des Explorateurs', 'bronze', (SELECT id FROM app_users LIMIT 1), now() + interval '24 hours'),
  (gen_random_uuid(), 'Sommet de l''Atlas', 'silver', (SELECT id FROM app_users LIMIT 1), now() + interval '23 hours'),
  (gen_random_uuid(), 'Étoiles du Désert', 'gold', (SELECT id FROM app_users LIMIT 1), now() + interval '22 hours'),
  (gen_random_uuid(), 'Champions de Rabat', 'bronze', (SELECT id FROM app_users LIMIT 1), now() + interval '21 hours'),
  (gen_random_uuid(), 'Maîtres du Savoir', 'silver', (SELECT id FROM app_users LIMIT 1), now() + interval '20 hours')
ON CONFLICT DO NOTHING;

-- Add members to these leagues
DO $$
DECLARE
    league_record RECORD;
    user_record RECORD;
BEGIN
    FOR league_record IN SELECT id FROM leagues WHERE name IN ('Ligue des Explorateurs', 'Sommet de l''Atlas', 'Étoiles du Désert', 'Champions de Rabat', 'Maîtres du Savoir')
    LOOP
        -- Add 5-10 random users to each league
        FOR user_record IN (SELECT id FROM app_users ORDER BY random() LIMIT 8)
        LOOP
            INSERT INTO league_members (league_id, user_id, points_earned, cities_completed)
            VALUES (league_record.id, user_record.id, floor(random() * 2000), floor(random() * 8))
            ON CONFLICT (league_id, user_id) DO UPDATE SET
                points_earned = EXCLUDED.points_earned,
                cities_completed = EXCLUDED.cities_completed;
        END LOOP;
    END LOOP;
END $$;
