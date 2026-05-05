import { motion } from 'motion/react';
import { Settings, MessageCircle, GitBranch, Users, Brain, ChevronRight, TrendingUp, Trophy, Star, Shield, Flame, Loader2, Sparkles } from 'lucide-react';
import { useSupabaseProfile, useSupabaseBadges, useAuth } from '../hooks/useSupabase';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { optimizeSupabaseUrl } from '../lib/city-theme';
import { DEFAULT_AVATAR_URL } from '../types';

interface ProfileScreenProps {
  onBack: () => void;
  onSettings: () => void;
  onShowBadges: () => void;
}

export default function ProfileScreen({ onBack, onSettings, onShowBadges }: ProfileScreenProps) {
  const { session } = useAuth();
  const { profile, loading } = useSupabaseProfile(session?.user?.id);
  const { badges, earnedBadges, loading: badgesLoading } = useSupabaseBadges(session?.user?.id);
  
  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-voyage-sand">
      <Loader2 className="animate-spin text-voyage-primary" size={40} />
    </div>
  );

  const stats = { 
    xp: profile?.xp || 0, 
    stars: profile?.stars || 0, 
    level: profile?.level || 1 
  };
  
  const skills = [
    { name: 'Communication', label: 'التواصل', level: 2, xp: 75, icon: MessageCircle, color: 'text-voyage-accent', bg: 'bg-voyage-accent/10', border: 'border-voyage-accent/20' },
    { name: 'Décision', label: 'القرار', level: 1, xp: 40, icon: GitBranch, color: 'text-duo-orange', bg: 'bg-duo-orange/10', border: 'border-duo-orange/20' },
    { name: 'Travail d\'équipe', label: 'العمل الجماعي', level: 3, xp: 85, icon: Users, color: 'text-voyage-primary', bg: 'bg-voyage-primary/10', border: 'border-voyage-primary/20' },
    { name: 'Gestion Stress', label: 'إدارة الضغط', level: 1, xp: 20, icon: Brain, color: 'text-duo-red', bg: 'bg-duo-red/10', border: 'border-duo-red/20' },
  ];

  return (
    <div className="h-full w-full bg-voyage-sand/30 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 adventure-pattern pointer-events-none" />
      <TopAppBar stats={stats} title="Ton Profil" onBack={onBack} />
      
      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">

        
        {/* User Profile Card */}
        <section className="relative flex flex-col items-center text-center pt-8 pb-4">
           <div className="relative group">
              <div className="w-36 h-36 rounded-[40px] bg-white flex items-center justify-center border-4 border-white shadow-[0_20px_40px_rgba(123,63,26,0.15)] relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                <img 
                   src={optimizeSupabaseUrl(profile?.avatar_url || DEFAULT_AVATAR_URL, 256, 80)} 
                   alt="Profile" 
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSettings}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-voyage-primary text-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer z-20 border-2 border-white"
              >
                <Settings size={22} />
              </motion.button>
           </div>
           
           <div className="mt-8 space-y-2">
              <h1 className="text-4xl font-headline font-black text-[#4E2510] tracking-tight drop-shadow-sm">{profile?.display_name || 'Explorateur'}</h1>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-voyage-accent/10 rounded-full border border-voyage-accent/20">
                 <Sparkles size={12} className="text-voyage-accent" />
                 <span className="font-black text-voyage-accent uppercase tracking-[0.2em] text-[10px]">L'Explorateur des Savoirs</span>
              </div>
           </div>
        </section>

        {/* Big Stats Row */}
        <section className="grid grid-cols-3 gap-4">
           {[
             { icon: Flame, value: '12', label: 'JOURS', color: 'text-orange-500', bg: 'bg-orange-50' },
             { icon: TrendingUp, value: profile?.xp || 0, label: 'XP TOTAL', color: 'text-voyage-accent', bg: 'bg-amber-50' },
             { icon: Trophy, value: `#${profile?.level || 1}`, label: 'LIGUE', color: 'text-yellow-600', bg: 'bg-yellow-50' }
           ].map((stat, i) => (
             <div key={i} className={cn("p-5 rounded-[28px] border-2 bg-white flex flex-col items-center gap-2 shadow-sm transition-all hover:shadow-md", stat.bg, "border-white")}>
                <stat.icon size={26} className={stat.color} />
                <span className="font-black text-xl text-[#4E2510]">{stat.value}</span>
                <span className="text-[9px] font-black text-[#4E2510]/40 uppercase tracking-widest">{stat.label}</span>
             </div>
           ))}
        </section>


        {/* Progress Card */}
        <section className="bg-voyage-accent/5 border-2 border-voyage-accent/20 rounded-3xl p-6 relative overflow-hidden group">
           <div className="relative z-10 flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-voyage-accent uppercase tracking-widest">PROCHAINE ÉTAPE</span>
                  <h3 className="text-xl font-black text-duo-eel">Niveau {(profile?.level || 1) + 1}</h3>
                </div>
                <span className="font-black text-voyage-accent">{(profile?.level || 1) * 500 - (profile?.xp || 0)} XP à gagner</span>
              </div>
              <div className="h-4 w-full bg-duo-swan/50 rounded-full overflow-hidden p-0.5 border-2 border-duo-swan/30 shadow-inner">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min(100, ((profile?.xp || 0) % 500) / 5)}%` }}
                   className="h-full bg-voyage-accent rounded-full shadow-lg"
                />
              </div>
           </div>
           <TrendingUp className="absolute -bottom-4 -right-4 text-voyage-accent/10" size={120} />
        </section>

        {/* Skills Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-duo-eel">Compétences</h2>
            <button className="text-voyage-accent font-black text-xs uppercase tracking-widest flex items-center gap-1">Détails <ChevronRight size={14}/></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.name} className={cn("p-5 rounded-3xl border-2 border-b-4 flex flex-col items-center text-center gap-3 transition-all hover:translate-y-[-2px] hover:border-b-6 active:translate-y-0 active:border-b-2", skill.bg, skill.border)}>
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm relative border-2 border-transparent group-hover:border-white">
                    <skill.icon className={skill.color} size={28} />
                 </div>
                 <div>
                    <p className="font-black text-duo-eel text-sm">{skill.name}</p>
                    <p className="text-[10px] font-bold text-duo-wolf arabic-font leading-none mt-1">{skill.label}</p>
                 </div>
                 <div className="bg-white/50 px-3 py-1 rounded-full text-[9px] font-black text-duo-wolf border border-white/80 uppercase">
                    Niv. {skill.level}
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
         <section className="space-y-4">
            <div className="flex justify-between items-center px-2">
               <h2 className="text-xl font-black text-duo-eel">Succès</h2>
               <button 
                  onClick={onShowBadges}
                  className="text-voyage-accent font-black text-xs uppercase tracking-widest flex items-center gap-1"
               >
                  Voir tout <ChevronRight size={14}/>
               </button>
            </div>
            <div className="bg-white border-2 border-duo-swan rounded-3xl p-6 border-b-4">
               <div className="flex flex-col gap-6">
                  {badges.slice(0, 3).map((badge, i) => {
                    const isEarned = earnedBadges.includes(badge.badge_id);
                    return (
                      <div key={i} className={cn("flex items-center gap-4 group transition-opacity", !isEarned && "opacity-40")}>
                         <div className={cn("w-16 h-16 rounded-full flex items-center justify-center border-b-4 shadow-sm group-hover:scale-110 transition-transform bg-duo-swan/20 border-duo-swan overflow-hidden relative")}>
                            {badge.image_url && badge.image_url.startsWith('http') ? (
                               <img 
                                 src={optimizeSupabaseUrl(badge.image_url, 128, 80)} 
                                 alt={badge.name_fr} 
                                 className="w-full h-full object-cover" 
                               />
                            ) : (
                               <span className="text-2xl">{badge.image_url || '🏆'}</span>
                            )}
                         </div>
                         <div className="flex-grow">
                            <h4 className="font-black text-duo-eel">{badge.name_fr}</h4>
                            <p className="text-[10px] font-bold text-duo-wolf uppercase tracking-widest">{isEarned ? 'Débloqué' : 'Verrouillé'}</p>
                         </div>
                         {isEarned && <Star className="text-voyage-accent fill-voyage-accent" size={16} />}
                      </div>
                    );
                  })}
                  {badges.length === 0 && !badgesLoading && (
                    <p className="text-center text-duo-wolf font-bold py-4">Commence ton aventure pour gagner des badges !</p>
                  )}
                  {badgesLoading && (
                    <div className="flex justify-center py-4">
                       <Loader2 className="animate-spin text-voyage-primary" size={24} />
                    </div>
                  )}
               </div>
            </div>
         </section>

      </main>
    </div>
  );
}
