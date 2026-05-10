-- Final Migration to fix badge resources and reconcile schema with Dashboard
-- Path: supabase/migrations/20260510_fix_badges.sql

-- 1. Drop existing tables to resolve schema conflicts (safe as no players have earned badges yet)
DROP TABLE IF EXISTS public.player_earned_badges CASCADE;
DROP TABLE IF EXISTS public.badge_definitions CASCADE;

-- 2. Create BADGE_DEFINITIONS with schema expected by Dashboard (BadgesManager.jsx)
CREATE TABLE public.badge_definitions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_name varchar(255) NOT NULL UNIQUE,
  description_fr text NOT NULL,
  description_ar text,
  requirement text,
  icon_url text,
  category varchar(50) DEFAULT 'achievement'::character varying CHECK (category IN ('cultural', 'achievement', 'challenge', 'multiplayer')),
  rarity varchar(20) DEFAULT 'common'::character varying CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_badge_definitions_category ON public.badge_definitions(category);
CREATE INDEX idx_badge_definitions_rarity ON public.badge_definitions(rarity);

-- 3. Create PLAYER_EARNED_BADGES with correct references
CREATE TABLE public.player_earned_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id varchar(255) NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badge_definitions(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  CONSTRAINT player_earned_badges_unique UNIQUE(player_id, badge_id)
);

-- 4. Enable RLS
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_earned_badges ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "badge_definitions_read" ON public.badge_definitions FOR SELECT USING (true);
CREATE POLICY "badge_definitions_admin" ON public.badge_definitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "player_earned_badges_read" ON public.player_earned_badges FOR SELECT USING (true);
CREATE POLICY "player_earned_badges_insert" ON public.player_earned_badges FOR INSERT WITH CHECK (true);

-- 6. Insert Cultural Badges (19) with verified storage URLs
INSERT INTO public.badge_definitions (id, badge_name, description_fr, icon_url, category, rarity, image_url)
VALUES
  ('550e8400-e29b-41d4-a716-446655441111', 'Abzim', 'Bijou traditionnel de Rabat', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Abzim.png'),
  ('550e8400-e29b-41d4-a716-446655442222', 'Aghraf', 'Bijou traditionnel de Rabat', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Aghraf.png'),
  ('550e8400-e29b-41d4-a716-446655443333', 'Chebbka', 'Bijou traditionnel de Rabat', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Chebbka.png'),
  ('550e8400-e29b-41d4-a716-446655444444', 'Fnous', 'Bijou traditionnel de Rabat', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Fnous.png'),
  ('550e8400-e29b-41d4-a716-446655445555', 'Ibzimen', 'Bijou traditionnel de Rabat', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Ibzimen.png'),
  ('98b50e2d-dc99-43ef-b387-052637738c01', 'Khalkhal Mawj', 'Bijou traditionnel de Chefchaouen', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Khalkhal%20Mawj.png'),
  ('98b50e2d-dc99-43ef-b387-052637738c02', 'khalkhal', 'Bijou traditionnel de Chefchaouen', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/khalkhal.png'),
  ('98b50e2d-dc99-43ef-b387-052637738c03', 'khit-Roh', 'Bijou traditionnel de Chefchaouen', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/khit-Roh.png'),
  ('98b50e2d-dc99-43ef-b387-052637738c04', 'Khmissa', 'Bijou traditionnel de Chefchaouen', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Khmissa.png'),
  ('98b50e2d-dc99-43ef-b387-052637738c05', 'Mdama bahar', 'Bijou traditionnel de Chefchaouen', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Mdama%20bahar.png'),
  ('550e8400-e29b-41d4-a716-44665544f111', 'Mdama', 'Bijou traditionnel de Fès', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Mdama.png'),
  ('550e8400-e29b-41d4-a716-44665544f222', 'Mharma', 'Bijou traditionnel de Fès', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Mharma.png'),
  ('550e8400-e29b-41d4-a716-44665544f333', 'Mniqqa', 'Bijou traditionnel de Fès', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Mniqqa.png'),
  ('550e8400-e29b-41d4-a716-44665544f444', 'Qabt', 'Bijou traditionnel de Fès', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Qabt.png'),
  ('550e8400-e29b-41d4-a716-44665544f555', 'Sertia Atlantik', 'Bijou traditionnel de Fès', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Sertia%20Atlantik.png'),
  ('98b50e2d-dc99-43ef-b387-052637738a01', 'Sertla', 'Bijou traditionnel de Marrakech', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Sertla.png'),
  ('98b50e2d-dc99-43ef-b387-052637738a02', 'Tabraat', 'Bijou traditionnel de Marrakech', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tabraat.png'),
  ('98b50e2d-dc99-43ef-b387-052637738a03', 'Tasfift', 'Bijou traditionnel de Marrakech', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tasfift.png'),
  ('98b50e2d-dc99-43ef-b387-052637738a04', 'Tazrabt Sahara', 'Bijou traditionnel de Marrakech', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tazrabt%20Sahara.png'),
  ('98b50e2d-dc99-43ef-b387-052637738a05', 'Tazrabt', 'Bijou traditionnel de Marrakech', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tazrabt.png'),
  ('f83e1989-e001-470a-bda4-722124c346f1', 'Tifinagh', 'Bijou traditionnel de Dakhla', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tifinagh.png'),
  ('0f576c5b-6cba-4efc-a85d-ddc0aa307dc3', 'Tizerzai', 'Bijou traditionnel de Dakhla', '🏅', 'cultural', 'rare', 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tizerzai.png');

-- 7. Insert Multiplayer Badges (from previous schema)
INSERT INTO public.badge_definitions (badge_name, description_fr, icon_url, category, rarity)
VALUES
  ('Tazra n Imazighen', 'Connaissance Amazighe: Répondez correctement à 10 questions culturelles', '💎', 'cultural', 'common'),
  ('Azadagh n Umdan', 'Guerrier Uni: Remportez un défi multijoueur avec des amis', '🗡️', 'multiplayer', 'uncommon'),
  ('Amazir Agmazen', 'Maître Amazighe: Maîtrisez tous les défis culturels', '👑', 'cultural', 'legendary');
