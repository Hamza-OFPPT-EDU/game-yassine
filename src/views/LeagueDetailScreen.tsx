/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, ArrowLeft, Star, TrendingUp, TrendingDown, Minus, Shield, Trash2, LogOut, Copy, Check, Medal, Navigation2, Clock, Users, ArrowRight, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLeagues } from '../hooks/useLeagues';
import { useAuth } from '../hooks/useSupabase';
import TopAppBar from '../components/TopAppBar';
import ConfirmationModal from '../components/ConfirmationModal';

interface LeagueDetailScreenProps {
  leagueId: string;
  onBack: () => void;
  onShowBadges?: () => void;
  onContinueAdventure?: () => void;
  userStats: { xp: number; stars: number; level: number; cities: number; badges: number };
}

export default function LeagueDetailScreen({ leagueId, onBack, onShowBadges, onContinueAdventure, userStats }: LeagueDetailScreenProps) {
  const { session } = useAuth();
  const { leagues, loading, leaveLeague, deleteLeague } = useLeagues(session?.user?.id);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState<'leave' | 'delete' | null>(null);
  const [copied, setCopied] = useState(false);

  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  const league = useMemo(() => leagues.find(l => l.id === leagueId), [leagues, leagueId]);
  const isCreator = league?.creator_id === session?.user?.id;
  const stats = userStats; 

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`Rejoins ma ligue ${league?.name} ! ID: ${league?.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = async () => {
    if (showActionModal === 'leave') {
      await leaveLeague(leagueId);
      onBack();
    } else if (showActionModal === 'delete') {
      await deleteLeague(leagueId);
      onBack();
    }
    setShowActionModal(null);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-12 h-12 border-4 border-voyage-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-voyage-accent uppercase tracking-widest">Analyse du classement...</p>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white p-10 text-center gap-6">
        <Shield size={64} className="text-slate-200" />
        <div className="space-y-2">
          <h2 className="text-xl font-black text-voyage-primary uppercase tracking-tight">Ligue non trouvée</h2>
          <p className="text-sm font-bold text-slate-400">Cette compétition est terminée ou introuvable.</p>
        </div>
        <button onClick={onBack} className="bg-voyage-accent text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Retour</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden font-sans">
      <TopAppBar stats={stats} title="Détails de la Ligue" onBack={() => setShowExitModal(true)} />
      
      <ConfirmationModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={onBack}
        title="Quitter la vue ?"
        message="Voulez-vous retourner à la liste des compétitions ?"
        confirmLabel="Oui, retourner"
        cancelLabel="Non, rester"
      />

      <ConfirmationModal
        isOpen={!!showActionModal}
        onClose={() => setShowActionModal(null)}
        onConfirm={handleAction}
        title={showActionModal === 'delete' ? "Supprimer la compétition ?" : "Quitter la compétition ?"}
        message={showActionModal === 'delete' 
          ? "Cette action est irréversible." 
          : "Tu ne feras plus partie de ce classement."}
        confirmLabel={showActionModal === 'delete' ? "Supprimer" : "Quitter"}
        cancelLabel="Annuler"
      />
      
      <main className="flex-grow overflow-y-auto px-4 pt-24 pb-32 space-y-6 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">
        
        {/* Advanced League Header */}
        <section className={cn(
          "rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-2xl",
          league.tier === 'bronze' ? "bg-amber-600" :
          league.tier === 'silver' ? "bg-slate-500" :
          league.tier === 'gold' ? "bg-yellow-600" : "bg-voyage-accent"
        )}>
           <div className="relative z-10 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                       <Shield size={12} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Ligue {league.tier}</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight leading-tight uppercase">{league.name}</h1>
                 </div>
                 <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <Trophy size={24} />
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                 <div className="bg-black/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/60 mb-1">Temps Restant</p>
                    <div className="flex items-center gap-1.5">
                       <Timer size={14} className="text-white" />
                       <span className="text-xs font-black uppercase">{league.timeLeft}</span>
                    </div>
                 </div>
                 <div className="bg-black/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/60 mb-1">Joueurs</p>
                    <div className="flex items-center gap-1.5">
                       <Users size={14} className="text-white" />
                       <span className="text-xs font-black uppercase">{league.players.length}</span>
                    </div>
                 </div>
                 <div className="bg-black/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/60 mb-1">Tes Points</p>
                    <div className="flex items-center gap-1.5">
                       <Star size={14} className="text-yellow-300" fill="currentColor" />
                       <span className="text-xs font-black uppercase">
                          {league.players.find(p => p.isCurrentUser)?.xp.toLocaleString() || 0}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                 <div className="flex gap-2">
                    <button 
                      onClick={handleCopyLink}
                      className="flex-grow bg-white text-voyage-primary py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg"
                    >
                       {copied ? <Check size={14} /> : <Copy size={14} />}
                       {copied ? 'Lien Copié' : 'Inviter des amis'}
                    </button>
                    {isCreator ? (
                       <button onClick={() => setShowActionModal('delete')} className="bg-red-500/20 hover:bg-red-500/30 border border-white/10 px-4 rounded-2xl flex items-center justify-center"><Trash2 size={18} /></button>
                    ) : (
                       <button onClick={() => setShowActionModal('leave')} className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 rounded-2xl flex items-center justify-center"><LogOut size={18} /></button>
                    )}
                 </div>
                 
                 {onContinueAdventure && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onContinueAdventure}
                      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-voyage-primary py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.1em] shadow-xl shadow-amber-900/20 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all"
                    >
                       <Zap size={18} fill="currentColor" />
                       Continuer l'aventure
                       <ArrowRight size={18} />
                    </motion.button>
                 )}
              </div>
           </div>
           
           <Trophy className="absolute -bottom-10 -right-10 text-white/5" size={200} />
        </section>

        {/* Rewards Section */}
        <div className="bg-white rounded-3xl p-4 border-2 border-slate-50 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
              <Star size={24} fill="currentColor" />
           </div>
           <div className="flex-grow">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Récompense de Saison</h4>
              <p className="text-xs font-black text-slate-700">Badge "Gardien de l'Atlas" + 500 XP</p>
           </div>
           <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase">Top 3</span>
           </div>
        </div>

        {/* Specialized Stats Section */}
        <div className="grid gap-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performances du Groupe</h2>
              <div className="h-px flex-grow mx-4 bg-slate-100" />
           </div>

           <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-xl overflow-hidden divide-y divide-slate-50">
              {league.players.map((player, index) => {
                const nextPlayer = league.players[index - 1];
                const xpDiff = nextPlayer ? nextPlayer.xp - player.xp : 0;
                const isDuel = xpDiff > 0 && xpDiff < 200;
                
                return (
                  <motion.div 
                    key={player.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-6 relative group",
                      player.isCurrentUser ? "bg-voyage-primary/[0.02]" : "hover:bg-slate-50/50"
                    )}
                  >
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                           <div className="relative">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-transform group-hover:scale-110",
                                player.rank === 1 ? "bg-yellow-400 text-white shadow-lg shadow-yellow-200" :
                                player.rank === 2 ? "bg-slate-300 text-white" :
                                player.rank === 3 ? "bg-amber-600 text-white" : "bg-slate-50 text-slate-300 border"
                              )}>
                                 {player.rank}
                              </div>
                              {isDuel && (
                                <motion.div 
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                  className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 border-2 border-white"
                                >
                                   <Zap size={8} className="text-white fill-white" />
                                </motion.div>
                              )}
                           </div>
                           <div className="flex items-center gap-3">
                              <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                              <div>
                                 <h3 className="font-black text-sm uppercase text-slate-700">{player.name}</h3>
                                 <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                       <Clock size={10} />
                                       {formatTime((player as any).timePlayed || 0)}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-voyage-accent">
                                       <Navigation2 size={10} className="-rotate-45" />
                                       {player.citiesCompleted}/8
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="text-right">
                           <p className="text-lg font-black text-slate-800 leading-none">{player.xp.toLocaleString()}</p>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Points</p>
                        </div>
                     </div>

                     {/* Progress & Comparison */}
                     <div className="space-y-4">
                        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(player.xp / (league.players[0].xp || 1)) * 100}%` }}
                             className="h-full bg-voyage-accent" 
                           />
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="flex gap-2">
                              <div className="bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100 flex items-center gap-1">
                                 <Star size={10} fill="currentColor" />
                                 <span className="text-[9px] font-black">{player.badgesEarned} Bijoux</span>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setExpandedPlayerId(expandedPlayerId === player.id ? null : player.id); }}
                                className="bg-slate-50 text-slate-400 px-3 py-1 rounded-lg border border-slate-100 text-[9px] font-black uppercase hover:bg-slate-100 transition-all"
                              >
                                 {expandedPlayerId === player.id ? 'Fermer' : 'Détails'}
                              </button>
                           </div>
                           
                           {xpDiff > 0 && (
                             <div className="flex items-center gap-1 text-slate-400">
                                <TrendingUp size={10} className={cn(isDuel ? "text-red-500" : "text-voyage-accent")} />
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-tighter",
                                  isDuel && "text-red-500 font-black"
                                )}>
                                   {isDuel ? "DUEL ! " : "-"}{xpDiff.toLocaleString()} pts de #{player.rank - 1}
                                </span>
                             </div>
                           )}
                           
                           {player.rank === 1 && (
                             <div className="flex items-center gap-1 text-emerald-500">
                                <Medal size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">En tête !</span>
                             </div>
                           )}
                        </div>

                        {/* Expanded Details: Chart, Skills, Cities */}
                        <AnimatePresence>
                           {expandedPlayerId === player.id && (
                             <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="overflow-hidden pt-4 space-y-6"
                             >
                                {/* Activity Mini-Chart */}
                                <div className="space-y-3">
                                   <div className="flex justify-between items-center">
                                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Activité (7j)</h4>
                                      <span className="text-[8px] font-bold text-voyage-accent">+120 XP hier</span>
                                   </div>
                                   <div className="h-16 flex items-end justify-between px-2 gap-1.5">
                                      {[40, 70, 30, 90, 50, 100, 60].map((h, i) => (
                                        <div key={i} className="flex-grow group relative">
                                           <motion.div 
                                             initial={{ height: 0 }}
                                             animate={{ height: `${h}%` }}
                                             className={cn(
                                               "w-full rounded-t-sm transition-colors",
                                               i === 5 ? "bg-voyage-accent" : "bg-slate-100 group-hover:bg-slate-200"
                                             )} 
                                           />
                                        </div>
                                      ))}
                                   </div>
                                </div>

                                {/* Skills Section */}
                                <div className="space-y-3">
                                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compétences Apprises</h4>
                                   <div className="flex flex-wrap gap-2">
                                      {['Grammaire', 'Vocabulaire', 'Culture', 'Oral'].map((skill, i) => (
                                        <div key={skill} className="bg-white border-2 border-slate-50 px-3 py-1.5 rounded-xl flex items-center gap-2">
                                           <div className={cn(
                                             "w-2 h-2 rounded-full",
                                             i === 0 ? "bg-emerald-400" : i === 1 ? "bg-blue-400" : i === 2 ? "bg-amber-400" : "bg-purple-400"
                                           )} />
                                           <span className="text-[9px] font-black text-slate-600 uppercase">{skill}</span>
                                        </div>
                                      ))}
                                   </div>
                                </div>

                                {/* City History Timeline */}
                                <div className="space-y-3 pb-2">
                                   <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Villes Traversées</h4>
                                   <div className="flex items-center gap-1">
                                      {['Rabat', 'Tanger', 'Fès', 'Marrakech', 'Casablanca'].map((city, i) => (
                                        <React.Fragment key={city}>
                                           <div className={cn(
                                             "w-2 h-2 rounded-full",
                                             i < player.citiesCompleted ? "bg-voyage-accent" : "bg-slate-100"
                                           )} />
                                           {i < 4 && <div className={cn("h-[2px] flex-grow", i < player.citiesCompleted - 1 ? "bg-voyage-accent" : "bg-slate-100")} />}
                                        </React.Fragment>
                                      ))}
                                   </div>
                                   <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                      <span>Départ</span>
                                      <span>Objectif 8</span>
                                   </div>
                                </div>
                             </motion.div>
                           )}
                        </AnimatePresence>
                     </div>

                     {player.isCurrentUser && (
                       <div className="absolute top-0 right-0 w-1 h-full bg-voyage-primary" />
                     )}
                  </motion.div>
                )
              })}
           </div>
        </div>

        {/* Info Card */}
        <div className="bg-voyage-primary text-white rounded-[2.5rem] p-6 relative overflow-hidden">
           <div className="relative z-10 space-y-2">
              <h4 className="font-black text-xs uppercase tracking-widest">Comment monter ?</h4>
              <p className="text-[10px] text-white/80 font-bold leading-relaxed">
                 Termine plus d'exercices dans les villes et explore de nouveaux monuments pour gagner des points d'XP et grimper au sommet de la ligue avant la fin du temps imparti !
              </p>
           </div>
           <Star className="absolute -bottom-6 -right-6 text-white/10" size={100} />
        </div>

      </main>
    </div>
  );
}
