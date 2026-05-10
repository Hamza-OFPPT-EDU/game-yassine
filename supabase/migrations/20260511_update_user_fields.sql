-- 1. Create Organizations table for groups
CREATE TABLE IF NOT EXISTS public.organizations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Seed some organizations
INSERT INTO public.organizations (name) VALUES 
('OFPPT - Casablanca'),
('OFPPT - Rabat'),
('OFPPT - Tanger'),
('OFPPT - Marrakech'),
('OFPPT - Agadir'),
('Université Mohammed V'),
('Freelance / Indépendant'),
('Formation Continue')
ON CONFLICT (name) DO NOTHING;

-- 3. Update app_users table with requested fields
ALTER TABLE public.app_users 
ADD COLUMN IF NOT EXISTS first_name varchar(255),
ADD COLUMN IF NOT EXISTS last_name varchar(255),
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id);

-- 4. Sync existing full_name to first_name/last_name if they are empty
-- This helps populate the new fields for existing users
UPDATE public.app_users 
SET first_name = split_part(full_name, ' ', 1),
    last_name = CASE 
        WHEN position(' ' in full_name) > 0 THEN substring(full_name from position(' ' in full_name) + 1)
        ELSE ''
    END
WHERE (first_name IS NULL OR first_name = '') AND full_name IS NOT NULL;

-- 5. Add RLS for organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organizations_public_read" ON public.organizations FOR SELECT USING (true);
