/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { League, LeaguePlayer, AVATAR_MALE_URL, AVATAR_FEMALE_URL } from '../types';

export function useLeagues(userId?: string) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeagues = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch ALL leagues first
      const { data: leaguesData, error: leaguesError } = await supabase
        .from('leagues')
        .select(`
          *,
          league_members (
            user_id,
            points_earned,
            cities_completed,
            badges_earned,
            app_users (
              id,
              full_name,
              avatar_url,
              xp,
              gender
            )
          )
        `);

      if (leaguesError) throw leaguesError;

      const mappedLeagues: League[] = (leaguesData || []).map(l => {
        const players: LeaguePlayer[] = (l.league_members || [])
          .filter((m: any) => m.app_users)
          .map((m: any) => ({
            id: m.app_users.id,
            name: m.app_users.full_name || 'Explorateur',
            avatar: m.app_users.avatar_url || (m.app_users.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL),
            xp: m.points_earned || 0,
            rank: 0,
            isCurrentUser: m.app_users.id === userId,
            citiesCompleted: m.cities_completed || 0,
            badgesEarned: m.badges_earned || 0,
            timePlayed: 1200 + Math.floor(Math.random() * 3600) // Mocked time for now
          })).sort((a, b) => b.xp - a.xp)
          .map((p, i) => ({ ...p, rank: i + 1 }));

        const endsAt = l.ends_at ? new Date(l.ends_at) : null;
        const now = new Date();
        const diffMs = endsAt ? endsAt.getTime() - now.getTime() : 0;
        
        let timeLeft = 'Fini';
        let timeLeftSeconds = 0;
        if (diffMs > 0) {
          timeLeftSeconds = Math.floor(diffMs / 1000);
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          timeLeft = `${hours}h ${mins}m`;
        }

        const isJoined = userId ? players.some(p => p.id === userId) : false;

        return {
          id: l.id,
          name: l.name,
          tier: l.tier || 'bronze',
          players,
          timeLeft,
          timeLeftSeconds,
          myRank: players.find(p => p.isCurrentUser)?.rank || 0,
          creator_id: l.creator_id,
          isJoined,
          created_at: l.created_at,
          ends_at: l.ends_at
        } as any;
      });

      setLeagues(mappedLeagues);
    } catch (err) {
      console.error('Error fetching leagues:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateLeague = async (id: string, name: string, tier: string) => {
    const { data, error } = await supabase
      .from('leagues')
      .update({ name, tier })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchLeagues();
    return data;
  };

  const createLeague = async (name: string, tier: string, points: number = 0, cities: number = 0, badges: number = 0) => {
    if (!userId) {
      throw new Error("Tu dois être connecté pour créer une compétition.");
    }
    const { data: league, error } = await supabase
      .from('leagues')
      .insert({ 
        name, 
        tier, 
        creator_id: userId,
        ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as member automatically with their current stats
    await supabase.from('league_members').insert({
      league_id: league.id,
      user_id: userId,
      points_earned: points,
      cities_completed: cities,
      badges_earned: badges
    });

    await fetchLeagues();
    return league;
  };

  const joinLeague = async (leagueId: string, points: number = 0, cities: number = 0, badges: number = 0) => {
    if (!userId) {
      throw new Error("Tu dois être connecté pour rejoindre une compétition.");
    }
    const { error } = await supabase
      .from('league_members')
      .upsert({ 
        league_id: leagueId, 
        user_id: userId,
        points_earned: points,
        cities_completed: cities,
        badges_earned: badges
      });
    
    if (error) throw error;
    await fetchLeagues();
  };

  const leaveLeague = async (leagueId: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('league_members')
      .delete()
      .eq('league_id', leagueId)
      .eq('user_id', userId);
    
    if (error) throw error;
    await fetchLeagues();
  };

  const deleteLeague = async (leagueId: string) => {
    const { error } = await supabase
      .from('leagues')
      .delete()
      .eq('id', leagueId);
    
    if (error) throw error;
    await fetchLeagues();
  };

  const fetchAllLeagues = async () => {
    const { data, error } = await supabase
      .from('leagues')
      .select('*');
    if (error) throw error;
    return data;
  };

  useEffect(() => {
    fetchLeagues();
  }, [fetchLeagues]);

  return { 
    leagues, 
    loading, 
    fetchLeagues, 
    createLeague, 
    updateLeague,
    joinLeague, 
    leaveLeague, 
    deleteLeague,
    fetchAllLeagues
  };
}
