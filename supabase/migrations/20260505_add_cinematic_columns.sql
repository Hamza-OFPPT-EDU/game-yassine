-- Migration: Add cinematic fields to missions table
-- Execute this in the Supabase SQL Editor

ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS cinematic_text text,
ADD COLUMN IF NOT EXISTS cinematic_gif_url text,
ADD COLUMN IF NOT EXISTS cinematic_audio_url text;

COMMENT ON COLUMN public.missions.cinematic_text IS 'Texte narratif affiché pendant la cinématique d''introduction';
COMMENT ON COLUMN public.missions.cinematic_gif_url IS 'URL de l''image GIF pour la cinématique';
COMMENT ON COLUMN public.missions.cinematic_audio_url IS 'URL de l''audio MP3 pour la cinématique';
