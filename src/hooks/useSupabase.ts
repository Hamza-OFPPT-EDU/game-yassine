/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CITIES, type Challenge, type City, type Mission, DEFAULT_AVATAR_URL } from '../types';
import { Session } from '@supabase/supabase-js';
import { useSettings } from '../contexts/SettingsContext';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}

function buildFallbackCities(completedCities: string[], freeExploration: boolean = false): City[] {
  const firstIncompleteIndex = CITIES.findIndex((city) => !completedCities.includes(city.id));

  return CITIES.map((city, index) => {
    const isCompleted = completedCities.includes(city.id);
    let status: City['status'] = isCompleted
      ? 'completed'
      : firstIncompleteIndex === -1
        ? (index === CITIES.length - 1 ? 'active' : 'locked')
        : (index === firstIncompleteIndex ? 'active' : 'locked');

    if (freeExploration && status === 'locked') {
      status = 'active';
    }

    return {
      ...city,
      status,
      stepNum: isCompleted ? city.totalSteps : city.stepNum,
    };
  });
}

export function useSupabaseCities(completedCities: string[], completedMissions: string[]) {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { freeExploration } = useSettings();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch global settings
        const { data: globalSettings } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'global_free_exploration')
          .single();
        
        const isGlobalFreeExploration = globalSettings?.value === true || globalSettings?.value === 'true';
        const effectiveFreeExploration = freeExploration || isGlobalFreeExploration;

        // Fetch cities
        const { data: cityData, error: cityError } = await supabase
          .from('challenges')
          .select('*')
          .order('sort_order', { ascending: true });

        // Fetch missions to count steps
        const { data: missionData, error: missionError } = await supabase
          .from('missions')
          .select('id, city_id');

        if (cityError || missionError) throw cityError || missionError;

        if (!cityData || cityData.length === 0) {
          console.warn('No cities found in database');
          setCities([]);
          setLoading(false);
          return;
        }

        const mappedCities = (cityData || []).map((city) => {
          const cityMissions = (missionData || []).filter(m => m.city_id === city.id);
          const totalSteps = cityMissions.length || 1;
          const completedInCity = cityMissions.filter(m => completedMissions.includes(m.id)).length;
          
          const isFinished = completedInCity >= totalSteps && totalSteps > 0;
          const isCompleted = completedCities.includes(city.id) || isFinished;
          let status: 'locked' | 'active' | 'completed' = isCompleted ? 'completed' : 'locked';
          
          const firstIncomplete = (cityData || []).find(c => {
            const cMissions = (missionData || []).filter(m => m.city_id === c.id);
            const cTotal = cMissions.length || 1;
            const cCompleted = cMissions.filter(m => completedMissions.includes(m.id)).length;
            return !completedCities.includes(c.id) && cCompleted < cTotal;
          });
          if (!isCompleted && firstIncomplete && firstIncomplete.id === city.id) {
            status = 'active';
          }

          // Open access mode: if effectiveFreeExploration is true, nothing is locked
          if (effectiveFreeExploration && status === 'locked') {
            status = 'active';
          }

          return {
            id: city.id,
            name: city.city_name_fr,
            arabicName: city.city_name_ar,
            description: city.description_fr,
            arabicDescription: city.description_ar || '',
            focus: city.focus_fr,
            points: 500,
            image: city.illustration_url,
            iconUrl: city.icon_name,
            status,
            stepNum: completedInCity + 1 > totalSteps ? totalSteps : completedInCity + 1,
            totalSteps,
            cinematicIntro: city.cinematic_intro,
            cinematicCharacter: city.cinematic_character,
            color: city.city_color,
            iconName: city.icon_name,
            iconSize: city.icon_size || 52,
            learningOutcomes: city.learning_outcomes,
            keyCompetencies: city.pedagogical_theories,
            headline: city.headline_fr,
            arabicHeadline: city.headline_ar,
            missionsTitle: city.missions_title_fr,
            arabicMissionsTitle: city.missions_title_ar,
            acteTitle: city.acte_title,
            stepLabel: city.step_label
          };
        });
        setCities(mappedCities);
      } catch (err) {
        console.error('Failed to link with database:', err);
        // We still keep the fallback only as a last resort to prevent app crash
        setCities(buildFallbackCities(completedCities, freeExploration));
      }
      setLoading(false);
    }

    fetchData();
  }, [completedCities, completedMissions]);

  return { cities, loading };
}

