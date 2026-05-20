import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, MessageCircle, GitBranch, Users, Brain, ChevronRight, ChevronLeft,
  TrendingUp, Trophy, Star, Shield, Flame, Loader2, Volume2, Music, Bell,
  CheckCircle2, Award, Zap, Globe, Lock, MapPin, LogOut
} from 'lucide-react';
import { useAuth, useSupabaseProfile, useSupabaseBadges, useSupabaseUserHistory, useSupabaseSettings, useSupabaseCities } from '../hooks/useSupabase';
import { useAudio } from '../hooks/useAudio';
import { useSettings } from '../contexts/SettingsContext';
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

const cityTranslations: Record<string, string> = {
  'Tous': 'الكل',
  'Rabat': 'الرباط',
  'Chefchaouen': 'شفشاون',
  'Fès': 'فاس',
  'Marrakech': 'مراكش',
  'Laâyoune': 'العيون',
  'Dakhla': 'الداخلة',
  'Culture': 'ثقافة',
  'Succès': 'نجاح'
};

const translateBadgeDescription = (desc: string, city: string, lang: string) => {
  if (lang !== 'ar') return desc;
  if (!desc) return '';

  if (desc.includes('Bijou traditionnel de la ville de')) {
    const cityName = desc.split('ville de')[1]?.trim()?.replace('.', '');
    const arCity = cityTranslations[cityName] || cityName || cityTranslations[city] || city;
    return `مجوهرات تقليدية لمدينة ${arCity}.`;
  }

  if (desc === 'Connaissance Amazighe') return 'المعرفة الأمازيغية';
  if (desc === 'Guerrier Uni') return 'المحارب المتحد';
  if (desc === 'Maître Amazighe') return 'سيد الأمازيغ';

  if (desc.startsWith('Bijou de')) {
    const cityName = desc.replace('Bijou de', '').trim();
    const arCity = cityTranslations[cityName] || cityName || cityTranslations[city] || city;
    return `مجوهرات لمدينة ${arCity}`;
  }

  return desc;
};

function BadgeDetail({ badge, isEarned, onClose }: BadgeDetailProps) {
  const { language } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
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
          isEarned ? "bg-linear-to-br from-voyage-sand to-voyage-parchment" : "bg-gray-100 grayscale"
        )}>
          {isEarned && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#D4A43E_0%,transparent_70%)]"
            />
          )}
          {badge.isEmoji ? (
            <span className="text-7xl relative z-10 select-none animate-pulse-slow">{badge.emoji}</span>
          ) : (
            <img
              src={optimizeSupabaseUrl(badge.url || '', 300, 85) || '/assets/badge_placeholder.png'}
              className="w-32 h-32 object-contain relative z-10"
              alt={badge.badge_name || badge.name}
            />
          )}
          {!isEarned && <Lock className="text-gray-400 opacity-30 absolute" size={64} />}
        </div>

        <div className="p-8 text-center space-y-4">
          <div className="space-y-1">
            <h3 className={cn("text-2xl font-black text-voyage-primary-dark", language === 'ar' ? 'arabic-font' : '')}>
              {badge.badge_name}
            </h3>
            <p className="text-[10px] font-black text-voyage-accent uppercase tracking-[0.2em]">
              {badge.rarity}
              {!isEarned && badge.xp_requirement > 0 && (
                language === 'ar'
                  ? ` • الفتح عند ${badge.xp_requirement} نقطة`
                  : ` • Déverrouillage à ${badge.xp_requirement} XP`
              )}
            </p>
          </div>

          <p className={cn("text-sm text-voyage-primary/70 leading-relaxed font-medium", language === 'ar' ? 'arabic-font' : '')}>
            {badge.description_fr}
          </p>

          <div className="pt-4">
            <button
              onClick={onClose}
              className={cn("w-full py-4 bg-voyage-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-voyage-primary-dark transition-colors", language === 'ar' ? 'arabic-font' : '')}
            >
              {language === 'ar' ? 'إغلاق' : 'Fermer'}
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
  const { language } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
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
          <Globe size={20} className="text-voyage-primary-dark/40" />
        </button>

        <div className="h-40 bg-voyage-primary-dark relative">
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
            <h3 className="text-3xl font-black text-voyage-primary-dark tracking-tight">{devInfo.name || 'Développeur'}</h3>
            <p className={cn("text-[10px] font-black text-voyage-accent uppercase tracking-[0.3em]", language === 'ar' ? 'arabic-font' : '')}>
              {language === 'ar' ? 'المصمم والمطور' : 'Concepteur & Développeur'}
            </p>
          </div>

          <p className={cn("text-sm text-voyage-primary/70 leading-relaxed font-medium px-4", language === 'ar' ? 'arabic-font' : '')}>
            {language === 'ar'
              ? 'شغوف بإنشاء تجارب رقمية مبتكرة وتعليمية. تجدني على LinkedIn للتواصل!'
              : "Passionné par la création d'expériences numériques innovantes et éducatives. Retrouvez-moi sur LinkedIn pour échanger !"}
          </p>

          <div className="flex flex-col items-center gap-4 py-4">
            <motion.a
              href={devInfo.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white rounded-[32px] border-4 border-voyage-accent/20 shadow-lg relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-voyage-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={devInfo.qr_code_url || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(devInfo.linkedin_url || '')}
                className="w-32 h-32 object-contain relative z-10"
                alt="LinkedIn QR"
              />
            </motion.a>
            <span className={cn("text-[9px] font-black text-voyage-accent uppercase tracking-widest animate-pulse", language === 'ar' ? 'arabic-font' : '')}>
              {language === 'ar' ? 'امسح للزيارة' : 'Scannez pour visiter'}
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className={cn("w-full py-5 bg-voyage-primary-dark text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-lg shadow-voyage-primary-dark/20 active:shadow-none transition-all active:scale-95", language === 'ar' ? 'arabic-font' : '')}
            >
              {language === 'ar' ? 'العودة إلى اللعبة' : 'Retour au jeu'}
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
  completedCities: string[];
}

