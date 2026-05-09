import { motion } from 'motion/react';
import { Trophy, Timer, ChevronRight, Star, Plus, Shield, Zap, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import type { League } from '../types';
import { AVATAR_MALE_URL, AVATAR_FEMALE_URL } from '../types';
import TopAppBar from '../components/TopAppBar';
import ConfirmationModal from '../components/ConfirmationModal';

interface LeagueScreenProps {
  onSelectLeague: (id: string) => void;
  onCreateLeague: () => void;
  onBack: () => void;
}

const MOCK_LEAGUES: League[] = [
  {
    id: 'bronze',
    name: 'Ligue Bronze',
    tier: 'bronze',
    timeLeft: '2j 4h',
    myRank: 4,
    players: [
      { id: '1', name: 'Zaynab', xp: 2100, avatar: AVATAR_FEMALE_URL, rank: 1 },
      { id: '2', name: 'Omar', xp: 1950, avatar: AVATAR_MALE_URL, rank: 2 },
      { id: '3', name: 'Yasmine', xp: 1800, avatar: AVATAR_FEMALE_URL, rank: 3 },
      { id: '4', name: 'Ahmed', xp: 1450, avatar: AVATAR_MALE_URL, rank: 4, isCurrentUser: true },
    ]
  },
  { id: 'silver', name: 'Ligue Argent', tier: 'silver', timeLeft: 'Terminé', myRank: 12, players: [] },
  { id: 'gold', name: 'Ligue Or', tier: 'gold', timeLeft: 'Bientôt', myRank: 0, players: [] },
  { id: 'emerald', name: 'Ligue Émeraude', tier: 'emerald', timeLeft: 'Verrouillé', myRank: 0, players: [] },
];

export default function LeagueScreen({ onSelectLeague, onCreateLeague, onBack }: LeagueScreenProps) {
  const stats = { xp: 1450, stars: 120, level: 4 };
  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Celebration Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {[...Array(25)].map((_, i) => (
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
            {['⭐', '✨', '🏆', '💫', '🎊', '🟡'][Math.floor(Math.random() * 6)]}
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
      
      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">
        
        {/* Season Status */}
        <section className="bg-voyage-accent rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                 <Timer size={14} className="text-white" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Saison 4 • 2j 04h restants</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">
                Ligue de Cristal
              </h1>
              <p className="text-white/80 font-bold">
                Maintiens ta position dans le top 10 pour passer à la ligue supérieure !
              </p>
           </div>
           <Trophy className="absolute -bottom-6 -right-6 text-white/10" size={180} />
        </section>

        {/* Action Row */}
        <section className="flex gap-4">
           <button onClick={onCreateLeague} className="flex-grow flex items-center justify-center gap-2 bg-white border-2 border-duo-swan p-4 rounded-2xl border-b-4 hover:bg-duo-swan/20 transition-all">
              <Plus size={20} className="text-voyage-accent" />
              <span className="font-black text-xs text-voyage-accent uppercase tracking-widest">Créer un groupe</span>
           </button>
           <button className="flex-grow flex items-center justify-center gap-2 bg-white border-2 border-duo-swan p-4 rounded-2xl border-b-4 hover:bg-duo-swan/20 transition-all">
              <Shield size={20} className="text-duo-orange" />
              <span className="font-black text-xs text-duo-orange uppercase tracking-widest">Classement mondial</span>
           </button>
        </section>

        {/* Leagues List */}
        <section className="space-y-4">
           <h2 className="text-sm font-black text-duo-wolf uppercase tracking-widest px-2">Ton Parcours Compétitif</h2>
           
           {MOCK_LEAGUES.map((league) => (
             <motion.div
               key={league.id}
               whileTap={{ scale: 0.98 }}
               onClick={() => onSelectLeague(league.id)}
               className={cn(
                 "bg-white border-2 rounded-[2rem] p-6 border-b-4 transition-all cursor-pointer relative group",
                 league.id === 'bronze' ? "border-voyage-accent/50 shadow-md" : "border-duo-swan opacity-60"
               )}
             >
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                     <div className={cn(
                       "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border-b-4",
                       league.tier === 'bronze' ? "bg-amber-100 border-amber-200 text-amber-600" :
                       league.tier === 'silver' ? "bg-slate-100 border-slate-200 text-slate-400" :
                       "bg-duo-swan/10 border-duo-swan text-duo-wolf/30"
                     )}>
                        <Trophy size={32} />
                     </div>
                     <div>
                        <h3 className="font-black text-duo-eel text-lg leading-tight">{league.name}</h3>
                        <p className="text-xs font-bold text-duo-wolf/60 uppercase tracking-widest mt-1">
                           {league.timeLeft}
                        </p>
                     </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                     {league.myRank > 0 ? (
                       <>
                         <div className="flex items-center gap-1 bg-voyage-primary/10 text-voyage-primary px-2 py-0.5 rounded-full mb-1">
                            <TrendingUp size={12} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">En hausse</span>
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
                       Voir le groupe <ChevronRight size={14} />
                    </div>
                 </div>
               )}
             </motion.div>
           ))}
        </section>

        {/* Daily Quest Card */}
        <section className="bg-duo-orange/5 border-2 border-duo-orange/20 rounded-[2rem] p-6 flex items-center justify-between group overflow-hidden relative">
           <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                 <Zap className="text-duo-orange" size={20} fill="currentColor" />
                 <span className="text-[10px] font-black text-duo-orange uppercase tracking-widest">Boost d'XP Actif</span>
              </div>
              <h3 className="text-xl font-black text-duo-eel tracking-tight">Vitesse de Croisière</h3>
              <p className="text-duo-wolf font-bold text-xs max-w-[200px]">Gagne encore 200 XP pour doubler tes récompenses !</p>
           </div>
           <Zap className="absolute -bottom-6 -right-6 text-duo-orange/10" size={150} />
        </section>

      </main>
    </div>
  );
}
