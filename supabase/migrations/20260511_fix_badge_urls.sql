-- Migration to update badge URLs based on user provided list
-- Path: supabase/migrations/20260511_fix_badge_urls.sql

-- Update image_url for badges based on the provided list
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Fnous.png' WHERE badge_name = 'Fnous';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Khalkhal%20Mawj.png' WHERE badge_name = 'Khalkhal Mawj';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/khalkhal.png' WHERE badge_name = 'khalkhal';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/khit-Roh.png' WHERE badge_name = 'khit-Roh';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Khmissa.png' WHERE badge_name = 'Khmissa';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Mdama%20bahar.png' WHERE badge_name = 'Mdama bahar';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Mdama.png' WHERE badge_name = 'Mdama';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Mharma.png' WHERE badge_name = 'Mharma';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Mniqqa.png' WHERE badge_name = 'Mniqqa';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Qabt.png' WHERE badge_name = 'Qabt';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Sertia%20Atlantik.png' WHERE badge_name = 'Sertia Atlantik';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Sertla.png' WHERE badge_name = 'Sertla';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tabraat.png' WHERE badge_name = 'Tabraat';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tazrabt%20Sahara.png' WHERE badge_name = 'Tazrabt Sahara';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tazrabt.png' WHERE badge_name = 'Tazrabt';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tifinagh.png' WHERE badge_name = 'Tifinagh';
UPDATE public.badge_definitions SET image_url = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/Tizerzai.png' WHERE badge_name = 'Tizerzai';

-- Ensure icon_url is also set to a fallback emoji if image fails
UPDATE public.badge_definitions SET icon_url = '🏅' WHERE category = 'cultural' AND icon_url IS NULL;
