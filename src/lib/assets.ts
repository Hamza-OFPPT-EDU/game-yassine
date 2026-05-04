import { supabase } from './supabase';
import { type Asset } from '../hooks/useAssetPreloader';

export const CORE_ASSETS = {
  videos: [
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4',
  ],
  images: [
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/Guide%20de%20voayage.gif',
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatar-map-user.jpg',
    // Cities (Legacy/Hardcoded fallbacks)
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAam8RrX9i8jv1Ae0Fgass0NakYu4DYy4vs1TeTt8RaBSmEeyC7FlqOTU6HxzaXP5tiC-AB9Q7LKvspWZmXunG5o8cSITPFHp-ZSoTqbSAxCyDKscx5g10ainLsKtaETl0Li32nm3Yc08jBeE8UtVKDCSnOE3SLy5lx9QGg1jz29JjL9RGvQE7LwhO-UP-8nf9RDzsLjDfWMOmljJ4FEPCiJSMJSwtywAZJBIiw0luLvYb8IyPkK1JvG6DfNT-vRE97Da0qYcm23FQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDweOhzNui_6YLrqo-bO0jsnpz0r0vGT_8hDBJblWPy7NwHMaZYO2G_RSwZFkogPXigbBoxH-Z_iojYSblvEeCHT0cAKoBp83ZynjbewafML84nsCdMgflJ7zdwV5QvLbcp2CnzY3EEA-PgAZvIGuvnD_MNCeky6Jgirk4Xe-t8ey1mHkp6xTGLaMTvE8XW28GYk7rmJ8KmlWe9Jne33FTHGAHl-WKb8Ook68QpSTmgk6KGznyu2CC0nyD02Nk7xMCxp5alsOSDbyY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBxa5gIFvHnzNsfPn807w_ILftZAoG4nxMRqLsk2MEIhc7e7EapJbhs7n08MHs8SlJ-hmXKvHcWLeKT3ZPUYqebAYclG6b0xJsq4E_iiBMVkZn_PjCXzQG0Rt2gD55hio6_Qf03Ycfy2KmFm_YmKO6sDoeiiJJBFEetNiEohRhsacsVWf6s-dg7gvX3RS-YlUklqoRS70ISdadtfwm1Il6j4y3IakWLP45w_hYxRMj3PmZ7sqgHQhpzxCrXRx83LVEuTfslJcewa0s',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAo5rKbDQN79PlNuvL0J92tWoa79kWMYpbrJCuOKTR4sc6zF3U2zU7ahtX9RoV7PN8nsyFpTM3VSAgBdDMeu-VOsRLn6MTd1wyo675_aRPjoXN3UGh_x6-1ic30Qn64TYvXc02NPE7gn9AeXTOfxWRXDnBZHd9Itq3mHbvFdiJMubRglApslIdlqGTnZSEKZQjjuQs2HXj8u9DoWKMS2shEfPBXyoXvvw4tRtn2d9hupkfWpTZd92TE6fdI7zrpABzkDMs85P1QO-k',
  ],
  audio: [
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/correct.mp3',
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/wrong.mp3',
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/click.mp3',
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/match.mp3',
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/success.mp3',
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/whoosh.mp3',
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/rabat_intro_voice.mp3',
  ]
};

export const fetchDynamicAssets = async () => {
  const assets: Asset[] = [];
  
  try {
    const { data: cities } = await supabase
      .from('challenges')
      .select('illustration_url, cinematic_character, icon_name');

    if (cities) {
      cities.forEach(city => {
        if (city.illustration_url && city.illustration_url.startsWith('http')) {
          assets.push({ url: city.illustration_url, type: 'image' });
        }
        if (city.cinematic_character && city.cinematic_character.startsWith('http')) {
          assets.push({ url: city.cinematic_character, type: 'image' });
        }
        if (city.icon_name && city.icon_name.startsWith('http')) {
          assets.push({ url: city.icon_name, type: 'image' });
        }
      });
    }
  } catch (err) {
    console.error('Error fetching dynamic assets:', err);
  }

  return assets;
};

export const getAllAssets = (dynamicAssets: Asset[] = []) => {
  const assets: Asset[] = [...dynamicAssets];
  
  CORE_ASSETS.images.forEach(url => assets.push({ url, type: 'image' }));
  CORE_ASSETS.audio.forEach(url => assets.push({ url, type: 'audio' }));
  CORE_ASSETS.videos.forEach(url => assets.push({ url, type: 'video' }));
  
  return assets;
};
