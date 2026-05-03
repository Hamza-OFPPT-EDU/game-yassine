/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Check, ChevronRight, X, Loader2, Lock,
  Star, Sparkles, Navigation2, ArrowDown
} from 'lucide-react';
import { type City } from '../types';
import { cn } from '../lib/utils';
import TopAppBar from '../components/TopAppBar';
import { useAudio } from '../hooks/useAudio';
import { useSupabaseCities, useSupabaseMissions } from '../hooks/useSupabase';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { getCityTheme, resolveCityIcon } from '../lib/city-theme';

// ── MapJourneyScreen ─────────────────────────────────────────────────────────

interface MapJourneyScreenProps {
  stats: { xp: number; stars: number; level: number };
  completedCities: string[];
  completedMissions: string[];
  onSelectCity: (city: City) => void;
}

export default function MapJourneyScreen({
  stats, completedCities, completedMissions, onSelectCity
}: MapJourneyScreenProps) {
  const { playSound } = useAudio();
  const { cities, loading } = useSupabaseCities(completedCities, completedMissions);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [cinematicCity, setCinematicCity] = useState<City | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

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
    setIsDescriptionExpanded(true);
  };
  const handleLaunchAdventure = (city: City) => {
    playSound('click');
    if (city.cinematicIntro && city.status !== 'completed') {
      setCinematicCity(city);
    } else {
      onSelectCity(city);
    }
  };

  // Hook pour jouer la voix de Rabat automatiquement
  useEffect(() => {
    if (cinematicCity && cinematicCity.name === 'Rabat') {
      const audio = new Audio('https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/rabat_intro_voice.mp3');
      audio.play().catch(err => console.log('Audio playback prevented:', err));
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [cinematicCity]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full w-full map-bg flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-[6px] border-[#7B3F1A]/20 border-t-[#D4A43E]"
        />
        <p className="font-headline font-black text-[#7B3F1A] uppercase tracking-widest text-xs opacity-70">
          Préparation du voyage...
        </p>
      </div>
    );
  }

  const activeCity = (cities?.length > 0) ? (cities.find(c => c.status === 'active') || cities[0]) : null;
  const displayCity = selectedCityId ? cities.find(c => c.id === selectedCityId) : null;
  const displayCityTheme = getCityTheme(displayCity ?? null);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden map-bg">
      <TopAppBar stats={stats} />

      {/* ── Écran cinématique ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {cinematicCity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{ background: 'linear-gradient(160deg, #4E2510 0%, #7B3F1A 50%, #A0572B 100%)' }}
          >
            <button 
              onClick={() => setCinematicCity(null)}
              className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all z-20 backdrop-blur-md border border-white/20 shadow-xl"
            >
              <X size={24} strokeWidth={3} />
            </button>

            {/* Étoiles de fond (fixes) */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-[#D4A43E] star-twinkle"
                style={{
                  top: `${8 + Math.random() * 84}%`,
                  left: `${5 + Math.random() * 90}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${10 + Math.random() * 14}px`,
                }}
              >★</motion.div>
            ))}

            {/* Contenu scrollable */}
            <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
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
                    {resolveCityIcon(cinematicCity, 60, 'text-[#D4A43E]')}
                  </motion.div>

                  <div className="space-y-2.5">
                    <p className="text-[#D4A43E] font-black uppercase tracking-[0.3em] text-[13px]">
                      Le Voyage des Compétences
                    </p>
                    <h1 className="text-[43px] font-headline font-black text-white tracking-tight">
                      {cinematicCity.name}
                    </h1>
                    <p className="arabic-font text-[#C9A96E] text-lg">{cinematicCity.arabicName}</p>
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
                        src={cinematicCity.cinematicCharacter || "https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/intro_caracter.gif"}
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
                      className="bg-black/20 backdrop-blur-2xl p-8 rounded-[40px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] mx-4 relative overflow-hidden group max-w-[550px]"
                    >
                      {/* Decorative elements */}
                      <div className="absolute -top-24 -left-24 w-48 h-48 bg-voyage-accent/10 blur-[60px] rounded-full transition-all duration-700" />
                      
                      <div className="flex flex-col items-center gap-2 mb-5">
                        <div className="h-1 w-12 bg-voyage-accent/40 rounded-full" />
                        <p className="text-voyage-accent font-black text-[11px] uppercase tracking-[0.5em] opacity-90">Guide de l'aventure</p>
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
                        className="text-white/95 text-xl font-medium leading-[1.8] italic font-serif"
                      >
                        {cinematicCity.cinematicIntro.split('').map((char, index) => (
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
                    className="flex items-center justify-center gap-3 text-white text-lg py-4 px-9 rounded-2xl font-black shadow-xl hover:brightness-110 active:scale-95 transition-all w-full"
                    style={{
                      background: `linear-gradient(135deg, ${getCityTheme(cinematicCity).colorLight || getCityTheme(cinematicCity).color}, ${getCityTheme(cinematicCity).colorDark || getCityTheme(cinematicCity).color})`,
                      boxShadow: `0 8px 25px ${getCityTheme(cinematicCity).color}50`,
                    }}
                  >
                    🚀 Commencer l'Aventure
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Corps principal ──────────────────────────────────────────────── */}
      <main className="flex-grow overflow-y-auto relative pt-6 pb-48 scrollbar-hide" ref={scrollContainerRef}>

        {/* Titre décoratif */}
        <div className="text-center mb-2 pt-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#C9A96E]/40 rounded-full px-5 py-2 shadow-sm"
          >
            <Navigation2 size={14} className="text-[#7B3F1A]" />
            <span className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest">
              Carte du Voyage
            </span>
            <span className="arabic-font text-[10px] text-[#A0572B] font-black">خريطة الرحلة</span>
          </motion.div>
        </div>

        {/* ── SVG Path + Nœuds ────────────────────────────────────────────── */}
        <div className="relative max-w-sm mx-auto px-4">

          {/* Chemin SVG entre les villes */}
          <svg
            className="absolute inset-0 w-full pointer-events-none"
            style={{ height: `${cities.length * 220}px` }}
            viewBox={`0 0 320 ${cities.length * 220}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Ombre du chemin */}
            <path
              d={buildPath(cities.length, 320)}
              fill="none"
              stroke="#7B3F1A"
              strokeWidth="6"
              strokeOpacity="0.08"
              strokeLinecap="round"
            />
            {/* Chemin pointillé animé */}
            <path
              d={buildPath(cities.length, 320)}
              fill="none"
              stroke="#C9A96E"
              strokeWidth="3"
              strokeOpacity="0.5"
              strokeLinecap="round"
              strokeDasharray="10 18"
              className="path-dashed"
            />
            {/* Chemin de base */}
            <path
              d={buildPath(cities.length, 320)}
              fill="none"
              stroke="#7B3F1A"
              strokeWidth="2"
              strokeOpacity="0.15"
              strokeLinecap="round"
            />
          </svg>

          {/* Nœuds des villes */}
          <div
            className="relative z-10 flex flex-col-reverse items-center gap-0 py-8"
            style={{ gap: 0 }}
          >
            {cities.map((city, index) => (
              <div
                key={city.id}
                style={{ marginBottom: index < cities.length - 1 ? '140px' : 0 }}
                ref={city.status === 'active' ? activeCityRef : null}
              >
                <CityNode
                  city={city}
                  onSelect={() => handleShowCitySheet(city)}
                  isSelected={selectedCityId === city.id}
                  delay={index * 0.12}
                  index={index}
                  isScrollTarget={city.status === 'active'}
                  scrollDone={scrollDone}
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
              className="fixed bottom-52 left-1/2 -translate-x-1/2 z-50 p-3 rounded-full shadow-lg border-2 bg-white/95 backdrop-blur-sm border-[#D4A43E]/60 hover:bg-white transition-all group"
            >
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowDown size={24} className="text-[#D4A43E] group-hover:text-[#A87D28] transition-colors" />
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
              >
                <div
                  className="rounded-[2rem] p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl border border-white/40"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    boxShadow: `0 25px 50px -12px ${displayCityTheme.color}40`,
                  }}
                >
                  {/* Décoration coin */}
                  <div className="absolute top-0 right-0 w-28 h-28 opacity-10 pointer-events-none flex items-start justify-end pr-4 pt-4">
                    {resolveCityIcon(displayCity, 80, 'text-voyage-primary')}
                  </div>

                  {/* Fermer */}
                  <button
                    onClick={() => {
                      playSound('click');
                      setSelectedCityId(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/30 backdrop-blur-md hover:bg-white/50 rounded-xl transition-colors z-50 border border-white/40"
                  >
                    <X size={18} style={{ color: displayCityTheme.color }} />
                  </button>

                  {/* En-tête */}
                  <div className="flex items-start gap-4 mb-4 pr-10">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white/40 shadow-md"
                      style={{ background: displayCityTheme.bgGradient }}
                    >
                      {resolveCityIcon(displayCity, 52, 'text-white')}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {displayCity.status === 'locked' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/10 border border-black/10">
                            <Lock size={9} className="text-[#4E2510]" />
                            <span className="text-[9px] font-black text-[#4E2510] uppercase tracking-widest">Verrouillée</span>
                          </span>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: displayCityTheme.color }} />
                            <span className="text-[9px] font-black text-[#4E2510] uppercase tracking-widest opacity-70">
                              {displayCity.focus}
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="text-3xl font-headline font-black text-[#4E2510] tracking-tight leading-none">
                        {displayCity.name}
                      </h2>
                      <p className="arabic-font text-sm font-black text-[#4E2510]/80">
                        {displayCity.arabicName}
                      </p>
                    </div>
                    {/* Badge progression */}
                    <div
                      className="ml-auto shrink-0 px-3 py-2 rounded-2xl flex flex-col items-center backdrop-blur-md border border-white/40"
                      style={{
                        background: `rgba(255, 255, 255, 0.2)`,
                      }}
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: displayCityTheme.color }}>Progrès</span>
                      <span className="font-black text-xl leading-none mt-0.5" style={{ color: displayCityTheme.colorDark || displayCityTheme.color }}>
                        {Math.round((displayCity.stepNum / displayCity.totalSteps) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Description avec Toggle */}
                  <div className="mb-5">
                    <button
                      onClick={() => {
                        playSound('click');
                        setIsDescriptionExpanded(!isDescriptionExpanded);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all mb-2 group border border-white/30"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} style={{ color: displayCityTheme.color }} />
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: displayCityTheme.color }}>
                          {isDescriptionExpanded ? "Réduire la description" : "En savoir plus sur la ville"}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isDescriptionExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight size={14} strokeWidth={3} style={{ color: displayCityTheme.color }} className="group-hover:translate-x-0.5 transition-transform" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isDescriptionExpanded && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
                          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="text-[#4E2510]/80 text-sm leading-relaxed font-bold overflow-hidden p-2"
                        >
                          {displayCity.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-5 space-y-1">
                    <div className="flex justify-between text-[10px] font-black text-[#4E2510]/60 uppercase tracking-widest">
                      <span>Progression</span>
                      <span>{displayCity.stepNum}/{displayCity.totalSteps} missions</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden border border-white/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(displayCity.stepNum / displayCity.totalSteps) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${displayCityTheme.colorLight || displayCityTheme.color}, ${displayCityTheme.color})` }}
                      />
                    </div>
                  </div>

                  {/* Missions */}
                  <div className="mb-5">
                    <h4 className="text-[10px] font-black text-[#4E2510] uppercase tracking-widest opacity-50 mb-2">
                      Missions de la ville
                    </h4>
                    <div className={cn(
                      "space-y-2 overflow-y-auto pr-1 scrollbar-hide transition-all duration-300",
                      isDescriptionExpanded ? "max-h-[28vh]" : "max-h-[45vh]"
                    )}>
                      <MissionsList
                        cityId={displayCity.id}
                        completedMissions={completedMissions}
                        cityTheme={displayCityTheme}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: displayCity.status !== 'locked' ? 1.02 : 1 }}
                    whileTap={{ scale: displayCity.status !== 'locked' ? 0.98 : 1 }}
                    onClick={() => displayCity.status !== 'locked' && handleLaunchAdventure(displayCity)}
                    disabled={displayCity.status === 'locked'}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 text-base py-4 rounded-2xl font-black text-white shadow-lg transition-all",
                      displayCity.status === 'locked' ? "opacity-40 cursor-not-allowed" : "hover:brightness-110 active:scale-95"
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${displayCityTheme.colorLight || displayCityTheme.color}, ${displayCityTheme.colorDark || displayCityTheme.color})`,
                      boxShadow: `0 8px 25px ${displayCityTheme.color}50`,
                    }}
                  >
                    <span className="font-black uppercase tracking-tight">
                      {displayCity.status === 'locked'
                        ? '🔒 Ville verrouillée'
                        : displayCity.status === 'completed'
                          ? '✦ Relever de nouveau'
                          : "🚀 Continuer l'aventure"}
                    </span>
                    {displayCity.status !== 'locked' && <ChevronRight size={22} strokeWidth={3} />}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ── Calcul du chemin SVG en S ─────────────────────────────────────────────────
function buildPath(count: number, width: number): string {
  if (count < 2) return '';
  const cx = width / 2;
  const stepH = 220;
  const amp = 70;
  const totalH = count * stepH;

  let d = `M ${cx} ${totalH - 30}`;
  for (let i = count - 2; i >= 0; i--) {
    const y1 = totalH - (i + 1) * stepH + 30;
    const y0 = totalH - i * stepH - 30;
    const side = i % 2 === 0 ? 1 : -1;
    const cp1x = cx + side * amp;
    const cp2x = cx - side * amp;
    const midy = (y1 + y0) / 2;
    d += ` C ${cp1x} ${midy}, ${cp2x} ${midy}, ${cx} ${y0}`;
  }
  return d;
}

// ── Composant Nœud de ville ────────────────────────────────────────────────────
const CityNode: React.FC<{
  city: City;
  onSelect: () => void;
  isSelected: boolean;
  delay: number;
  index: number;
  isScrollTarget?: boolean;
  scrollDone?: boolean;
}> = ({ city, onSelect, isSelected, delay, isScrollTarget = false, scrollDone = false }) => {
  const isLocked = city.status === 'locked';
  const isCompleted = city.status === 'completed';
  const isActive = city.status === 'active';
  const cityTheme = getCityTheme(city);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.85 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: isSelected || (isScrollTarget && scrollDone) ? 1.15 : 1
      }}
      transition={{
        delay,
        scale: { type: 'spring', stiffness: 300, damping: 22 },
      }}
      className="flex flex-col items-center relative"
    >
      {/* Animation Focus - Aura brillante après scroll */}
      {isScrollTarget && scrollDone && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: [0.6, 0.2, 0.6], scale: [1.3, 1.5, 1.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 180,
              height: 180,
              top: -42,
              left: -42,
              background: `radial-gradient(circle, ${cityTheme.color} 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="absolute rounded-full pointer-events-none border-2"
            style={{
              width: 150,
              height: 150,
              top: -27,
              left: -27,
              borderColor: `${cityTheme.color}88`,
            }}
          />
        </>
      )}
      {/* Aura extérieure pulsante */}
      {!isLocked && (
        <>
          <div
            className='absolute rounded-full city-aura pointer-events-none'
            style={{
              width: 140,
              height: 140,
              top: -22,
              left: -22,
              backgroundColor: `${cityTheme.color}40`
            }}
          />
          {isActive && (
            <div
              className="absolute rounded-full pointer-events-none border-2 border-dashed ring-spin"
              style={{ width: 128, height: 128, top: -16, left: -16, borderColor: `${cityTheme.color}66` }}
            />
          )}
        </>
      )}

      {/* Bouton principal */}
      <button
        onClick={onSelect}
        className={cn(
          'relative w-24 h-24 rounded-full flex items-center justify-center',
          'border-[6px] shadow-2xl transition-all duration-300',
          'focus:outline-none',
          isLocked && 'opacity-50 cursor-pointer',
          isSelected && 'ring-4 scale-110',
        )}
        style={{
          background: isLocked
            ? 'linear-gradient(135deg, #C9B99A, #D4C5B0)'
            : isCompleted
              ? `linear-gradient(135deg, ${cityTheme.color}CC, ${cityTheme.color})`
              : `linear-gradient(135deg, ${cityTheme.colorLight || cityTheme.color}CC, ${cityTheme.color})`,
          borderColor: isLocked ? '#B5A48A' : cityTheme.colorDark || cityTheme.color,
          ...(isSelected ? { boxShadow: `0 0 0 4px ${cityTheme.color}50` } : {}),
        }}
      >
        {/* Cercle intérieur */}
        <div
          className='w-16 h-16 rounded-full flex items-center justify-center relative'
          style={{
            background: isLocked
              ? `linear-gradient(135deg, ${cityTheme.color}55, ${cityTheme.color}33)`
              : isCompleted
                ? `linear-gradient(135deg, #F0CC7A, ${cityTheme.color})`
                : `linear-gradient(135deg, ${cityTheme.colorLight || cityTheme.color}, ${cityTheme.color}CC)`,
          }}
        >
          {isCompleted ? (
            <div className="flex flex-col items-center">
              <Check size={(city.iconSize || 52) - 4} className="text-white stroke-[3px]" />
            </div>
          ) : (
            <motion.span
              animate={isLocked ? {} : { y: [0, -4, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
              className="leading-none select-none flex items-center justify-center"
              style={{ opacity: isLocked ? 0.5 : 1 }}
            >
              {resolveCityIcon(city, city.iconSize || 52, 'text-white')}
            </motion.span>
          )}
          {/* Badge cadenas pour villes verrouillées */}
          {isLocked && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#9B8870] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Lock size={9} className="text-white" />
            </div>
          )}
        </div>

        {/* Badge statut haut */}
        {(isActive || isSelected) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'absolute -top-3.5 px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase shadow-md text-white',
              isSelected ? 'bg-[#D4A43E]' : 'bg-[#7B3F1A]',
            )}
          >
            {isSelected ? '⚡ SÉLECTIONNÉ' : '✦ EN COURS'}
          </motion.div>
        )}
        {isCompleted && !isSelected && (
          <div className="absolute -top-3 bg-[#D4A43E] text-[#4E2510] px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest shadow-md">
            ✓ TERMINÉ
          </div>
        )}

        {/* Badge progression bas */}
        {!isLocked && (
          <div
            className={cn(
              'absolute -bottom-4 bg-white px-2.5 py-0.5 rounded-full shadow-md border-2 text-[11px] font-black z-20',
              isCompleted ? 'border-[#D4A43E] text-[#7B3F1A]' : 'border-[#C9A96E] text-[#7B3F1A]',
            )}
          >
            {isCompleted ? city.totalSteps : city.stepNum}/{city.totalSteps}
          </div>
        )}

        {/* Étoiles décoratifs pour "complété" */}
        {isCompleted && (
          <>
            <Star
              size={12}
              className="absolute -right-1 top-1 text-white fill-white star-twinkle shadow-sm"
              style={{ animationDelay: '0.3s' }}
            />
            <Star
              size={10}
              className="absolute -left-1 bottom-2 text-white fill-white star-twinkle shadow-sm"
              style={{ animationDelay: '0.8s' }}
            />
          </>
        )}
      </button>

      {/* Label ville */}
      <div className="mt-6 text-center space-y-0.5">
        <p
          className={cn('font-headline font-black text-sm tracking-tight')}
          style={{ color: isLocked ? '#C9A96E' : cityTheme.colorDark || cityTheme.color }}
        >
          {city.name}
        </p>
        <p
          className={cn('arabic-font text-xs font-black')}
          style={{ color: isLocked ? '#C9A96E' : cityTheme.color, opacity: isLocked ? 0.3 : 0.8 }}
        >
          {city.arabicName}
        </p>
        {!isLocked && (
          <div className="mt-1.5 w-20 h-1.5 bg-[#C9A96E]/15 rounded-full overflow-hidden border border-[#C9A96E]/20 mx-auto">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(isCompleted ? city.totalSteps : city.stepNum) / city.totalSteps * 100}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: isCompleted ? 'linear-gradient(90deg, #D4A43E, #A87D28)' : 'linear-gradient(90deg, #A0572B, #7B3F1A)' }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Liste de missions ─────────────────────────────────────────────────────────