export function useSupabaseMissions(cityId: string, completedMissions: string[] = []) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { freeExploration } = useSettings();

  useEffect(() => {
    async function fetchMissions() {
      // Fetch global settings
      const { data: globalSettings } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'global_free_exploration')
        .single();
      
      const isGlobalFreeExploration = globalSettings?.value === true || globalSettings?.value === 'true';
      const effectiveFreeExploration = freeExploration || isGlobalFreeExploration;

      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      let queryCityId = cityId;
      
      if (!isUUID(cityId)) {
        const { data: cityData } = await supabase
          .from('challenges')
          .select('id')
          .or(`city_id.eq.${cityId},city_name_fr.ilike.${cityId}`)
          .single();
        
        if (cityData) queryCityId = cityData.id;
      }

      let { data, error } = await supabase
        .from('missions')
        .select('*')
        .or(`city_id.eq.${queryCityId},challenge_id.eq.${queryCityId}`)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching missions:', error);
      } else {
        const mappedMissions = (data || []).map((m: any, index: number) => {
          const isDone = completedMissions.includes(m.id);
          
          // Logic for linear mission progression
          const firstIncompleteIndex = (data || []).findIndex((mission: any) => !completedMissions.includes(mission.id));
          let status: Mission['status'] = isDone ? 'completed' : 
                                          (index === firstIncompleteIndex ? 'active' : 'locked');
          
          if (effectiveFreeExploration && status === 'locked') {
            status = 'active';
          }

          let mentorName = m.mentor_name;
          let mentorRole = m.mentor_role;
          if (!mentorName && m.profils && m.profils.length > 0) {
            mentorName = m.profils[0].nom;
            mentorRole = m.profils[0].profession;
          }

          let scriptOpening = m.script_opening;
          if (!scriptOpening && m.narration?.intro?.texte) {
            scriptOpening = m.narration.intro.texte;
          }

          return {
            ...m,
            status,
            xp_reward: m.xp_reward || 0,
            mentor_name: mentorName,
            mentor_role: mentorRole,
            script_opening: scriptOpening,
            cinematic_text: m.cinematic_text,
            cinematic_gif_url: m.cinematic_gif_url,
            cinematic_audio_url: m.cinematic_audio_url
          };
        });
        setMissions(mappedMissions);
      }
      setLoading(false);
    }

    if (cityId) fetchMissions();
  }, [cityId, completedMissions, freeExploration]);

  return { missions, loading };
}

