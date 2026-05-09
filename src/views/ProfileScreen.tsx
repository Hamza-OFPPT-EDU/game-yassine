import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, MessageCircle, GitBranch, Users, Brain, ChevronRight, TrendingUp, Trophy, Star, Shield, Flame, Loader2, Volume2, Music, Bell, CheckCircle2, Award, Zap, Globe, Lock, MapPin, LogOut } from 'lucide-react';
import { useAuth, useSupabaseProfile } from '../hooks/useSupabase';
import { useAudio } from '../hooks/useAudio';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { optimizeSupabaseUrl } from '../lib/city-theme';
import { DEFAULT_AVATAR_URL } from '../types';
import { BADGE_MAP, getBadgeUrl } from '../lib/badges';

interface BadgeDetailProps {
  badge: any;
  isEarned: boolean;
  onClose: () => void;
}

function BadgeDetail({ badge, isEarned, onClose }: BadgeDetailProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className={cn(
          "h-48 flex items-center justify-center relative",
          isEarned ? "bg-gradient-to-br from-[#FFF8F0] to-[#FEF3C7]" : "bg-gray-100 grayscale"
        )}>
          {isEarned && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#D4A43E_0%,transparent_70%)]"
            />
          )}
          <img 
            src={getBadgeUrl(badge.url) || '/assets/badge_placeholder.png'} 
            className="w-32 h-32 object-contain relative z-10"
            alt={badge.badge_name}
          />
          {!isEarned && <Lock className="text-gray-400 opacity-30 absolute" size={64} />}
        </div>
        
        <div className="p-8 text-center space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#4E2510]">{badge.badge_name}</h3>
            <p className="text-[10px] font-black text-[#D4A43E] uppercase tracking-[0.2em]">{badge.rarity}</p>
          </div>
          
          <p className="text-sm text-[#7B3F1A]/70 leading-relaxed font-medium">
            {badge.description_fr}
          </p>
          
          <div className="pt-4">
             <button 
               onClick={onClose}
               className="w-full py-4 bg-[#7B3F1A] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4E2510] transition-colors"
             >
               Fermer
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ProfileScreenProps {
  onBack: () => void;
  onSettings: () => void;
  onShowBadges: () => void;
  completedMissions: string[];
}

