import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, MessageCircle, GitBranch, Users, Brain, ChevronRight, TrendingUp, Trophy, Star, Shield, Flame, Loader2, Volume2, Music, Bell, CheckCircle2 } from 'lucide-react';
import { useSupabaseProfile } from '../hooks/useSupabase';
import { useAudio } from '../hooks/useAudio';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { optimizeSupabaseUrl } from '../lib/city-theme';
import { DEFAULT_AVATAR_URL } from '../types';

interface ProfileScreenProps {
  onBack: () => void;
  onSettings: () => void;
}

export default function ProfileScreen({ onBack, onSettings }: ProfileScreenProps) {
  const { profile, loading } = useSupabaseProfile();
  const { settings: audio, updateSettings: updateAudio, playSound, saveToCloud } = useAudio();
  const [isSavingAudio, setIsSavingAudio] = useState(false);
  
  const handleToggleAudio = async (patch: any) => {
    updateAudio(patch);
    playSound('click');
    setIsSavingAudio(true);
    // Debounce or immediate save? Let's do immediate for now as per request
    setTimeout(async () => {
      await saveToCloud();
      setIsSavingAudio(false);
    }, 500);
  };

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
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#7B3F1A]/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4A43E]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <TopAppBar stats={stats} title="Ton Profil" onBack={onBack} />
      
      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">
        
        {/* User Profile Card */}
        <section className="relative flex flex-col items-center text-center pt-8 pb-4">
           <div className="relative group">
              {/* Profile Glow */}
              <div className="absolute inset-0 bg-[#D4A43E]/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-36 h-36 rounded-[40px] bg-white p-2 shadow-[0_20px_50px_rgba(123,63,26,0.15)] border-2 border-white overflow-hidden"
              >
                <img 
                   src={optimizeSupabaseUrl(profile?.avatar_url || DEFAULT_AVATAR_URL, 300, 80)} 
                   alt="Profile" 
                   className="w-full h-full object-cover rounded-[32px]"
                   referrerPolicy="no-referrer"
                 />
              </motion.div>
              
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSettings}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border-2 border-[#E5D5B8] rounded-2xl flex items-center justify-center shadow-xl cursor-pointer z-20 hover:border-[#D4A43E] transition-colors"
              >
                <Settings size={24} className="text-[#7B3F1A]" />
              </motion.button>
           </div>
           
           <div className="mt-8 space-y-2">
              <h1 className="text-4xl font-black text-[#4E2510] tracking-tight">
                {profile?.full_name?.split(' ')[0] || 'Explorateur'}
              </h1>
              <div className="inline-flex items-center gap-2 bg-[#D4A43E]/10 px-4 py-1.5 rounded-full border border-[#D4A43E]/20">
                <Shield size={14} className="text-[#D4A43E]" />
                <span className="font-black text-[#7B3F1A] uppercase tracking-[0.2em] text-[10px]">L'Explorateur des Savoirs</span>
              </div>
           </div>
        </section>

        {/* Big Stats Row */}
        <section className="grid grid-cols-3 gap-4">
           {[
             { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'JOURS', val: '12' },
             { icon: TrendingUp, color: 'text-[#D4A43E]', bg: 'bg-[#D4A43E]/5', label: 'XP TOTAL', val: (stats.xp/1000).toFixed(1) + 'k' },
             { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', label: 'LIGUE', val: '#4' },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 * i }}
               className={cn("bg-white border border-[#E5D5B8] p-5 rounded-3xl flex flex-col items-center gap-2 shadow-sm relative overflow-hidden group")}
             >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-1", stat.bg)}>
                  <stat.icon size={22} className={stat.color} />
                </div>
                <span className="font-black text-xl text-[#4E2510]">{stat.val}</span>
                <span className="text-[9px] font-black text-[#7B3F1A]/50 uppercase tracking-widest">{stat.label}</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-[#D4A43E]/20 transition-colors" />
             </motion.div>
           ))}
        </section>

        {/* Progress Card (XP Bar) */}
        <section className="relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-[#7B3F1A] to-[#4E2510] rounded-[40px] shadow-2xl" />
           <div className="relative z-10 p-8 space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#D4A43E] uppercase tracking-[0.3em]">PROCHAINE ÉTAPE</span>
                  <h3 className="text-2xl font-black text-white">Niveau {stats.level + 1}</h3>
                </div>
                <div className="text-right">
                  <span className="block font-black text-white text-xl">{(stats.level + 1) * 1000 - stats.xp} XP</span>
                  <span className="text-[10px] font-bold text-[#D4A43E]/70 uppercase tracking-widest text-right">Restant</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-5 w-full bg-black/30 rounded-full overflow-hidden p-1 border border-white/10 relative">
                  {/* Shimmer effect inside the bar */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.xp % 1000) / 10}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#D4A43E] to-[#F59E0B] rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(212,164,62,0.4)]"
                  >
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    />
                  </motion.div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-white/40 tracking-widest uppercase">
                  <span>0 XP</span>
                  <span>1000 XP</span>
                </div>
              </div>
           </div>
           
           <Trophy className="absolute -bottom-6 -right-6 text-white/5 rotate-12" size={160} />
        </section>

        {/* Skills Section */}
        <section className="space-y-5">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-[#4E2510]">Compétences <span className="text-[10px] font-black text-[#D4A43E] bg-[#D4A43E]/10 px-2 py-0.5 rounded ml-2">SOFT SKILLS</span></h2>
            <button className="text-[#7B3F1A] font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">Tout voir <ChevronRight size={14}/></button>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {skills.map((skill, idx) => (
              <motion.div 
                key={skill.name} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (idx * 0.05) }}
                className={cn("p-6 rounded-[32px] border border-[#E5D5B8] flex flex-col items-center text-center gap-4 transition-all hover:shadow-xl hover:-translate-y-1 bg-white")}
              >
                 <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner relative border-2 border-transparent", skill.bg)}>
                    <skill.icon className={skill.color} size={32} />
                 </div>
                 <div>
                    <p className="font-black text-[#4E2510] text-sm leading-tight mb-1">{skill.name}</p>
                    <p className="text-[10px] font-bold text-[#7B3F1A]/40 arabic-font leading-none">{skill.label}</p>
                 </div>
                 <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.xp}%` }}
                      className={cn("h-full rounded-full", skill.color.replace('text-', 'bg-'))}
                    />
                 </div>
                 <span className="text-[10px] font-black text-[#7B3F1A]/60 uppercase tracking-widest">Niveau {skill.level}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Audio Settings Section */}
        <section className="space-y-5">
           <div className="flex justify-between items-center px-2">
             <h2 className="text-2xl font-black text-[#4E2510]">Réglages Audio</h2>
             {isSavingAudio && (
               <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-voyage-primary"
               >
                 <Loader2 size={14} className="animate-spin" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Synchronisation...</span>
               </motion.div>
             )}
             {!isSavingAudio && (
               <div className="flex items-center gap-2 text-duo-green opacity-60">
                 <CheckCircle2 size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Enregistré</span>
               </div>
             )}
           </div>

           <div className="bg-white border border-[#E5D5B8] rounded-[40px] p-6 shadow-sm grid grid-cols-2 gap-4">
              {/* Sound Effects Toggle */}
              <button 
                onClick={() => handleToggleAudio({ soundEffectsEnabled: !audio.soundEffectsEnabled })}
                className={cn(
                  "p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden",
                  audio.soundEffectsEnabled ? "bg-voyage-primary/5 border-voyage-primary" : "bg-gray-50 border-transparent opacity-60"
                )}
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", audio.soundEffectsEnabled ? "bg-voyage-primary text-white" : "bg-gray-200 text-gray-400")}>
                  <Bell size={24} />
                </div>
                <div className="text-center">
                  <p className="font-black text-[#4E2510] text-sm uppercase tracking-tight">Effets</p>
                  <p className="text-[9px] font-bold text-[#7B3F1A]/40 uppercase tracking-widest">Sonores</p>
                </div>
                {audio.soundEffectsEnabled && (
                  <motion.div layoutId="audio-active-1" className="absolute top-2 right-2 w-2 h-2 bg-voyage-primary rounded-full" />
                )}
              </button>

              {/* Music Toggle */}
              <button 
                onClick={() => handleToggleAudio({ musicEnabled: !audio.musicEnabled })}
                className={cn(
                  "p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden",
                  audio.musicEnabled ? "bg-voyage-accent/5 border-voyage-accent" : "bg-gray-50 border-transparent opacity-60"
                )}
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", audio.musicEnabled ? "bg-voyage-accent text-white" : "bg-gray-200 text-gray-400")}>
                  <Music size={24} />
                </div>
                <div className="text-center">
                  <p className="font-black text-[#4E2510] text-sm uppercase tracking-tight">Musique</p>
                  <p className="text-[9px] font-bold text-[#7B3F1A]/40 uppercase tracking-widest">De fond</p>
                </div>
                {audio.musicEnabled && (
                  <motion.div layoutId="audio-active-2" className="absolute top-2 right-2 w-2 h-2 bg-voyage-accent rounded-full" />
                )}
              </button>
           </div>
        </section>

        {/* Achievements Section */}
        <section className="space-y-5">
           <h2 className="text-2xl font-black text-[#4E2510] px-2">Médailles & Succès</h2>
           <div className="bg-white border border-[#E5D5B8] rounded-[40px] p-8 shadow-sm">
              <div className="flex flex-col gap-8">
                 {badges.map((badge, i) => (
                   <div key={i} className="flex items-center gap-5 group">
                      <div className={cn("w-20 h-20 rounded-[28px] flex items-center justify-center border-2 border-[#E5D5B8]/50 shadow-sm transition-all duration-300 group-hover:rotate-6", badge.count > 0 ? "bg-[#D4A43E]/5 border-[#D4A43E]/20" : "bg-gray-50 grayscale opacity-40")}>
                         <badge.icon className={badge.count > 0 ? badge.color : "text-gray-400"} size={36} />
                      </div>
                      <div className="flex-grow space-y-3">
                         <div className="flex justify-between items-end">
                            <h4 className="font-black text-[#4E2510] text-lg">{badge.name}</h4>
                            <span className="font-black text-[#D4A43E] text-xs bg-[#D4A43E]/10 px-2 py-0.5 rounded-md">{badge.count}/20</span>
                         </div>
                         <div className="h-3 w-full bg-[#F0F0F0] rounded-full overflow-hidden border border-gray-100">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(badge.count/20)*100}%` }}
                              className="h-full bg-gradient-to-r from-[#D4A43E] to-[#F59E0B] rounded-full" 
                            />
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}
