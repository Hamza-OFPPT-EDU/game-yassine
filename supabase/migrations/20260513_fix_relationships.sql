-- Migration: Fix Schema Relationships and Seeding
-- Created on 2026-05-13
-- Focus: Fixing 'league_members' join issue and ensuring data consistency

-- 1. FIX RELATIONSHIP: league_members -> app_users
-- PostgREST needs this to perform .select('*, league_members(*, app_users(*))')
ALTER TABLE IF EXISTS public.league_members 
DROP CONSTRAINT IF EXISTS league_members_user_id_fkey;

ALTER TABLE IF EXISTS public.league_members
ADD CONSTRAINT league_members_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.app_users(id) 
ON DELETE CASCADE;

-- 2. FIX RELATIONSHIP: leagues -> app_users (creator)
ALTER TABLE IF EXISTS public.leagues
DROP CONSTRAINT IF EXISTS leagues_creator_id_fkey;

ALTER TABLE IF EXISTS public.leagues
ADD CONSTRAINT leagues_creator_id_fkey 
FOREIGN KEY (creator_id) 
REFERENCES public.app_users(id) 
ON DELETE SET NULL;

-- 3. ENSURE RLS IS PERMISSIVE FOR LEAGUES (for testing)
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leagues_public_read" ON public.leagues;
CREATE POLICY "leagues_public_read" ON public.leagues FOR SELECT USING (true);

DROP POLICY IF EXISTS "leagues_public_insert" ON public.leagues;
CREATE POLICY "leagues_public_insert" ON public.leagues FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "league_members_public_read" ON public.league_members;
CREATE POLICY "league_members_public_read" ON public.league_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "league_members_public_insert" ON public.league_members;
CREATE POLICY "league_members_public_insert" ON public.league_members FOR INSERT WITH CHECK (true);

-- 4. SEED DATA: Ensure app_users has the players
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

-- 5. SEED DATA: Specific Leagues
INSERT INTO public.leagues (id, name, tier, creator_id, ends_at) VALUES 
('f6666666-6666-6666-6666-666666666666', 'Rabat Coding Sprint', 'bronze', 'yacine_bly_1', now() + interval '24 hours'),
('g7777777-7777-7777-7777-777777777777', 'Casablanca Soft Skills Pro', 'silver', 'player_amine', now() + interval '24 hours'),
('h8888888-8888-8888-8888-888888888888', 'Tanger Tech Challenge', 'gold', 'player_sofia', now() + interval '24 hours'),
('i9999999-9999-9999-9999-999999999999', 'Marrakech Leadership Summit', 'emerald', 'player_mehdi', now() + interval '24 hours'),
('j0000000-0000-0000-0000-000000000000', 'Agadir Innovation Cup', 'diamond', 'player_lina', now() + interval '24 hours')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED DATA: Add players to leagues
INSERT INTO public.league_members (league_id, user_id, points_earned, cities_completed, badges_earned)
SELECT l.id, u.id, floor(random() * 5000) + 1000, floor(random() * 8) + 1, floor(random() * 10) + 1
FROM public.leagues l, public.app_users u
WHERE l.name IN ('Rabat Coding Sprint', 'Casablanca Soft Skills Pro', 'Tanger Tech Challenge', 'Marrakech Leadership Summit', 'Agadir Innovation Cup')
AND u.id IN ('yacine_bly_1', 'player_amine', 'player_sofia', 'player_mehdi', 'player_lina')
ON CONFLICT (league_id, user_id) DO NOTHING;