export default function ProfileScreen({ onBack, onSettings, onShowBadges, completedMissions }: ProfileScreenProps) {
  const { session, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useSupabaseProfile(session?.user?.id);
  const { playSound } = useAudio();
  const { settings: audio, updateSettings: updateAudio, saveToCloud } = useAudio();
  const [isSavingAudio, setIsSavingAudio] = useState(false);
  const [activeCity, setActiveCity] = useState<string>('Tous');
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  
  const handleToggleAudio = async (patch: any) => {
    updateAudio(patch);
    playSound('click');
    setIsSavingAudio(true);
    setTimeout(async () => {
      await saveToCloud();
      setIsSavingAudio(false);
    }, 500);
  };

  const cities = ['Tous', 'Rabat', 'Chefchaouen', 'Fès', 'Marrakech', 'Dakhla'];

  const allGameBadges = useMemo(() => {
    return Object.entries(BADGE_MAP).map(([id, data]) => ({
      id,
      ...data,
      isEarned: completedMissions.includes(id)
    }));
  }, [completedMissions]);

  const filteredBadges = useMemo(() => {
    if (activeCity === 'Tous') return allGameBadges;
    return allGameBadges.filter(b => b.city === activeCity);
  }, [allGameBadges, activeCity]);

  if (authLoading || profileLoading) return (
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
    { name: 'Communication', label: 'التواصل', level: Math.floor(stats.xp / 2000) + 1, xp: (stats.xp % 2000) / 20, icon: MessageCircle, color: 'text-voyage-accent', bg: 'bg-voyage-accent/10', border: 'border-voyage-accent/20' },
    { name: 'Décision', label: 'القرار', level: Math.floor(stats.xp / 2500) + 1, xp: (stats.xp % 2500) / 25, icon: GitBranch, color: 'text-duo-orange', bg: 'bg-duo-orange/10', border: 'border-duo-orange/20' },
    { name: 'Travail d\'équipe', label: 'العمل الجماعي', level: Math.floor(stats.xp / 1500) + 1, xp: (stats.xp % 1500) / 15, icon: Users, color: 'text-voyage-primary', bg: 'bg-voyage-primary/10', border: 'border-voyage-primary/20' },
    { name: 'Gestion Stress', label: 'إدارة الضغط', level: Math.floor(stats.xp / 3000) + 1, xp: (stats.xp % 3000) / 30, icon: Brain, color: 'text-duo-red', bg: 'bg-duo-red/10', border: 'border-duo-red/20' },
  ];

  return (
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#7B3F1A]/10 to-transparent pointer-events-none" />
      
      <TopAppBar stats={stats} title="Ton Profil" onBack={onBack} />
      
      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">

        
        {/* User Profile Card */}
        <section className="relative flex flex-col items-center text-center pt-8 pb-4">
           <div className="relative group">
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
                 {/* Settings button hidden as requested */}
               {/* 
               <motion.button 
                 whileHover={{ scale: 1.1, rotate: 15 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={onSettings}
                 className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border-2 border-[#E5D5B8] rounded-2xl flex items-center justify-center shadow-xl cursor-pointer z-20 hover:border-[#D4A43E] transition-colors"
               >
                 <Settings size={24} className="text-[#7B3F1A]" />
               </motion.button>
               */}
              </motion.div>
           </div>
           
           <div className="mt-8 space-y-3 text-center">
              <h1 className="text-4xl font-black text-[#4E2510] tracking-tight">
                {profile?.full_name || 'Explorateur'}
              </h1>
              
              <div className="flex flex-col items-center gap-2">
                <p className="text-[#7B3F1A]/60 font-bold text-sm tracking-wide">
                  {profile?.username ? `@${profile.username}` : (session?.user?.email || 'Explorateur des Savoirs')}
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-[#D4A43E]/10 px-4 py-1.5 rounded-full border border-[#D4A43E]/20">
                    <Shield size={14} className="text-[#D4A43E]" />
                    <span className="font-black text-[#7B3F1A] uppercase tracking-[0.2em] text-[10px]">Niveau {profile?.level || 1}</span>
                  </div>
                  
                  <div className="inline-flex items-center gap-2 bg-[#7B3F1A]/5 px-4 py-1.5 rounded-full border border-[#7B3F1A]/10">
                    <span className="font-black text-[#7B3F1A] uppercase tracking-widest text-[10px]">
                      {profile?.group_name || 'GROUPE NON DÉFINI'}
                    </span>
                  </div>
                </div>

                {profile?.birth_date && (
                  <p className="text-[10px] font-black text-[#7B3F1A]/40 uppercase tracking-[0.3em] mt-1">
                    Né le {new Date(profile.birth_date).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
           </div>
        </section>

        {/* Big Stats Row */}
        <section className="grid grid-cols-3 gap-4">
           {[
             { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'JOURS', val: '12' },
             { icon: TrendingUp, color: 'text-[#D4A43E]', bg: 'bg-[#D4A43E]/5', label: 'XP TOTAL', val: (stats.xp/1000).toFixed(1) + 'k' },
             { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', label: 'BADGES', val: allGameBadges.filter(b => b.isEarned).length },
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
             </motion.div>
           ))}
        </section>


        {/* Progress Card */}
        <section className="relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-[#7B3F1A] to-[#4E2510] rounded-[40px] shadow-2xl" />
           <div className="relative z-10 p-8 space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#D4A43E] uppercase tracking-[0.3em]">PROCHAINE ÉTAPE</span>
                  <h3 className="text-2xl font-black text-white">Niveau {stats.level + 1}</h3>
                </div>
                <div className="text-right">
                  <span className="block font-black text-white text-xl">{Math.max(0, (stats.level + 1) * 1000 - stats.xp)} XP</span>
                  <span className="text-[10px] font-bold text-[#D4A43E]/70 uppercase tracking-widest text-right">Restant</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-5 w-full bg-black/30 rounded-full overflow-hidden p-1 border border-white/10 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (stats.xp % 1000) / 10)}%` }}
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
              </div>
           </div>
           <Trophy className="absolute -bottom-6 -right-6 text-white/5 rotate-12" size={160} />
        </section>

        {/* Badges Section - Dynamic with Toggle */}
        <section className="space-y-6">
           <div className="flex justify-between items-center px-2">
             <div className="flex flex-col">
               <h2 className="text-2xl font-black text-[#4E2510]">Badges des Missions</h2>
               <p className="text-[10px] font-black text-[#D4A43E] uppercase tracking-widest text-left mt-1">
                  Collectionne les trésors du Maroc
               </p>
             </div>
             <span className="text-[10px] font-black text-[#D4A43E] bg-[#D4A43E]/10 px-3 py-1 rounded-full border border-[#D4A43E]/20">
               {allGameBadges.filter(b => b.isEarned).length} / {allGameBadges.length} OBTENUS
             </span>
           </div>

           {/* Toggle Menu - Cities */}
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
             {cities.map((city) => (
               <button
                 key={city}
                 onClick={() => { playSound('click'); setActiveCity(city); }}
                 className={cn(
                   "flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 border-2",
                   activeCity === city 
                     ? "bg-[#7B3F1A] text-white border-[#7B3F1A] shadow-lg shadow-[#7B3F1A]/20" 
                     : "bg-white text-[#7B3F1A] border-[#E5D5B8] hover:border-[#D4A43E]"
                 )}
               >
                 <MapPin size={14} />
                 {city}
               </button>
             ))}
           </div>

           <div className="bg-white border border-[#E5D5B8] rounded-[40px] p-8 shadow-sm">
              <AnimatePresence mode="wait">
                {filteredBadges.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                      <Lock size={32} />
                    </div>
                    <p className="text-sm font-bold text-[#7B3F1A]/40 uppercase tracking-tight">Aucun badge dans cette ville</p>
                  </div>
                ) : (
                  <motion.div 
                    key={activeCity}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-3 gap-6"
                  >
                    {filteredBadges.map((badge) => {
                      const isEarned = badge.isEarned;
                      return (
                        <motion.div
                          key={badge.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { playSound('click'); setSelectedBadge(badge); }}
                          className="flex flex-col items-center gap-3 group relative cursor-pointer"
                        >
                          <div className={cn(
                            "w-20 h-20 rounded-[28px] flex items-center justify-center border-2 shadow-sm transition-all duration-500 relative overflow-hidden",
                            isEarned 
                              ? "bg-gradient-to-br from-[#FFF8F0] to-[#FEF3C7] border-[#D4A43E] shadow-[#D4A43E]/20" 
                              : "bg-gray-50 border-[#E5D5B8]/50 grayscale opacity-40"
                          )}>
                            {isEarned && (
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#D4A43E_0%,transparent_70%)]"
                              />
                            )}
                            <img 
                              src={getBadgeUrl(badge.url)} 
                              alt={badge.name}
                              className="w-12 h-12 object-contain relative z-10"
                            />
                            {!isEarned && <Lock className="absolute inset-0 m-auto text-gray-400 opacity-20" size={24} />}
                          </div>
                          <div className="text-center space-y-0.5">
                            <p className={cn("text-[10px] font-black uppercase tracking-tight leading-tight", isEarned ? "text-[#4E2510]" : "text-gray-400")}>
                              {badge.name}
                            </p>
                            <p className="text-[8px] font-bold text-[#D4A43E] uppercase tracking-tighter">
                              {badge.city}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </section>

        <AnimatePresence>
          {selectedBadge && (
            <BadgeDetail 
              badge={{ badge_name: selectedBadge.name, url: selectedBadge.url, rarity: selectedBadge.city, description_fr: `Badge obtenu lors de votre mission à ${selectedBadge.city}.` }} 
              isEarned={selectedBadge.isEarned} 
              onClose={() => setSelectedBadge(null)} 
            />
          )}
        </AnimatePresence>

        {/* Skills Section */}
        <section className="space-y-5">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-[#4E2510]">Compétences <span className="text-[10px] font-black text-[#D4A43E] bg-[#D4A43E]/10 px-2 py-0.5 rounded ml-2">SOFT SKILLS</span></h2>
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

        {/* Audio Settings */}
        <section className="space-y-5">
           <h2 className="text-2xl font-black text-[#4E2510] px-2">Réglages Audio</h2>
           <div className="bg-white border border-[#E5D5B8] rounded-[40px] p-6 shadow-sm grid grid-cols-2 gap-4">
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
              </button>

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
              </button>
           </div>
        </section>
        
        {/* Logout Button */}
        <div className="pt-8 pb-32">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              playSound('click');
              const { error } = await import('../lib/supabase').then(m => m.supabase.auth.signOut());
              if (!error) {
                window.location.reload(); 
              }
            }}
            className="w-full py-5 rounded-3xl font-black text-[#7B3F1A]/60 border-2 border-[#E5D5B8] hover:bg-[#7B3F1A]/5 transition-all flex items-center justify-center gap-3 shadow-sm active:shadow-none"
          >
            <LogOut size={22} className="text-[#7B3F1A]/40" />
            <div className="flex flex-col items-center leading-none">
              <span className="tracking-tight text-lg uppercase text-[#7B3F1A]">Se déconnecter</span>
              <span className="text-[10px] opacity-40 font-bold mt-1 tracking-widest uppercase">تسجيل الخروج</span>
            </div>
          </motion.button>
        </div>

      </main>
    </div>
  );
}
