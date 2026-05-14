-- Seed developer info setting if not exists
INSERT INTO public.app_settings (key, value, description)
VALUES (
  'developer_info',
  '{"name": "Hamza", "photo_url": "https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/dev-photo.png", "linkedin_url": "https://www.linkedin.com/in/hamza-ofppt", "qr_code_url": "https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/dev-linkedin-qr.png"}',
  'Informations sur le développeur (Photo, LinkedIn, QR Code)'
)
ON CONFLICT (key) DO NOTHING;
