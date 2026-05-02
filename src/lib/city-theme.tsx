import React from 'react';
import { 
  Landmark, Flower2, Castle, Mountain, Ship, Sun, Shield, 
  MapPin, Tent, Waves, Compass, Landmark as LandmarkIcon,
  Palmtree, Book, GraduationCap, Users, Rocket, Building2,
  Gem, Heart, Star, Camera, Music
} from 'lucide-react';
import { type City } from '../types';

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
  const iconName = city.iconName || '';
  
  // 1. Image URLs
  if (iconName.startsWith('http')) {
    return <img src={iconName} style={{ width: size, height: size, objectFit: 'contain' }} className={className} alt="icon" />;
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