export function useSupabaseQuestions(missionId: string) {
  const [questions, setQuestions] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('mission_id', missionId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        const mappedQuestions: Challenge[] = (data || []).map((q: any) => {
          const type = mapType(q.question_type);
          let options = q.options;
          let steps = undefined;
          
          // Handle different option structures based on question type
          if (Array.isArray(q.options)) {
            // Standard array format
            options = q.options.map((opt: any, idx: number) => ({
              id: opt.id || String(idx),
              text: opt.text_fr || opt.left_fr || opt.left || opt.label_fr || opt.label || opt.text || (typeof opt === 'string' ? opt : ''),
              label: opt.label || opt.label_fr || String.fromCharCode(65 + idx),
              match: opt.match || opt.right_fr || opt.right || '',
              isError: !!opt.is_error
            }));
          } else if (q.options?.pairs) {
            // Matching question format: { pairs: [{ left, right }] }
            options = q.options.pairs.map((p: any, idx: number) => ({
              id: String(idx),
              text: p.item || p.left || p.left_fr || '',
              label: String.fromCharCode(65 + idx),
              match: p.match || p.right || p.right_fr || ''
            }));
          } else if (q.options?.bank) {
            // Fill-in-blanks format: { bank: [...] }
            options = (q.options.bank || []).map((item: any, idx: number) => ({
              id: String(idx),
              text: typeof item === 'string' ? item : (item.text || item.text_fr || ''),
              label: String.fromCharCode(65 + idx)
            }));
          } else if (q.options?.steps || q.options?.errors) {
            // Handle scenario-cascade (steps) or error-detection (errors)
            if (q.options.steps) {
              steps = q.options.steps;
              options = (q.options.options || []).map((opt: any, idx: number) => ({
                id: opt.id || String(idx),
                text: opt.text_fr || opt.label_fr || opt.label || opt.text || (typeof opt === 'string' ? opt : ''),
                label: opt.label || opt.label_fr || String.fromCharCode(65 + idx),
                match: opt.match || opt.right_fr || ''
              }));
              
              // If no top-level options, try to extract from the first step
              if (options.length === 0 && steps.length > 0 && (steps[0].responses || steps[0].options)) {
                const stepOptions = steps[0].responses || steps[0].options;
                options = stepOptions.map((opt: any, idx: number) => ({
                  id: opt.id || String(idx),
                  text: opt.text || opt.text_fr || opt.label || opt.label_fr || '',
                  label: opt.label || String.fromCharCode(65 + idx)
                }));
              }
            } else if (q.options.errors) {
              options = q.options.errors.map((err: any, idx: number) => ({
                id: err.id || String(idx),
                text: err.text_fr || err.text || '',
                label: String.fromCharCode(65 + idx),
                isError: !!err.is_error || err.isError || false
              }));
            }
          } else if (q.options?.order) {
            // Ranking format: { order: [...] }
            options = q.options.order.map((item: any, idx: number) => ({
              id: item.id || String(idx),
              text: item.text_fr || item.label_fr || item.text || '',
              label: String.fromCharCode(65 + idx)
            }));
          } else if (!q.options) {
            // No options provided - check type for defaults
            if (type === 'true-false') {
              options = [
                { id: 'vrai', text: 'Vrai', label: 'V' },
                { id: 'faux', text: 'Faux', label: 'F' }
              ];
            } else {
              options = [];
            }
          }

          // Format content for fill-in-blanks if it uses underscores or is missing placeholders
          let content = q.presentation_fr || q.question_fr 
            ? [q.presentation_fr || q.question_fr] 
            : [];
          
          if (type === 'fill-in-blanks' && content.length > 0) {
            let processed = content[0];
            
            // If it's fill-in-blanks but has no placeholders, and we have options, 
            // maybe we should append them or log a warning.
            // For now, let's ensure it has at least one placeholder if options exist.
            if (!processed.includes('__________') && !processed.includes('...') && !processed.includes('[1]') && options.length > 0) {
              // Try to inject enough placeholders for the correct answers
              const correctAnswers = q.correct_answer?.split(/[|,]/) || [];
              const placeholderCount = Math.max(1, correctAnswers.length);
              processed += " " + Array(placeholderCount).fill('__________').join(' ');
            }

            let count = 1;
            // Replace __________ or ... with [1], [2], etc.
            while (processed.includes('__________') || processed.includes('...')) {
              processed = processed.replace('__________', `[${count}]`).replace('...', `[${count}]`);
              count++;
            }
            content = [processed];
          }

          return {
            id: q.id,
            type,
            xp_reward: q.xp_reward,
            title: q.question_fr ? (q.question_fr.length > 40 ? q.question_fr.substring(0, 40) + '...' : q.question_fr) : 'Défi',
            question: q.question_fr,
            arabicQuestion: q.question_ar,
            options: Array.isArray(options) ? options : [],
            steps,
            correctOptionId: q.correct_answer || (type === 'scenario-cascade' && steps?.length > 0 ? (steps[0].correct_response_id || steps[0].correct) : (type === 'ranking' && q.options?.order ? q.options.order.map((o:any) => o.id || '').join(',') : undefined)),
            hint: q.hint_fr,
            content,
            feedbackPositive: q.feedback_positive_fr,
            feedbackNegative: q.feedback_negative_fr,
            presentation_fr: q.presentation_fr,
            explanation_fr: q.explanation_fr,
            context_dialogue: q.context_dialogue
          };
        });
        setQuestions(mappedQuestions);
      }
      setLoading(false);
    }

    if (missionId) fetchQuestions();
  }, [missionId]);

  return { questions, loading };
}

