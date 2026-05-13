-- Migration: Final League Setup and Seeding
-- Created on 2026-05-13
-- Focus: Real-looking players and leagues for testing

-- 1. Ensure app_users has the target players
INSERT INTO public.app_users (id, full_name, avatar_url, xp, level, gender)
VALUES 
('yacine_bly_1', 'Yassine Bly', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yassine', 12500, 15, 'M'),
('player_amine', 'Amine El Guerrouj', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amine', 8400, 10, 'M'),
('player_sofia', 'Sofia Bennani', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', 9200, 11, 'F'),
('player_mehdi', 'Mehdi Zahraoui', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehdi', 7100, 8, 'M'),
('player_lina', 'Lina Mansouri', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lina', 10500, 13, 'F')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    xp = EXCLUDED.xp,
    level = EXCLUDED.level;

-- 2. Seed 5 specific leagues as requested
DELETE FROM public.leagues WHERE name IN (
    'Rabat Coding Sprint', 
    'Casablanca Soft Skills Pro', 
    'Tanger Tech Challenge', 
    'Marrakech Leadership Summit', 
    'Agadir Innovation Cup'
);

INSERT INTO public.leagues (id, name, tier, creator_id, ends_at) VALUES 
('f6666666-6666-6666-6666-666666666666', 'Rabat Coding Sprint', 'bronze', 'yacine_bly_1', now() + interval '24 hours'),
('g7777777-7777-7777-7777-777777777777', 'Casablanca Soft Skills Pro', 'silver', 'player_amine', now() + interval '24 hours'),
('h8888888-8888-8888-8888-888888888888', 'Tanger Tech Challenge', 'gold', 'player_sofia', now() + interval '24 hours'),
('i9999999-9999-9999-9999-999999999999', 'Marrakech Leadership Summit', 'emerald', 'player_mehdi', now() + interval '24 hours'),
('j0000000-0000-0000-0000-000000000000', 'Agadir Innovation Cup', 'diamond', 'player_lina', now() + interval '24 hours');

-- 3. Add players to these leagues with varied points
DO $$
DECLARE
    league_id_val uuid;
    user_id_val varchar;
    points_val integer;
BEGIN
    FOR league_id_val IN (SELECT id FROM public.leagues WHERE name IN ('Rabat Coding Sprint', 'Casablanca Soft Skills Pro', 'Tanger Tech Challenge', 'Marrakech Leadership Summit', 'Agadir Innovation Cup'))
    LOOP
        FOR user_id_val IN (SELECT id FROM public.app_users WHERE id IN ('yacine_bly_1', 'player_amine', 'player_sofia', 'player_mehdi', 'player_lina'))
        LOOP
            -- Randomize points a bit but keep them realistic
            points_val := floor(random() * 5000) + 1000;
            
            INSERT INTO public.league_members (league_id, user_id, points_earned, cities_completed, badges_earned)
            VALUES (league_id_val, user_id_val, points_val, floor(random() * 8) + 1, floor(random() * 10) + 1)
            ON CONFLICT (league_id, user_id) DO UPDATE SET
                points_earned = EXCLUDED.points_earned,
                cities_completed = EXCLUDED.cities_completed,
                badges_earned = EXCLUDED.badges_earned;
        END LOOP;
    END LOOP;
END $$;
