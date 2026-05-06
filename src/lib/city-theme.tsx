import React from 'react';
import { 
  Landmark, Flower2, Castle, Mountain, Ship, Sun, Shield, 
  MapPin, Tent, Waves, Compass, Landmark as LandmarkIcon,
  Palmtree, Book, GraduationCap, Users, Rocket, Building2,
  Gem, Heart, Star, Camera, Music
} from 'lucide-react';
import { type City } from '../types';
import { cn } from './utils';

/**
 * Optimizes a Supabase storage URL using their transformation service.
 * Converts /object/public/ to /render/image/public/ and adds transformation parameters.
 */
export const optimizeSupabaseUrl = (url: string, width = 200, quality = 75) => {
  if (!url || typeof url !== 'string') return url;
  
  // Intercept known failing Supabase instance and redirect to local for certain assets
  if (url.includes('rydmefudpczpxrresflx.supabase.co')) {
    const fileName = url.split('/').pop()?.split('?')[0] || '';
    const decodedName = decodeURIComponent(fileName);
    
    // Allow videos to pass through if they work on Supabase
    if (url.match(/\.(mp4|webm|ogv)$/i)) {
      return url;
    }

    if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      return `/audio/${decodedName}`;
    }
    
    // For images/gifs, redirect to local placeholders if they are known to be missing or problematic
    const legacyAssets: Record<string, string> = {
      'paneau.png': 'panel.png',
      'Guide de voayage.gif': 'guide_voyage.gif',
      'avatar-map-user.jpg': 'avatar_user.jpg',
      'fallback-city.jpg': 'fallback_city.jpg'
    };

    if (legacyAssets[decodedName]) {
      return `/assets/${legacyAssets[decodedName]}`;
    }
    
    // Otherwise, let it through to normal optimization
  }

  // 1. Never optimize audio or video files
  if (url.match(/\.(mp3|wav|ogg|m4a|mp4|webm|ogv)$/i)) {
    return url;
  }

  // 2. Only apply to Supabase storage URLs for images
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    // Check if it's a GIF (ignoring query params)
    const isGif = url.split('?')[0].toLowerCase().endsWith('.gif');
    if (isGif) return url;
    try {
      const transformed = url.replace('/object/public/', '/render/image/public/');
      return `${transformed}?width=${width}&quality=${quality}`;
    } catch (e) {
      return url;
    }
  }
  return url;
};

/**
 * Resolves technical asset names (like 'intro_caracter') to full URLs
 */
export const resolveAssetUrl = (name: string | undefined, fallback: string) => {
  if (!name) return fallback;
  if (name.startsWith('http')) return name;
  
  // Mapping for known technical names in dashboard
  const mapping: Record<string, string> = {
    'intro_caracter': 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/Guide%20de%20voayage.gif',
    'guide': '/assets/game/guide_portrait.png',
    'dr_amina': '/assets/game/dr_amina_portrait.png',
    'avatar_map': 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatar-map-user.jpg',
    'paneau': 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/paneau.png',
    'hospital_bg': '/assets/game/hospital_bg.png',

  };
  
  return mapping[name] || fallback;
};

/**
 * Adjusts a hex color brightness
 */
export const adjustColor = (hex: string, amt: number) => {
  let col = hex.replace(/^#/, '');
  if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
  let [r, g, b] = col.match(/.{2}/g)!.map(x => parseInt(x, 16));
  r = Math.max(0, Math.min(255, r + amt));
  g = Math.max(0, Math.min(255, g + amt));
  b = Math.max(0, Math.min(255, b + amt));
  const newHex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  return newHex;
};

/**
 * Generates a consistent theme for a city based on its base color
 */
export const getCityTheme = (city: City | null) => {
  const baseColor = city?.color || '#8B4513';
  return {
    color: baseColor,
    colorDark: adjustColor(baseColor, -20),
    colorLight: adjustColor(baseColor, 20),
    bgGradient: `linear-gradient(135deg, ${baseColor}, ${baseColor}CC)`,
    accent: adjustColor(baseColor, 40)
  };
};

/**
 * Resolves an icon for a city (supports Lucide names, emojis, and URLs)
 */
export const resolveCityIcon = (city: City, size = 72, className = "") => {
  const iconName = city.iconName || city.iconUrl || '';
  
  // 1. Image URLs (Custom uploads or external links)
  if (iconName.startsWith('http')) {
    // Apply Supabase optimization if it's a Supabase URL
    const optimizedUrl = optimizeSupabaseUrl(iconName, size * 2, 75);
    return <img src={optimizedUrl} style={{ width: size, height: size, objectFit: 'cover' }} className={className} alt="icon" />;
  }

  // 2. Emojis
  if (iconName.startsWith('emoji:')) {
    const emoji = iconName.split(':')[1];
    return <span style={{ fontSize: size * 0.8 }} className={className}>{emoji}</span>;
  }

  // 3. Lucide Names Mapping
  const name = iconName.toLowerCase();
  const props = { size, className };
  
  if (name === 'landmark') return <Landmark {...props} />;
  if (name === 'castle') return <Castle {...props} />;
  if (name === 'tent') return <Tent {...props} />;
  if (name === 'waves') return <Waves {...props} />;
  if (name === 'mountain') return <Mountain {...props} />;
  if (name === 'ship') return <Ship {...props} />;
  if (name === 'sun') return <Sun {...props} />;
  if (name === 'shield') return <Shield {...props} />;
  if (name === 'flower') return <Flower2 {...props} />;
  if (name === 'compass') return <Compass {...props} />;
  if (name === 'mosque') return <LandmarkIcon {...props} />;
  if (name === 'palmtree') return <Palmtree {...props} />;
  if (name === 'book') return <Book {...props} />;
  if (name === 'education' || name === 'graduation') return <GraduationCap {...props} />;
  if (name === 'users' || name === 'team') return <Users {...props} />;
  if (name === 'rocket' || name === 'start') return <Rocket {...props} />;
  if (name === 'building' || name === 'city') return <Building2 {...props} />;
  if (name === 'gem' || name === 'premium') return <Gem {...props} />;
  if (name === 'heart') return <Heart {...props} />;
  if (name === 'star') return <Star {...props} />;
  if (name === 'camera') return <Camera {...props} />;
  if (name === 'music') return <Music {...props} />;

  // 4. Default City Mapping (Legacy)
  const cityId = city.id?.toLowerCase();
  if (cityId === 'rabat') return <Landmark {...props} />;
  if (cityId === 'marrakech') return <Flower2 {...props} />;
  if (cityId === 'fes') return <Castle {...props} />;
  if (cityId === 'chefchaouen') return <Mountain {...props} />;
  if (cityId === 'laayoune') return <LandmarkIcon {...props} />;
  if (cityId === 'dakhla') return <Ship {...props} />;
  if (cityId === 'agadir') return <Sun {...props} />;
  if (cityId === 'meknes') return <Shield {...props} />;

  return <MapPin {...props} />;
};