function mapType(dbType: string): any {
  const normalized = (dbType || '').toLowerCase().replace(/_/g, '-');
  switch (normalized) {
    case 'qcm':
    case 'multiple-choice':
      return 'multiple-choice';
    case 'vrai-faux':
    case 'vrai_faux':
    case 'true-false':
      return 'true-false';
    case 'scenario-decision':
      return 'scenario-decision';
    case 'scenario-dialogue':
      return 'scenario-dialogue';
    case 'fill-blanks':
    case 'fill_blanks':
    case 'fill-in-blanks':
    case 'cloze_text':
    case 'cloze-text':
      return 'fill-in-blanks';
    case 'matching':
      return 'matching';
    case 'ranking':
    case 'sorting-challenge':
      return 'ranking';
    case 'scenario-cascade':
    case 'scenario_cascade':
      return 'scenario-cascade';
    case 'puzzle-riddle':
    case 'riddle':
    case 'puzzle_riddle':
      return 'puzzle-riddle';
    case 'short-answer':
    case 'short_answer':
      return 'short-answer';
    case 'glitch':
      return 'glitch';
    case 'error-detection':
    case 'error_detection':
      return 'error-detection';
    case 'zellige':
    case 'mosaic':
      return 'zellige';
    case 'team-roles':
    case 'team_roles':
      return 'team-roles';
    case 'time-attack':
    case 'time_attack':
      return 'multiple-choice';
    default:
      return 'multiple-choice';
  }
}
export function useSupabaseSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');

      if (error) {
        console.error('Error fetching settings:', error);
      } else {
        setSettings(data || []);
      }
      setLoading(false);
    }

    fetchSettings();
  }, []);

  const getSetting = (key: string) => {
    return settings.find(s => s.key === key)?.value;
  };

  return { settings, loading, getSetting };
}

export function useSupabaseProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      // Try to get the profile from player_profiles or app_users
      // Since we synced app_users to auth.users, we should use app_users as the primary source of truth for the login info
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile({
          ...data,
          avatar_url: data.avatar_url || DEFAULT_AVATAR_URL
        });
      } else {
        console.warn('Profile not found for user:', userId);
        setProfile({
          id: userId,
          avatar_url: DEFAULT_AVATAR_URL
        });
      }
      setLoading(false);
    }

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: any) => {
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('app_users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (!error) {
      setProfile(data);
      return true;
    }
    return false;
  };

  return { profile, loading, updateProfile };
}

export function useSupabaseBadges(userId?: string) {
  const [badges, setBadges] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBadges() {
      setLoading(true);
      try {
        // Fetch all definitions
        const { data: definitions, error: defError } = await supabase
          .from('badge_definitions')
          .select('*');

        if (defError) throw defError;

        // Fetch earned badges for this user
        let earnedIds: string[] = [];
        if (userId) {
          const { data: earned, error: earnedError } = await supabase
            .from('player_earned_badges')
            .select('badge_id')
            .eq('player_id', userId);
          
          if (!earnedError && earned) {
            earnedIds = earned.map(eb => eb.badge_id);
          }
        }

        setBadges(definitions || []);
        setEarnedBadges(earnedIds);
      } catch (err) {
        console.error('Error fetching badges:', err);
      }
      setLoading(false);
    }

    fetchBadges();
  }, [userId]);

  return { badges, earnedBadges, loading };
}
