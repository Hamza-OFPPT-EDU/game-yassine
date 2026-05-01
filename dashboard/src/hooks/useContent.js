import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('challenges')
      .select('*')
      .order('sort_order');
    setChallenges(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (challenge) => {
    if (challenge.id) {
      const { error } = await supabase.from('challenges').update(challenge).eq('id', challenge.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('challenges').insert(challenge);
      if (error) throw error;
    }
    await fetch();
  };

  const remove = async (id) => {
    await supabase.from('challenges').delete().eq('id', id);
    await fetch();
  };

  return { challenges, loading, refresh: fetch, save, remove };
}

export function useMissions(challengeId) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!challengeId) { setMissions([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('missions')
      .select('*')
      .eq('challenge_id', challengeId)
      .order('sort_order');
    setMissions(data || []);
    setLoading(false);
  }, [challengeId]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (mission) => {
    const payload = { 
      challenge_id: challengeId, 
      ...mission 
    };
    if (mission.id) {
      const { error } = await supabase.from('missions').update(payload).eq('id', mission.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('missions').insert(payload);
      if (error) throw error;
    }
    await fetch();
  };

  const remove = async (id) => {
    await supabase.from('missions').delete().eq('id', id);
    await fetch();
  };

  return { missions, loading, refresh: fetch, save, remove };
}

export function useQuestions(missionId) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!missionId) { setQuestions([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('mission_id', missionId)
      .order('sort_order');
    setQuestions(data || []);
    setLoading(false);
  }, [missionId]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (question) => {
    const payload = { ...question, mission_id: missionId };
    if (question.id) {
      const { error } = await supabase.from('questions').update(payload).eq('id', question.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('questions').insert(payload);
      if (error) throw error;
    }
    await fetch();
  };

  const remove = async (id) => {
    await supabase.from('questions').delete().eq('id', id);
    await fetch();
  };

  return { questions, loading, refresh: fetch, save, remove };
}

export function useSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('app_settings')
      .select('*')
      .order('key');
    setSettings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (setting) => {
    if (setting.id) {
      const { error } = await supabase.from('app_settings').update(setting).eq('id', setting.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('app_settings').insert(setting);
      if (error) throw error;
    }
    await fetch();
  };

  return { settings, loading, refresh: fetch, save };
}
