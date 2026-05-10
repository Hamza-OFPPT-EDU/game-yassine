import { motion } from 'motion/react';
import { Trophy, Timer, ChevronRight, Star, Plus, Shield, Zap, TrendingUp, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useLeagues } from '../hooks/useLeagues';
import { useAuth } from '../hooks/useSupabase';
import TopAppBar from '../components/TopAppBar';
import ConfirmationModal from '../components/ConfirmationModal';

interface LeagueScreenProps {
  onSelectLeague: (id: string) => void;
  onCreateLeague: () => void;
  onBack: () => void;
}

export default function LeagueScreen({ onSelectLeague, onCreateLeague, onBack }: LeagueScreenProps) {
  const { session } = useAuth();
  const { leagues, loading, fetchAllLeagues, joinLeague } = useLeagues(session?.user?.id);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [allLeagues, setAllLeagues] = useState<any[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = { xp: 0, stars: 0, level: 1 }; // These could be fetched from profile if needed

  useEffect(() => {
    if (showJoinModal) {
      setLoadingAll(true);
      fetchAllLeagues().then(data => {
        setAllLeagues(data || []);
        setLoadingAll(false);
      });
    }
  }, [showJoinModal]);

  const filteredLeagues = allLeagues.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !leagues.some(myL => myL.id === l.id)
  );

  const handleJoin = async (id: string) => {
    await joinLeague(id);
    setShowJoinModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Celebration Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -20, 
              x: Math.random() * window.innerWidth,
              rotate: 0,
              opacity: 1 
            }}
            animate={{
              y: window.innerHeight + 20,
              x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200,
              rotate: Math.random() * 720,
              opacity: 0
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: 'easeOut'
            }}
            className="fixed text-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20
            }}
          >
            {['⭐', '✨', '🏆', '💫', '🟡'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

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

      {/* Join League Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-voyage-accent/10">
              <h2 className="text-xl font-black text-voyage-primary mb-4 uppercase tracking-tight">Rejoindre une compétition</h2>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-voyage-primary transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-3">
              {loadingAll ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="animate-spin text-voyage-accent" size={32} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Recherche en cours...</p>
                </div>
              ) : filteredLeagues.length > 0 ? (
                filteredLeagues.map(l => (
                  <div key={l.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-voyage-accent/30 transition-all group">
                    <div>
                      <h3 className="font-black text-voyage-primary uppercase text-sm tracking-tight">{l.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.tier} • Ligue active</p>
                    </div>
                    <button 
                      onClick={() => handleJoin(l.id)}
                      className="bg-voyage-primary text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md shadow-voyage-primary/20"
                    >
                      Rejoindre
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-slate-400">Aucune autre compétition trouvée.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">
        
        {/* Season Status */}
        <section className="bg-voyage-accent rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                 <Timer size={14} className="text-white" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Saison 2026 • En cours</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight leading-tight uppercase">
                Le Voyage des Ligues
              </h1>
              <p className="text-white/90 font-bold text-sm leading-relaxed max-w-md">
                Défie d'autres explorateurs et grimpe dans le classement pour devenir une légende !
              </p>
           </div>
           <Trophy className="absolute -bottom-10 -right-10 text-white/10" size={240} />
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
        </section>

        {/* Action Row */}
        <section className="flex gap-4">
           <button 
             onClick={onCreateLeague} 
             className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-slate-100 p-5 rounded-[2rem] shadow-sm hover:border-voyage-accent/30 hover:shadow-md transition-all active:scale-95"
           >
              <div className="w-10 h-10 bg-voyage-accent/10 rounded-xl flex items-center justify-center">
                <Plus size={20} className="text-voyage-accent" />
              </div>
              <span className="font-black text-xs text-voyage-primary uppercase tracking-widest">Créer un groupe</span>
           </button>
        </section>

        {/* Leagues List */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Toutes les Compétitions</h2>
              <div className="h-px flex-grow mx-4 bg-slate-100" />
              <Shield size={16} className="text-slate-200" />
           </div>
           
           {loading ? (
             <div className="py-20 flex flex-col items-center gap-6">
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-voyage-accent/10 rounded-full" />
                   <div className="w-16 h-16 border-4 border-voyage-accent border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                </div>
                <p className="text-[10px] font-black text-voyage-accent uppercase tracking-widest animate-pulse">Ouverture des portes du stade...</p>
             </div>
           ) : leagues.length > 0 ? (
             <div className="grid gap-4">
               {leagues.map((league) => (
                 <motion.div
                   key={league.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => (league as any).isJoined ? onSelectLeague(league.id) : null}
                   className={cn(
                     "bg-white border-2 rounded-[2.5rem] p-6 transition-all relative overflow-hidden group shadow-sm hover:shadow-xl",
                     (league as any).isJoined 
                       ? "border-voyage-accent/20 cursor-pointer" 
                       : "border-slate-100 opacity-90"
                   )}
                 >
                   {/* Tier Indicator Tag */}
                   <div className={cn(
                     "absolute top-0 right-0 px-6 py-1.5 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-widest text-white shadow-sm",
                     league.tier === 'bronze' ? "bg-amber-600" :
                     league.tier === 'silver' ? "bg-slate-400" :
                     league.tier === 'gold' ? "bg-voyage-primary" :
                     league.tier === 'emerald' ? "bg-emerald-500" : "bg-voyage-accent"
                   )}>
                      Ligue {league.tier}
                   </div>

                   <div className="flex justify-between items-start pt-2">
                      <div className="flex items-center gap-5">
                         <div className={cn(
                           "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner border",
                           league.tier === 'bronze' ? "bg-amber-50 border-amber-100 text-amber-600" :
                           league.tier === 'silver' ? "bg-slate-50 border-slate-100 text-slate-400" :
                           "bg-voyage-primary/5 border-voyage-primary/10 text-voyage-primary"
                         )}>
                            <Trophy size={32} className={cn(
                               (league as any).isJoined ? "animate-bounce-slow" : ""
                            )} />
                         </div>
                         <div>
                            <h3 className="font-black text-voyage-primary text-lg leading-tight uppercase tracking-tight">{league.name}</h3>
                            <div className="flex items-center gap-3 mt-1.5">
                               <div className="flex items-center gap-1.5">
                                  <Timer size={12} className="text-slate-300" />
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{league.timeLeft}</span>
                               </div>
                               <div className="w-1 h-1 rounded-full bg-slate-200" />
                               <div className="flex items-center gap-1.5">
                                  <Star size={12} className="text-yellow-400" fill="currentColor" />
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{league.players.length} Joueurs</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="text-right pt-2">
                        {(league as any).isJoined ? (
                           <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-black text-voyage-accent uppercase tracking-tighter">Ton Rang</span>
                              <span className="text-3xl font-black text-voyage-primary drop-shadow-sm">#{league.myRank}</span>
                           </div>
                        ) : (
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               handleJoin(league.id);
                             }}
                             className="bg-voyage-primary text-white text-[10px] font-black px-6 py-3 rounded-2xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-voyage-primary/20"
                           >
                             Rejoindre
                           </button>
                        )}
                      </div>
                   </div>

                   {/* Avatars Preview Section */}
                   <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-5">
                      <div className="flex items-center gap-3">
                         <div className="flex -space-x-3">
                            {league.players.length > 0 ? (
                              league.players.slice(0, 5).map((p) => (
                                <div key={p.id} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden bg-voyage-sand shadow-sm ring-1 ring-slate-100">
                                   <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                              ))
                            ) : (
                              <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-50 flex items-center justify-center text-slate-200 ring-1 ring-slate-100">
                                 <Plus size={16} />
                              </div>
                            )}
                            {league.players.length > 5 && (
                              <div className="w-10 h-10 rounded-full border-4 border-white bg-voyage-accent text-white flex items-center justify-center text-[10px] font-black shadow-sm ring-1 ring-voyage-accent/20">
                                 +{league.players.length - 5}
                              </div>
                            )}
                         </div>
                         {league.players.length > 0 && (
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-2">En lice</span>
                         )}
                      </div>
                      
                      {(league as any).isJoined && (
                        <div className="flex items-center gap-2 text-voyage-accent font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-all">
                           Voir classement <ChevronRight size={16} />
                        </div>
                      )}
                   </div>

                   {/* Decorative gradient corner */}
                   <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-voyage-accent/5 rounded-full blur-2xl pointer-events-none" />
                 </motion.div>
               ))}
             </div>
           ) : (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Shield size={40} className="text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-slate-400 uppercase tracking-widest">Le stade est vide</h3>
                  <p className="text-xs text-slate-400 font-bold max-w-[240px] mx-auto leading-relaxed">Soyez le premier à inaugurer une nouvelle compétition !</p>
                </div>
                <button 
                  onClick={onCreateLeague}
                  className="bg-voyage-accent text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-voyage-accent/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Démarrer une ligue
                </button>
             </div>
           )}
        </section>

      </main>
    </div>
  );
}
