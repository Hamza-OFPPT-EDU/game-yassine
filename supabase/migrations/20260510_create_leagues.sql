-- Migration: Create Leagues and League Members tables
-- Created for "Le Voyage des Compétences"

-- 1. LEAGUES TABLE
CREATE TABLE IF NOT EXISTS public.leagues (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(255) NOT NULL,
  tier varchar(50) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'emerald', 'diamond')),
  creator_id varchar(255),
  ends_at timestamp with time zone DEFAULT (now() + interval '1 month'),
  created_at timestamp with time zone DEFAULT now()
);

-- 2. LEAGUE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.league_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id uuid NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id varchar(255) NOT NULL,
  joined_at timestamp with time zone DEFAULT now(),
  points_earned integer DEFAULT 0,
  cities_completed integer DEFAULT 0,
  badges_earned integer DEFAULT 0,
  
  CONSTRAINT league_members_unique_entry UNIQUE(league_id, user_id)
);

-- 3. ENABLE RLS
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES
CREATE POLICY "leagues_read_all" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "leagues_insert_all" ON public.leagues FOR INSERT WITH CHECK (true);
CREATE POLICY "leagues_update_all" ON public.leagues FOR UPDATE USING (true);
CREATE POLICY "leagues_delete_all" ON public.leagues FOR DELETE USING (true);

CREATE POLICY "league_members_read_all" ON public.league_members FOR SELECT USING (true);
CREATE POLICY "league_members_insert_all" ON public.league_members FOR INSERT WITH CHECK (true);
CREATE POLICY "league_members_delete_all" ON public.league_members FOR DELETE USING (true);

-- 5. SEED DATA (The 4 competitions requested by user)
INSERT INTO public.leagues (name, tier) VALUES 
('Ligue des Novices', 'bronze'),
('Cercle des Experts', 'silver'),
('Sommet de l\'Excellence', 'gold'),
('Légende des Soft Skills', 'diamond')
ON CONFLICT DO NOTHING;