export default function ProfileScreen({ onBack, onSettings, onShowBadges, onLogout, completedMissions, completedCities }: ProfileScreenProps) {
  const { session, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useSupabaseProfile(session?.user?.id);
  const { badges, earnedBadges, loading: badgesLoading } = useSupabaseBadges(session?.user?.id);
  const { history, loading: historyLoading } = useSupabaseUserHistory(session?.user?.id);
  const { settings, loading: settingsLoading, getSetting } = useSupabaseSettings();
  const { cities, loading: citiesLoading } = useSupabaseCities(completedCities, completedMissions);
  const { settings: audio, updateSettings: updateAudio, saveToCloud, playSound } = useAudio();
  const { language } = useSettings();
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
      activity: (language === 'ar' ? ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد'] : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']).map(day => ({ day, count: 0 }))
    };

    // 1. XP Progress
    let totalXp = 0;
    const xpData = history.map(h => {
      return {
        date: new Date(h.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', { day: '2-digit', month: '2-digit' }),
        xp: totalXp += h.xp || 0
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
      const locale = language === 'ar' ? 'ar-MA' : 'fr-FR';
      const day = new Date(h.created_at).toLocaleDateString(locale, { weekday: 'short' });
      const formattedDay = language === 'ar' ? day : (day.charAt(0).toUpperCase() + day.slice(1, 3));
      dayMap[formattedDay] = (dayMap[formattedDay] || 0) + 1;
    });

    const days = language === 'ar'
      ? ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد']
      : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const activityData = days.map(day => ({
      day,
      count: dayMap[day] || 0
    }));

    return { xp: xpData, skills: skillData, success: successData, activity: activityData };
  }, [history, language]);

  const handleToggleAudio = async (patch: any) => {
    updateAudio(patch);
    playSound('click');
    setIsSavingAudio(true);
    setTimeout(async () => {
      await saveToCloud();
      setIsSavingAudio(false);
    }, 500);
  };

  const badgeFilterTabs = ['Tous', 'Rabat', 'Chefchaouen', 'Fès', 'Marrakech', 'Laâyoune', 'Dakhla', 'Culture', 'Succès'];

  const allGameBadges = useMemo(() => {
    return badges.map(b => {
      const bId = b.id || b.badge_id;
      const bName = b.badge_name || b.name_fr || b.translation || '';
      const bNameAr = b.badge_name_ar || b.name_ar || '';
      const bImageUrl = b.image_url || '';
      const bDescription = b.description_fr || b.description || '';
      const bRarity = b.rarity || b.rank || 'common';
      const bXpRequirement = b.xp_requirement || b.points || 0;

      const staticInfo = (BADGE_MAP as any)[bId];
      const name = staticInfo?.name || bName;
      const nameAr = bNameAr || '';
      let rawUrl = bImageUrl || staticInfo?.url || bName;

      // Check if rawUrl is an emoji
      const isEmoji = rawUrl && (
        ['💎', '🗡️', '👑', '⭐', '🏆', '🎯', '🌟', '⛰️', '🏅'].includes(rawUrl) ||
        (rawUrl.length <= 4 && /[\u{1F300}-\u{1F9FF}]/u.test(rawUrl))
      );

      if (rawUrl && !isEmoji && !rawUrl.toLowerCase().endsWith('.png') && !rawUrl.startsWith('http')) {
        rawUrl += '.png';
      }

      const mainCities = ['Rabat', 'Chefchaouen', 'Fès', 'Marrakech', 'Laâyoune', 'Dakhla'];
      let city = staticInfo?.city || b.city;
      if (!city || !mainCities.some(mc => mc.toLowerCase() === city.toLowerCase())) {
        const cat = (b.category || '').toLowerCase();
        if (cat === 'cultural' || cat === 'culture') city = 'Culture';
        else city = 'Succès';
      } else {
        city = mainCities.find(mc => mc.toLowerCase() === city.toLowerCase()) || city;
      }

      const playerXp = profile?.xp || 0;
      const xpRequirement = bXpRequirement || 0;
      const isUnlockedByXp = xpRequirement > 0 && playerXp >= xpRequirement;

      return {
        id: bId,
        name: name,
        badge_name: name,
        nameAr: nameAr,
        badge_name_ar: nameAr,
        url: isEmoji ? '' : getBadgeUrl(rawUrl),
        emoji: isEmoji ? rawUrl : null,
        isEmoji: !!isEmoji,
        city: city,
        isEarned: earnedBadges.includes(bId) || isUnlockedByXp,
        xp_requirement: xpRequirement,
        description_fr: bDescription || (staticInfo ? `Bijou traditionnel de la ville de ${staticInfo.city}.` : ''),
        rarity: bRarity
      };
    });
  }, [badges, earnedBadges, profile?.xp]);

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
    { name: "Travail d'équipe", label: 'العمل الجماعي', level: Math.floor(stats.xp / 1500) + 1, xp: (stats.xp % 1500) / 15, icon: Users, color: 'text-voyage-primary', bg: 'bg-voyage-primary/10', border: 'border-voyage-primary/20' },
    { name: 'Gestion Stress', label: 'إدارة الضغط', level: Math.floor(stats.xp / 3000) + 1, xp: (stats.xp % 3000) / 30, icon: Brain, color: 'text-duo-red', bg: 'bg-duo-red/10', border: 'border-duo-red/20' },
  ];

  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-voyage-primary/10 to-transparent pointer-events-none" />

      <TopAppBar stats={stats} title={language === 'ar' ? 'ملفك الشخصي' : 'Ton Profil'} onBack={onBack} />

      <main className="grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">

        {/* User Profile Card */}
        <section className="relative flex flex-col items-center text-center pt-8 pb-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-voyage-accent/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-36 h-36 rounded-[40px] bg-white p-2 shadow-[0_20px_50px_rgba(123,63,26,0.15)] border-2 border-white overflow-hidden"
            >
              {/* Level Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="46"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <motion.circle
                  cx="50" cy="50" r="46"
                  fill="none"
                  stroke="url(#progress-gradient)"
                  strokeWidth="4"
                  strokeDasharray="289.02"
                  initial={{ strokeDashoffset: 289.02 }}
                  animate={{ strokeDashoffset: 289.02 - (289.02 * ((stats.xp % 1000) / 1000)) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4A43E" />
                    <stop offset="100%" stopColor="#7B3F1A" />
                  </linearGradient>
                </defs>
              </svg>

              <img
                src={optimizeSupabaseUrl(profile?.avatar_url || DEFAULT_AVATAR_URL, 300, 80)}
                alt="Profile"
                className="w-full h-full object-cover rounded-[32px] relative z-10"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Settings Button - Superimposed on frame */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: -15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                playSound('click');
                onSettings();
              }}
              className={cn(
                "absolute -bottom-3 w-12 h-12 bg-white border-4 border-voyage-primary rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer z-30 transition-all",
                language === 'ar' ? "-left-3" : "-right-3"
              )}
            >
              <Settings size={22} className="text-voyage-primary fill-voyage-primary/10" />
            </motion.button>
          </div>

          <div className="mt-8 space-y-3 text-center">
            <h1 className={cn("text-4xl font-black text-voyage-primary-dark tracking-tight", language === 'ar' ? 'arabic-font text-3xl' : '')}>
              {profile?.full_name || (language === 'ar' ? 'مستكشف' : 'Explorateur')}
            </h1>

            <div className="flex flex-col items-center gap-2">
              <p className="text-voyage-primary/60 font-bold text-sm tracking-wide">
                {profile?.username ? `@${profile.username}` : (session?.user?.email || (language === 'ar' ? 'مستكشف المعارف' : 'Explorateur des Savoirs'))}
              </p>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-voyage-accent/10 px-4 py-1.5 rounded-full border border-voyage-accent/20">
                  <Shield size={14} className="text-voyage-accent" />
                  <span className={cn("font-black text-voyage-primary uppercase tracking-[0.2em] text-[10px]", language === 'ar' ? 'arabic-font' : '')}>
                    {language === 'ar' ? `المستوى ${profile?.level || 1}` : `Niveau ${profile?.level || 1}`}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 bg-voyage-primary/5 px-4 py-1.5 rounded-full border border-voyage-primary/10">
                  <span className={cn("font-black text-voyage-primary uppercase tracking-widest text-[10px]", language === 'ar' ? 'arabic-font' : '')}>
                    {profile?.group_name ? (
                      profile.group_name === 'GROUPE NON DÉFINI' && language === 'ar' ? 'تخصص غير محدد' : profile.group_name
                    ) : (
                      language === 'ar' ? 'تخصص غير محدد' : 'SPÉCIALITÉ NON DÉFINIE'
                    )}
                  </span>
                </div>
              </div>

              {profile?.birth_date && (
                <p className={cn("text-[10px] font-black text-voyage-primary/40 uppercase tracking-[0.3em] mt-1", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar'
                    ? `ولد في ${new Date(profile.birth_date).toLocaleDateString('ar-MA')}`
                    : `Né le ${new Date(profile.birth_date).toLocaleDateString('fr-FR')}`}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Big Stats Row */}
        <section className="grid grid-cols-3 gap-4">
          {[
            { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: language === 'ar' ? 'أيام' : 'JOURS', val: '12' },
            { icon: TrendingUp, color: 'text-voyage-accent', bg: 'bg-voyage-accent/5', label: language === 'ar' ? 'إجمالي الخبرة' : 'XP TOTAL', val: (stats.xp / 1000).toFixed(1) + 'k' },
            { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', label: language === 'ar' ? 'الأوسمة' : 'BADGES', val: allGameBadges.filter(b => b.isEarned).length },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn("bg-white border border-voyage-secondary-light p-5 rounded-3xl flex flex-col items-center gap-2 shadow-sm relative overflow-hidden group")}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-1", stat.bg)}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <span className="font-black text-xl text-voyage-primary-dark">{stat.val}</span>
              <span className={cn("text-[9px] font-black text-voyage-primary/50 uppercase tracking-widest text-center", language === 'ar' ? 'arabic-font' : '')}>{stat.label}</span>
            </motion.div>
          ))}
        </section>
        {/* Soft Skills Radar Chart */}
        <div className="bg-white border border-voyage-secondary-light rounded-[40px] p-6 shadow-sm">
          <h3 className={cn("text-sm font-black text-voyage-primary-dark mb-4", language === 'ar' ? 'arabic-font text-right' : '')}>
            {language === 'ar' ? 'توازن المهارات الناعمة' : 'Équilibre des Soft Skills'}
          </h3>
          <div className="h-56 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.skills}>
                <PolarGrid stroke="#E5D5B8" opacity={0.5} />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#7B3F1A', fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                <Radar name="Soft Skills" dataKey="value" stroke="#2D6A4F" strokeWidth={2} fill="#2D6A4F" fillOpacity={0.3} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#2D6A4F' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Engagement & Analytics Section */}
        <section className="space-y-6">
          <div className={cn("flex justify-between items-end px-2", language === 'ar' ? 'flex-row-reverse' : '')}>
            <div className="flex flex-col">
              <h2 className={cn("text-2xl font-black text-voyage-primary-dark", language === 'ar' ? 'arabic-font text-right' : '')}>
                {language === 'ar' ? 'خريطة المملكة' : 'Carte du Royaume'}
              </h2>
              <p className={cn("text-[10px] font-black text-voyage-accent uppercase tracking-widest mt-1", language === 'ar' ? 'arabic-font text-right' : 'text-left')}>
                {language === 'ar' ? 'غزوك للمجال المغربي' : 'Ta conquête du territoire marocain'}
              </p>
            </div>
            <MapPin size={20} className="text-voyage-accent mb-1" />
          </div>

          <div className="bg-white border border-voyage-secondary-light rounded-[40px] p-2 shadow-sm relative overflow-hidden aspect-4/3 flex items-center justify-center">
            <div className="absolute inset-0 bg-voyage-sand/30 opacity-40">
              <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-110">
                <path d="M100 50C150 20 250 80 300 120C350 160 300 250 250 280C200 310 100 280 50 220C0 160 50 80 100 50Z" fill="#E5D5B8" fillOpacity="0.3" />
                <path d="M50 100C80 80 120 120 150 100C180 80 220 140 250 120" stroke="#7B3F1A" strokeOpacity="0.1" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="relative w-full h-full">
              {cities.map((city, idx) => {
                const x = city.map_x ? `${(city.map_x / 1000) * 100}%` : `${20 + (idx * 15)}%`;
                const y = city.map_y ? `${(city.map_y / 1000) * 100}%` : `${30 + (idx * 10)}%`;

                return (
                  <motion.div
                    key={city.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + (idx * 0.1), type: 'spring' }}
                    style={{ left: x, top: y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-500",
                      city.status === 'completed' ? "bg-green-500 scale-110" :
                        city.status === 'active' ? "bg-voyage-accent animate-bounce" : "bg-gray-300 grayscale"
                    )}>
                      {city.status === 'completed' ? (
                        <CheckCircle2 size={16} className="text-white" />
                      ) : city.status === 'active' ? (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      ) : (
                        <Lock size={12} className="text-white/50" />
                      )}
                    </div>
                    <span className={cn(
                      "text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border shadow-sm",
                      city.status === 'locked' ? "text-gray-400 border-gray-100" : "text-voyage-primary-dark border-voyage-secondary-light",
                      language === 'ar' ? 'arabic-font font-bold' : ''
                    )}>
                      {language === 'ar' ? (cityTranslations[city.name] || city.name) : city.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Advanced Stats Section (Charts) */}
        <section className="space-y-6">
          <div className={cn("flex justify-between items-end px-2", language === 'ar' ? 'flex-row-reverse' : '')}>
            <div className="flex flex-col">
              <h2 className={cn("text-2xl font-black text-voyage-primary-dark", language === 'ar' ? 'arabic-font text-right' : '')}>
                {language === 'ar' ? 'الإحصائيات والتقدم' : 'Statistiques & Progression'}
              </h2>
              <p className={cn("text-[10px] font-black text-voyage-accent uppercase tracking-widest mt-1", language === 'ar' ? 'arabic-font text-right' : 'text-left')}>
                {language === 'ar' ? 'تحليل أدائك' : 'Analyse de tes performances'}
              </p>
            </div>
            <TrendingUp size={20} className="text-voyage-accent mb-1" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* XP Progression Chart */}
            <div className="bg-white border border-voyage-secondary-light rounded-[40px] p-6 shadow-sm">
              <h3 className={cn("text-sm font-black text-voyage-primary-dark mb-4", language === 'ar' ? 'arabic-font text-right' : '')}>
                {language === 'ar' ? 'تطور الخبرة (XP)' : 'Évolution de l\'XP'}
              </h3>
              <div className="h-48 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.xp} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4A43E" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D4A43E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D5B8" opacity={0.4} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C8C8C' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C8C8C' }} width={30} />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#2D6A4F' }}
                    />
                    <Area type="monotone" dataKey="xp" stroke="#D4A43E" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>



            {/* Engagement Bar Chart */}
            <div className="bg-white border border-voyage-secondary-light rounded-[40px] p-6 shadow-sm">
              <h3 className={cn("text-sm font-black text-voyage-primary-dark mb-4", language === 'ar' ? 'arabic-font text-right' : '')}>
                {language === 'ar' ? 'المشاركة الأسبوعية' : 'Engagement Hebdomadaire'}
              </h3>
              <div className="h-48 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D5B8" opacity={0.4} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C8C8C' }} dy={10} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C8C8C' }} />
                    <Tooltip
                      cursor={{ fill: '#F3F4F6' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" name={language === 'ar' ? 'مهام' : 'Missions'} fill="#E25C3D" radius={[6, 6, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Card */}
        <section className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-voyage-primary to-voyage-primary-dark rounded-[40px] shadow-2xl" />
          <div className="relative z-10 p-8 space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className={cn("text-[10px] font-black text-voyage-accent uppercase tracking-[0.3em]", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? 'الخطوة التالية' : 'PROCHAINE ÉTAPE'}
                </span>
                <h3 className={cn("text-2xl font-black text-white", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? `المستوى ${stats.level + 1}` : `Niveau ${stats.level + 1}`}
                </h3>
              </div>
              <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                <span className={cn("block font-black text-white text-xl", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar'
                    ? `${Math.max(0, (stats.level + 1) * 1000 - stats.xp)} نقطة`
                    : `${Math.max(0, (stats.level + 1) * 1000 - stats.xp)} XP`}
                </span>
                <span className={cn("block text-[10px] font-bold text-voyage-accent/70 uppercase tracking-widest", language === 'ar' ? 'arabic-font text-left' : 'text-right')}>
                  {language === 'ar' ? 'متبقي' : 'Restant'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-5 w-full bg-black/30 rounded-full overflow-hidden p-1 border border-white/10 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.xp % 1000) / 10)}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-voyage-accent to-[#F59E0B] rounded-full relative overflow-hidden shadow-[0_0_20px_rgba(212,164,62,0.4)]"
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  />
                </motion.div>
              </div>
            </div>
          </div>
          <Trophy className="absolute -bottom-6 -right-6 text-white/5 rotate-12" size={160} />
        </section>

        {/* Badges Section - Dynamic with Toggle */}
        <section className="space-y-6">
          <div className={cn("flex items-center justify-between px-2", language === 'ar' ? 'flex-row-reverse' : '')}>
            <div>
              <h2 className={cn("text-[10px] font-black text-voyage-primary/40 uppercase tracking-[0.2em]", language === 'ar' ? 'arabic-font text-right' : '')}>
                {language === 'ar' ? 'مكتبة المجوهرات' : 'Médiathèque des Bijoux'}
              </h2>
              <p className={cn("text-[8px] font-bold text-voyage-accent uppercase tracking-widest mt-0.5", language === 'ar' ? 'arabic-font text-right' : '')}>
                {language === 'ar' ? 'مجموعة الكنوز المفتوحة بإنجازاتك' : 'Collection des trésors déverrouillés par tes exploits'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn("text-[10px] font-black text-voyage-accent bg-voyage-accent/10 px-3 py-1 rounded-full border border-voyage-accent/20", language === 'ar' ? 'arabic-font' : '')}>
                {language === 'ar'
                  ? `${allGameBadges.filter(b => b.isEarned).length} / ${allGameBadges.length} مكتسب`
                  : `${allGameBadges.filter(b => b.isEarned).length} / ${allGameBadges.length} ACQUIS`}
              </span>
            </div>
          </div>

          {/* Toggle Menu - Cities */}
          <div className={cn("flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1", language === 'ar' ? 'flex-row-reverse' : '')}>
            {badgeFilterTabs.map((city) => {
              const cityBadges = allGameBadges.filter(b =>
                city === 'Tous' ? true : b.city?.toLowerCase() === city.toLowerCase()
              );
              const earned = cityBadges.filter(b => b.isEarned).length;
              const displayTab = language === 'ar' ? (cityTranslations[city] || city) : city;

              return (
                <button
                  key={city}
                  onClick={() => { playSound('click'); setActiveCity(city); }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 border-2",
                    activeCity === city
                      ? "bg-voyage-primary text-white border-voyage-primary shadow-lg shadow-voyage-primary/20"
                      : "bg-white text-voyage-primary border-voyage-secondary-light hover:border-voyage-accent"
                  )}
                >
                  <MapPin size={14} className={activeCity === city ? "text-white" : "text-voyage-accent"} />
                  <div className={cn("flex flex-col items-start leading-tight", language === 'ar' ? 'items-end' : 'items-start')}>
                    <span className={language === 'ar' ? 'arabic-font' : ''}>{displayTab}</span>
                    <span className={cn(
                      "text-[8px] font-bold",
                      activeCity === city ? "text-white/60" : "text-voyage-accent"
                    )}>
                      {earned}/{cityBadges.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white border border-voyage-secondary-light rounded-[40px] p-8 shadow-sm">
            <AnimatePresence mode="wait">
              {filteredBadges.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                    <Lock size={32} />
                  </div>
                  <p className={cn("text-sm font-bold text-voyage-primary/40 uppercase tracking-tight", language === 'ar' ? 'arabic-font' : '')}>
                    {language === 'ar' ? 'لا توجد أوسمة في هذه المدينة' : 'Aucun badge dans cette ville'}
                  </p>
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
                            ? "bg-linear-to-br from-voyage-sand to-voyage-parchment border-voyage-accent shadow-voyage-accent/20"
                            : "bg-gray-50 border-voyage-secondary-light/30 grayscale opacity-40"
                        )}>
                          {isEarned && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#D4A43E_0%,transparent_70%)]"
                            />
                          )}

                          {badge.isEmoji ? (
                            <span className="text-4xl relative z-10 select-none">{badge.emoji}</span>
                          ) : badge.url ? (
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
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 z-20 gap-1">
                              <Lock size={16} className="text-voyage-primary/50" />
                              {badge.xp_requirement > 0 && (
                                <span className="text-[6px] font-black text-voyage-primary/40 uppercase tracking-tighter">{badge.xp_requirement} XP</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-center space-y-0.5 px-1">
                          <p className={cn("text-[10px] font-black uppercase tracking-tight leading-tight", isEarned ? "text-voyage-primary-dark" : "text-gray-400", language === 'ar' ? 'arabic-font text-xs' : '')}>
                            {language === 'ar' ? (badge.nameAr || badge.name) : badge.name}
                          </p>
                          {badge.nameAr && language !== 'ar' && (
                            <p className="text-[9px] font-bold text-voyage-primary/40 arabic-font leading-none mb-1">
                              {badge.nameAr}
                            </p>
                          )}
                          {language === 'ar' && badge.nameAr && (
                            <p className="text-[9px] font-bold text-voyage-primary/40 leading-none mb-1">
                              {badge.name}
                            </p>
                          )}
                          <p className={cn("text-[8px] font-black text-voyage-accent uppercase tracking-tighter", language === 'ar' ? 'arabic-font font-bold' : '')}>
                            {language === 'ar' ? (cityTranslations[badge.city] || badge.city) : badge.city}
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
                badge_name: language === 'ar' ? (selectedBadge.nameAr || selectedBadge.name) : selectedBadge.name,
                url: selectedBadge.url,
                rarity: language === 'ar' ? (cityTranslations[selectedBadge.city] || selectedBadge.city) : (selectedBadge.rarity || selectedBadge.city),
                xp_requirement: selectedBadge.xp_requirement,
                description_fr: translateBadgeDescription(selectedBadge.description_fr, selectedBadge.city, language)
              }}
              isEarned={selectedBadge.isEarned}
              onClose={() => setSelectedBadge(null)}
            />
          )}
        </AnimatePresence>

        {/* Skills Section */}
        <section className="space-y-5">
          <div className="flex justify-between items-center px-2">
            <h2 className={cn("text-2xl font-black text-voyage-primary-dark", language === 'ar' ? 'arabic-font' : '')}>
              {language === 'ar' ? 'المهارات الشخصية' : 'Compétences'} <span className="text-[10px] font-black text-voyage-accent bg-voyage-accent/10 px-2 py-0.5 rounded ml-2">SOFT SKILLS</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (idx * 0.05) }}
                className={cn("p-6 rounded-[32px] border border-voyage-secondary-light flex flex-col items-center text-center gap-4 transition-all hover:shadow-xl hover:-translate-y-1 bg-white")}
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner relative border-2 border-transparent", skill.bg)}>
                  <skill.icon className={skill.color} size={32} />
                </div>
                <div>
                  <p className={cn("font-black text-voyage-primary-dark leading-tight mb-1", language === 'ar' ? 'text-base arabic-font' : 'text-sm')}>{language === 'ar' ? skill.label : skill.name}</p>
                  <p className="text-[10px] font-bold text-voyage-primary/40 leading-none">{language === 'ar' ? skill.name : skill.label}</p>
                </div>
                <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.xp}%` }}
                    className={cn("h-full rounded-full", skill.color.replace('text-', 'bg-'))}
                  />
                </div>
                <span className={cn("text-[10px] font-black text-voyage-primary/60 uppercase tracking-widest", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? `المستوى ${skill.level}` : `Niveau ${skill.level}`}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Audio Settings */}
        <section className="space-y-5">
          <h2 className={cn("text-2xl font-black text-voyage-primary-dark px-2", language === 'ar' ? 'arabic-font text-right' : '')}>
            {language === 'ar' ? 'إعدادات الصوت' : 'Réglages Audio'}
          </h2>
          <div className="bg-white border border-voyage-secondary-light rounded-[40px] p-6 shadow-sm grid grid-cols-2 gap-4">
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
                <p className={cn("font-black text-voyage-primary-dark text-sm uppercase tracking-tight", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? 'مؤثرات' : 'Effets'}
                </p>
                <p className={cn("text-[9px] font-bold text-voyage-primary/40 uppercase tracking-widest", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? 'صوتية' : 'Sonores'}
                </p>
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
                <p className={cn("font-black text-voyage-primary-dark text-sm uppercase tracking-tight", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? 'موسيقى' : 'Musique'}
                </p>
                <p className={cn("text-[9px] font-bold text-voyage-primary/40 uppercase tracking-widest", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? 'الخلفية' : 'De fond'}
                </p>
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
            className={cn(
              "w-full py-6 rounded-[32px] font-black text-voyage-accent border-2 border-voyage-accent/30 bg-voyage-accent/5 hover:bg-voyage-accent/10 transition-all flex items-center justify-between px-8 shadow-sm group",
              language === 'ar' ? 'flex-row-reverse' : ''
            )}
          >
            <div className={cn("flex items-center gap-4", language === 'ar' ? 'flex-row-reverse' : '')}>
              <div className="p-3 bg-voyage-accent rounded-2xl text-white shadow-lg shadow-voyage-accent/20 group-hover:rotate-12 transition-transform">
                <Users size={20} />
              </div>
              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                <span className={cn("block text-sm font-black uppercase tracking-tight text-voyage-primary-dark", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? 'التعرف على المطور' : 'Connaître le développeur'}
                </span>
                <span className={cn("block text-[10px] font-bold text-voyage-accent uppercase tracking-widest mt-0.5", language === 'ar' ? 'arabic-font' : '')}>
                  {language === 'ar' ? 'التصميم والتطوير' : 'Design & Développement'}
                </span>
              </div>
            </div>
            <ChevronIcon size={20} className={cn("text-voyage-accent/60 transition-transform", language === 'ar' ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
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
            className="w-full py-5 rounded-3xl font-black text-voyage-primary/60 border-2 border-voyage-secondary-light hover:bg-voyage-primary/5 transition-all flex items-center justify-center gap-3 shadow-sm active:shadow-none"
          >
            <LogOut size={22} className="text-voyage-primary/40" />
            <div className="flex flex-col items-center leading-none">
              <span className={cn("tracking-tight text-lg uppercase text-voyage-primary", language === 'ar' ? 'arabic-font' : '')}>
                {language === 'ar' ? 'تسجيل الخروج' : 'Se déconnecter'}
              </span>
              <span className={cn("text-[10px] opacity-40 font-bold mt-1 tracking-widest uppercase", language === 'ar' ? '' : 'arabic-font')}>
                {language === 'ar' ? 'Se déconnecter' : 'تسجيل الخروج'}
              </span>
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
