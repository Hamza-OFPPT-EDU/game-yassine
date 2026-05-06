import { motion } from 'motion/react';
import { Trophy, Star, Award, User, Loader2, PartyPopper } from 'lucide-react';
import { useSupabaseMissionLeaderboard } from '../hooks/useSupabase';
import { cn } from '../lib/utils';

interface MissionLeaderboardProps {
  missionId: string;
  currentUserId?: string;
}

export default function MissionLeaderboard({ missionId, currentUserId }: MissionLeaderboardProps) {
  const { leaderboard, loading } = useSupabaseMissionLeaderboard(missionId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-[#D4A43E]" size={48} />
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#7B3F1A]/50">Calcul des scores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#D4A43E]/10 px-4 py-1 rounded-full border border-[#D4A43E]/20 mb-2">
           <Trophy size={14} className="text-[#D4A43E]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-[#7B3F1A]">Classement Mondial</span>
        </div>
        <h2 className="text-3xl font-black text-[#24160D]">Tableau des Champions</h2>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden">
        <div className="divide-y divide-[#E5D5B8]/30">
          {leaderboard.map((player, index) => {
            const isMe = player.id === currentUserId;
            const isTop3 = index < 3;
            
            return (
              <motion.div
                key={player.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-4 px-6 py-5 transition-all",
                  isMe ? "bg-[#D4A43E]/10 border-l-4 border-l-[#D4A43E]" : "hover:bg-white/40"
                )}
              >
                <div className="w-10 text-center font-black text-lg text-[#7B3F1A]/40">
                  {isTop3 ? (
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mx-auto",
                      index === 0 ? "bg-amber-400 text-white shadow-lg shadow-amber-200" :
                      index === 1 ? "bg-slate-300 text-white shadow-lg shadow-slate-200" :
                      "bg-amber-600 text-white shadow-lg shadow-amber-700/20"
                    )}>
                      <Trophy size={18} />
                    </div>
                  ) : (
                    `#${index + 1}`
                  )}
                </div>

                <div className="relative">
                  <img 
                    src={player.avatar} 
                    alt={player.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  {isMe && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-voyage-primary rounded-full border-2 border-white flex items-center justify-center">
                       <User size={10} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-[#4E2510] text-lg">{player.name}</h4>
                    {isMe && (
                      <span className="text-[9px] font-black bg-voyage-primary text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Toi</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#7B3F1A]/50 uppercase tracking-widest">Niveau {player.level}</span>
                    <div className="h-1 w-1 rounded-full bg-[#E5D5B8]" />
                    <span className="text-[10px] font-bold text-[#D4A43E] uppercase tracking-widest">Explorateur</span>
                  </div>
                </div>

                <div className="text-right">
                   <div className="flex items-center gap-1.5 justify-end">
                      <Star size={16} className="text-[#D4A43E] fill-[#D4A43E]" />
                      <span className="font-black text-2xl text-[#24160D]">{player.score.toLocaleString()}</span>
                   </div>
                   <p className="text-[10px] font-black text-[#7B3F1A]/40 uppercase tracking-widest">Points XP</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Celebration Message */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/50 p-8 rounded-[2.5rem] text-center space-y-4 shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <PartyPopper size={48} className="text-[#D4A43E] mx-auto mb-4" />
          <h3 className="text-2xl font-black text-[#7B3F1A] italic">"Chaque étape est une victoire sur soi-même !"</h3>
          <p className="text-[#7B3F1A]/60 text-sm font-bold uppercase tracking-widest">Continue ton voyage, l'aventure ne fait que commencer.</p>
        </div>
        
        {/* Decorative background for the quote */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Trophy size={120} className="text-[#D4A43E] rotate-12" />
        </div>
      </motion.div>
    </div>
  );
}