const MissionsList: React.FC<{
  cityId: string;
  completedMissions: string[];
  cityTheme?: any;
}> = ({
  cityId, completedMissions, cityTheme
}) => {
    const { missions, loading } = useSupabaseMissions(cityId);

    if (loading) return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin text-[#C9A96E]" size={20} />
      </div>
    );

    return (
      <div className="space-y-2">
        {missions.length > 0 ? missions.map((mission, idx) => {
          const isDone = completedMissions.includes(mission.id);
          const themeColor = cityTheme?.color || '#7B3F1A';
          return (
            <div
              key={mission.id}
              className={cn(
                'p-3 rounded-xl border flex items-center justify-between transition-all backdrop-blur-md shadow-sm',
                isDone ? '' : 'bg-white/20 border-white/40',
              )}
              style={isDone ? {
                backgroundColor: `${themeColor}22`,
                borderColor: `${themeColor}60`
              } : {}}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-colors"
                  style={{
                    backgroundColor: isDone ? themeColor : `${themeColor}22`,
                    color: isDone ? 'white' : themeColor
                  }}
                >
                  {isDone ? <Check size={14} strokeWidth={3} /> : idx + 1}
                </div>
                <div>
                  <p className={cn('text-sm font-black', isDone ? 'text-[#7B3F1A]' : 'text-[#4E2510]')}>
                    {mission.title_fr}
                  </p>
                  <p
                    className="text-[10px] font-bold opacity-60"
                    style={{ color: themeColor }}
                  >
                    +{mission.xp_reward} XP
                  </p>
                </div>
              </div>
              {isDone && (
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={10} className="text-[#D4A43E] fill-[#D4A43E] star-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>
          );
        }) : (
          <p className="text-xs text-[#A0572B] font-bold italic py-2 text-center opacity-40">
            Aucune mission trouvée
          </p>
        )}
      </div>
    );
  };
