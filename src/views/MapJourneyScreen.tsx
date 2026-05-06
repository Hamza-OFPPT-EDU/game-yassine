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
import { getCityTheme, resolveCityIcon, optimizeSupabaseUrl } from '../lib/city-theme';

// ── MapJourneyScreen ─────────────────────────────────────────────────────────

interface MapJourneyScreenProps {
  stats: { xp: number; stars: number; level: number };
  completedCities: string[];
  completedMissions: string[];
  onSelectCity: (city: City, mission?: any) => void;
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
  const handleSelectMission = (city: City, mission: any) => {
    playSound('click');
    onSelectCity(city, mission);
  };

  // Hook pour jouer la voix de Rabat automatiquement
  useEffect(() => {
    if (cinematicCity && cinematicCity.name === 'Rabat') {
      const audio = new Audio('/audio/rabat_intro_voice.mp3');
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
      <main className="flex-grow overflow-y-auto relative pt-16 pb-48 scrollbar-hide" ref={scrollContainerRef}>

        {/* ── SVG Path + Nœuds ────────────────────────────────────────────── */}
        <div className="relative max-w-sm mx-auto px-4">

          {/* Chemin SVG entre les villes */}
          <svg
            className="absolute inset-0 w-full pointer-events-none"
            style={{ height: `${cities.length * 300}px` }}
            viewBox={`0 0 320 ${cities.length * 300}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Chemin Principal (Dashed) */}
            <path
              d={buildPath(cities, 320)}
              fill="none"
              stroke="#D4A43E"
              strokeWidth="24"
              strokeOpacity="0.4"
              strokeLinecap="round"
              strokeDasharray="48 64"
              className="path-dashed"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(212, 164, 62, 0.3))'
              }}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
            {/* Ligne de contour très fine pour l'effet "tracé" */}
            <path
              d={buildPath(cities, 320)}
              fill="none"
              stroke="#7B3F1A"
              strokeWidth="6"
              strokeOpacity="0.1"
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
                style={{ marginBottom: index < cities.length - 1 ? '220px' : 0 }}
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
                  className="rounded-[2.5rem] shadow-2xl relative overflow-hidden backdrop-blur-3xl border border-white/40 flex flex-col"
                  style={{
                    background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 240, 230, 0.9) 100%)',
                    boxShadow: `0 30px 60px -15px ${displayCityTheme.color}40`,
                  }}
                >
                  {/* City Illustration / Banner */}
                  <div className="h-44 w-full relative overflow-hidden">
                    <img 
                      src={optimizeSupabaseUrl(displayCity.image || 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/fallback-city.jpg', 600, 80)}
                      alt={displayCity.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    
                    {/* Floating Icon over Banner */}
                    <div 
                      className="absolute bottom-[-20px] left-8 w-20 h-20 rounded-3xl shadow-xl border-4 border-white flex items-center justify-center"
                      style={{ background: displayCityTheme.bgGradient }}
                    >
                      {resolveCityIcon(displayCity, 48, 'text-white')}
                    </div>

                    {/* Close button */}
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedCityId(null);
                      }}
                      className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md hover:bg-black/40 rounded-xl transition-all z-50 border border-white/20 group"
                    >
                      <X size={20} className="text-white group-hover:rotate-90 transition-transform" />
                    </button>
                  </div>

                  <div className="p-8 pt-10">
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-[#D4A43E] uppercase tracking-[0.2em]">{displayCity.headline || displayCity.focus}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-[#D4A43E] animate-pulse" />
                           {displayCity.acteTitle && (
                             <>
                               <div className="w-px h-2 bg-[#D4A43E]/30" />
                               <span className="text-[10px] font-bold text-[#7B3F1A]/60 italic">{displayCity.acteTitle}</span>
                             </>
                           )}
                        </div>
                        <h2 className="text-3xl font-black text-[#4E2510] tracking-tight leading-none">
                          {displayCity.name}
                        </h2>
                        <p className="arabic-font text-lg font-black text-[#7B3F1A] opacity-70">
                          {displayCity.arabicHeadline || displayCity.arabicName}
                        </p>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="bg-white/50 border border-[#E5D5B8] px-3 py-1.5 rounded-2xl shadow-sm text-right">
                          <span className="block text-[8px] font-black text-[#7B3F1A]/50 uppercase tracking-widest">Progression</span>
                          <span className="font-black text-lg text-[#D4A43E]">
                            {Math.round((displayCity.stepNum / displayCity.totalSteps) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-[#7B3F1A]/5 rounded-[24px] p-5 border border-[#7B3F1A]/10 mb-6">
                      <p className="text-[#4E2510]/90 text-sm leading-relaxed font-medium italic">
                        "{displayCity.description || displayCity.arabicDescription}"
                      </p>
                    </div>

                    {/* Missions List */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4 px-1">
                        <h4 className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-[0.3em]">{displayCity.missionsTitle || "Missions Disponibles"}</h4>
                        <span className="text-[10px] font-black text-[#D4A43E]">{displayCity.stepNum}/{displayCity.totalSteps}</span>
                      </div>
                      
                      <div className={cn(
                        "space-y-2 overflow-y-auto pr-1 scrollbar-hide transition-all duration-300",
                        "max-h-[35vh]"
                      )}>
                        <MissionsList
                          city={displayCity}
                          completedMissions={completedMissions}
                          cityTheme={displayCityTheme}
                          onSelectMission={(mission) => handleSelectMission(displayCity, mission)}
                        />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLaunchAdventure(displayCity)}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-[#D4A43E] to-[#7B3F1A] text-white py-5 rounded-[24px] font-black flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(123,63,26,0.3)] transition-all"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                      <span className="font-black uppercase tracking-widest relative z-10">
                        {displayCity.status === 'completed' ? 'Relever de nouveau' : 'Lancer l\'aventure'}
                      </span>
                      <ChevronRight size={22} strokeWidth={3} className="relative z-10" />
                    </motion.button>
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
function buildPath(cities: City[], width: number): string {
  if (cities.length < 2) return '';
  const cx = width / 2;
  const sorted = [...cities].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // The distance between centers of cities in the SVG
  // This should match the visual height of (Node + Margin)
  // Node height is ~128px, Margin is 220px. Total ~348px.
  // But let's use a consistent scale factor that matches our SVG viewBox height.
  const stepY = 300; 
  const startY = (sorted.length - 1) * stepY + 150; // Bottom city y

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
  const progress = (isCompleted ? city.totalSteps : city.stepNum) / city.totalSteps;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.85 }}
      animate={{
        y: 0,
        opacity: 1,
        scale: (isSelected || (isScrollTarget && scrollDone) ? 1.1 : 1) * (city.map_size || 1)
      }}
      transition={{
        delay,
        scale: { type: 'spring', stiffness: 300, damping: 22 },
      }}
      className="flex flex-col items-center relative"
    >
      {/* Aura pulsante pour la ville active */}
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute w-32 h-32 rounded-full"
          style={{ background: `radial-gradient(circle, ${isActive ? '#2C6E7F' : '#D4A43E'} 0%, transparent 70%)` }}
        />
      )}

      {/* Conteneur principal du nœud */}
      <div className="relative group cursor-pointer" onClick={onSelect}>
        
        {/* Banner "EN COURS" */}
        {isActive && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-[#7B3F1A] text-white px-4 py-1.5 rounded-xl border-2 border-white/20 shadow-lg flex items-center gap-1.5"
          >
            <span className="text-[10px] font-black tracking-widest">✦ EN COURS</span>
          </motion.div>
        )}

        {/* Le Cercle Extérieur */}
        <div
          className={cn(
            "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500",
            isLocked ? "bg-[#E5D5B8]/50 border-4 border-[#C9B99A]" : "bg-[#2C6E7F] shadow-xl ring-8 ring-[#2C6E7F]/10"
          )}
          style={!isLocked && !isActive ? { backgroundColor: cityTheme.color, borderColor: cityTheme.colorDark } : {}}
        >
          {/* Progress Ring (uniquement pour l'actif) */}
          {isActive && (
            <svg className="absolute inset-0 w-full h-full -rotate-90 p-1">
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.2"
                strokeDasharray="4 4"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="none"
                stroke="#D4A43E"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress }}
                transition={{ duration: 1.5, delay: delay + 0.5 }}
              />
            </svg>
          )}

          {/* Cercle Intérieur (Contient l'icône) */}
          <div
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300",
              isLocked ? "bg-[#D1C4B0] opacity-60" : "bg-white/10 backdrop-blur-sm"
            )}
          >
            {/* L'image ou l'icône de la ville */}
            <motion.div
              animate={isLocked ? {} : { y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center relative"
            >
              {city.image && (
                <img 
                  src={optimizeSupabaseUrl(city.image, 200, 70)} 
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover",
                    isLocked ? "grayscale opacity-40" : "opacity-100"
                  )}
                  alt={city.name}
                />
              )}
              
              <div className={cn(
                "relative z-10 flex items-center justify-center w-full h-full",
                city.image ? "bg-black/20" : ""
              )}>
                {city.iconName?.startsWith('http') ? (
                  resolveCityIcon(city, (city.iconSize || (city.image ? 48 : 96)), isLocked ? "grayscale opacity-40" : "")
                ) : (
                  resolveCityIcon(city, (city.iconSize || (city.image ? 40 : 56)), isLocked ? "grayscale opacity-50" : "text-white")
                )}
              </div>
            </motion.div>

            {/* Overlay de verrouillage */}
            {isLocked && (
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                <div className="bg-white/80 p-2 rounded-full shadow-sm">
                  <Lock size={16} className="text-[#7B3F1A]" />
                </div>
              </div>
            )}
          </div>

          {/* Bouton d'action bas (Arrow) */}
          {isActive && (
             <motion.div
               animate={{ y: [0, 5, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -bottom-4 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-[#E5D5B8] z-30"
             >
               <ArrowDown size={20} className="text-[#D4A43E]" />
             </motion.div>
          )}

          {/* Badge cadenas (small) pour locked */}
          {isLocked && (
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center border-2 border-[#E5D5B8] shadow-md">
               <Lock size={12} className="text-[#B5A48A]" />
            </div>
          )}

          {/* Badge Complété */}
          {isCompleted && (
            <div className="absolute -bottom-2 bg-[#D4A43E] text-white p-1.5 rounded-full shadow-lg border-2 border-white">
              <Check size={16} strokeWidth={4} />
            </div>
          )}
        </div>
      </div>

      {/* Label de la ville */}
      <div className="mt-8 text-center">
        <h3 className={cn(
          "text-lg font-black tracking-tight leading-none mb-1",
          isLocked ? "text-[#7B3F1A]/40" : "text-[#2C6E7F]"
        )}>
          {city.name}
        </h3>
        <p className={cn(
          "arabic-font text-sm font-bold",
          isLocked ? "text-[#7B3F1A]/30" : "text-[#7B3F1A]/60"
        )}>
          {city.arabicName}
        </p>

        {/* Petite barre de progression sous le nom */}
        {!isLocked && (
          <div className="mt-2 w-16 h-1.5 bg-[#E5D5B8]/30 rounded-full overflow-hidden mx-auto">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              className="h-full bg-gradient-to-r from-[#D4A43E] to-[#7B3F1A] rounded-full"
            />
          </div>
        )}
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
    const { missions, loading } = useSupabaseMissions(city.id);

    if (loading) return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <Loader2 className="animate-spin text-[#D4A43E]" size={24} />
        <span className="text-[10px] font-black text-[#7B3F1A]/40 uppercase tracking-widest">Chargement des défis...</span>
      </div>
    );

    return (
      <div className="space-y-3">
        {missions.length > 0 ? missions.map((mission, idx) => {
          const isDone = completedMissions.includes(mission.id);
          const themeColor = cityTheme?.color || '#7B3F1A';
          
          return (
            <motion.button
              key={mission.id}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMission?.(mission)}
              className={cn(
                'w-full p-4 rounded-[20px] border flex items-center justify-between transition-all backdrop-blur-md text-left group relative overflow-hidden',
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
                    <p className={cn('text-sm font-black', isDone ? 'text-[#7B3F1A]' : 'text-[#4E2510]')}>
                      {mission.title_fr}
                    </p>
                    {mission.is_bonus && (
                       <Sparkles size={12} className="text-[#D4A43E]" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[9px] font-black text-[#D4A43E] uppercase tracking-wider flex items-center gap-1">
                      <Star size={10} fill="#D4A43E" /> +{mission.xp_reward} XP
                    </span>
                    <span className="text-[9px] font-bold text-[#7B3F1A]/40 uppercase tracking-widest">
                       {mission.estimated_time || '5 min'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2 relative z-10">
                {isDone ? (
                  <div className="flex gap-0.5 bg-[#D4A43E]/10 p-1 rounded-lg">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} size={10} className="text-[#D4A43E] fill-[#D4A43E] star-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                ) : (
                  <ChevronRight size={18} className="text-[#7B3F1A]/20 group-hover:text-[#7B3F1A] transition-colors" />
                )}
              </div>
              
              {/* Progress background for in-progress missions? (Future use) */}
            </motion.button>
          );
        }) : (
          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-[#E5D5B8] rounded-[30px] opacity-40">
             <MapPin size={32} className="text-[#7B3F1A] mb-2" />
             <p className="text-xs font-black text-[#7B3F1A] uppercase tracking-widest">
                En attente d'expédition...
             </p>
          </div>
        )}
      </div>
    );
  };
