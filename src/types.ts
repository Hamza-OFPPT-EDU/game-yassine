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
}

export type LeaguePlayer = {
  id: string;
  name: string;
  xp: number;
  avatar: string;
  rank: number;
  isCurrentUser?: boolean;
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
  narration?: {
    intro?: { texte: string; consigne?: string; objectif?: string };
    conclusion?: { texte_reussite: string };
  };
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAam8RrX9i8jv1Ae0Fgass0NakYu4DYy4vs1TeTt8RaBSmEeyC7FlqOTU6HxzaXP5tiC-AB9Q7LKvspWZmXunG5o8cSITPFHp-ZSoTqbSAxCyDKscx5g10ainLsKtaETl0Li32nm3Yc08jBeE8UtVKDCSnOE3SLy5lx9QGg1jz29JjL9RGvQE7LwhO-UP-8nf9RDzsLjDfWMOmljJ4FEPCiJSMJSwtywAZJBIiw0luLvYb8IyPkK1JvG6DfNT-vRE97Da0qYcm23FQ',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDweOhzNui_6YLrqo-bO0jsnpz0r0vGT_8hDBJblWPy7NwHMaZYO2G_RSwZFkogPXigbBoxH-Z_iojYSblvEeCHT0cAKoBp83ZynjbewafML84nsCdMgflJ7zdwV5QvLbcp2CnzY3EEA-PgAZvIGuvnD_MNCeky6Jgirk4Xe-t8ey1mHkp6xTGLaMTvE8XW28GYk7rmJ8KmlWe9Jne33FTHGAHl-WKb8Ook68QpSTmgk6KGznyu2CC0nyD02Nk7xMCxp5alsOSDbyY',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxa5gIFvHnzNsfPn807w_ILftZAoG4nxMRqLsk2MEIhc7e7EapJbhs7n08MHs8SlJ-hmXKvHcWLeKT3ZPUYqebAYclG6b0xJsq4E_iiBMVkZn_PjCXzQG0Rt2gD55hio6_Qf03Ycfy2KmFm_YmKO6sDoeiiJJBFEetNiEohRhsacsVWf6s-dg7gvX3RS-YlUklqoRS70ISdadtfwm1Il6j4y3IakWLP45w_hYxRMj3PmZ7sqgHQhpzxCrXRx83LVEuTfslJcewa0s',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo5rKbDQN79PlNuvL0J92tWoa79kWMYpbrJCuOKTR4sc6zF3U2zU7ahtX9RoV7PN8nsyFpTM3VSAgBdDMeu-VOsRLn6MTd1wyo675_aRPjoXN3UGh_x6-1ic30Qn64TYvXc02NPE7gn9AeXTOfxWRXDnBZHd9Itq3mHbvFdiJMubRglApslIdlqGTnZSEKZQjjuQs2HXj8u9DoWKMS2shEfPBXyoXvvw4tRtn2d9hupkfWpTZd92TE6fdI7zrpABzkDMs85P1QO-k',
    status: 'active',
    stepNum: 1,
    totalSteps: 15,
  },
];
