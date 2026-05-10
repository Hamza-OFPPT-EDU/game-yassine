import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Screen } from '../types';

/**
 * Tracks time spent in various parts of the game and logs them to Supabase.
 */
export function useActivityTracker(userId: string | undefined, currentScreen: Screen, selectedCityId: string | null) {
  const lastUpdateRef = useRef<number>(Date.now());
  const activeSessionRef = useRef<{ type: string, id: string | null } | null>(null);

  const logActivity = async (type: string, id: string | null, duration: number) => {
    if (!userId || duration < 5) return; // Don't log sessions < 5s to avoid noise

    console.log(`[ActivityTracker] Logging ${type} for ${id || 'global'} - Duration: ${Math.floor(duration)}s`);
    
    try {
      await supabase.from('player_activity_logs').insert({
        user_id: userId,
        activity_type: type,
        reference_id: (id && id.length === 36) ? id : null, // Ensure valid UUID if provided
        duration_seconds: Math.floor(duration),
        started_at: new Date(Date.now() - duration * 1000).toISOString(),
        metadata: id && id.length !== 36 ? { slug: id } : {}
      });
    } catch (err) {
      console.error('[ActivityTracker] Failed to log activity:', err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Determine current activity context
    let contextType = 'game_session';
    let contextId = null;

    if (currentScreen === Screen.Story || currentScreen === Screen.CinematicIntro) {
      contextType = 'city_session';
      contextId = selectedCityId;
    } else if (currentScreen === Screen.Challenge || currentScreen === Screen.GrammarQuest || currentScreen === Screen.VocabularyMatch) {
      contextType = 'exercise_session';
      contextId = selectedCityId; // Ideally mission_id but city_id is okay for now
    } else if (currentScreen === Screen.Map) {
      contextType = 'map_browsing';
    } else if (currentScreen === Screen.League || currentScreen === Screen.LeagueDetail) {
      contextType = 'league_session';
    }

    const now = Date.now();
    
    // Close previous session and log it
    if (activeSessionRef.current && activeSessionRef.current.type !== contextType) {
      const duration = (now - lastUpdateRef.current) / 1000;
      logActivity(activeSessionRef.current.type, activeSessionRef.current.id, duration);
      
      // Start new session
      activeSessionRef.current = { type: contextType, id: contextId };
      lastUpdateRef.current = now;
    } else if (!activeSessionRef.current) {
      // First session
      activeSessionRef.current = { type: contextType, id: contextId };
      lastUpdateRef.current = now;
    }

    // Periodic heartbeat logging every 5 minutes for long sessions
    const heartbeatInterval = setInterval(() => {
      if (activeSessionRef.current) {
        const now = Date.now();
        const duration = (now - lastUpdateRef.current) / 1000;
        if (duration >= 60) { // Log at least 1 min chunks
           logActivity(activeSessionRef.current.type, activeSessionRef.current.id, duration);
           lastUpdateRef.current = now;
        }
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [userId, currentScreen, selectedCityId]);

  // Handle page close/unload
  useEffect(() => {
    const handleUnload = () => {
      if (userId && activeSessionRef.current) {
        const duration = (Date.now() - lastUpdateRef.current) / 1000;
        // Navigation might be too late for async fetch, but navigator.sendBeacon is better if supported
        // Here we just try to log a small chunk
        const startedAt = new Date(Date.now() - duration * 1000).toISOString();
        const body = JSON.stringify({
           user_id: userId,
           activity_type: activeSessionRef.current.type,
           duration_seconds: Math.floor(duration),
           started_at: startedAt
        });
        // We can't easily use supabase client in sendBeacon without some extra setup
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [userId]);
}
