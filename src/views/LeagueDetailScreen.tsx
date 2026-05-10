/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Trophy, Timer, ArrowLeft, Star, TrendingUp, TrendingDown, Minus, Shield, Trash2, LogOut, Copy, Check, Medal, Navigation2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '../lib/utils';
import { useLeagues } from '../hooks/useLeagues';
import { useAuth } from '../hooks/useSupabase';
import TopAppBar from '../components/TopAppBar';
import ConfirmationModal from '../components/ConfirmationModal';

interface LeagueDetailScreenProps {
  leagueId: string;
  onBack: () => void;
}

export default function LeagueDetailScreen({ leagueId, onBack }: LeagueDetailScreenProps) {
  const { session } = useAuth();
  const { leagues, loading, leaveLeague, deleteLeague } = useLeagues(session?.user?.id);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState<'leave' | 'delete' | null>(null);
  const [copied, setCopied] = useState(false);

  const league = useMemo(() => leagues.find(l => l.id === leagueId), [leagues, leagueId]);
  const isCreator = league?.creator_id === session?.user?.id;
  const stats = { xp: 0, stars: 0, level: 1 }; // Mocked for TopAppBar

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`Rejoins ma ligue ${league?.name} sur Voyage des Compétences ! ID: ${league?.id}`);
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

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-12 h-12 border-4 border-voyage-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-voyage-accent uppercase tracking-widest">Chargement du classement...</p>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white p-10 text-center gap-6">
        <Shield size={64} className="text-slate-200" />
        <div className="space-y-2">
          <h2 className="text-xl font-black text-voyage-primary uppercase tracking-tight">Ligue non trouvée</h2>
          <p className="text-sm font-bold text-slate-400">Cette compétition n'existe plus ou tu n'en fais pas partie.</p>
        </div>
        <button onClick={onBack} className="bg-voyage-accent text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Retour</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden">
      <TopAppBar stats={stats} title={league.name} onBack={() => setShowExitModal(true)} />
      
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
          ? "Cette action est irréversible. Tous les membres seront expulsés." 
          : "Tu ne feras plus partie de ce classement."}
        confirmLabel={showActionModal === 'delete' ? "Supprimer" : "Quitter"}
        cancelLabel="Annuler"
      />
      
      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-6 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">
        
        {/* League Header Card */}
        <section className={cn(
          "rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl",
          league.tier === 'bronze' ? "bg-gradient-to-br from-amber-500 to-amber-700" :
          league.tier === 'silver' ? "bg-gradient-to-br from-slate-400 to-slate-600" :
          "bg-gradient-to-br from-voyage-accent to-voyage-primary"
        )}>
           <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                    <Trophy size={14} className="text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ligue {league.tier}</span>
                 </div>
                 <h1 className="text-3xl font-black tracking-tight leading-tight uppercase">{league.name}</h1>
                 <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1.5">
                       <Timer size={16} />
                       <span className="text-xs font-black uppercase tracking-widest">{league.timeLeft}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <div className="flex items-center gap-1.5">
                       <Star size={16} className="text-yellow-300" fill="currentColor" />
                       <span className="text-xs font-black uppercase tracking-widest">{league.players.length} Joueurs</span>
                    </div>
                 </div>
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-[2rem] backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                 <Trophy size={40} className="text-white" />
              </div>
           </div>
           
           {/* Action Buttons */}
           <div className="relative z-10 mt-8 flex gap-2">
              <button 
                onClick={handleCopyLink}
                className="flex-grow bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                 {copied ? <Check size={16} /> : <Copy size={16} />}
                 <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copié !' : 'Inviter'}</span>
              </button>
              
              {isCreator ? (
                <button 
                  onClick={() => setShowActionModal('delete')}
                  className="bg-red-500/80 hover:bg-red-600 border border-red-400/30 px-4 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                >
                   <Trash2 size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => setShowActionModal('leave')}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                >
                   <LogOut size={18} />
                </button>
              )}
           </div>

           <Trophy className="absolute -bottom-10 -right-10 text-white/10" size={240} />
        </section>

        {/* Leaderboard List */}
        <section className="bg-white rounded-[2.5rem] border-2 border-voyage-accent/5 shadow-xl overflow-hidden">
           <div className="p-6 border-b border-voyage-accent/5 bg-voyage-accent/5 flex items-center justify-between">
              <h2 className="text-xs font-black text-voyage-primary uppercase tracking-widest">Classement du Groupe</h2>
              <div className="flex items-center gap-2">
                 <TrendingUp size={14} className="text-voyage-primary" />
                 <span className="text-[10px] font-bold text-voyage-primary/60 uppercase tracking-tighter">Mise à jour en direct</span>
              </div>
           </div>

           <div className="divide-y divide-voyage-accent/5">
              {league.players.map((player) => (
                <div 
                  key={player.id} 
                  className={cn(
                    "flex items-center justify-between p-5 transition-all",
                    player.isCurrentUser ? "bg-voyage-primary/5 border-l-4 border-voyage-primary" : "hover:bg-slate-50"
                  )}
                >
                   <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black",
                        player.rank === 1 ? "bg-yellow-400 text-white shadow-md" :
                        player.rank === 2 ? "bg-slate-300 text-white" :
                        player.rank === 3 ? "bg-amber-600 text-white" : "text-duo-wolf/40"
                      )}>
                         {player.rank}
                      </div>
                      <div className="relative">
                         <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-voyage-sand">
                            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                         </div>
                         {player.rank === 1 && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-1 shadow-sm border border-white">
                               <Trophy size={10} fill="currentColor" />
                            </div>
                         )}
                      </div>
                      <div>
                         <h3 className={cn(
                           "font-black text-sm uppercase tracking-tight",
                           player.isCurrentUser ? "text-voyage-primary" : "text-duo-eel"
                         )}>
                            {player.name} {player.isCurrentUser && "(Moi)"}
                         </h3>
                         <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2">
                               <div className="flex items-center gap-1">
                                  <Medal className="text-duo-orange" size={10} fill="currentColor" />
                                  <span className="text-[10px] font-black text-duo-orange uppercase">Lvl {Math.floor(player.xp / 1000) + 1}</span>
                               </div>
                               <div className="w-1 h-1 rounded-full bg-slate-200" />
                               <div className="flex items-center gap-1">
                                  <Star className="text-amber-500" size={10} fill="currentColor" />
                                  <span className="text-[10px] font-black text-amber-500 uppercase">{player.badgesEarned || 0} Badges</span>
                               </div>
                            </div>
                            {/* City Progress Indicator */}
                            <div className="flex items-center gap-2 mt-0.5 bg-voyage-sand/30 px-2 py-1 rounded-lg border border-voyage-accent/5">
                               <Navigation2 size={10} className="text-voyage-accent -rotate-45" />
                               <span className="text-[9px] font-black text-voyage-accent uppercase tracking-widest">
                                  {player.citiesCompleted === 0 ? 'Rabat' : 
                                   player.citiesCompleted === 1 ? 'Chefchaouen' : 
                                   player.citiesCompleted === 2 ? 'Fès' : 
                                   player.citiesCompleted === 3 ? 'Marrakech' : 
                                   player.citiesCompleted === 4 ? 'Essaouira' : 
                                   player.citiesCompleted === 5 ? 'Agadir' : 
                                   player.citiesCompleted === 6 ? 'Laâyoune' : 'Dakhla'}
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="text-right">
                      <div className="text-sm font-black text-duo-eel uppercase tracking-tighter">
                         {player.xp.toLocaleString()} XP
                      </div>
                      {player.rank <= 3 ? (
                        <div className="flex items-center gap-1 justify-end text-voyage-primary">
                           <TrendingUp size={10} />
                           <span className="text-[8px] font-black uppercase tracking-widest">Promotion</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 justify-end text-duo-wolf/30">
                           <Minus size={10} />
                           <span className="text-[8px] font-black uppercase tracking-widest">Stable</span>
                        </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </section>

      </main>
    </div>
  );
}
