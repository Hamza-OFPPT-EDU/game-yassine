import { supabase } from './supabase';
import { type Asset } from '../hooks/useAssetPreloader';

export const CORE_ASSETS = {
  videos: [
    '/assets/splash_video.mp4',
  ],
  images: [
    '/assets/guide_voyage.gif',
    '/assets/avatar_user.jpg',
    '/assets/panel.png',
    // Cities (Legacy/Hardcoded fallbacks)
    '/assets/fallback_city.jpg',
  ],
  audio: [
    '/audio/correct.mp3',
    '/audio/wrong.mp3',
    '/audio/click.mp3',
    '/audio/match.mp3',
    '/audio/success.mp3',
    '/audio/whoosh.mp3',
    '/audio/rabat_intro_voice.mp3',
  ]
};

export const fetchDynamicAssets = async (cityId?: string) => {
  const assets: Asset[] = [];
  
  try {
    let query = supabase
      .from('challenges')
      .select('illustration_url, cinematic_character, icon_name');
    
    if (cityId) {
      // If it's a UUID, use eq. Otherwise, try matching slug/name
      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      if (isUUID(cityId)) {
        query = query.eq('id', cityId);
      } else {
        query = query.or(`city_id.eq.${cityId},city_name_fr.ilike.${cityId}`);
      }
    }

    const { data: cities } = await query;

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

export const fetchCityMissionAssets = async (cityId: string) => {
  const assets: Asset[] = [];
  
  try {
    // Resolve UUID if needed
    let queryCityId = cityId;
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    
    if (!isUUID(cityId)) {
      const { data: cityData } = await supabase
        .from('challenges')
        .select('id')
        .or(`city_id.eq.${cityId},city_name_fr.ilike.${cityId}`)
        .single();
      
      if (cityData) {
        queryCityId = cityData.id;
      }
    }

    const { data: missions } = await supabase
      .from('missions')
      .select('cinematic_gif_url, cinematic_audio_url')
      .or(`city_id.eq.${queryCityId},challenge_id.eq.${queryCityId}`);

    if (missions) {
      missions.forEach(mission => {
        if (mission.cinematic_gif_url && mission.cinematic_gif_url.startsWith('http')) {
          assets.push({ url: mission.cinematic_gif_url, type: 'image' });
        }
        if (mission.cinematic_audio_url && mission.cinematic_audio_url.startsWith('http')) {
          assets.push({ url: mission.cinematic_audio_url, type: 'audio' });
        }
      });
    }
  } catch (err) {
    console.error('Error fetching mission assets:', err);
  }

  return assets;
};

export const getCoreAssets = () => {
  const assets: Asset[] = [];
  
  CORE_ASSETS.images.forEach(url => assets.push({ url, type: 'image' }));
  CORE_ASSETS.audio.forEach(url => assets.push({ url, type: 'audio' }));
  CORE_ASSETS.videos.forEach(url => assets.push({ url, type: 'video' }));
  
  return assets;
};

export const getAllAssets = (dynamicAssets: Asset[] = []) => {
  const assets: Asset[] = [...dynamicAssets];
  
  const core = getCoreAssets();
  return [...assets, ...core];
};
