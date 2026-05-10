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
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // 1. Fetch memberships for this user
      const { data: membershipData, error: membershipError } = await supabase
        .from('league_members')
        .select('league_id')
        .eq('user_id', userId);

      if (membershipError) throw membershipError;

      const myLeagueIds = (membershipData || []).map(m => m.league_id);

      if (myLeagueIds.length === 0) {
        setLeagues([]);
        setLoading(false);
        return;
      }

      // 2. Fetch full league details with all members
      const { data: leaguesData, error: leaguesError } = await supabase
        .from('leagues')
        .select(`
          *,
          league_members (
            user_id,
            app_users (
              id,
              full_name,
              avatar_url,
              xp,
              gender
            )
          )
        `)
        .in('id', myLeagueIds);

      if (leaguesError) throw leaguesError;

      const mappedLeagues: League[] = (leaguesData || []).map(l => {
        const players: LeaguePlayer[] = (l.league_members || [])
          .filter((m: any) => m.app_users)
          .map((m: any) => ({
            id: m.app_users.id,
            name: m.app_users.full_name || 'Explorateur',
            avatar: m.app_users.avatar_url || (m.app_users.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL),
            xp: m.app_users.xp || 0, // Fallback to total XP
            rank: 0,
            isCurrentUser: m.app_users.id === userId,
            citiesCompleted: m.cities_completed || 0,
            badgesEarned: m.badges_earned || 0
          })).sort((a, b) => b.xp - a.xp)
          .map((p, i) => ({ ...p, rank: i + 1 }));

        const endsAt = l.ends_at ? new Date(l.ends_at) : null;
        const now = new Date();
        const diffMs = endsAt ? endsAt.getTime() - now.getTime() : 0;
        
        let timeLeft = 'Fini';
        if (diffMs > 0) {
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          timeLeft = hours > 24 ? `${Math.ceil(hours / 24)}j restants` : `${hours}h ${mins}m`;
        }

        return {
          id: l.id,
          name: l.name,
          tier: l.tier || 'bronze',
          players,
          timeLeft,
          myRank: players.find(p => p.isCurrentUser)?.rank || 0,
          creator_id: l.creator_id
        } as League & { creator_id?: string };
      });

      setLeagues(mappedLeagues);
    } catch (err) {
      console.error('Error fetching leagues:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createLeague = async (name: string, tier: string) => {
    if (!userId) return null;
    const { data: league, error } = await supabase
      .from('leagues')
      .insert({ name, tier, creator_id: userId })
      .select()
      .single();

    if (error) throw error;

    // Add creator as member automatically
    await supabase.from('league_members').insert({
      league_id: league.id,
      user_id: userId
    });

    await fetchLeagues();
    return league;
  };

  const joinLeague = async (leagueId: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('league_members')
      .upsert({ league_id: leagueId, user_id: userId });
    
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
    joinLeague, 
    leaveLeague, 
    deleteLeague,
    fetchAllLeagues
  };
}
