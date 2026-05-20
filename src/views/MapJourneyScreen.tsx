/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Check, ChevronRight, X, Loader2, Lock,
  Star, Sparkles, Navigation2, ArrowDown, Trophy
} from 'lucide-react';
import { type City, DEFAULT_AVATAR_URL } from '../types';
import { cn } from '../lib/utils';
import TopAppBar from '../components/TopAppBar';
import { useAudio } from '../hooks/useAudio';
import { useSupabaseCities, useSupabaseMissions } from '../hooks/useSupabase';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { getCityTheme, resolveCityIcon, optimizeSupabaseUrl, resolveAssetUrl } from '../lib/city-theme';
import GameButton from '../components/GameButton';
import { useSettings } from '../contexts/SettingsContext';

// ── MapJourneyScreen ─────────────────────────────────────────────────────────

interface MapJourneyScreenProps {
  stats: { xp: number; stars: number; level: number };
  profile?: any;
  completedCities: string[];
  completedMissions: string[];
  onSelectCity: (city: City, mission?: any) => void;
}

export default function MapJourneyScreen({
  stats, profile, completedCities, completedMissions, onSelectCity
}: MapJourneyScreenProps) {
  const { playSound, playVoice } = useAudio();
  const { language } = useSettings();
  const { cities, loading } = useSupabaseCities(completedCities, completedMissions);

  // Sorting and progress indices for Duolingo dual-trail path calculation
  const sortedCities = useMemo(() => {
    return [...(cities || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [cities]);

  const activeCityIndex = useMemo(() => {
    const idx = sortedCities.findIndex(c => c.status === 'active');
    if (idx !== -1) return idx;
    const lastCompletedIdx = sortedCities.reduce((acc, c, i) => c.status === 'completed' ? i : acc, -1);
    return lastCompletedIdx !== -1 ? lastCompletedIdx : 0;
  }, [sortedCities]);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [cinematicCity, setCinematicCity] = useState<City | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isMissionsExpanded, setIsMissionsExpanded] = useState(false);

  // Refs pour scroll automatique
  const activeCityRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollDone, setScrollDone] = useState(false);

  // Hook pour scroll automatique
  const { isInView: isActiveCityInView } = useAutoScroll({
    targetRef: activeCityRef,
    enabled: !loading && !scrollDone,
    onScrolDone: () => setScrollDone(true),
  });

  const handleShowCitySheet = (city: City) => {
    playSound('whoosh');
    setSelectedCityId(city.id);
    setIsDescriptionExpanded(false);
    setIsMissionsExpanded(false);
  };
  const handleLaunchAdventure = (city: City) => {
    playSound('click');
    if (city.cinematicIntro && city.status !== 'completed') {
      setCinematicCity(city);
    } else {
      onSelectCity(city);
    }
  };
  const handleSelectMission = (city: City, mission: any) => {
    playSound('click');
    onSelectCity(city, mission);
  };

  // Hook pour jouer la voix de Rabat automatiquement
  useEffect(() => {
    if (cinematicCity && cinematicCity.name === 'Rabat') {
      const audio = playVoice('https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/rabat_intro_voice.mp3');
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [cinematicCity, playVoice]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full w-full map-bg flex flex-col items-center justify-center gap-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-[6px] border-voyage-primary/20 border-t-voyage-accent"
        />
        <p className={cn("font-headline font-black text-voyage-primary uppercase tracking-widest text-[11px] opacity-80", language === 'ar' && "arabic-font text-[14px]")}>
          {language === 'ar' ? "جاري تحضير الرحلة..." : "Préparation du voyage..."}
        </p>
      </div>
    );
  }

  const activeCity = (cities?.length > 0) ? (cities.find(c => c.status === 'active') || cities[0]) : null;
  const displayCity = selectedCityId ? cities.find(c => c.id === selectedCityId) : null;
  const displayCityTheme = getCityTheme(displayCity ?? null);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden map-bg pt-[56px]">
      <TopAppBar stats={stats} />

      {/* ── Écran cinématique ────────────────────────────────────────────── */}
      <AnimatePresence>
        {cinematicCity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'linear-gradient(160deg, var(--color-voyage-primary-dark) 0%, var(--color-voyage-primary) 50%, var(--color-voyage-terracotta) 100%)' }}
          >
            <button
              onClick={() => setCinematicCity(null)}
              className={cn("absolute top-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all z-20 backdrop-blur-md border border-white/20 shadow-xl", language === 'ar' ? "left-8" : "right-8")}
            >
              <X size={24} strokeWidth={3} />
            </button>

            {/* Étoiles de fond (fixes) */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-voyage-accent star-twinkle"
                style={{
                  top: `${8 + Math.random() * 84}%`,
                  left: `${5 + Math.random() * 90}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${9.5 + Math.random() * 13.3}px`,
                }}
              >★</motion.div>
            ))}

            {/* Contenu scrollable */}
            <div className="absolute inset-0 overflow-y-auto scrollbar-hide" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <div className="min-h-full flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="max-w-lg space-y-9 relative z-10 py-10"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="mx-auto flex items-center justify-center"
                  >
                    {resolveCityIcon(cinematicCity, 60, 'text-voyage-accent')}
                  </motion.div>

                  <div className="space-y-2.5">
                    <p className={cn("text-voyage-accent font-black uppercase tracking-[0.3em] text-[12px]", language === 'ar' && "arabic-font text-[14px]")}>
                      {language === 'ar' ? "رحلة المهارات" : "Le Voyage des Compétences"}
                    </p>
                    <h1 className={cn("text-[41px] font-headline font-black text-white tracking-tight", language === 'ar' && "arabic-font text-[43px]")}>
                      {language === 'ar' ? cinematicCity.arabicHeadline || cinematicCity.arabicName || cinematicCity.name : cinematicCity.name}
                    </h1>
                    {language !== 'ar' && (
                      <p className="arabic-font text-voyage-secondary text-[17px]">{cinematicCity.arabicName}</p>
                    )}
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="relative"
                    >
                      {/* Ambient Aura Effect */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-voyage-accent/30 blur-[60px] rounded-full scale-110"
                      />

                      <motion.img
                        src={cinematicCity.cinematicCharacter || "/assets/intro_caracter.gif"}
                        alt="Personnage"
                        animate={{
                          y: [0, -8, 0], // Subtle float
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-[345px] h-[345px] mx-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.4)] relative z-10"
                      />
                    </motion.div>

                    {/* Narrative Introduction Box */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className={cn("bg-black/20 backdrop-blur-2xl p-8 rounded-[40px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] mx-4 relative overflow-hidden group max-w-[550px]", language === 'ar' ? "text-right" : "text-left")}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {/* Decorative elements */}
                      <div className="absolute -top-24 -left-24 w-48 h-48 bg-voyage-accent/10 blur-[60px] rounded-full transition-all duration-700" />

                      <div className="flex flex-col items-center gap-2 mb-5">
                        <div className="h-1 w-12 bg-voyage-accent/40 rounded-full" />
                        <p className={cn("text-voyage-accent font-black text-[10px] uppercase tracking-[0.5em] opacity-90", language === 'ar' && "arabic-font text-[12px] tracking-normal")}>
                          {language === 'ar' ? "مرشد المغامرة" : "Guide de l'aventure"}
                        </p>
                      </div>

                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 1 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.015 }
                          }
                        }}
                        className={cn("text-white/95 text-[19px] font-medium leading-[1.8] italic font-serif", language === 'ar' && "arabic-font text-[21px] text-right font-medium not-italic")}
                      >
                        {(cinematicCity.cinematicIntro || '').split('').map((char, index) => (
                          <motion.span
                            key={index}
                            variants={{
                              hidden: { opacity: 0, filter: 'blur(4px)' },
                              visible: { opacity: 1, filter: 'blur(0px)' }
                            }}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      playSound('click');
                      const c = cinematicCity; setCinematicCity(null); onSelectCity(c);
                    }}
                    className={cn("flex items-center justify-center gap-3 text-white text-[17px] py-4 px-9 rounded-2xl font-black shadow-xl hover:brightness-110 active:scale-95 transition-all w-full", language === 'ar' && "arabic-font")}
                    style={{
                      background: `linear-gradient(135deg, ${getCityTheme(cinematicCity).colorLight || getCityTheme(cinematicCity).color}, ${getCityTheme(cinematicCity).colorDark || getCityTheme(cinematicCity).color})`,
                      boxShadow: `0 8px 25px ${getCityTheme(cinematicCity).color}50`,
                    }}
                  >
                    {language === 'ar' ? "🚀 ابدأ المغامرة" : "🚀 Commencer l'Aventure"}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ── Corps principal ──────────────────────────────────────────────── */}
      <main className="grow overflow-y-auto relative pt-4 pb-0 scrollbar-hide" ref={scrollContainerRef} dir={language === 'ar' ? 'rtl' : 'ltr'}>

        {/* ── SVG Path + Nœuds ────────────────────────────────────────────── */}
        <div className="relative max-w-sm mx-auto px-4">

          {/* Chemin SVG entre les villes */}
          <svg
            className="absolute inset-0 w-full pointer-events-none"
            style={{ height: `${cities.length * 300}px` }}
            viewBox={`0 0 320 ${cities.length * 300}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 1. Chemin d'arrière-plan (Complet, non-atteint) - Sable/Bronze clair */}
            <path
              d={buildPath(cities, 320)}
              fill="none"
              stroke="var(--color-voyage-secondary-light)"
              strokeWidth="16"
              strokeOpacity="0.2"
              strokeLinecap="round"
            />

            {/* 2. Chemin actif / complété - Or riche */}
            {activeCityIndex >= 0 && (
              <path
                d={buildPath(cities, 320, activeCityIndex)}
                fill="none"
                stroke="var(--color-voyage-accent)"
                strokeWidth="16"
                strokeOpacity="0.5"
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 4px var(--color-voyage-accent))'
                }}
              />
            )}

            {/* 3. Ligne fine interne pulsante pour l'effet de flux */}
            {activeCityIndex >= 0 && (
              <path
                d={buildPath(cities, 320, activeCityIndex)}
                fill="none"
                stroke="var(--color-voyage-accent-light)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="20 40"
                style={{ opacity: 0.4 }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="120"
                  to="0"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </path>
            )}
          </svg>

          {/* Nœuds des villes */}
          <div
            className="relative z-10 flex flex-col-reverse items-center gap-0 pt-8 pb-0"
            style={{ gap: 0 }}
          >
            {cities.map((city, index) => (
              <div
                key={city.id}
                style={{ marginBottom: index < cities.length - 1 ? '220px' : 0 }}
                ref={city.status === 'active' ? activeCityRef : null}
              >
                <CityNode
                  city={city}
                  profile={profile}
                  onSelect={() => handleShowCitySheet(city)}
                  isSelected={selectedCityId === city.id}
                  delay={index * 0.12}
                  index={index}
                  isScrollTarget={city.status === 'active'}
                  scrollDone={scrollDone}
                  isLastCity={index === cities.length - 1}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Flèche flottante pour revenir à la ville active ────────────── */}
        <AnimatePresence>
          {!isActiveCityInView && scrollDone && (
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound('whoosh');
                activeCityRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }}
              className="fixed bottom-52 left-1/2 -translate-x-1/2 z-50 p-3 rounded-full shadow-lg border-2 bg-white/95 backdrop-blur-sm border-voyage-accent/60 hover:bg-white transition-all group"
            >
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown size={24} className="text-voyage-accent group-hover:text-voyage-accent-dark transition-colors" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Bottom Sheet ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {displayCity && (
            <motion.div
              key={`backdrop-${displayCity.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-end justify-center p-4 bg-[#4E2510]/30 backdrop-blur-sm"
              onClick={() => setSelectedCityId(null)}
            >
              <motion.div
                key={displayCity.id}
                initial={{ y: 320, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 28 } }}
                exit={{ y: 320, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-lg mb-20"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div
                  className="rounded-[2.5rem] shadow-2xl relative overflow-hidden backdrop-blur-3xl border border-white/40 flex flex-col"
                  style={{
                    background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 240, 230, 0.9) 100%)',
                    boxShadow: `0 30px 60px -15px ${displayCityTheme.color}40`,
                  }}
                >
                  {/* City Illustration / Banner */}
                  <div className="h-50 w-full relative overflow-hidden">
                    <img
                      src={optimizeSupabaseUrl(displayCity.image || 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/fallback-city.jpg', 800, 80)}
                      alt={displayCity.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />

                    {/* Floating Icon over Banner - Now using the CityOrb for consistency */}
                    <div className={cn("absolute bottom-[-9px] z-10 scale-[0.85]", language === 'ar' ? "right-8 origin-bottom-right" : "left-8 origin-bottom-left")}>
                      <CityOrb
                        city={displayCity}
                        isSelected={false}
                        size="w-[92px] h-[92px]"
                      />
                    </div>

                    {/* Close button */}
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedCityId(null);
                      }}
                      className={cn("absolute top-4 p-2 bg-black/20 backdrop-blur-md hover:bg-black/40 rounded-xl transition-all z-50 border border-white/20 group", language === 'ar' ? "left-4" : "right-4")}
                    >
                      <X size={20} className="text-white group-hover:rotate-90 transition-transform" />
                    </button>
                  </div>

                  <div className="p-8 pt-10">
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[8.5px] font-black text-voyage-accent uppercase tracking-[0.2em]", language === 'ar' && "arabic-font text-[10.5px] tracking-normal")}>
                            {language === 'ar' ? displayCity.arabicHeadline || displayCity.arabicName || displayCity.headline || displayCity.focus : displayCity.headline || displayCity.focus}
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-voyage-accent animate-pulse" />
                          {displayCity.acteTitle && (
                            <>
                              <div className="w-px h-2 bg-voyage-accent/30" />
                              <span className="text-[9.5px] font-bold text-[#7B3F1A]/60 italic">{displayCity.acteTitle}</span>
                            </>
                          )}
                        </div>
                        <h2 className={cn("text-[28px] font-black text-[#4E2510] tracking-tight leading-none", language === 'ar' && "arabic-font text-[28px] leading-normal")}>
                          {language === 'ar' ? displayCity.arabicName || displayCity.name : displayCity.name}
                        </h2>
                        <p className={cn("text-[17px] font-black text-[#7B3F1A] opacity-70", language === 'ar' ? "font-sans text-[13px] tracking-wide" : "arabic-font")}>
                          {language === 'ar' ? displayCity.name : displayCity.arabicName}
                        </p>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="bg-white/50 border border-[#E5D5B8] px-3 py-1.5 rounded-2xl shadow-sm text-right">
                          <span className={cn("block text-[7.5px] font-black text-[#7B3F1A]/50 uppercase tracking-widest", language === 'ar' && "arabic-font text-[10.5px] tracking-normal")}>
                            {language === 'ar' ? "التقدم" : "Progression"}
                          </span>
                          <span className="font-black text-[17px] text-voyage-accent">
                            {Math.round((displayCity.stepNum / displayCity.totalSteps) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-[#7B3F1A]/5 rounded-[24px] p-5 border border-[#7B3F1A]/10 mb-6">
                      <p className={cn("text-[#4E2510]/90 text-[13px] leading-relaxed font-medium italic", language === 'ar' && "arabic-font text-[15px] not-italic text-right")}>
                        "{language === 'ar' ? displayCity.arabicDescription || displayCity.description : displayCity.description || displayCity.arabicDescription}"
                      </p>
                    </div>

                    {/* Missions List Toggle */}
                    <div className="mb-8">
                      <button
                        onClick={() => { playSound('click'); setIsMissionsExpanded(!isMissionsExpanded); }}
                        className="w-full flex justify-between items-center px-4 py-3 bg-[#7B3F1A]/5 hover:bg-[#7B3F1A]/10 border border-[#7B3F1A]/10 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-xl transition-colors",
                            isMissionsExpanded ? "bg-voyage-accent text-white" : "bg-white text-voyage-accent"
                          )}>
                            <Sparkles size={16} />
                          </div>
                          <div className="text-left">
                            <h4 className={cn("text-[9.5px] font-black text-[#7B3F1A] uppercase tracking-[0.2em] leading-none mb-1", language === 'ar' && "arabic-font text-[12px] tracking-normal")}>
                              {language === 'ar' ? "المهمات المتاحة" : displayCity.missionsTitle || "Missions Disponibles"}
                            </h4>
                            <p className={cn("text-[8.5px] font-bold text-[#7B3F1A]/40 uppercase tracking-widest", language === 'ar' && "arabic-font text-[10.5px] tracking-normal")}>
                              {language === 'ar' ? `${displayCity.stepNum}/${displayCity.totalSteps} مكتملة` : `${displayCity.stepNum}/${displayCity.totalSteps} complétées`}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isMissionsExpanded ? 180 : 0 }}
                          className="text-[#7B3F1A]/30 group-hover:text-[#7B3F1A]"
                        >
                          <ArrowDown size={20} />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isMissionsExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 space-y-2 max-h-[35vh] overflow-y-auto pr-1 scrollbar-hide">
                              <MissionsList
                                city={displayCity}
                                completedMissions={completedMissions}
                                cityTheme={displayCityTheme}
                                onSelectMission={(mission) => handleSelectMission(displayCity, mission)}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* CTA Button */}
                    <GameButton
                      variant="primary"
                      size="lg"
                      onClick={() => handleLaunchAdventure(displayCity)}
                      className="w-full mt-2"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                      <span className={cn("font-black uppercase tracking-widest relative z-10", language === 'ar' && "arabic-font tracking-normal")}>
                        {displayCity.status === 'completed'
                          ? (language === 'ar' ? 'تحدي مجدداً' : 'Relever de nouveau')
                          : (language === 'ar' ? 'ابدأ المغامرة' : "Lancer l'aventure")}
                      </span>
                      <ChevronRight size={22} strokeWidth={3} className={cn("relative z-10 transition-transform", language === 'ar' && "rotate-180")} />
                    </GameButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ── Calcul du chemin SVG Dynamique ───────────────────────────────────────────
function buildPath(cities: City[], width: number, limitIndex?: number): string {
  const cx = width / 2;
  const sorted = [...cities].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const stepY = 300;
  const startY = (sorted.length - 1) * stepY + 150; // Bottom city y

  const sliced = limitIndex !== undefined ? sorted.slice(0, limitIndex + 1) : sorted;

  let d = '';
  sorted.forEach((city, idx) => {
    const x = cx + ((city.map_x || 0) * width) / 100;
    // Calculate y based on index to match flex-col-reverse
    // Cities[0] is at the bottom, so its y is largest.
    const y = startY - (idx * stepY);

    if (idx === 0) {
      d += `M ${x} ${y}`;
    } else {
      const prev = sorted[idx - 1];
      const prevX = cx + ((prev.map_x || 0) * width) / 100;
      const prevY = startY - ((idx - 1) * stepY);

      const midY = (prevY + y) / 2;
      // Wavy Bezier curve effect
      const waveOffset = idx % 2 === 0 ? 45 : -45;
      d += ` C ${prevX + waveOffset} ${midY}, ${x - waveOffset} ${midY}, ${x} ${y}`;
    }
  });
  return d;
}

// ── Composant Orb de ville (Réutilisable) ─────────────────────────────────────
const CityOrb: React.FC<{
  city: City;
  isSelected?: boolean;
  size?: string;
  onClick?: () => void;
  isLocked?: boolean;
  isLastCity?: boolean;
}> = ({ city, isSelected = false, size = "w-[92px] h-[92px]", onClick, isLocked: manualIsLocked, isLastCity = false }) => {
  const isLocked = manualIsLocked ?? (city.status === 'locked');
  const isCompleted = city.status === 'completed';
  const isActive = city.status === 'active';
  const progress = (isCompleted ? city.totalSteps : city.stepNum) / city.totalSteps;

  return (
    <div className="relative group" onClick={onClick}>
      {/* Premium Rotating Starburst Aura & Pulsing Glow for Last City (Grand Prize) */}
      {isLastCity && (
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          {/* Pulsing radial sunburst glow */}
          <motion.div
            animate={{
              scale: [1.3, 1.5, 1.3],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.65) 0%, rgba(245,158,11,0.2) 55%, rgba(0,0,0,0) 100%)',
            }}
            className="absolute w-full h-full rounded-full blur-md scale-[1.5]"
          />

          {/* Rotating dashed ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-full h-full rounded-full border-4 border-dashed border-amber-400/40 scale-[1.38]"
          />

          {/* Rotating dashed ring 2 (reverse speed) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-full h-full rounded-full border-2 border-dashed border-yellow-500/30 scale-[1.48]"
          />

          {/* Sparkly particle emitters */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 1, 0],
                y: [0, (i % 2 === 0 ? -28 : 28), 0],
                x: [0, (i < 2 ? -28 : 28), 0],
              }}
              transition={{
                duration: 2.2 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full blur-[0.5px]"
            />
          ))}
        </div>
      )}
      {/* Concentric Sonar Wave Ripples for Active City Node */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          {/* Wave 1 */}
          <motion.div
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.3, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute w-full h-full rounded-full border-2 border-voyage-accent/40 bg-voyage-accent/5"
          />
          {/* Wave 2 */}
          <motion.div
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.3, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1,
            }}
            className="absolute w-full h-full rounded-full border-2 border-voyage-accent/30 bg-voyage-accent/5"
          />
          {/* Wave 3 */}
          <motion.div
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.3, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: 2,
            }}
            className="absolute w-full h-full rounded-full border-2 border-voyage-accent/20 bg-voyage-accent/5"
          />
        </div>
      )}

      {/* Gentle Concentric Ripple for Completed City Nodes */}
      {isCompleted && (
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <motion.div
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute w-full h-full rounded-full border border-emerald-500/20 bg-emerald-500/2"
          />
        </div>
      )}

      <motion.div
        whileHover={onClick && !isLocked ? { scale: 1.05 } : {}}
        whileTap={onClick && !isLocked ? { scale: 0.95 } : {}}
        className={cn(
          "relative rounded-full transition-all duration-100",
          size
        )}
      >
        {/* 3D Base (Shadow Layer) */}
        <div
          className={cn(
            "absolute inset-0 rounded-full translate-y-[6px]",
            isLocked 
              ? "bg-slate-350" 
              : isCompleted 
                ? "bg-emerald-700" 
                : "bg-voyage-accent-dark"
          )}
        />

        {/* 3D Face (Top Layer) */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-100",
            "flex items-center justify-center border-b-4",
            isLocked 
              ? "bg-slate-200 border-slate-300 text-slate-400 opacity-60" 
              : isCompleted 
                ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/20" 
                : "bg-voyage-accent border-voyage-accent-dark text-white shadow-voyage-accent/20",
            "active:translate-y-[6px] active:border-b-0 -translate-y-0"
          )}
          style={isSelected && !isLocked ? { borderColor: 'var(--color-voyage-accent-light)' } : {}}
        >
          {/* Inner Content */}
          <div className="relative z-10 flex items-center justify-center w-full h-full p-2.5">
            {city.iconName ? (
              city.iconName.startsWith('http') ? (
                <img
                  src={resolveAssetUrl(city.iconName, '')}
                  alt={city.name}
                  className={cn(
                    "w-full h-full object-contain transition-transform duration-500",
                    isLocked ? "grayscale opacity-40" : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                  )}
                />
              ) : (
                resolveCityIcon(city, (city.iconSize || 36), isLocked ? "grayscale opacity-40 text-slate-400" : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]")
              )
            ) : (
              <div className="text-white/80">
                <MapPin size={32} strokeWidth={2.8} />
              </div>
            )}
          </div>

          {/* SVG Progress Corona surrounding the button */}
          {!isLocked && (
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none scale-105">
              <circle
                cx="50%" cy="50%" r="42"
                fill="none"
                stroke={isCompleted ? "#047857" : "var(--color-voyage-accent-dark)"}
                strokeWidth="4"
                strokeOpacity="0.15"
              />
              <circle
                cx="50%" cy="50%" r="42"
                fill="none"
                stroke={isCompleted ? "#34D399" : "var(--color-voyage-accent-light)"}
                strokeWidth="4"
                strokeDasharray={264}
                strokeDashoffset={264 * (1 - progress)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
          )}

          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 rounded-full">
              <Lock size={20} strokeWidth={2.8} className="text-slate-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />
            </div>
          )}
        </div>
      </motion.div>

      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-20"
        >
          <Check size={14} strokeWidth={3} className="text-white font-bold" />
        </motion.div>
      )}
    </div>
  );
};

