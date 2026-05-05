/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Medal, Timer, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import type { League } from '../types';

interface LeagueDetailScreenProps {
  leagueId: string;
  onBack: () => void;
}

const MOCK_LEAGUES: Record<string, League> = {
  bronze: {
    id: 'bronze',
    name: 'Ligue Bronze',
    tier: 'bronze',
    timeLeft: '2j 4h restants',
    myRank: 4,
    players: [
      { id: '1', name: 'Zaynab', xp: 2100, avatar: '/assets/avatar_user.jpg', rank: 1 },
      { id: '2', name: 'Omar', xp: 1950, avatar: '/assets/avatar_user.jpg', rank: 2 },
      { id: '3', name: 'Yasmine', xp: 1800, avatar: '/assets/avatar_user.jpg', rank: 3 },
      { id: '4', name: 'Ahmed', xp: 1450, avatar: '/assets/avatar_user.jpg', rank: 4, isCurrentUser: true },
      { id: '5', name: 'Imane', xp: 1200, avatar: '/assets/avatar_user.jpg', rank: 5 },
      { id: '6', name: 'Karim', xp: 1100, avatar: '/assets/avatar_user.jpg', rank: 6 },
    ]
  },
  silver: {
    id: 'silver',
    name: 'Ligue Argent',
    tier: 'silver',
    timeLeft: 'Saison Terminée',
    myRank: 12,
    players: [
      { id: 's1', name: 'Mounir', xp: 4500, avatar: '/assets/avatar_user.jpg', rank: 1 },
      { id: 's2', name: 'Salma', xp: 4200, avatar: '/assets/avatar_user.jpg', rank: 2 },
      { id: 's3', name: 'Bilal', xp: 3800, avatar: '/assets/avatar_user.jpg', rank: 3 },
    ]
  },
  gold: {
    id: 'gold',
    name: 'Ligue Or',
    tier: 'gold',
    timeLeft: 'Bientôt disponible',
    myRank: 0,
    players: []
  }
};

export default function LeagueDetailScreen({ leagueId, onBack }: LeagueDetailScreenProps) {
  const league = MOCK_LEAGUES[leagueId] || MOCK_LEAGUES.bronze;

  return (
    <div className="flex flex-col h-full bg-voyage-sand pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 bg-white border-b border-voyage-accent/10 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-voyage-accent/10 rounded-full transition-colors text-voyage-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-voyage-primary font-headline">{league.name}</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <Timer size={14} className="text-voyage-accent" />
              <span>{league.timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Podium mock-up or highlight */}
        <div className="flex items-end justify-center gap-4 relative z-10 pt-4">
          {league.players.slice(0, 3).sort((a,b) => (a.rank === 1 ? 0 : a.rank === 2 ? -1 : 1)).map((player) => {
            const isFirst = player.rank === 1;
            const isSecond = player.rank === 2;
            const isThird = player.rank === 3;

            return (
              <div key={player.id} className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className={cn(
                    "rounded-full p-1 overflow-hidden",
                    isFirst ? "w-20 h-20 ring-4 ring-voyage-accent" : "w-16 h-16 ring-2 ring-slate-200"
                  )}>
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white",
                    isFirst ? "bg-voyage-accent" : isSecond ? "bg-slate-400" : "bg-amber-600"
                  )}>
                    {player.rank}
                  </div>
                </div>
                <span className="text-xs font-bold text-voyage-primary">{player.name}</span>
                <span className="text-[10px] font-black text-voyage-accent">{player.xp} XP</span>
              </div>
            );
          })}
        </div>

        {/* Background decorative zellige line */}
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.05] pointer-events-none zellige-pattern" />
      </header>

      {/* Leaderboard list */}
      <main className="flex-grow overflow-y-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <TrendingUp size={14} />
            Classement complet
          </h2>
          <span className="text-[10px] font-bold text-slate-400">Zone de promotion : Top 10</span>
        </div>

        <div className="space-y-3">
          {league.players.map((player) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl shadow-sm border",
                player.isCurrentUser 
                  ? "bg-voyage-primary/5 border-voyage-primary shadow-voyage-primary/10" 
                  : "bg-white border-voyage-accent/10"
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn(
                  "w-6 text-center text-sm font-black",
                  player.rank <= 3 ? "text-voyage-accent" : "text-slate-400"
                )}>
                  {player.rank}
                </span>
                
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-white shadow-sm shrink-0">
                  <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <h3 className={cn(
                    "text-sm font-bold",
                    player.isCurrentUser ? "text-voyage-primary" : "text-slate-700"
                  )}>
                    {player.name} {player.isCurrentUser && "(Moi)"}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] font-black text-voyage-accent uppercase tracking-tighter">
                    <Medal size={12} />
                    <span>Maître Artisan Jr.</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-sm font-black text-voyage-primary">{player.xp}</span>
                <span className="text-[10px] uppercase font-bold text-slate-300">XP</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Promotion Zone Separator */}
        <div className="my-8 py-4 border-y border-dashed border-voyage-accent/30 flex flex-col items-center gap-2">
           <div className="text-[10px] font-black uppercase text-voyage-accent tracking-widest bg-white px-4 -mt-6">
             Zone Intermédiaire
           </div>
           <p className="text-center text-xs text-slate-400 max-w-[200px]">
             Continuez à grimper pour atteindre la zone de promotion !
           </p>
        </div>
      </main>

      {/* Floating Rank Indicator for Current User */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm">
        <div className="bg-voyage-primary text-white px-6 py-3 rounded-full flex items-center justify-between shadow-2xl shadow-voyage-primary/30 border border-white/20">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-inner">
                <img src={league.players.find(p => p.isCurrentUser)?.avatar} className="w-full h-full object-cover" />
             </div>
             <div>
                <span className="text-xs opacity-80 block leading-tight">Votre position</span>
                <span className="font-black text-lg">4ème place</span>
             </div>
          </div>
          <div className="text-right">
             <Trophy size={20} className="text-voyage-accent inline mr-2" />
             <span className="text-xs font-bold text-white/80">Prochaine : Argent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
