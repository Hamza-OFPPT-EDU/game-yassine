import { supabase } from './supabase';
import { type Asset } from '../hooks/useAssetPreloader';

// Helper to optimize Supabase storage URLs
export const optimizeImageUrl = (url: string, width = 800, quality = 80) => {
  if (!url || !url.includes('rydmefudpczpxrresflx.supabase.co')) return url;
  
  if (url.includes('/storage/v1/object/public/')) {
    // Replace object/public with render/image/public and add params
    const baseUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    return `${baseUrl}?width=${width}&quality=${quality}`;
  }
  return url;
};

export const CORE_ASSETS = {
  videos: [
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4',
  ],
  images: [
    'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/logo.png',
    '/assets/guide_voyage.gif',
    '/assets/avatar_user.jpg',
    '/assets/panel.png',
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
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    
    // 1. Prepare City Query
    let cityQuery = supabase
      .from('challenges')
      .select('id, illustration_url, cinematic_character, icon_name');
    
    if (cityId) {
      if (isUUID(cityId)) {
        cityQuery = cityQuery.eq('id', cityId);
      } else {
        cityQuery = cityQuery.or(`city_id.eq.${cityId},city_name_fr.ilike.${cityId}`);
      }
    }

    // 2. Prepare Mission Query
    let missionQuery = supabase
      .from('missions')
      .select('id, city_id, cinematic_gif_url, cinematic_audio_url');

    if (cityId) {
        // If we have a cityId, we might need its UUID first if it's a name
        let queryCityId = cityId;
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

    // 3. Prepare Question Query (Illustration only)
    let questionQuery = supabase
      .from('questions')
      .select('illustration_url, mission_id');

    // Execute queries in parallel
    const [
      { data: cities },
      { data: missions }
    ] = await Promise.all([
      cityQuery,
      missionQuery
    ]);

    if (cities) {
      cities.forEach(city => {
        if (city.illustration_url && city.illustration_url.startsWith('http')) {
          assets.push({ url: optimizeImageUrl(city.illustration_url, 600), type: 'image' });
        }
        if (city.cinematic_character && city.cinematic_character.startsWith('http')) {
          assets.push({ url: optimizeImageUrl(city.cinematic_character, 600), type: 'image' });
        }
        if (city.icon_name && city.icon_name.startsWith('http')) {
          assets.push({ url: optimizeImageUrl(city.icon_name, 200), type: 'image' });
        }
      });
    }

    if (missions) {
      missions.forEach(m => {
        if (m.cinematic_gif_url && m.cinematic_gif_url.startsWith('http')) {
          assets.push({ url: m.cinematic_gif_url, type: 'image' });
        }
        if (m.cinematic_audio_url && m.cinematic_audio_url.startsWith('http')) {
          assets.push({ url: m.cinematic_audio_url, type: 'audio' });
        }
      });

      // Filter questions if mission IDs are available
      if (cityId) {
        const missionIds = missions.map(m => m.id);
        questionQuery = questionQuery.in('mission_id', missionIds);
      }
    }

    const { data: questions } = await questionQuery;
    if (questions) {
      questions.forEach(q => {
        if (q.illustration_url && q.illustration_url.startsWith('http')) {
          assets.push({ url: optimizeImageUrl(q.illustration_url, 400), type: 'image' });
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
  return fetchDynamicAssets(cityId);
};

export const getCoreAssets = () => {
  const assets: Asset[] = [];
  
  // 1. Prioritize Logo
  assets.push({ url: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/logo.png', type: 'image' });
  
  // 2. Prioritize Intro Video
  assets.push({ url: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4', type: 'video' });
  
  // 3. Add remaining core images
  CORE_ASSETS.images.forEach(url => {
    if (url !== 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/logo.png') {
      assets.push({ url, type: 'image' });
    }
  });

  // 4. Add audio
  CORE_ASSETS.audio.forEach(url => assets.push({ url, type: 'audio' }));

  // 5. Add other videos (if any)
  CORE_ASSETS.videos.forEach(url => {
    if (url !== 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4') {
      assets.push({ url, type: 'video' });
    }
  });
  
  return assets;
};

export const getAssetsByPriority = (dynamicAssets: Asset[] = []) => {
  const priorities: Asset[][] = [[], [], [], []];

  // Priority 1: Intro Video and Background Music
  priorities[0].push({ url: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4', type: 'video' });
  priorities[0].push({ url: '/audio/intro_music.mp3', type: 'audio' });
  priorities[0].push({ url: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/logo.png', type: 'image' });

  // Priority 2: Audio Effects
  const effectAudios = [
    '/audio/correct.mp3', '/audio/wrong.mp3', '/audio/click.mp3', 
    '/audio/match.mp3', '/audio/success.mp3', '/audio/whoosh.mp3'
  ];
  effectAudios.forEach(url => priorities[1].push({ url, type: 'audio' }));

  // Priority 3: City Images (Dynamic assets from city table)
  // These are illustration_url, cinematic_character, icon_name
  dynamicAssets.forEach(asset => {
    // Crude filter based on common URL patterns or types if available
    // But since dynamicAssets already filtered city vs mission in fetchDynamicAssets, 
    // we should really separate them there. 
    // For now, let's assume images that are not GIFs are city images.
    if (asset.type === 'image' && !asset.url.toLowerCase().endsWith('.gif')) {
      priorities[2].push(asset);
    }
  });

  // Priority 4: GIFs and Narration Audios
  dynamicAssets.forEach(asset => {
    if (asset.url.toLowerCase().endsWith('.gif') || asset.type === 'audio') {
      priorities[3].push(asset);
    }
  });

  return priorities;
};

export const getAllAssets = (dynamicAssets: Asset[] = []) => {
  const assets: Asset[] = [...dynamicAssets];
  const core = getCoreAssets();
  
  // Combine all but remove duplicates
  const all = [...assets, ...core];
  const uniqueUrls = new Set<string>();
  return all.filter(a => {
    if (uniqueUrls.has(a.url)) return false;
    uniqueUrls.add(a.url);
    return true;
  });
};
