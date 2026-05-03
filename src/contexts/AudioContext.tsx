/**
 * AudioContext - Fournit un état global pour les réglages audio.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useSupabaseSettings, useSupabaseProfile } from '../hooks/useSupabase';

export interface AudioSettings {
  soundEffectsEnabled: boolean;
  musicEnabled: boolean;
  effectsVolume: number;
  musicVolume: number;
}

export type SoundType = 'correct' | 'wrong' | 'click' | 'match' | 'success' | 'whoosh';

const SOUND_FILES: Record<SoundType, string> = {
  correct: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/correct.mp3',
  wrong:   'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/wrong.mp3',
  click:   'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/click.mp3',
  match:   'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/match.mp3',
  success: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/success.mp3',
  whoosh:  'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/whoosh.mp3',
};

const BACKGROUND_MUSIC = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/background-theme.mp3';
const STORAGE_KEY = 'voyage_audio_settings';

const DEFAULT_SETTINGS: AudioSettings = {
  soundEffectsEnabled: true,
  musicEnabled: true,
  effectsVolume: 80,
  musicVolume: 50,
};

function loadSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (_) { /* ignore */ }
  return { ...DEFAULT_SETTINGS };
}

interface AudioContextType {
  settings: AudioSettings;
  updateSettings: (patch: Partial<AudioSettings>) => void;
  playSound: (type: SoundType) => void;
  saveToCloud: () => Promise<boolean>;
  loading: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};
function getAudioElement(type: SoundType): HTMLAudioElement {
  if (!audioCache[type]) {
    audioCache[type] = new Audio(SOUND_FILES[type]);
  }
  return audioCache[type]!;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { getSetting, loading: globalSettingsLoading } = useSupabaseSettings();
  const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile();
  const [settings, setSettings] = useState<AudioSettings>(loadSettings);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // Sync with Supabase Profile
  useEffect(() => {
    if (profile?.audio_settings) {
      setSettings(profile.audio_settings);
    }
  }, [profile, profileLoading]);

  // Sync with Local Storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Handle Background Music
  useEffect(() => {
    const globalAudio = getSetting('audio_settings');
    const globalMusicEnabled = globalAudio?.musicEnabled ?? true;
    const isActuallyEnabled = settings.musicEnabled && globalMusicEnabled;

    if (!musicRef.current) {
      musicRef.current = new Audio(BACKGROUND_MUSIC);
      musicRef.current.loop = true;
    }

    if (isActuallyEnabled) {
      musicRef.current.volume = settings.musicVolume / 100;
      musicRef.current.play().catch(() => {
        // Autoplay might be blocked until user interaction
        const playOnInteraction = () => {
          if (settings.musicEnabled && globalMusicEnabled) {
            musicRef.current?.play().catch(() => {});
          }
          window.removeEventListener('click', playOnInteraction);
        };
        window.addEventListener('click', playOnInteraction);
      });
    } else {
      musicRef.current.pause();
    }

    return () => {
      // Cleanup
    };
  }, [settings.musicEnabled, settings.musicVolume, globalSettingsLoading]);

  const playSound = useCallback((type: SoundType) => {
    const globalAudio = getSetting('audio_settings');
    const globalEnabled = globalAudio?.soundEffectsEnabled ?? true;
    
    if (!globalEnabled || !settings.soundEffectsEnabled) return;

    try {
      const audio = getAudioElement(type);
      audio.volume = settings.effectsVolume / 100;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (_) {}
  }, [settings, getSetting]);

  const updateSettings = useCallback((patch: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const saveToCloud = useCallback(async () => {
    if (!profile) return false;
    return await updateProfile({ audio_settings: settings });
  }, [settings, profile, updateProfile]);

  return (
    <AudioContext.Provider value={{ 
      settings, 
      updateSettings, 
      playSound, 
      saveToCloud, 
      loading: globalSettingsLoading || profileLoading 
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