// ── Composant Nœud de ville ────────────────────────────────────────────────────
const CityNode: React.FC<{
  city: City;
  profile?: any;
  onSelect: () => void;
  isSelected: boolean;
  delay: number;
  index: number;
  isScrollTarget?: boolean;
  scrollDone?: boolean;
  isLastCity?: boolean;
}> = ({ city, profile, onSelect, isSelected, delay, index, isScrollTarget = false, scrollDone = false, isLastCity = false }) => {
  const isLocked = city.status === 'locked';
  const { language } = useSettings();
  const completedCount = city.status === 'completed' ? city.totalSteps : Math.max(0, city.stepNum - 1);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="flex flex-col items-center relative"
    >
      {/* Floating Player Avatar on top of active CityOrb */}
      {city.status === 'active' && (
        <div className="absolute -top-[90px] z-40 flex flex-col items-center pointer-events-none">
          {/* Gentle Bouncing Avatar Container */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{ 
              duration: 2.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative flex flex-col items-center"
          >
            {/* Crown on top of active last city avatar */}
            {isLastCity && (
              <motion.div
                animate={{ 
                  rotate: [-5, 5, -5],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -top-[22px] z-50 text-[26px] drop-shadow-[0_3px_5px_rgba(0,0,0,0.25)] pointer-events-none select-none"
              >
                👑
              </motion.div>
            )}

            {/* Avatar Frame (Circle with white border and thick shadow) */}
            <div className="w-[52px] h-[52px] rounded-full border-4 border-white bg-voyage-sand shadow-[0_6px_16px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center relative">
              <img
                src={optimizeSupabaseUrl(profile?.avatar_url || DEFAULT_AVATAR_URL, 128, 80)}
                alt="Player Avatar"
                className="w-full h-full object-cover"
              />
              {/* Sparkles floating on top */}
              <div className="absolute top-0 right-0 bg-voyage-accent rounded-full p-0.5 border border-white shadow-xs">
                <Sparkles size={8} className="text-white fill-white" />
              </div>
            </div>

            {/* Moroccan/Duolingo speech bubble indicating "T'es ici !" */}
            <div className="mt-1 bg-voyage-accent text-white font-black text-[7.5px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md border border-white/20 whitespace-nowrap">
              {language === 'ar' ? "أنت هنا" : "Tu es ici !"}
            </div>

            {/* Down pointing pointer triangle */}
            <div className="w-2.5 h-2.5 bg-voyage-accent rotate-45 -mt-1 shadow-md" />
          </motion.div>

          {/* Bouncing Shadow at the ground level (pulsating in scale & opacity in opposition to height) */}
          <motion.div
            animate={{
              scale: [1, 0.7, 1],
              opacity: [0.35, 0.15, 0.35]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-8 h-2 bg-black/40 rounded-full blur-[2px] -mt-1"
          />
        </div>
      )}

      {/* Floating spectacular golden trophy above the last city node when locked/completed */}
      {isLastCity && city.status !== 'active' && (
        <div className="absolute -top-[82px] z-40 flex flex-col items-center pointer-events-none">
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative flex flex-col items-center animate-fade-in"
          >
            {/* Glowing gold back aura */}
            <div className="absolute inset-0 -m-3 bg-amber-400/25 blur-xl rounded-full animate-pulse pointer-events-none" />
            
            {/* Trophy Icon Badge */}
            <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-600 border-4 border-white shadow-[0_8px_20px_rgba(217,119,6,0.5)] flex items-center justify-center relative">
              <Trophy size={28} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] stroke-[2.5]" />
              
              {/* Little sparkles on the trophy badge */}
              <div className="absolute -top-1 -right-1 bg-yellow-300 rounded-full p-0.5 border border-white shadow-xs">
                <Sparkles size={8} className="text-amber-800 fill-amber-800 animate-pulse" />
              </div>
            </div>

            {/* Bilingual Ribbon Label */}
            <div className="mt-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-white font-black text-[9.5px] uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_4px_10px_rgba(217,119,6,0.3)] border-2 border-white whitespace-nowrap flex items-center gap-1">
              {language === 'ar' ? "الجائزة الكبرى 🏆" : "LE GRAND PRIX 🏆"}
            </div>

            {/* Small subtle pointing glow triangle */}
            <div className="w-2.5 h-2.5 bg-amber-500 rotate-45 -mt-1 shadow-md border-r border-b border-white/20" />
          </motion.div>
        </div>
      )}

      <CityOrb
        city={city}
        isSelected={isSelected}
        onClick={onSelect}
        isLastCity={isLastCity}
      />

      {/* City Labels */}
      <div className="mt-4 text-center flex flex-col items-center">
        <h3 className={cn(
          "text-[13px] font-black tracking-tight leading-none mb-1 uppercase",
          isLocked ? "text-slate-500" : "text-[#5A2207]",
          language === 'ar' && "arabic-font text-[15px]"
        )}>
          {language === 'ar' ? city.arabicName || city.name : city.name}
        </h3>
        <p className={cn(
          isLocked ? "text-slate-400" : "text-voyage-accent",
          language === 'ar' ? "font-sans text-[10px] uppercase tracking-wider opacity-70" : "arabic-font text-[11px] font-bold"
        )}>
          {language === 'ar' ? city.name : city.arabicName}
        </p>

        {/* Mission Progress Indicator */}
        <div className="mt-2 flex items-center justify-center">
          <span className={cn(
            "text-[9px] font-black px-2 py-0.5 rounded-full border shadow-xs transition-all tracking-wider select-none",
            isLocked 
              ? "bg-slate-100 text-slate-400 border-slate-200/60" 
              : city.status === 'completed'
                ? "bg-emerald-50 text-emerald-600 border-emerald-200/80 shadow-emerald-100/30"
                : "bg-voyage-accent/10 text-voyage-accent border-voyage-accent/20 shadow-amber-100/30"
          )}>
            {completedCount}/{city.totalSteps}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Liste de missions ─────────────────────────────────────────────────────────
const MissionsList: React.FC<{
  city: City;
  completedMissions: string[];
  cityTheme?: any;
  onSelectMission?: (mission: any) => void;
}> = ({
  city, completedMissions, cityTheme, onSelectMission
}) => {
    const { missions, loading } = useSupabaseMissions(city.id, completedMissions);
    const { playSound, playVoice } = useAudio();
    const { language } = useSettings();

    if (loading) return (
      <div className="flex flex-col items-center justify-center py-10 gap-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Loader2 className="animate-spin text-voyage-accent" size={24} />
        <span className={cn("text-[9.5px] font-black text-[#7B3F1A]/40 uppercase tracking-widest", language === 'ar' && "arabic-font text-[12px] tracking-normal")}>
          {language === 'ar' ? "جاري تحميل التحديات..." : "Chargement des défis..."}
        </span>
      </div>
    );

    return (
      <div className="space-y-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {missions.length > 0 ? missions.map((mission, idx) => {
          const isDone = mission.status === 'completed';
          const isLocked = mission.status === 'locked';
          const themeColor = cityTheme?.color || '#7B3F1A';

          return (
            <motion.button
              key={mission.id}
              whileHover={{ scale: 1.01, x: language === 'ar' ? -4 : 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMission?.(mission)}
              className={cn(
                'w-full p-4 rounded-[20px] border flex items-center justify-between transition-all backdrop-blur-md group relative overflow-hidden',
                language === 'ar' ? 'text-right' : 'text-left',
                isDone ? 'bg-white shadow-sm' : 'bg-white/40 border-white/60 hover:bg-white/60 shadow-none'
              )}
              style={isDone ? {
                borderColor: `${themeColor}40`
              } : {}}
            >
              {/* Mission content */}
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all shadow-inner"
                  style={{
                    backgroundColor: isDone ? themeColor : `${themeColor}15`,
                    color: isDone ? 'white' : themeColor,
                    boxShadow: isDone ? `0 4px 12px ${themeColor}40` : 'none'
                  }}
                >
                  {isDone ? <Check size={18} strokeWidth={3} /> : idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className={cn('text-[13px] font-black', isDone ? 'text-[#7B3F1A]' : 'text-[#4E2510]', language === 'ar' && "arabic-font text-[15px]")}>
                      {language === 'ar' ? mission.title_ar || mission.title_fr : mission.title_fr}
                    </p>
                    {mission.is_bonus && (
                      <Sparkles size={12} className="text-voyage-accent" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={cn("text-[8.5px] font-black text-voyage-accent uppercase tracking-wider flex items-center gap-1", language === 'ar' && "arabic-font text-[10.5px] tracking-normal")}>
                      <Star size={10} className="fill-voyage-accent text-voyage-accent" /> {language === 'ar' ? `+${mission.xp_reward} نقطة` : `+${mission.xp_reward} XP`}
                    </span>
                    <span className={cn("text-[8.5px] font-bold text-[#7B3F1A]/40 uppercase tracking-widest", language === 'ar' && "arabic-font text-[10.5px] tracking-normal")}>
                      {language === 'ar' ? "٥ دقائق" : (mission.estimated_time || '5 min')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2 relative z-10">
                {isDone ? (
                  <div className="flex gap-0.5 bg-voyage-accent/10 p-1 rounded-lg">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} size={10} className="text-voyage-accent fill-voyage-accent star-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                ) : (
                  <ChevronRight size={18} className={cn("text-[#7B3F1A]/20 group-hover:text-[#7B3F1A] transition-all", language === 'ar' && "rotate-180")} />
                )}
              </div>

              {/* Progress background for in-progress missions? (Future use) */}
            </motion.button>
          );
        }) : (
          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-[#E5D5B8] rounded-[30px] opacity-40">
            <MapPin size={32} className="text-[#7B3F1A] mb-2" />
            <p className={cn("text-[11px] font-black text-[#7B3F1A] uppercase tracking-widest", language === 'ar' && "arabic-font")}>
              {language === 'ar' ? 'في انتظار المغامرة...' : "En attente d'expédition..."}
            </p>
          </div>
        )}
      </div>
    );
  };
