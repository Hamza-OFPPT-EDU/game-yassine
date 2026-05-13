/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Screen {
  Splash = 'splash',
  Welcome = 'welcome',
  Map = 'map',
  Story = 'story',
  Challenge = 'challenge',
  Profile = 'profile',
  Settings = 'settings',
  LevelComplete = 'level-complete',
  GrammarQuest = 'grammar-quest',
  League = 'league',
  LeagueDetail = 'league-detail',
  LeagueCreate = 'league-create',
  VocabularyMatch = 'vocabulary-match',
  Login = 'login',
  CinematicIntro = 'cinematic-intro',
  Register = 'register',
  Badges = 'badges',
  Duel = 'duel',
}

export const AVATAR_MALE_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatar-homme.png';
export const AVATAR_FEMALE_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatar-femme.png';
export const DEFAULT_AVATAR_URL = AVATAR_MALE_URL;

export type LeaguePlayer = {
  id: string;
  name: string;
  xp: number;
  avatar: string;
  rank: number;
  isCurrentUser?: boolean;
  citiesCompleted: number;
  badgesEarned: number;
};

export type League = {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'emerald' | 'diamond';
  players: LeaguePlayer[];
  timeLeft: string;
  myRank: number;
};

export type City = {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  focus: string;
  points: number;
  image: string;
  iconUrl?: string;
  status: 'locked' | 'active' | 'completed';
  stepNum: number;
  totalSteps: number;
  cinematicIntro?: string;
  cinematicCharacter?: string;
  color?: string;
  iconName?: string;
  iconSize?: number;
  learningOutcomes?: string;
  keyCompetencies?: string;
  map_x?: number;
  map_y?: number;
  map_size?: number;
  sort_order?: number;
  headline?: string;
  arabicHeadline?: string;
  missionsTitle?: string;
  acteTitle?: string;
};

export type Mission = {
  id: string;
  challenge_id: string;
  city_id: string;
  title_fr: string;
  title_ar?: string;
  description_fr?: string;
  description_ar?: string;
  mission_type: 'challenge' | 'dialogue' | 'minigame' | 'scenario';
  xp_reward: number;
  mentor_name?: string;
  mentor_role?: string;
  script_opening?: string;
  script_closing?: string;
  soft_skill_dominant?: string;
  narration?: {
    intro?: { texte: string; consigne?: string; objectif?: string };
    conclusion?: { texte_reussite: string };
  };
  cinematic_text?: string;
  cinematic_gif_url?: string;
  cinematic_audio_url?: string;
  status?: 'locked' | 'active' | 'completed';
};

export type Challenge = {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'scenario-decision' | 'scenario-dialogue' | 'fill-in-blanks' | 'matching' | 'ranking' | 'scenario-cascade' | 'puzzle-riddle' | 'short-answer' | 'glitch' | 'zellige' | 'team-roles' | 'time-attack' | 'decision' | 'dialogue' | 'minigame' | 'mosaic' | 'riddle';
  title: string;
  question: string;
  xp_reward?: number;
  options?: any; // Made flexible to support array or steps object
  correctOptionId?: string;
  content?: string[]; 
  hint?: string;
  arabicQuestion?: string;
  feedbackPositive?: string;
  feedbackNegative?: string;
  presentation_fr?: string;
  explanation_fr?: string;
  context_dialogue?: string;
  illustration_url?: string;
  time_limit_sec?: number;
  soft_skills_impact?: any;
  steps?: {
    question: string;
    responses: { id: string; text: string }[];
  }[];
};

export type MissionQuestionResult = {
  questionId: string;
  questionType: Challenge['type'];
  question: string;
  givenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  xpEarned: number;
  starsEarned: number;
  isSkipped?: boolean;
  isTimedOut?: boolean;
  timeSpent?: number; // in seconds
};

export type MissionCompletionSummary = {
  missionId: string;
  missionTitle?: string;
  cityId: string;
  cityName?: string;
  questions: MissionQuestionResult[];
  totalXp: number;
  totalStars: number;
  correctCount: number;
  totalQuestions: number;
  successRate: number;
};

export const CITIES: City[] = [
  {
    id: 'rabat',
    name: 'Rabat',
    arabicName: 'الرباط',
    description: 'La capitale du royaume, où modernité et tradition se rencontrent.',
    arabicDescription: 'عاصمة المملكة، حيث تلتقي الحداثة والتقاليد.',
    focus: 'Leadership & Vision',
    points: 500,
    image: '/assets/fallback_city.jpg',
    status: 'completed',
    stepNum: 1,
    totalSteps: 4,
  },
  {
    id: 'chefchaouen',
    name: 'Chefchaouen',
    arabicName: 'شفشاون',
    description: "La Cité Bleue, un labyrinthe azuré au cœur du Rif.",
    arabicDescription: 'المدينة الزرقاء، متاهة لازوردية في قلب الريف.',
    focus: 'Sérénité & Observation',
    points: 300,
    image: '/assets/fallback_city.jpg',
    status: 'completed',
    stepNum: 1,
    totalSteps: 4,
  },
  {
    id: 'fes',
    name: 'Fès',
    arabicName: 'فاس',
    description: 'Le Cœur Historique du Royaume, gardien du savoir ancestral.',
    arabicDescription: 'القلب التاريخي للمملكة، حارس المعرفة العريقة.',
    focus: 'Artisanat & Spiritualité',
    points: 450,
    image: '/assets/fallback_city.jpg',
    status: 'active',
    stepNum: 3,
    totalSteps: 10,
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    arabicName: 'مراكش',
    description: 'La Ville Rouge, carrefour bouillonnant de cultures.',
    arabicDescription: 'المدينة الحمراء، ملتقى الثقافات الصاخب.',
    focus: 'Communication & Négociation',
    points: 400,
    image: '/assets/fallback_city.jpg',
    status: 'active',
    stepNum: 1,
    totalSteps: 15,
  },
];

// --- Multiplayer & Badges Types ---

export type RoomStatus = 'waiting' | 'playing' | 'finished';

export type Room = {
  id: string;
  code: string;
  host_id: string;
  status: RoomStatus;
  mission_id: string;
  created_at: string;
  updated_at: string;
};

export type RoomMember = {
  id: string;
  room_id: string;
  user_id: string;
  player_name: string;
  avatar?: string;
  progress: number;
  is_host: boolean;
  joined_at: string;
};

export type BadgeCategory = 'cultural' | 'achievement' | 'challenge' | 'multiplayer';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export type BadgeDefinition = {
  id: string;
  badge_name: string;
  description_fr: string;
  description_ar?: string;
  requirement?: string;
  icon_url?: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  image_url?: string;
  created_at: string;
};

export type PlayerEarnedBadge = {
  id: string;
  player_id: string;
  badge_id: string;
  earned_at: string;
  badge?: BadgeDefinition;
};

export type PlayerStats = {
  id: string;
  player_id: string;
  total_xp: number;
  total_stars: number;
  total_games_played: number;
  multiplayer_games_played: number;
  win_count: number;
  average_score: number;
  badge_count: number;
  level: number;
  last_game_at?: string;
  created_at: string;
  updated_at: string;
};
