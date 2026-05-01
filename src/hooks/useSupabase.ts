/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CITIES, type Challenge, type City, type Mission } from '../types';

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
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch cities
      const { data: cityData, error: cityError } = await supabase
        .from('challenges')
        .select('*')
        .order('sort_order', { ascending: true });

      // Fetch missions to count steps
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select('id, city_id');

      console.log('📍 Cities data:', cityData);
      console.log('🎯 Missions data (for counting):', missionData);

      if (cityError || missionError) {
        console.error('Error fetching data:', cityError || missionError);
        setCities(buildFallbackCities(completedCities));
      } else {
        if (!cityData || cityData.length === 0) {
          setCities(buildFallbackCities(completedCities));
          setLoading(false);
          return;
        }

        const mappedCities = (cityData || []).map((city, index) => {
          const cityMissions = (missionData || []).filter(m => m.city_id === city.city_id);
          console.log(`🏙️ City ${city.city_id}:`, { totalMissions: cityMissions.length, missions: cityMissions });
          
          const totalSteps = cityMissions.length || 1;
          const completedInCity = cityMissions.filter(m => completedMissions.includes(m.id)).length;
          
          // A city is active if it's the first one that is NOT completed
          const isCompleted = completedCities.includes(city.city_id);
          let status: 'locked' | 'active' | 'completed' = isCompleted ? 'completed' : 'locked';
          
          // Determine if this city is the current one (active)
          // The first incomplete city is active
          const firstIncomplete = (cityData || []).find(c => !completedCities.includes(c.city_id));
          if (firstIncomplete && firstIncomplete.city_id === city.city_id) {
            status = 'active';
          }

          return {
            id: city.city_id,
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
            color: city.city_color,
            iconName: city.icon_name
          };
        });
        setCities(mappedCities);
      }
      setLoading(false);
    }

    fetchData();
  }, [completedCities, completedMissions]);

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
      
      // Try fetching with city_id first (exact match)
      let { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('city_id', cityId)
        .order('sort_order', { ascending: true });

      // If no missions found, try case-insensitive match on city_id (ilike)
      if (!error && (!data || data.length === 0)) {
        console.log('⚠️ No missions with exact city_id, trying case-insensitive ilike...');
        const { data: ilikeData, error: ilikeError } = await supabase
          .from('missions')
          .select('*')
          .ilike('city_id', cityId)
          .order('sort_order', { ascending: true });

        if (!ilikeError && ilikeData && ilikeData.length > 0) {
          data = ilikeData;
          console.log('✅ Found missions with ilike(city_id)');
        } else if (ilikeError) {
          console.warn('⚠️ ilike query error:', ilikeError);
        }
      }

      // If still no missions found, try with challenge_id
      if (!error && (!data || data.length === 0)) {
        console.log('⚠️ Still no missions with city_id, trying challenge_id...');
        const { data: challengeData, error: challengeError } = await supabase
          .from('missions')
          .select('*')
          .eq('challenge_id', cityId)
          .order('sort_order', { ascending: true });
        
        if (!challengeError) {
          data = challengeData;
          console.log('✅ Found missions with challenge_id');
        } else {
          error = challengeError;
        }
      }

      if (error) {
        console.error('❌ Error fetching missions:', error);
        console.log('💾 Query details - Table: missions, Filter: city_id or challenge_id = "' + cityId + '"');
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
            mentor_name: mentorName,
            mentor_role: mentorRole,
            script_opening: scriptOpening,
            narration: m.narration
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
              text: opt.text_fr || opt.label || opt.text || (typeof opt === 'string' ? opt : ''),
              label: opt.label || String.fromCharCode(65 + idx),
              match: opt.match || ''
            }));
          } else if (q.options?.pairs) {
            // Matching question format: { pairs: [{ left, right }] }
            options = q.options.pairs.map((p: any, idx: number) => ({
              id: String(idx),
              text: p.item || p.left || '',
              label: String.fromCharCode(65 + idx),
              match: p.match || p.right || ''
            }));
          } else if (q.options?.bank) {
            // Fill-in-blanks format: { bank: [...] }
            options = (q.options.bank || []).map((item: any, idx: number) => ({
              id: String(idx),
              text: typeof item === 'string' ? item : (item.text || item.text_fr || ''),
              label: String.fromCharCode(65 + idx)
            }));
          } else if (q.options?.steps) {
            // Scenario-cascade format: { steps: [...] }
            steps = q.options.steps;
            options = []; // Empty array for this type
          } else if (!q.options) {
            // No options provided
            options = [];
          }

          return {
            id: q.id,
            type,
            xp_reward: q.xp_reward,
            title: q.question_fr ? (q.question_fr.length > 40 ? q.question_fr.substring(0, 40) + '...' : q.question_fr) : 'Défi',
            question: q.question_fr,
            arabicQuestion: q.question_ar,
            options,
            steps,
            correctOptionId: q.correct_answer,
            hint: q.hint_fr,
            content: q.presentation_fr ? [q.presentation_fr] : (q.question_fr ? [q.question_fr] : []),
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
    case 'error-detection':
    case 'error_detection':
      return 'glitch';
    case 'zellige':
    case 'mosaic':
      return 'zellige';
    case 'team-roles':
    case 'team_roles':
      return 'team-roles';
    case 'time-attack':
    case 'time_attack':
      return 'time-attack';
    default:
      return 'multiple-choice';
  }
}

