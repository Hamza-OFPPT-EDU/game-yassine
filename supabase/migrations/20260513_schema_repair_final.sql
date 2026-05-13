-- Migration: Schema Repair & Final Seeding
-- Fixes column mismatches and missing relationships

-- 1. FIX badge_definitions
ALTER TABLE IF EXISTS public.badge_definitions 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. FIX league_members RELATIONSHIPS
-- Ensure we can join league_members with app_users
ALTER TABLE IF EXISTS public.league_members
DROP CONSTRAINT IF EXISTS league_members_user_id_fkey;

ALTER TABLE IF EXISTS public.league_members
ADD CONSTRAINT league_members_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.app_users(id) 
ON DELETE CASCADE;

-- 3. FIX questions TABLE (Ensure columns for Duel mode)
-- If questions returns 400, it might be missing mission_id or options
ALTER TABLE IF EXISTS public.questions
ADD COLUMN IF NOT EXISTS question_fr TEXT,
ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE;

-- 4. ENSURE challenges AND missions ARE CONNECTED
-- The code in DuelCompetitionScreen uses 'id.eq.rabat' or 'name_fr.ilike.Rabat'
UPDATE public.challenges SET name_fr = 'Rabat' WHERE id = 'rabat' OR name_fr IS NULL;

-- 5. FINAL SEEDING FOR LEAGUES
-- Create 5 diverse leagues
INSERT INTO public.leagues (id, name, tier, creator_id, ends_at) VALUES 
('f6666666-6666-6666-6666-666666666666', 'Rabat Coding Sprint', 'bronze', 'yacine_bly_1', now() + interval '24 hours'),
('g7777777-7777-7777-7777-777777777777', 'Casablanca Soft Skills Pro', 'silver', 'player_amine', now() + interval '24 hours'),
('h8888888-8888-8888-8888-888888888888', 'Tanger Tech Challenge', 'gold', 'player_sofia', now() + interval '24 hours'),
('i9999999-9999-9999-9999-999999999999', 'Marrakech Leadership Summit', 'emerald', 'player_mehdi', now() + interval '24 hours'),
('j0000000-0000-0000-0000-000000000000', 'Agadir Innovation Cup', 'diamond', 'player_lina', now() + interval '24 hours')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tier = EXCLUDED.tier;

-- Ensure users exist for these leagues
INSERT INTO public.app_users (id, full_name, avatar_url, xp, level, gender)
VALUES 
('yacine_bly_1', 'Yassine Bly', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yassine', 12500, 15, 'M'),
('player_amine', 'Amine El Guerrouj', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amine', 8400, 10, 'M'),
('player_sofia', 'Sofia Bennani', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', 9200, 11, 'F'),
('player_mehdi', 'Mehdi Zahraoui', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehdi', 7100, 8, 'M'),
('player_lina', 'Lina Mansouri', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lina', 10500, 13, 'F')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, xp = EXCLUDED.xp;

-- Populate members
INSERT INTO public.league_members (league_id, user_id, points_earned, cities_completed, badges_earned)
SELECT l.id, u.id, floor(random() * 5000) + 1000, floor(random() * 8) + 1, floor(random() * 10) + 1
FROM public.leagues l, public.app_users u
WHERE l.id IN ('f6666666-6666-6666-6666-666666666666', 'g7777777-7777-7777-7777-777777777777', 'h8888888-8888-8888-8888-888888888888', 'i9999999-9999-9999-9999-999999999999', 'j0000000-0000-0000-0000-000000000000')
AND u.id IN ('yacine_bly_1', 'player_amine', 'player_sofia', 'player_mehdi', 'player_lina')
ON CONFLICT (league_id, user_id) DO NOTHING;
