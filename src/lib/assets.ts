import { supabase } from './supabase';
import { type Asset } from '../hooks/useAssetPreloader';

export const CORE_ASSETS = {
  videos: [
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4',
  ],
  images: [
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/logo.png',
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
    '/audio/intro_music.mp3',
  ]
};

export const fetchDynamicAssets = async (cityId?: string) => {
  const assets: Asset[] = [];
  
  try {
    // 1. Fetch City Assets (from challenges table)
    let cityQuery = supabase
      .from('challenges')
      .select('illustration_url, cinematic_character, icon_name');
    
    if (cityId) {
      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      if (isUUID(cityId)) {
        cityQuery = cityQuery.eq('id', cityId);
      } else {
        cityQuery = cityQuery.or(`city_id.eq.${cityId},city_name_fr.ilike.${cityId}`);
      }
    }

    const { data: cities } = await cityQuery;

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

    // 2. Fetch Mission Assets
    let missionQuery = supabase
      .from('missions')
      .select('id, city_id, cinematic_gif_url, cinematic_audio_url');

    if (cityId) {
      // If we have a cityId, we might need its UUID first if it's a name
      let queryCityId = cityId;
      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      if (!isUUID(cityId)) {
        const { data: cityData } = await supabase
          .from('challenges')
          .select('id')
          .or(`city_id.eq.${cityId},city_name_fr.ilike.${cityId}`)
          .single();
        if (cityData) queryCityId = cityData.id;
      }
      missionQuery = missionQuery.or(`city_id.eq.${queryCityId},challenge_id.eq.${queryCityId}`);
    }

    const { data: missions } = await missionQuery;
    if (missions) {
      missions.forEach(m => {
        if (m.cinematic_gif_url && m.cinematic_gif_url.startsWith('http')) {
          assets.push({ url: m.cinematic_gif_url, type: 'image' });
        }
        if (m.cinematic_audio_url && m.cinematic_audio_url.startsWith('http')) {
          assets.push({ url: m.cinematic_audio_url, type: 'audio' });
        }
      });
    }

    // 3. Fetch Question Assets (Illustrations)
    let questionQuery = supabase
      .from('questions')
      .select('illustration_url, mission_id');

    if (cityId && missions && missions.length > 0) {
      const missionIds = missions.map(m => m.id);
      questionQuery = questionQuery.in('mission_id', missionIds);
    }

    const { data: questions } = await questionQuery;
    if (questions) {
      questions.forEach(q => {
        if (q.illustration_url && q.illustration_url.startsWith('http')) {
          assets.push({ url: q.illustration_url, type: 'image' });
        }
      });
    }

  } catch (err) {
    console.error('Error fetching dynamic assets:', err);
  }

  // Remove duplicates
  const uniqueUrls = new Set<string>();
  return assets.filter(asset => {
    if (uniqueUrls.has(asset.url)) return false;
    uniqueUrls.add(asset.url);
    return true;
  });
};

export const fetchCityMissionAssets = async (cityId: string) => {
  // Now redundant as fetchDynamicAssets handles it, but kept for backward compatibility
  return fetchDynamicAssets(cityId);
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

