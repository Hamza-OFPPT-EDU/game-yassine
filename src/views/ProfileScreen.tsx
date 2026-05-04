import { motion } from 'motion/react';
import { Settings, MessageCircle, GitBranch, Users, Brain, ChevronRight, TrendingUp, Trophy, Star, Shield, Flame, Loader2 } from 'lucide-react';
import { useSupabaseProfile } from '../hooks/useSupabase';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { DEFAULT_AVATAR_URL } from '../types';

interface ProfileScreenProps {
  onBack: () => void;
  onSettings: () => void;
}

export default function ProfileScreen({ onBack, onSettings }: ProfileScreenProps) {
  const { profile, loading } = useSupabaseProfile();
  
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

  const badges = [
    { name: 'Sage de Rabat', icon: Trophy, color: 'text-duo-yellow', count: 12 },
    { name: 'Explorateur Noir', icon: Shield, color: 'text-duo-eel', count: 5 },
    { name: 'Expert Dialogue', icon: MessageCircle, color: 'text-voyage-accent', count: 8 },
  ];

  return (
    <div className="h-full w-full bg-white flex flex-col relative overflow-hidden">
      <TopAppBar stats={stats} title="Ton Profil" onBack={onBack} />
      
      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">
        
        {/* User Profile Card */}
        <section className="relative flex flex-col items-center text-center pt-8 pb-4">
           <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-duo-swan/20 flex items-center justify-center border-4 border-duo-swan relative overflow-hidden group-hover:border-voyage-accent transition-colors">
                <img 
                   src={profile?.avatar_url || DEFAULT_AVATAR_URL} 
                   alt="Profile" 
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                 />
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSettings}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border-b-4 border-duo-swan rounded-2xl flex items-center justify-center shadow-lg cursor-pointer z-20"
              >
                <Settings size={20} className="text-duo-wolf" />
              </motion.button>
           </div>
           
           <div className="mt-6 space-y-1">
              <h1 className="text-3xl font-black text-duo-eel tracking-tight">Yassine</h1>
              <p className="font-bold text-duo-wolf uppercase tracking-widest text-xs">L'Explorateur des Savoirs</p>
           </div>
        </section>

        {/* Big Stats Row */}
        <section className="grid grid-cols-3 gap-4">
           <div className="bg-white border-2 border-duo-swan p-4 rounded-2xl flex flex-col items-center gap-1 border-b-4 hover:border-voyage-accent/30 transition-colors">
              <Flame size={24} className="text-duo-orange" />
              <span className="font-black text-lg text-duo-eel">12</span>
              <span className="text-[10px] font-black text-duo-wolf uppercase tracking-tighter">JOURS</span>
           </div>
           <div className="bg-white border-2 border-duo-swan p-4 rounded-2xl flex flex-col items-center gap-1 border-b-4 hover:border-voyage-accent/30 transition-colors">
              <TrendingUp size={24} className="text-voyage-accent" />
              <span className="font-black text-lg text-duo-eel">1,4k</span>
              <span className="text-[10px] font-black text-duo-wolf uppercase tracking-tighter">XP TOTAL</span>
           </div>
           <div className="bg-white border-2 border-duo-swan p-4 rounded-2xl flex flex-col items-center gap-1 border-b-4 hover:border-voyage-accent/30 transition-colors">
              <Trophy size={24} className="text-duo-yellow" />
              <span className="font-black text-lg text-duo-eel">#4</span>
              <span className="text-[10px] font-black text-duo-wolf uppercase tracking-tighter">LIGUE</span>
           </div>
        </section>

        {/* Progress Card */}
        <section className="bg-voyage-accent/5 border-2 border-voyage-accent/20 rounded-3xl p-6 relative overflow-hidden group">
           <div className="relative z-10 flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-voyage-accent uppercase tracking-widest">PROCHAINE ÉTAPE</span>
                  <h3 className="text-xl font-black text-duo-eel">Niveau 5</h3>
                </div>
                <span className="font-black text-voyage-accent">550 XP à gagner</span>
              </div>
              <div className="h-4 w-full bg-duo-swan/50 rounded-full overflow-hidden p-0.5 border-2 border-duo-swan/30 shadow-inner">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '72.5%' }}
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
           <h2 className="text-xl font-black text-duo-eel px-2">Succès</h2>
           <div className="bg-white border-2 border-duo-swan rounded-3xl p-6 border-b-4">
              <div className="flex flex-col gap-6">
                 {badges.map((badge, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border-b-4 shadow-sm group-hover:scale-110 transition-transform", badge.count > 0 ? "bg-duo-swan/20 border-duo-swan" : "bg-duo-swan/10 opacity-30")}>
                         <badge.icon className={badge.color} size={32} />
                      </div>
                      <div className="flex-grow">
                         <h4 className="font-black text-duo-eel">{badge.name}</h4>
                         <div className="h-2 w-full bg-duo-swan/50 rounded-full mt-2">
                            <div className="h-full bg-duo-yellow rounded-full" style={{ width: `${(badge.count/20)*100}%` }} />
                         </div>
                      </div>
                      <span className="font-black text-duo-wolf text-xs">{badge.count}/20</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}
