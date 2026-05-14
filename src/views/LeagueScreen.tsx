import { motion } from 'motion/react';
import { Trophy, Timer, ChevronRight, Star, Plus, Shield, Zap, TrendingUp, Search, Loader2, Trash2, Edit2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { cn } from '../lib/utils';
import { useLeagues } from '../hooks/useLeagues';
import { useAuth } from '../hooks/useSupabase';
import TopAppBar from '../components/TopAppBar';
import ConfirmationModal from '../components/ConfirmationModal';

interface LeagueScreenProps {
  userStats: { xp: number; stars: number; level: number; cities: number; badges: number };
  onSelectLeague: (id: string) => void;
  onCreateLeague: () => void;
  onEditLeague: (id: string) => void;
  onEnterDuel: () => void;
  onBack: () => void;
}

export default function LeagueScreen({ userStats, onSelectLeague, onCreateLeague, onEditLeague, onEnterDuel, onBack }: LeagueScreenProps) {
  const { session } = useAuth();
  const { leagues, loading, joinLeague, deleteLeague } = useLeagues(session?.user?.id);
  const [showExitModal, setShowExitModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = userStats;

  const allDisplayLeagues = useMemo(() => {
    let list = [...leagues];
    if (searchQuery) {
      list = list.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [leagues, searchQuery]);

  const handleAction = async (e: React.MouseEvent, type: 'join' | 'select' | 'delete' | 'edit', leagueId: string) => {
    e.stopPropagation();
    try {
      if (type === 'join') {
        await joinLeague(leagueId, userStats.xp, userStats.cities, userStats.badges);
      } else if (type === 'select') {
        onSelectLeague(leagueId);
      } else if (type === 'delete') {
        await deleteLeague(leagueId);
      } else if (type === 'edit') {
        onEditLeague(leagueId);
      }
    } catch (err: any) {
      alert(err.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden font-sans">
      <TopAppBar 
        stats={stats} 
        title="Compétitions" 
        onBack={() => setShowExitModal(true)} 
      />
      
      <ConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={onBack}
        title="Quitter le classement ?"
        message="Es-tu sûr de vouloir quitter la page des compétitions ?"
        confirmLabel="Oui, quitter"
        cancelLabel="Non, rester"
      />

      <main className="flex-grow overflow-y-auto px-4 pt-24 pb-32 space-y-6 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">
        
        {/* Search & Create Header */}
        <div className="flex flex-col gap-4">
          {/* Duel Mode Entry */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnterDuel}
            className="w-full bg-gradient-to-br from-blue-600 to-red-600 p-[2px] rounded-[2rem] shadow-xl shadow-blue-600/20 overflow-hidden group"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-[1.9rem] p-6 flex items-center justify-between group-hover:bg-transparent transition-all">
              <div className="flex items-center gap-5 text-left">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-white transition-all">
                   <Zap size={28} className="text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                   <h3 className="font-black text-voyage-primary group-hover:text-white transition-colors text-base uppercase tracking-tight">Duel de Compétition</h3>
                   <p className="text-[10px] font-bold text-slate-400 group-hover:text-white/80 transition-colors uppercase tracking-widest mt-0.5">Tir à la corde • Temps réel</p>
                </div>
              </div>
              <ChevronRight className="text-red-600 group-hover:text-white transition-all group-hover:translate-x-2" size={24} strokeWidth={3} />
            </div>
          </motion.button>

          <div className="flex items-center gap-3">
             <div className="relative flex-grow">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Trouver une ligue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-voyage-accent transition-all text-sm font-bold shadow-sm"
                />
             </div>
             <button 
               onClick={onCreateLeague}
               className="bg-voyage-accent text-white p-3.5 rounded-2xl shadow-lg shadow-voyage-accent/20 hover:scale-105 active:scale-95 transition-all"
             >
                <Plus size={24} />
             </button>
          </div>
        </div>

        {/* Categories Header */}
        <div className="flex items-center justify-between px-2">
           <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ligues Actives • 24H</h2>
           <div className="flex items-center gap-2">
              <Zap size={14} className="text-voyage-accent animate-pulse" />
              <span className="text-[10px] font-black text-voyage-accent uppercase tracking-widest">En direct</span>
           </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-6">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-voyage-accent/10 rounded-full" />
                <div className="w-16 h-16 border-4 border-voyage-accent border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
             </div>
             <p className="text-[10px] font-black text-voyage-accent uppercase tracking-widest animate-pulse">Synchronisation des ligues...</p>
          </div>
        ) : allDisplayLeagues.length > 0 ? (
          <div className="grid gap-4 pb-10">
            {allDisplayLeagues.map((league) => {
              const isJoined = league.isJoined;
              const isCreator = league.creator_id === session?.user?.id;
              const timeLeftSeconds = league.timeLeftSeconds || 0;
              const totalSeconds = 24 * 3600;
              const progress = Math.max(0, Math.min(100, (timeLeftSeconds / totalSeconds) * 100));

              return (
                <motion.div
                  key={league.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => isJoined ? handleAction(e, 'select', league.id) : handleAction(e, 'join', league.id)}
                  className={cn(
                    "bg-white border-2 rounded-[2rem] p-5 transition-all relative overflow-hidden group shadow-sm hover:shadow-xl hover:border-voyage-accent/20",
                    isJoined ? "border-slate-100" : "border-slate-100/50 opacity-95"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank or Tier Icon */}
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border transition-transform group-hover:rotate-3",
                      league.tier === 'bronze' ? "bg-amber-50 border-amber-100 text-amber-600" :
                      league.tier === 'silver' ? "bg-slate-50 border-slate-100 text-slate-400" :
                      league.tier === 'gold' ? "bg-yellow-50 border-yellow-100 text-yellow-600" :
                      "bg-voyage-primary/5 border-voyage-primary/10 text-voyage-primary"
                    )}>
                      {isJoined && league.myRank > 0 ? (
                        <span className="text-xl font-black">#{league.myRank}</span>
                      ) : (
                        <Trophy size={28} />
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-voyage-primary text-base uppercase truncate tracking-tight">{league.name}</h3>
                        {isCreator && (
                          <div className="bg-emerald-100 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Moi</div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400" fill="currentColor" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{league.players.length} Joueurs</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ligue {league.tier}</span>
                      </div>
                    </div>

                    {/* Timer Circle */}
                    <div className="relative w-12 h-12 flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            className="text-slate-100"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={126}
                            strokeDashoffset={126 - (126 * progress) / 100}
                            strokeLinecap="round"
                            className={cn(
                              "transition-all duration-1000",
                              progress > 50 ? "text-voyage-accent" : progress > 20 ? "text-amber-500" : "text-red-500"
                            )}
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[8px] font-black text-slate-500">{league.timeLeft.split(' ')[0]}</span>
                       </div>
                    </div>
                  </div>

                  {/* Creator Actions */}
                  {/* Creator Actions */}
                  {isCreator && (
                    <div className="absolute top-4 right-16 flex gap-2 opacity-100 transition-all">
                       <button 
                         onClick={(e) => handleAction(e, 'edit', league.id)}
                         className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all"
                       >
                          <Edit2 size={14} />
                       </button>
                       <button 
                         onClick={(e) => handleAction(e, 'delete', league.id)}
                         className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                  )}

                  {!isJoined && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                       <div className="bg-voyage-primary text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-md">
                          Rejoindre
                       </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-16 text-center space-y-6">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
               <Shield size={40} className="text-slate-200" />
             </div>
             <div className="space-y-2">
               <h3 className="font-black text-slate-400 uppercase tracking-widest">Aucune ligue trouvée</h3>
               <p className="text-xs text-slate-400 font-bold max-w-[240px] mx-auto leading-relaxed">Défie tes amis en créant ta propre compétition !</p>
             </div>
             <button 
               onClick={onCreateLeague}
               className="bg-voyage-accent text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-voyage-accent/20 hover:scale-105 active:scale-95 transition-all"
             >
               Créer une ligue
             </button>
          </div>
        )}
      </main>
    </div>
  );
}
