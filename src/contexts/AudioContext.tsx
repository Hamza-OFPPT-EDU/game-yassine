/**
 * AudioContext - Fournit un état global pour les réglages audio.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useSupabaseSettings, useSupabaseProfile, useAuth } from '../hooks/useSupabase';

export interface AudioSettings {
  masterVolume: number;
  soundEffectsEnabled: boolean;
  musicEnabled: boolean;
  voicesEnabled: boolean;
  effectsVolume: number;
  musicVolume: number;
  voiceVolume: number;
}

export type SoundType = 'correct' | 'wrong' | 'click' | 'match' | 'success' | 'whoosh';

const SOUND_FILES: Record<SoundType, string> = {
  correct: '/audio/correct.mp3',
  wrong:   '/audio/wrong.mp3',
  click:   '/audio/click.mp3',
  match:   '/audio/match.mp3',
  success: '/audio/success.mp3',
  whoosh:  '/audio/whoosh.mp3',
};

const BACKGROUND_MUSIC = '/audio/background-theme.mp3';
const STORAGE_KEY = 'voyage_audio_settings';

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 100,
  soundEffectsEnabled: true,
  musicEnabled: true,
  voicesEnabled: true,
  effectsVolume: 80,
  musicVolume: 50,
  voiceVolume: 90,
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
  playVoice: (url: string) => HTMLAudioElement;
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
  const { session } = useAuth();
  const { getSetting, loading: globalSettingsLoading } = useSupabaseSettings();
  const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile(session?.user?.id);
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
      musicRef.current.volume = (settings.musicVolume / 100) * (settings.masterVolume / 100);
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
  }, [settings.musicEnabled, settings.musicVolume, settings.masterVolume, globalSettingsLoading]);

  const playSound = useCallback((type: SoundType) => {
    const globalAudio = getSetting('audio_settings');
    const globalEnabled = globalAudio?.soundEffectsEnabled ?? true;
    
    if (!globalEnabled || !settings.soundEffectsEnabled) return;

    try {
      const audio = getAudioElement(type);
      audio.volume = (settings.effectsVolume / 100) * (settings.masterVolume / 100);
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (_) {}
  }, [settings, getSetting]);

  const playVoice = useCallback((url: string) => {
    const audio = new Audio(url);
    if (!settings.voicesEnabled) {
      audio.volume = 0;
    } else {
      audio.volume = (settings.voiceVolume / 100) * (settings.masterVolume / 100);
    }
    audio.play().catch(() => {});
    return audio;
  }, [settings]);

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
      playVoice,
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
