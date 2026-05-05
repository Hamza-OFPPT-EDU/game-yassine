import { supabase } from './supabase';
import { type BadgeDefinition, type Mission, type Challenge } from '../types';

type MissionUnlockState = {
  isCompleted: boolean;
  isLocked: boolean;
  isPlayable: boolean;
};

function normalizeText(value: string | null | undefined) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function extractNumericImpact(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;

    try {
      return extractNumericImpact(JSON.parse(value));
    } catch {
      return 0;
    }
  }

  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + extractNumericImpact(item), 0);
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).reduce((sum, item) => sum + extractNumericImpact(item), 0);
  }

  return 0;
}

export function getMissionUnlockState(missions: Mission[], completedMissions: string[], missionId: string): MissionUnlockState {
  const index = missions.findIndex((mission) => mission.id === missionId);
  const isCompleted = completedMissions.includes(missionId);
  const previousCompleted = index <= 0 || missions.slice(0, index).every((mission) => completedMissions.includes(mission.id));

  return {
    isCompleted,
    isLocked: !isCompleted && !previousCompleted,
    isPlayable: isCompleted || previousCompleted,
  };
}

export function calculateQuestionXp(challenge: Challenge, isCorrect: boolean, timeSpent: number) {
  const baseXp = challenge.xp_reward ?? 20;
  const timeLimit = challenge.time_limit_sec ?? 0;
  const remainingRatio = timeLimit > 0 ? Math.max(0, Math.min(1, (timeLimit - timeSpent) / timeLimit)) : 0;
  const timeBonus = isCorrect && timeLimit > 0 ? Math.round(baseXp * 0.25 * remainingRatio) : 0;
  const skillImpact = Math.max(0, extractNumericImpact(challenge.soft_skills_impact));
  const softSkillBonus = isCorrect ? Math.min(20, Math.round(skillImpact * 2)) : 0;

  return {
    xpEarned: isCorrect ? Math.max(0, baseXp + timeBonus + softSkillBonus) : 0,
    timeBonus,
    softSkillBonus,
    timeLimit,
  };
}

export function calculatePlayerLevel(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / 100) + 1);
}

export async function pickRewardBadge({
  playerId,
  cityName,
  cityId,
  missionTitle,
  missionSkill,
}: {
  playerId: string;
  cityName?: string;
  cityId?: string;
  missionTitle?: string;
  missionSkill?: string;
}): Promise<BadgeDefinition | null> {
  const [{ data: badgeRows, error: badgeError }, { data: earnedRows }] = await Promise.all([
    supabase.from('badge_definitions').select('*').order('created_at', { ascending: true }),
    supabase.from('player_earned_badges').select('badge_id').eq('player_id', playerId),
  ]);

  if (badgeError || !badgeRows?.length) {
    return null;
  }

  const earnedIds = new Set((earnedRows || []).map((row: { badge_id: string }) => row.badge_id));
  const candidates = badgeRows.filter((badge: BadgeDefinition) => !earnedIds.has(badge.id));
  if (!candidates.length) return null;

  const queryTokens = [cityName, cityId, missionTitle, missionSkill].map(normalizeText).filter(Boolean);

  const scored = candidates.map((badge, index) => {
    const badgeText = normalizeText([
      badge.name_fr,
      badge.badge_name,
      badge.description_fr,
      badge.description_ar,
      badge.requirement,
      badge.category,
      badge.rarity,
    ].filter(Boolean).join(' '));

    let score = badge.category === 'cultural' ? 2 : 0;
    if (badge.rarity === 'legendary') score += 1;
    queryTokens.forEach((token) => {
      if (token && badgeText.includes(token)) score += 5;
    });

    return { badge, score, index };
  });

  scored.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (left.badge.category !== right.badge.category) {
      return left.badge.category === 'cultural' ? -1 : 1;
    }
    return left.index - right.index;
  });

  return scored[0]?.badge ?? null;
}
