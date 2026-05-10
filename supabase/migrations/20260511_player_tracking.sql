-- 20260511_player_tracking.sql
-- Tracking user sessions and granular activities

-- 1. Detailed Activity Logs
CREATE TABLE IF NOT EXISTS public.player_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'game_session', 'city_session', 'exercise_session', 'badge_earned', 'competition_joined'
    reference_id UUID, -- city_id, mission_id, etc.
    duration_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Daily Aggregated Stats for Performance
CREATE TABLE IF NOT EXISTS public.player_daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    game_time_seconds INTEGER DEFAULT 0,
    city_time_seconds INTEGER DEFAULT 0,
    exercise_time_seconds INTEGER DEFAULT 0,
    badges_earned_count INTEGER DEFAULT 0,
    missions_completed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, date)
);

-- 3. RLS Policies
ALTER TABLE public.player_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own logs" ON public.player_activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own logs" ON public.player_activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all logs" ON public.player_activity_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.app_users WHERE id = auth.uid() AND group_name = 'ADMIN'));

CREATE POLICY "Users can view their own stats" ON public.player_daily_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all stats" ON public.player_daily_stats FOR SELECT USING (EXISTS (SELECT 1 FROM public.app_users WHERE id = auth.uid() AND group_name = 'ADMIN'));

-- 4. Function to update daily stats automatically on log insertion
CREATE OR REPLACE FUNCTION update_daily_stats() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.player_daily_stats (user_id, date)
    VALUES (NEW.user_id, CURRENT_DATE)
    ON CONFLICT (user_id, date) DO NOTHING;

    IF NEW.activity_type = 'game_session' THEN
        UPDATE public.player_daily_stats 
        SET game_time_seconds = game_time_seconds + NEW.duration_seconds
        WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
    ELSIF NEW.activity_type = 'city_session' THEN
        UPDATE public.player_daily_stats 
        SET city_time_seconds = city_time_seconds + NEW.duration_seconds
        WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
    ELSIF NEW.activity_type = 'exercise_session' THEN
        UPDATE public.player_daily_stats 
        SET exercise_time_seconds = exercise_time_seconds + NEW.duration_seconds
        WHERE user_id = NEW.user_id AND date = CURRENT_DATE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_daily_stats
AFTER INSERT ON public.player_activity_logs
FOR EACH ROW EXECUTE FUNCTION update_daily_stats();
