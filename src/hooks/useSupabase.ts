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

function buildFallbackCities(completedCities: string[]): City[] {
  const firstIncompleteIndex = CITIES.findIndex((city) => !completedCities.includes(city.id));

  return CITIES.map((city, index) => {
    const isCompleted = completedCities.includes(city.id);
    const status: City['status'] = isCompleted
      ? 'completed'
      : firstIncompleteIndex === -1
        ? (index === CITIES.length - 1 ? 'active' : 'locked')
        : (index === firstIncompleteIndex ? 'active' : 'locked');

    return {
      ...city,
      status,
      stepNum: isCompleted ? city.totalSteps : city.stepNum,
    };
  });
}

export function useSupabaseCities(completedCities: string[], completedMissions: string[]) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { freeExploration } = useSettings();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
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

          // Free Exploration override: Unlock all cities
          if (freeExploration && status === 'locked') {
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
            map_x: city.map_x,
            map_y: city.map_y,
            map_size: city.map_size,
            sort_order: city.sort_order,
          };
        });
        setCities(mappedCities);
      } catch (err) {
        console.error('Failed to link with database:', err);
        // We still keep the fallback only as a last resort to prevent app crash
        setCities(buildFallbackCities(completedCities));
      }
      setLoading(false);
    }

    fetchData();
  }, [completedCities, completedMissions, freeExploration]);

  return { cities, loading };
}

export function useSupabaseMissions(cityId: string) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      console.log('🔍 Fetching missions for cityId:', cityId);
      
      // DIAGNOSTIC: First, fetch ALL missions to see what city_id values exist
      const { data: allMissions, error: allError } = await supabase
        .from('missions')
        .select('id, city_id, challenge_id, title_fr');
      
      if (!allError && allMissions) {
        console.log('📊 ALL MISSIONS IN DATABASE:');
        console.table(allMissions);
        const uniqueCityIds = [...new Set(allMissions.map((m: any) => m.city_id))];
        const uniqueChallengeIds = [...new Set(allMissions.map((m: any) => m.challenge_id))];
        console.log('🏙️ Unique city_id values:', uniqueCityIds);
        console.log('🎯 Unique challenge_id values:', uniqueChallengeIds);
      }
      
      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      let queryCityId = cityId;
      
      // If it's not a UUID, try to find the real UUID from challenges table first
      if (!isUUID(cityId)) {
        console.log('⚠️ cityId is not a UUID, attempting to resolve from challenges table:', cityId);
        const { data: cityData } = await supabase
          .from('challenges')
          .select('id')
          .or(`city_id.eq.${cityId},city_name_fr.ilike.${cityId}`)
          .single();
        
        if (cityData) {
          queryCityId = cityData.id;
          console.log('✅ Resolved slug "' + cityId + '" to UUID:', queryCityId);
        }
      }

      // Try fetching with city_id or challenge_id
      let { data, error } = await supabase
        .from('missions')
        .select('*')
        .or(`city_id.eq.${queryCityId},challenge_id.eq.${queryCityId}`)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching missions:', error);
        console.log('💾 Query details - Table: missions, Filter: city_id or challenge_id = "' + queryCityId + '"');
      } else {
        console.log('✅ Missions fetched:', data?.length || 0, 'found');
        console.log('📋 Missions data:', data);
        
        const mappedMissions = (data || []).map((m: any) => {
          // Extract mentor info from JSONB profils if flat fields are empty
          let mentorName = m.mentor_name;
          let mentorRole = m.mentor_role;
          if (!mentorName && m.profils && m.profils.length > 0) {
            mentorName = m.profils[0].nom;
            mentorRole = m.profils[0].profession;
          }

          // Extract script_opening from narration JSONB if flat field is empty
          let scriptOpening = m.script_opening;
          if (!scriptOpening && m.narration?.intro?.texte) {
            scriptOpening = m.narration.intro.texte;
          }

          return {
            ...m,
            mission_type: m.mission_type,
            xp_reward: m.xp_reward || 0,
            mentor_name: mentorName,
            mentor_role: mentorRole,
            script_opening: scriptOpening,
            script_closing: m.script_closing,
            soft_skill_dominant: m.soft_skill_dominant,
            narration: m.narration,
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
  }, [cityId]);

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
