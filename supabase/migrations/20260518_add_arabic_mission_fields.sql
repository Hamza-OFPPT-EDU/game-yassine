-- Migration: Add Arabic fields to missions table to support full localization of narrations
-- Execute this in the Supabase SQL Editor: https://supabase.com/dashboard/project/rydmefudpczpxrresflx/sql/new

ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS mentor_name_ar text,
ADD COLUMN IF NOT EXISTS mentor_role_ar text,
ADD COLUMN IF NOT EXISTS script_opening_ar text,
ADD COLUMN IF NOT EXISTS script_closing_ar text,
ADD COLUMN IF NOT EXISTS cinematic_text_ar text;

COMMENT ON COLUMN public.missions.mentor_name_ar IS 'Nom du mentor en arabe';
COMMENT ON COLUMN public.missions.mentor_role_ar IS 'Rôle du mentor en arabe';
COMMENT ON COLUMN public.missions.script_opening_ar IS 'Texte d''ouverture de la mission en arabe';
COMMENT ON COLUMN public.missions.script_closing_ar IS 'Texte de fermeture de la mission en arabe';
COMMENT ON COLUMN public.missions.cinematic_text_ar IS 'Texte de la cinématique en arabe';
