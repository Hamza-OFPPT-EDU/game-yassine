/**
 * useAudio - Hook de gestion des effets sonores et de la musique de fond.
 * Utilise les fichiers MP3 dans /public/audio/.
 * Persiste les préférences dans localStorage.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSupabaseSettings, useSupabaseProfile } from './useSupabase';

export interface AudioSettings {
  soundEffectsEnabled: boolean;
  musicEnabled: boolean;
  effectsVolume: number;   // 0 → 100
  musicVolume: number;     // 0 → 100
}

// ─── Types de sons disponibles ───────────────────────────────────────────────
export type SoundType = 'correct' | 'wrong' | 'click' | 'match' | 'success' | 'whoosh';

// Correspondance son → fichier dans /public/audio/
const SOUND_FILES: Record<SoundType, string> = {
  correct: '/audio/correct.mp3',
  wrong:   '/audio/wrong.mp3',
  click:   '/audio/click.mp3',
  match:   '/audio/match.mp3',
  success: '/audio/success.mp3',
  whoosh:  '/audio/whoosh.mp3',
};

// ─── Persistance ─────────────────────────────────────────────────────────────
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

function saveSettings(s: AudioSettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (_) { /* ignore */ }
}

// ─── Cache des objets Audio ───────────────────────────────────────────────────
// On pré-instancie chaque son pour éviter la latence au premier clic
const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};

function getAudioElement(type: SoundType): HTMLAudioElement {
  if (!audioCache[type]) {
    audioCache[type] = new Audio(SOUND_FILES[type]);
  }
  return audioCache[type]!;
}

// ─── Hook principal ───────────────────────────────────────────────────────────
export function useAudio() {
  const { getSetting, loading: globalSettingsLoading } = useSupabaseSettings();
  const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile();
  const [settings, setSettings] = useState<AudioSettings>(loadSettings);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // 1. Sync with Global settings (Master Switch)
  // These act as an override or a default
  useEffect(() => {
    const globalAudio = getSetting('audio_settings');
    if (globalAudio) {
      // If global is disabled, we don't necessarily force local to disabled,
      // but the playSound function will check the global flag.
    }
  }, [globalSettingsLoading]);

  // 2. Sync with Individual Profile settings from Supabase
  useEffect(() => {
    if (profile?.audio_settings) {
      setSettings(profile.audio_settings);
      saveSettings(profile.audio_settings);
    }
  }, [profileLoading]);

  // Persist locally on every change
  useEffect(() => { saveSettings(settings); }, [settings]);

  // ── Musique de fond ──────────────────────────────────────────────────────
  // (Bloc musique identique...)
  useEffect(() => {
    return () => { musicRef.current?.pause(); };
  }, []);

  // ── Lecture d'un effet sonore ─────────────────────────────────────────────
  const playSound = useCallback((type: SoundType) => {
    // 1. Check global master switch from DB (Administrator control)
    const globalAudio = getSetting('audio_settings');
    const globalEnabled = globalAudio?.soundEffectsEnabled ?? true;
    
    // 2. Check individual user setting
    if (!globalEnabled || !settings.soundEffectsEnabled) return;

    try {
      const audio = getAudioElement(type);
      audio.volume = settings.effectsVolume / 100;
      audio.currentTime = 0;
      audio.play().catch(() => { /* silenced by browser */ });
    } catch (_) { /* ignore */ }
  }, [settings.soundEffectsEnabled, settings.effectsVolume, globalSettingsLoading]);

  // ── Mise à jour des réglages ──────────────────────────────────────────────
  const updateSettings = useCallback((patch: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  // ── Sauvegarde vers le Cloud ──────────────────────────────────────────────
  const saveToCloud = useCallback(async () => {
    if (!profile) return false;
    return await updateProfile({ audio_settings: settings });
  }, [settings, profile, updateProfile]);

  return { 
    settings, 
    updateSettings, 
    saveToCloud, 
    playSound, 
    loading: globalSettingsLoading || profileLoading 
  };
}
