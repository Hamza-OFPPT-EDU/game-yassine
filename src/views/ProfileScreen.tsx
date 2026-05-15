import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, MessageCircle, GitBranch, Users, Brain, ChevronRight, TrendingUp, Trophy, Star, Shield, Flame, Loader2, Volume2, Music, Bell, CheckCircle2, Award, Zap, Globe, Lock, MapPin, LogOut } from 'lucide-react';
import { useAuth, useSupabaseProfile, useSupabaseBadges, useSupabaseUserHistory, useSupabaseSettings } from '../hooks/useSupabase';
import { useAudio } from '../hooks/useAudio';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { optimizeSupabaseUrl } from '../lib/city-theme';
import { DEFAULT_AVATAR_URL } from '../types';
import { getBadgeUrl, BADGE_MAP } from '../lib/badges';
import { 
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

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
            src={optimizeSupabaseUrl(badge.url || '', 300, 85) || '/assets/badge_placeholder.png'} 
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

interface DevModalProps {
  devInfo: {
    name: string;
    photo_url: string;
    linkedin_url: string;
    qr_code_url: string;
  };
  onClose: () => void;
}

function DevModal({ devInfo, onClose }: DevModalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 50, rotate: -2 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        className="bg-white rounded-[48px] w-full max-w-md overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
        >
          <Globe size={20} className="text-[#4E2510]/40" />
        </button>

        <div className="h-40 bg-[#4E2510] relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 rounded-[32px] border-8 border-white overflow-hidden shadow-xl bg-white">
              <img 
                src={devInfo.photo_url || DEFAULT_AVATAR_URL} 
                className="w-full h-full object-cover"
                alt="Developer"
              />
            </div>
          </div>
        </div>

        <div className="p-10 pt-20 text-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-[#4E2510] tracking-tight">{devInfo.name || 'Développeur'}</h3>
            <p className="text-[10px] font-black text-[#D4A43E] uppercase tracking-[0.3em]">Concepteur & Développeur</p>
          </div>

          <p className="text-sm text-[#7B3F1A]/70 leading-relaxed font-medium px-4">
            Passionné par la création d'expériences numériques innovantes et éducatives. Retrouvez-moi sur LinkedIn pour échanger !
          </p>

          <div className="flex flex-col items-center gap-4 py-4">
            <motion.a 
              href={devInfo.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white rounded-[32px] border-4 border-[#D4A43E]/20 shadow-lg relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A43E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src={devInfo.qr_code_url || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(devInfo.linkedin_url || '')} 
                className="w-32 h-32 object-contain relative z-10"
                alt="LinkedIn QR"
              />
            </motion.a>
            <span className="text-[9px] font-black text-[#D4A43E] uppercase tracking-widest animate-pulse">Scannez pour visiter</span>
          </div>

          <div className="pt-2">
             <button 
                onClick={onClose}
                className="w-full py-5 bg-[#4E2510] text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#4E2510]/20 active:shadow-none transition-all active:scale-95"
             >
               Retour au jeu
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
  onLogout: () => void;
  completedMissions: string[];
}

export default function ProfileScreen({ onBack, onSettings, onShowBadges, onLogout, completedMissions }: ProfileScreenProps) {
  const { session, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useSupabaseProfile(session?.user?.id);
  const { badges, earnedBadges, loading: badgesLoading } = useSupabaseBadges(session?.user?.id);
  const { history, loading: historyLoading } = useSupabaseUserHistory(session?.user?.id);
  const { settings, loading: settingsLoading, getSetting } = useSupabaseSettings();
  const { settings: audio, updateSettings: updateAudio, saveToCloud, playSound } = useAudio();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [activeCity, setActiveCity] = useState('Tous');
  const [showDevModal, setShowDevModal] = useState(false);
  const [isSavingAudio, setIsSavingAudio] = useState(false);

  const devInfo = getSetting('developer_info') || {
    name: 'Yacine BOULYALI',
    photo_url: '/assets/yacine_profile.jpg',
    linkedin_url: 'https://www.linkedin.com/in/yacineboulyali/',
    qr_code_url: '/assets/yacine_qr.png'
  };

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return { 
      xp: [{ date: '', xp: 0 }], 
      skills: [{ name: 'Com', value: 0 }, { name: 'Déc', value: 0 }, { name: 'Eq', value: 0 }, { name: 'Str', value: 0 }], 
      success: [{ name: '', score: 0 }], 
      activity: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => ({ day, count: 0 })) 
    };

    // 1. XP Progress
    let totalXp = 0;
    const xpData = history.map(h => {
      totalXp += h.xp || 0;
      return { 
        date: new Date(h.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), 
        xp: totalXp 
      };
    });

    // 2. Skills Radar
    const skillMap: Record<string, number> = {};
    history.forEach(h => {
      const skill = h.missions?.soft_skill_dominant || 'Général';
      skillMap[skill] = (skillMap[skill] || 0) + (h.xp || 0);
    });
    const skillData = Object.entries(skillMap).map(([name, value]) => ({ name, value }));

    // 3. Success Rate (last 10 missions)
    const successData = history.slice(-10).map(h => ({
      name: h.missions?.title_fr?.substring(0, 10) || 'Mission',
      score: h.score || 0
    }));

    // 4. Activity (Daily missions count)
    const dayMap: Record<string, number> = {};
    history.forEach(h => {
      const day = new Date(h.created_at).toLocaleDateString('fr-FR', { weekday: 'short' });
      const formattedDay = day.charAt(0).toUpperCase() + day.slice(1, 3);
      dayMap[formattedDay] = (dayMap[formattedDay] || 0) + 1;
    });
    
    const daysFr = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const activityData = daysFr.map(day => ({
      day,
      count: dayMap[day] || 0
    }));

    return { xp: xpData, skills: skillData, success: successData, activity: activityData };
  }, [history]);

  const handleToggleAudio = async (patch: any) => {
    updateAudio(patch);
    playSound('click');
    setIsSavingAudio(true);
    setTimeout(async () => {
      await saveToCloud();
      setIsSavingAudio(false);
    }, 500);
  };

  const cities = ['Tous', 'Rabat', 'Chefchaouen', 'Fès', 'Marrakech', 'Laâyoune', 'Dakhla', 'Culture', 'Succès'];

  const allGameBadges = useMemo(() => {
    return badges.map(b => {
      const staticInfo = (BADGE_MAP as any)[b.id];
      const name = staticInfo?.name || b.badge_name;
      const nameAr = b.badge_name_ar || '';
      let rawUrl = b.image_url || staticInfo?.url || b.badge_name;
      
      if (rawUrl && !rawUrl.toLowerCase().endsWith('.png') && !rawUrl.startsWith('http')) {
        rawUrl += '.png';
      }
      
      // Determine city/category
      let city = staticInfo?.city;
      if (!city) {
        if (b.category === 'cultural' || b.category === 'culture') city = 'Culture';
        else if (b.category === 'achievement' || b.category === 'succes') city = 'Succès';
        else if (b.category === 'multiplayer') city = 'Succès';
        else city = 'Succès';
      }

      return {
        id: b.id,
        name: name,
        nameAr: nameAr,
        url: getBadgeUrl(rawUrl),
        city: city,
        isEarned: earnedBadges.includes(b.id),
        description_fr: b.description_fr || (staticInfo ? `Bijou traditionnel de la ville de ${staticInfo.city}.` : ''),
        rarity: b.rarity
      };
    });
  }, [badges, earnedBadges]);

  const filteredBadges = useMemo(() => {
    if (activeCity === 'Tous') return allGameBadges;
    return allGameBadges.filter(b => 
      b.city?.toLowerCase() === activeCity.toLowerCase()
    );
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
                 <motion.button 
                   whileHover={{ scale: 1.1, rotate: 15 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={() => {
                     playSound('click');
                     onSettings();
                   }}
                   className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border-2 border-[#E5D5B8] rounded-2xl flex items-center justify-center shadow-xl cursor-pointer z-20 hover:border-[#D4A43E] transition-colors"
                 >
                   <Settings size={24} className="text-[#7B3F1A]" />
                 </motion.button>
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
                      {profile?.group_name || 'SPÉCIALITÉ NON DÉFINIE'}
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


        {/* Engagement & Analytics Section */}
        <section className="space-y-6">
           <div className="flex justify-between items-end px-2">
             <div className="flex flex-col">
               <h2 className="text-2xl font-black text-[#4E2510]">Engagement</h2>
               <p className="text-[10px] font-black text-[#D4A43E] uppercase tracking-widest text-left mt-1">
                  Analyse de tes performances
               </p>
             </div>
             <TrendingUp size={20} className="text-[#D4A43E] mb-1" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* XP Progression Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-[#E5D5B8] rounded-[40px] p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-[#7B3F1A] uppercase tracking-widest">Progression XP</h4>
                  <Zap size={14} className="text-[#D4A43E]" />
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.xp}>
                      <defs>
                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4A43E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4A43E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="xp" stroke="#D4A43E" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Skills Radar Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-[#E5D5B8] rounded-[40px] p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-[#7B3F1A] uppercase tracking-widest">Soft Skills</h4>
                  <Brain size={14} className="text-[#7B3F1A]" />
                </div>
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.skills}>
                      <PolarGrid stroke="#F0F0F0" />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 'bold', fill: '#7B3F1A' }} />
                      <Radar name="XP" dataKey="value" stroke="#7B3F1A" fill="#7B3F1A" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Success Rate Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-[#E5D5B8] rounded-[40px] p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-[#7B3F1A] uppercase tracking-widest">Taux de Succès</h4>
                  <Star size={14} className="text-amber-500" />
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.success}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Line type="stepAfter" dataKey="score" stroke="#7B3F1A" strokeWidth={3} dot={{ fill: '#7B3F1A', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Activity Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-[#E5D5B8] rounded-[40px] p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-[#7B3F1A] uppercase tracking-widest">Activité Hebdo</h4>
                  <Flame size={14} className="text-orange-500" />
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.activity}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#7B3F1A' }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: '#F59E0B', opacity: 0.1 }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="count" fill="#D4A43E" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
           </div>
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
           <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-[10px] font-black text-[#7B3F1A]/40 uppercase tracking-[0.2em]">Mes Badges & Succès</h2>
                <p className="text-[8px] font-bold text-[#D4A43E] uppercase tracking-widest mt-0.5">
                  Collection des bijoux de compétences
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-black text-[#D4A43E] bg-[#D4A43E]/10 px-3 py-1 rounded-full border border-[#D4A43E]/20">
                  {allGameBadges.filter(b => b.isEarned).length} / {allGameBadges.length} DÉVEROUILLÉS
                </span>
              </div>
            </div>

           {/* Toggle Menu - Cities */}
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
             {cities.map((city) => {
               const cityBadges = allGameBadges.filter(b => 
                 city === 'Tous' ? true : b.city?.toLowerCase() === city.toLowerCase()
               );
               const earned = cityBadges.filter(b => b.isEarned).length;
               
               return (
                 <button
                   key={city}
                   onClick={() => { playSound('click'); setActiveCity(city); }}
                   className={cn(
                     "flex items-center gap-3 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 border-2",
                     activeCity === city 
                       ? "bg-[#7B3F1A] text-white border-[#7B3F1A] shadow-lg shadow-[#7B3F1A]/20" 
                       : "bg-white text-[#7B3F1A] border-[#E5D5B8] hover:border-[#D4A43E]"
                   )}
                 >
                   <MapPin size={14} className={activeCity === city ? "text-white" : "text-[#D4A43E]"} />
                   <div className="flex flex-col items-start leading-tight">
                     <span>{city}</span>
                     <span className={cn(
                       "text-[8px] font-bold",
                       activeCity === city ? "text-white/60" : "text-[#D4A43E]"
                     )}>
                       {earned}/{cityBadges.length}
                     </span>
                   </div>
                 </button>
               );
             })}
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
                              : "bg-gray-50 border-[#E5D5B8]/30 grayscale opacity-40"
                          )}>
                            {isEarned && (
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#D4A43E_0%,transparent_70%)]"
                              />
                            )}
                            
                            {badge.url ? (
                              <img 
                                src={optimizeSupabaseUrl(badge.url, 160, 85)} 
                                alt={badge.name}
                                className="w-12 h-12 object-contain relative z-10"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const parent = (e.target as HTMLImageElement).parentElement;
                                  if (parent) {
                                    const fallback = document.createElement('span');
                                    fallback.className = 'text-3xl relative z-10';
                                    fallback.innerText = '🏆';
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-3xl relative z-10">🏆</span>
                            )}

                            {!isEarned && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-20">
                                <Lock size={20} className="text-[#7B3F1A]/50" />
                              </div>
                            )}
                          </div>
                          <div className="text-center space-y-0.5 px-1">
                            <p className={cn("text-[10px] font-black uppercase tracking-tight leading-tight", isEarned ? "text-[#4E2510]" : "text-gray-400")}>
                              {badge.name}
                              {badge.nameAr && <span className="block text-[8px] opacity-60 font-bold mt-0.5">{badge.nameAr}</span>}
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
              badge={{ 
                badge_name: selectedBadge.name, 
                url: selectedBadge.url, 
                rarity: selectedBadge.rarity || selectedBadge.city, 
                description_fr: selectedBadge.description_fr || `Badge obtenu lors de votre mission à ${selectedBadge.city}.` 
              }} 
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
        
        {/* Developer Info Button */}
        <div className="pt-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playSound('click');
              setShowDevModal(true);
            }}
            className="w-full py-6 rounded-[32px] font-black text-[#D4A43E] border-2 border-[#D4A43E]/30 bg-[#D4A43E]/5 hover:bg-[#D4A43E]/10 transition-all flex items-center justify-between px-8 shadow-sm group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#D4A43E] rounded-2xl text-white shadow-lg shadow-[#D4A43E]/20 group-hover:rotate-12 transition-transform">
                <Users size={20} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-black uppercase tracking-tight text-[#4E2510]">Connaître le développeur</span>
                <span className="block text-[10px] font-bold text-[#D4A43E] uppercase tracking-widest mt-0.5">Design & Développement</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#D4A43E]/60 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
        
        {/* Logout Button */}
        <div className="pt-8 pb-32">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              playSound('click');
              await signOut();
              onLogout();
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

        <AnimatePresence>
          {showDevModal && (
            <DevModal 
              devInfo={devInfo}
              onClose={() => setShowDevModal(false)}
            />
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
