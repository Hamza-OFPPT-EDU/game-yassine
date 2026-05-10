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
        <section className="bg-voyage-accent rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                 <Timer size={14} className="text-white" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Saison 4 • Compétitions Actives</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">
                Tes Compétitions
              </h1>
              <p className="text-white/80 font-bold">
                Crée ou rejoins des groupes pour comparer ton score avec tes amis !
              </p>
           </div>
           <Trophy className="absolute -bottom-6 -right-6 text-white/10" size={180} />
        </section>

        {/* Action Row */}
        <section className="flex gap-4">
           <button onClick={onCreateLeague} className="flex-grow flex items-center justify-center gap-2 bg-white border-2 border-duo-swan p-4 rounded-2xl border-b-4 hover:bg-duo-swan/20 transition-all">
              <Plus size={20} className="text-voyage-accent" />
              <span className="font-black text-xs text-voyage-accent uppercase tracking-widest">Créer</span>
           </button>
           <button 
             onClick={() => setShowJoinModal(true)}
             className="flex-grow flex items-center justify-center gap-2 bg-white border-2 border-duo-swan p-4 rounded-2xl border-b-4 hover:bg-duo-swan/20 transition-all"
           >
              <Search size={20} className="text-duo-orange" />
              <span className="font-black text-xs text-duo-orange uppercase tracking-widest">Rejoindre</span>
           </button>
        </section>

        {/* Leagues List */}
        <section className="space-y-4">
           <h2 className="text-sm font-black text-duo-wolf uppercase tracking-widest px-2">Mes Groupes</h2>
           
           {loading ? (
             <div className="py-12 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-voyage-accent" size={40} />
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Synchronisation...</p>
             </div>
           ) : leagues.length > 0 ? (
             leagues.map((league) => (
               <motion.div
                 key={league.id}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => onSelectLeague(league.id)}
                 className={cn(
                   "bg-white border-2 rounded-[2rem] p-6 border-b-4 transition-all cursor-pointer relative group border-voyage-accent/30 shadow-md"
                 )}
               >
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                       <div className={cn(
                         "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border-b-4",
                         league.tier === 'bronze' ? "bg-amber-100 border-amber-200 text-amber-600" :
                         league.tier === 'silver' ? "bg-slate-100 border-slate-200 text-slate-400" :
                         "bg-voyage-primary/10 border-voyage-primary text-voyage-primary"
                       )}>
                          <Trophy size={32} />
                       </div>
                       <div>
                          <h3 className="font-black text-duo-eel text-lg leading-tight uppercase tracking-tight">{league.name}</h3>
                          <p className="text-xs font-bold text-duo-wolf/60 uppercase tracking-widest mt-1">
                             {league.players.length} Joueurs • {league.timeLeft}
                          </p>
                       </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end">
                       {league.myRank > 0 ? (
                         <>
                           <div className="flex items-center gap-1 bg-voyage-primary/10 text-voyage-primary px-2 py-0.5 rounded-full mb-1">
                              <TrendingUp size={12} />
                              <span className="text-[10px] font-black uppercase tracking-tighter">Ton rang</span>
                           </div>
                           <span className="text-2xl font-black text-duo-eel">#{league.myRank}</span>
                         </>
                       ) : (
                         <span className="text-duo-wolf/20 font-black text-2xl">—</span>
                       )}
                    </div>
                 </div>

                 {/* Avatars Preview */}
                 {league.players.length > 0 && (
                   <div className="mt-6 flex items-center justify-between border-t border-duo-swan pt-4">
                      <div className="flex -space-x-3">
                         {league.players.slice(0, 4).map((p) => (
                           <div key={p.id} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-duo-swan">
                              <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                           </div>
                         ))}
                         {league.players.length > 4 && (
                           <div className="w-9 h-9 rounded-full border-2 border-white bg-voyage-accent text-white flex items-center justify-center text-[10px] font-black">
                              +{league.players.length - 4}
                           </div>
                         )}
                      </div>
                      <div className="flex items-center gap-2 text-voyage-accent font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                         Voir le classement <ChevronRight size={14} />
                      </div>
                   </div>
                 )}
               </motion.div>
             ))
           ) : (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center space-y-4">
                <Shield size={48} className="text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="font-black text-slate-400 uppercase tracking-tight">Aucun groupe actif</p>
                  <p className="text-xs text-slate-400 font-bold max-w-[200px] mx-auto">Crée ton propre groupe ou rejoins tes amis !</p>
                </div>
                <button 
                  onClick={onCreateLeague}
                  className="text-voyage-accent font-black text-xs uppercase tracking-widest border-2 border-voyage-accent/20 px-6 py-3 rounded-xl hover:bg-voyage-accent/5 transition-all"
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
