/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CITIES, type Challenge, type City, type Mission, DEFAULT_AVATAR_URL, AVATAR_MALE_URL, AVATAR_FEMALE_URL } from '../types';
import { Session } from '@supabase/supabase-js';
import { useSettings } from '../contexts/SettingsContext';
import { pickRewardBadge } from '../lib/progression';

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

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, loading, signOut };
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
  const [cities, setCities] = useState<City[]>([]);
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
            headline: city.headline_fr,
            arabicHeadline: city.headline_ar,
            missionsTitle: city.missions_title_fr,
            acteTitle: city.acte_title,
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
  }, [completedCities, completedMissions, freeExploration]);

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
            xp_reward: q.xp_reward || 20,
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
            context_dialogue: q.context_dialogue,
            illustration_url: q.illustration_url
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
      try {
        // 1. Try to get the profile from app_users (primary)
        const { data: appUser, error: appUserError } = await supabase
          .from('app_users')
          .select('*, organizations(name)')
          .eq('id', userId)
          .single();

        // 2. Also get from player_profiles for fallback stats
        const { data: playerProfile } = await supabase
          .from('player_profiles')
          .select('xp, level, display_name')
          .eq('id', userId)
          .single();

        // 3. Also get auth metadata for ultimate fallback of identity (critical for signup sync delays)
        const { data: authData } = await supabase.auth.getUser();
        const meta = authData?.user?.user_metadata || {};

        if (!appUserError && appUser) {
          const genderDefault = appUser.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL;
          setProfile({
            ...appUser,
            // Map join data
            group_name: appUser.organizations?.name || 'GROUPE NON DÉFINI',
            // Ensure stats are up-to-date with player_profiles if there's a discrepancy
            xp: Math.max(appUser.xp || 0, playerProfile?.xp || 0),
            level: Math.max(appUser.level || 1, playerProfile?.level || 1),
            avatar_url: appUser.avatar_url || genderDefault
          });
        } else {
          console.warn('Profile not found in app_users, using fallbacks for user:', userId);
          const genderDefault = meta.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL;
          setProfile({
            id: userId,
            full_name: playerProfile?.display_name || meta.full_name || meta.first_name || 'Explorateur',
            username: meta.username || '',
            first_name: meta.first_name || '',
            last_name: meta.last_name || '',
            gender: meta.gender || 'H',
            group_name: meta.group_name || 'GROUPE NON DÉFINI',
            birth_date: meta.birth_date || null,
            organization_id: meta.organization_id || null,
            xp: playerProfile?.xp || 0,
            level: playerProfile?.level || 1,
            stars: 0,
            avatar_url: meta.avatar_url || genderDefault
          });
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
        setProfile({
          id: userId,
          full_name: 'Explorateur',
          avatar_url: DEFAULT_AVATAR_URL,
          xp: 0,
          level: 1
        });
      }
      setLoading(false);
    }

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: any) => {
    if (!userId) return false;
    
    // Create a copy without join data for DB update
    const dbUpdates = { ...updates };
    delete dbUpdates.organizations; 
    delete dbUpdates.group_name;

    // 1. Update app_users
    const { data, error } = await supabase
      .from('app_users')
      .update(dbUpdates)
      .eq('id', userId)
      .select('*, organizations(name)')
      .single();

    if (!error) {
      setProfile({
        ...data,
        group_name: data.organizations?.name || 'GROUPE NON DÉFINI'
      });

      // 2. Sync with player_profiles for dashboard consistency
      const profileUpdates: any = {};
      if (updates.xp !== undefined) profileUpdates.xp = updates.xp;
      if (updates.level !== undefined) profileUpdates.level = updates.level;
      if (updates.full_name !== undefined) profileUpdates.display_name = updates.full_name;
      if (updates.first_name !== undefined && updates.last_name !== undefined) {
         profileUpdates.display_name = `${updates.first_name} ${updates.last_name}`.trim();
      }
      if (updates.streak_days !== undefined) profileUpdates.streak_days = updates.streak_days;

      if (Object.keys(profileUpdates).length > 0) {
        await supabase
          .from('player_profiles')
          .update(profileUpdates)
          .eq('id', userId);
      }

      return true;
    }
    console.error('Update profile error:', error);
    return false;
  };

  return { profile, loading, updateProfile };
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name')
          .order('name');
        if (!error && data) setOrganizations(data);
      } catch (err) {
        console.error('Error fetching organizations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  return { organizations, loading };
}

export function useSupabaseBadges(userId?: string) {
  const [badges, setBadges] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBadges() {
      setLoading(true);
      try {
        const { data: defs, error: defsError } = await supabase
          .from('badge_definitions')
          .select('*')
          .order('created_at', { ascending: true });

        if (defsError) throw defsError;
        setBadges(defs || []);

        if (userId) {
          const { data: earned, error: earnedError } = await supabase
            .from('player_earned_badges')
            .select('badge_id')
            .eq('player_id', userId);

          if (!earnedError && earned) {
            setEarnedBadges(earned.map((b: any) => b.badge_id));
          }
        }
      } catch (err) {
        console.error('Error fetching badges:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, [userId]);

  return { badges, earnedBadges, loading };
}

export function useSupabaseMissionLeaderboard(missionId: string) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        // Fallback seed data (premium players for comparison)
        const seedPlayers = [
          { id: 'seed-1', name: 'Yassine B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yassine', score: 25400, level: 12, rank: 0 },
          { id: 'seed-2', name: 'Sarra M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarra', score: 18200, level: 10, rank: 0 },
          { id: 'seed-3', name: 'Amine T.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amine', score: 12500, level: 8, rank: 0 },
          { id: 'seed-4', name: 'Sofia K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', score: 8900, level: 6, rank: 0 },
          { id: 'seed-5', name: 'Karim L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim', score: 4200, level: 4, rank: 0 },
        ];

        const { data, error } = await supabase
          .from('app_users')
          .select('id, full_name, avatar_url, xp, level, gender')
          .order('xp', { ascending: false })
          .limit(20);

        let finalPlayers = [...seedPlayers];

        if (!error && data && data.length > 0) {
          const dbPlayers = data.map(u => ({
            id: u.id,
            name: u.full_name || 'Explorateur',
            avatar: u.avatar_url || (u.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL),
            score: u.xp || 0,
            level: u.level || 1,
            rank: 0
          }));
          
          // Merge and sort, keeping only top 15
          finalPlayers = [...dbPlayers, ...seedPlayers]
            .sort((a, b) => b.score - a.score)
            .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
            .slice(0, 15);
        }

        setLeaderboard(finalPlayers.map((p, i) => ({ ...p, rank: i + 1 })));
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [missionId]);

  return { leaderboard, loading };
}

export function useSupabaseUserHistory(userId?: string) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchHistory() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('mission_history')
          .select(`
            id, 
            xp, 
            score, 
            stars, 
            created_at,
            missions (
              id,
              title_fr,
              city_id,
              soft_skill_dominant
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          setHistory(data);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [userId]);

  return { history, loading };
}

export function useSupabaseAssetConfigs(bucketId: string) {
  const [configs, setConfigs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigs() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('asset_configs')
          .select('*')
          .eq('bucket_id', bucketId);

        if (!error && data) {
          const configMap: Record<string, any> = {};
          data.forEach(c => {
            configMap[c.file_name] = c;
          });
          setConfigs(configMap);
        }
      } catch (err) {
        console.error('Error fetching asset configs:', err);
      } finally {
        setLoading(false);
      }
    }

    if (bucketId) fetchConfigs();
  }, [bucketId]);

  const getAssetStyle = (url: string) => {
    if (!url) return {};
    try {
      const fileName = url.split('/').pop()?.split('?')[0];
      if (!fileName) return {};
      const config = configs[fileName];
      if (!config) return {};

      return {
        backgroundColor: config.bg_color || 'transparent',
        opacity: config.opacity ?? 1,
        borderRadius: config.border_radius || '0px',
        boxShadow: config.shadow || 'none'
      };
    } catch (e) {
      return {};
    }
  };


  return { configs, loading, getAssetStyle };
}

/**
 * Persists detailed mission history and updates city progress.
 */
export async function saveMissionResult(summary: any, userId: string, isCorrection: boolean = false) {
  try {
    // 1. Update Mission History
    await supabase.from('mission_history').insert({
      user_id: userId,
      mission_id: summary.missionId,
      score: summary.score,
      xp: summary.totalXp,
      stars: summary.totalStars,
      is_correction: isCorrection
    });

    // 2. Update User Global Stats
    const { data: profile } = await supabase
      .from('app_users')
      .select('xp, level')
      .eq('id', userId)
      .single();

    if (profile) {
      const newXp = (profile.xp || 0) + summary.totalXp;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      await supabase
        .from('app_users')
        .update({ xp: newXp, level: newLevel })
        .eq('id', userId);
        
      await supabase
        .from('player_profiles')
        .update({ xp: newXp, level: newLevel })
        .eq('id', userId);
    }

    // 3. Update City Progress
    const { data: existingProgress } = await supabase
      .from('player_city_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('city_id', summary.cityId)
      .single();

    if (existingProgress) {
       // Update logic (e.g. if all missions done)
       const { data: missions } = await supabase
         .from('missions')
         .select('id')
         .eq('city_id', summary.cityId);
         
       const { data: completedMissions } = await supabase
         .from('mission_history')
         .select('mission_id')
         .eq('user_id', userId);
         
       const completedIds = new Set(completedMissions?.map(m => m.mission_id) || []);
       const allDone = missions?.every(m => completedIds.has(m.id)) || false;
       
       if (allDone && existingProgress.status !== 'done') {
         await supabase
           .from('player_city_progress')
           .update({ status: 'done', completed_at: new Date().toISOString() })
           .eq('id', existingProgress.id);
         
         // Mark for league update
         existingProgress.status = 'done'; 
       }
    } else {
       await supabase.from('player_city_progress').insert({
         user_id: userId,
         city_id: summary.cityId,
         status: 'active'
       });
    }

    // 4. Update League Progress (if player is in any competitions)
    const { data: userLeagues } = await supabase
      .from('league_members')
      .select('league_id, cities_completed, points_earned, badges_earned')
      .eq('user_id', userId);

    if (userLeagues && userLeagues.length > 0) {
      for (const membership of userLeagues) {
        // Increment points via RPC for atomicity
        await supabase.rpc('increment_league_points', { 
          amount: summary.totalXp, 
          user_id_param: userId, 
          league_id_param: membership.league_id 
        });

        // Update other stats if city was just finished
        if (existingProgress?.status === 'done') {
           await supabase
            .from('league_members')
            .update({
              cities_completed: (membership.cities_completed || 0) + 1,
              badges_earned: summary.totalStars >= 10 ? (membership.badges_earned || 0) + 1 : (membership.badges_earned || 0)
            })
            .eq('user_id', userId)
            .eq('league_id', membership.league_id);
        } else if (summary.totalStars >= 10) {
           await supabase
            .from('league_members')
            .update({
              badges_earned: (membership.badges_earned || 0) + 1
            })
            .eq('user_id', userId)
            .eq('league_id', membership.league_id);
        }
      }
    }

    // 5. Grant Badge if mission is passed successfully (at least 70% success)
    const successRate = summary.successRate || (summary.totalQuestions > 0 ? Math.round((summary.correctCount / summary.totalQuestions) * 100) : 0);
    if (successRate >= 70) {
      const badge = await pickRewardBadge({
        playerId: userId,
        cityName: summary.cityName,
        cityId: summary.cityId,
        missionTitle: summary.missionTitle
      });

      if (badge) {
        const { error: badgeError } = await supabase.from('player_earned_badges').insert({
          player_id: userId,
          badge_id: badge.id
        });
        
        if (badgeError) {
          console.warn('Could not grant badge:', badgeError);
        } else {
          console.log(`Badge granted: ${badge.badge_name}`);
        }
      }
    }

    return true;
  } catch (err) {
    console.error('Error in saveMissionResult:', err);
    return false;
  }
}
