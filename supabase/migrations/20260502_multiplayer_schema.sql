-- ============================================================================
-- VOYAGE WEB - Multiplayer Module & Badge System Database Migrations
-- ============================================================================
-- Exécuter ce script dans: Supabase Dashboard → SQL Editor
-- ============================================================================

-- 1. ROOMS TABLE - Gère les salons de jeu multijoueur
CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code varchar(4) NOT NULL UNIQUE,
  host_id varchar(255) NOT NULL,
  status varchar(20) DEFAULT 'waiting'::character varying CHECK (status IN ('waiting', 'playing', 'finished')),
  mission_id uuid NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Indexes pour performance
  CONSTRAINT rooms_code_check CHECK (code ~ '^\d{4}$')
);

CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON public.rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON public.rooms(created_at DESC);

COMMENT ON TABLE public.rooms IS 'Salons de jeu multijoueur avec codes d''accès';
COMMENT ON COLUMN public.rooms.code IS 'Code d''accès à 4 chiffres (UNIQUE)';
COMMENT ON COLUMN public.rooms.status IS 'État: waiting, playing, finished';

-- 2. ROOM MEMBERS TABLE - Joueurs dans une salle
CREATE TABLE IF NOT EXISTS public.room_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id varchar(255) NOT NULL,
  player_name varchar(255) NOT NULL,
  avatar text,
  progress integer DEFAULT 0 CHECK (progress >= 0),
  is_host boolean DEFAULT false,
  joined_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT room_members_unique_player UNIQUE(room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON public.room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON public.room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_members_is_host ON public.room_members(is_host);

COMMENT ON TABLE public.room_members IS 'Joueurs dans chaque salle avec leur progression';
COMMENT ON COLUMN public.room_members.progress IS 'Index de la question actuelle';

-- 3. BADGE DEFINITIONS TABLE - Catalogue des badges disponibles
CREATE TABLE IF NOT EXISTS public.badge_definitions (
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

CREATE INDEX IF NOT EXISTS idx_badge_definitions_category ON public.badge_definitions(category);
CREATE INDEX IF NOT EXISTS idx_badge_definitions_rarity ON public.badge_definitions(rarity);

COMMENT ON TABLE public.badge_definitions IS 'Catalogue de tous les badges "Bijoux Amazighs" disponibles';

-- 4. PLAYER EARNED BADGES TABLE - Badges gagnés par les joueurs
CREATE TABLE IF NOT EXISTS public.player_earned_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id varchar(255) NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badge_definitions(id) ON DELETE CASCADE,
  earned_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT player_earned_badges_unique UNIQUE(player_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_player_earned_badges_player_id ON public.player_earned_badges(player_id);
CREATE INDEX IF NOT EXISTS idx_player_earned_badges_badge_id ON public.player_earned_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_player_earned_badges_earned_at ON public.player_earned_badges(earned_at DESC);

COMMENT ON TABLE public.player_earned_badges IS 'Historique des badges gagnés par chaque joueur';

-- 5. GAME SESSIONS TABLE - Enregistrement des parties jouées
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  mission_id uuid NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  started_at timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone,
  
  -- Stats
  total_players integer DEFAULT 0 CHECK (total_players >= 0),
  correct_answers integer DEFAULT 0 CHECK (correct_answers >= 0),
  total_questions integer DEFAULT 0 CHECK (total_questions >= 0)
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_room_id ON public.game_sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_mission_id ON public.game_sessions(mission_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_started_at ON public.game_sessions(started_at DESC);

COMMENT ON TABLE public.game_sessions IS 'Enregistrement de chaque partie jouée en multijoueur';

-- 6. PLAYER GAME RESULTS TABLE - Résultats par joueur
CREATE TABLE IF NOT EXISTS public.player_game_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  game_session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  player_id varchar(255) NOT NULL,
  player_name varchar(255) NOT NULL,
  xp_earned integer DEFAULT 0 CHECK (xp_earned >= 0),
  stars_earned integer DEFAULT 0 CHECK (stars_earned >= 0),
  correct_count integer DEFAULT 0 CHECK (correct_count >= 0),
  completion_time integer,  -- en secondes
  ranking integer,
  
  CONSTRAINT player_game_results_unique UNIQUE(game_session_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_player_game_results_game_session_id ON public.player_game_results(game_session_id);
CREATE INDEX IF NOT EXISTS idx_player_game_results_player_id ON public.player_game_results(player_id);
CREATE INDEX IF NOT EXISTS idx_player_game_results_ranking ON public.player_game_results(ranking);

COMMENT ON TABLE public.player_game_results IS 'Résultats détaillés de chaque joueur par partie';

-- 7. PLAYER STATS TABLE - Statistiques consolidées par joueur
CREATE TABLE IF NOT EXISTS public.player_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id varchar(255) NOT NULL UNIQUE,
  total_xp integer DEFAULT 0 CHECK (total_xp >= 0),
  total_stars integer DEFAULT 0 CHECK (total_stars >= 0),
  total_games_played integer DEFAULT 0 CHECK (total_games_played >= 0),
  multiplayer_games_played integer DEFAULT 0 CHECK (multiplayer_games_played >= 0),
  win_count integer DEFAULT 0 CHECK (win_count >= 0),
  average_score numeric(5,2) DEFAULT 0,
  badge_count integer DEFAULT 0 CHECK (badge_count >= 0),
  level integer DEFAULT 1 CHECK (level > 0),
  last_game_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON public.player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_total_xp ON public.player_stats(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_player_stats_level ON public.player_stats(level DESC);
CREATE INDEX IF NOT EXISTS idx_player_stats_updated_at ON public.player_stats(updated_at DESC);

COMMENT ON TABLE public.player_stats IS 'Statistiques consolidées et profil de chaque joueur';

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_earned_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- ROOMS - Lecture/Écriture publique (RLS simplifié)
CREATE POLICY "rooms_public_read" ON public.rooms
  FOR SELECT USING (true);

CREATE POLICY "rooms_public_insert" ON public.rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "rooms_public_update" ON public.rooms
  FOR UPDATE USING (true);

CREATE POLICY "rooms_public_delete" ON public.rooms
  FOR DELETE USING (true);

-- ROOM_MEMBERS (RLS simplifié)
CREATE POLICY "room_members_read" ON public.room_members
  FOR SELECT USING (true);

CREATE POLICY "room_members_insert" ON public.room_members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "room_members_update" ON public.room_members
  FOR UPDATE USING (true);

CREATE POLICY "room_members_delete" ON public.room_members
  FOR DELETE USING (true);

-- BADGE_DEFINITIONS - Lecture seule
CREATE POLICY "badge_definitions_read" ON public.badge_definitions
  FOR SELECT USING (true);

-- PLAYER_EARNED_BADGES (RLS simplifié)
CREATE POLICY "player_earned_badges_read" ON public.player_earned_badges
  FOR SELECT USING (true);

CREATE POLICY "player_earned_badges_insert" ON public.player_earned_badges
  FOR INSERT WITH CHECK (true);

-- GAME_SESSIONS (RLS simplifié)
CREATE POLICY "game_sessions_read" ON public.game_sessions
  FOR SELECT USING (true);

CREATE POLICY "game_sessions_insert" ON public.game_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "game_sessions_update" ON public.game_sessions
  FOR UPDATE USING (true);

-- PLAYER_GAME_RESULTS (RLS simplifié)
CREATE POLICY "player_game_results_read" ON public.player_game_results
  FOR SELECT USING (true);

CREATE POLICY "player_game_results_insert" ON public.player_game_results
  FOR INSERT WITH CHECK (true);

-- PLAYER_STATS (RLS simplifié)
CREATE POLICY "player_stats_read" ON public.player_stats
  FOR SELECT USING (true);

CREATE POLICY "player_stats_insert" ON public.player_stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "player_stats_update" ON public.player_stats
  FOR UPDATE USING (true);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: rooms.updated_at
DROP TRIGGER IF EXISTS rooms_updated_at ON public.rooms;
CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger: player_stats.updated_at
DROP TRIGGER IF EXISTS player_stats_updated_at ON public.player_stats;
CREATE TRIGGER player_stats_updated_at
  BEFORE UPDATE ON public.player_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Function: Calculer le niveau à partir du XP
CREATE OR REPLACE FUNCTION public.calculate_level(total_xp integer)
RETURNS integer AS $$
BEGIN
  RETURN LEAST(GREATEST(1, (total_xp / 100) + 1), 50);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Mettre à jour les stats du joueur (SIMPLIFIÉ)
CREATE OR REPLACE FUNCTION public.update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.player_stats (
    player_id,
    total_xp,
    total_stars,
    total_games_played,
    badge_count,
    level
  )
  SELECT
    NEW.player_id,
    COALESCE(SUM(pgr.xp_earned), 0),
    COALESCE(SUM(pgr.stars_earned), 0),
    COUNT(DISTINCT pgr.game_session_id),
    (SELECT COALESCE(COUNT(*), 0) FROM public.player_earned_badges WHERE player_id = NEW.player_id),
    public.calculate_level(COALESCE(SUM(pgr.xp_earned), 0))
  FROM public.player_game_results pgr
  WHERE pgr.player_id = NEW.player_id
  ON CONFLICT (player_id) DO UPDATE SET
    total_xp = EXCLUDED.total_xp,
    total_stars = EXCLUDED.total_stars,
    total_games_played = EXCLUDED.total_games_played,
    badge_count = EXCLUDED.badge_count,
    level = EXCLUDED.level,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Mettre à jour player_stats après chaque résultat
DROP TRIGGER IF EXISTS update_player_stats_on_result ON public.player_game_results;
CREATE TRIGGER update_player_stats_on_result
  AFTER INSERT OR UPDATE ON public.player_game_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_player_stats();

-- ============================================================================
-- SEED DATA - "BIJOUX AMAZIGHS" BADGES
-- ============================================================================

INSERT INTO public.badge_definitions (badge_name, description_fr, description_ar, icon_url, category, rarity)
VALUES
  (
    'Tazra n Imazighen',
    'Connaissance Amazighe: Répondez correctement à 10 questions culturelles',
    'تاذرا ن إيمازيغن: أجب بشكل صحيح على 10 أسئلة ثقافية',
    '💎',
    'cultural',
    'common'
  ),
  (
    'Azadagh n Umdan',
    'Guerrier Uni: Remportez un défi multijoueur avec des amis',
    'أزاداغ ن أومدان: فز بتحدٍ متعدد اللاعبين مع الأصدقاء',
    '🗡️',
    'multiplayer',
    'uncommon'
  ),
  (
    'Amazir Agmazen',
    'Maître Amazighe: Maîtrisez tous les défis culturels',
    'أمازير أغمازن: أتقن جميع التحديات الثقافية',
    '👑',
    'cultural',
    'rare'
  ),
  (
    'Tafat n Ulac',
    'Chemin Parfait: Complétez une mission sans erreurs',
    'تافات ن أولاك: أكمل مهمة بدون أخطاء',
    '⭐',
    'achievement',
    'rare'
  ),
  (
    'Agellid n Izerfan',
    'Légende Suprême: Atteignez le statut de légende dans tous les défis',
    'أجيليد ن إيزرفان: وصل حالة الأسطورة في جميع التحديات',
    '🏆',
    'achievement',
    'legendary'
  ),
  (
    'Ikerman n Tamsirt',
    'Maître Collectif: Gagnez 5 défis multijoueurs consécutifs',
    'إيكرمان ن تمسيرت: اربح 5 تحديات متعددة لاعبين متتالية',
    '🎯',
    'multiplayer',
    'rare'
  ),
  (
    'Tafernut Tamazight',
    'Fierté Amazighe: Débloquez tous les badges culturels',
    'تافرنوت تامازيغت: فتح جميع الشارات الثقافية',
    '🌟',
    'cultural',
    'legendary'
  ),
  (
    'Idurar Igoudan',
    'Montagne de Persistance: Jouez 100 défis',
    'إيدورار إيغودان: العب 100 تحدٍ',
    '⛰️',
    'achievement',
    'uncommon'
  )
ON CONFLICT (badge_name) DO NOTHING;

-- ============================================================================
-- VIEWS UTILES
-- ============================================================================

-- View: Classement des joueurs
CREATE OR REPLACE VIEW public.player_leaderboard AS
SELECT
  ps.player_id,
  ps.total_xp,
  ps.total_stars,
  ps.level,
  ps.total_games_played,
  ps.multiplayer_games_played,
  ps.win_count,
  ps.badge_count,
  ROW_NUMBER() OVER (ORDER BY ps.total_xp DESC) as rank
FROM public.player_stats ps
WHERE ps.total_xp > 0
ORDER BY ps.total_xp DESC;

-- View: Salons actifs
CREATE OR REPLACE VIEW public.active_rooms AS
SELECT
  r.id,
  r.code,
  r.host_id,
  r.status,
  r.mission_id,
  r.created_at,
  COUNT(rm.id) as member_count,
  STRING_AGG(rm.player_name, ', ') as player_names
FROM public.rooms r
LEFT JOIN public.room_members rm ON r.id = rm.room_id
WHERE r.status IN ('waiting', 'playing')
GROUP BY r.id, r.code, r.host_id, r.status, r.mission_id, r.created_at;

COMMENT ON VIEW public.player_leaderboard IS 'Classement des 100 meilleurs joueurs par XP';
COMMENT ON VIEW public.active_rooms IS 'Salons actuellement actifs avec comptage des joueurs';

-- ============================================================================
-- MIGRATION STATUS
-- ============================================================================

-- Table pour tracker l'état des migrations
CREATE TABLE IF NOT EXISTS public._migration_history (
  id serial PRIMARY KEY,
  migration_name varchar(255) NOT NULL UNIQUE,
  executed_at timestamp with time zone DEFAULT now()
);

INSERT INTO public._migration_history (migration_name)
VALUES ('001_multiplayer_schema_v1.0')
ON CONFLICT (migration_name) DO NOTHING;
