-- Migration: Enhanced Leagues system
-- Updates the leagues table and adds tracking to members

-- 1. Update Leagues table
ALTER TABLE public.leagues 
  ALTER COLUMN ends_at SET DEFAULT (now() + interval '24 hours');

-- 2. Update League Members table to track competition-specific progress
ALTER TABLE public.league_members 
  ADD COLUMN IF NOT EXISTS points_earned integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cities_completed integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS badges_earned integer DEFAULT 0;

-- 3. Seed 5 Competitions (as requested)
DELETE FROM public.leagues WHERE name IN ('Ligue des Novices', 'Cercle des Experts', 'Sommet de l''Excellence', 'Légende des Soft Skills', 'Défi des Champions');

INSERT INTO public.leagues (id, name, tier, ends_at) VALUES 
('a1111111-1111-1111-1111-111111111111', 'Ligue des Novices', 'bronze', now() + interval '24 hours'),
('b2222222-2222-2222-2222-222222222222', 'Cercle des Experts', 'silver', now() + interval '24 hours'),
('c3333333-3333-3333-3333-333333333333', 'Sommet de l''Excellence', 'gold', now() + interval '24 hours'),
('d4444444-4444-4444-4444-444444444444', 'Légende des Soft Skills', 'emerald', now() + interval '24 hours'),
('e5555555-5555-5555-5555-555555555555', 'Défi des Champions', 'diamond', now() + interval '24 hours');

-- 4. RPC for incrementing points
CREATE OR REPLACE FUNCTION public.increment_league_points(amount integer, row_id varchar, l_id uuid)
RETURNS integer AS $$
DECLARE
  current_points integer;
BEGIN
  UPDATE public.league_members 
  SET points_earned = points_earned + amount 
  WHERE user_id = row_id AND league_id = l_id
  RETURNING points_earned INTO current_points;
  
  RETURN current_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Seed some existing players into these leagues (if any exist)
DO $$
DECLARE
    user_record RECORD;
    league_record RECORD;
    counter integer := 0;
BEGIN
    FOR user_record IN (SELECT id FROM public.app_users LIMIT 50) LOOP
        -- Distribute users across the 5 leagues
        SELECT id INTO league_record FROM public.leagues ORDER BY random() LIMIT 1;
        
        INSERT INTO public.league_members (league_id, user_id, points_earned, cities_completed)
        VALUES (league_record.id, user_record.id, floor(random() * 5000), floor(random() * 4))
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;
