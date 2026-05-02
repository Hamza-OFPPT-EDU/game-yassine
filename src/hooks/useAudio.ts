/**
 * useAudio - Hook de gestion des effets sonores et de la musique de fond.
 * Utilise les fichiers MP3 dans /public/audio/.
 * Persiste les préférences dans localStorage.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSupabaseSettings } from './useSupabase';

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
  const { getSetting, loading: settingsLoading } = useSupabaseSettings();
  const [settings, setSettings] = useState<AudioSettings>(loadSettings);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // Sync with Supabase settings when they load
  useEffect(() => {
    const dbSettings = getSetting('audio_settings');
    if (dbSettings) {
      setSettings(prev => ({
        ...prev,
        ...dbSettings
      }));
    }
  }, [settingsLoading]);

  // Persist on change
  useEffect(() => { saveSettings(settings); }, [settings]);

  // ── Musique de fond ──────────────────────────────────────────────────────
  // Si tu ajoutes un fichier music.mp3 dans /public/audio/ plus tard,
  // décommente la ligne suivante et le bloc ci-dessous.
  //
  // const MUSIC_FILE = '/audio/music.mp3';
  //
  // useEffect(() => {
  //   if (!musicRef.current) {
  //     musicRef.current = new Audio(MUSIC_FILE);
  //     musicRef.current.loop = true;
  //   }
  //   const music = musicRef.current;
  //   music.volume = settings.musicVolume / 100;
  //   if (settings.musicEnabled) {
  //     music.play().catch(() => { /* autoplay bloqué */ });
  //   } else {
  //     music.pause();
  //   }
  //   return () => { music.pause(); };
  // }, [settings.musicEnabled, settings.musicVolume]);

  // Nettoyage si unmount
  useEffect(() => {
    return () => { musicRef.current?.pause(); };
  }, []);

  // ── Lecture d'un effet sonore ─────────────────────────────────────────────
  const playSound = useCallback((type: SoundType) => {
    // 1. Check global master switch from DB
    const globalSettings = getSetting('audio_settings');
    const globalEnabled = globalSettings?.soundEffectsEnabled ?? true;
    
    // 2. Check local setting
    if (!globalEnabled || !settings.soundEffectsEnabled) return;

    try {
      const audio = getAudioElement(type);
      audio.volume = settings.effectsVolume / 100;
      audio.currentTime = 0;   // permet de rejouer rapidement
      audio.play().catch(() => { /* autoplay policy — silencieux */ });
    } catch (_) { /* ignore */ }
  }, [settings.soundEffectsEnabled, settings.effectsVolume, settingsLoading]);

  // ── Mise à jour des réglages ──────────────────────────────────────────────
  const updateSettings = useCallback((patch: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  return { settings, updateSettings, playSound };
}
