/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Check, ChevronRight, X, Loader2, Lock,
  Star, Sparkles, Navigation2
} from 'lucide-react';
import { type City } from '../types';
import { cn } from '../lib/utils';
import TopAppBar from '../components/TopAppBar';
import { useAudio } from '../hooks/useAudio';
import { useSupabaseCities, useSupabaseMissions } from '../hooks/useSupabase';
import { getCityTheme, resolveCityIcon } from '../lib/city-theme';

// ── Couleurs de nœud par statut ─────────────────────────────────────────────
const NODE_STYLES = {
  locked: {
    outer:  'bg-[#D4C5B0] border-[#B5A48A]',
    inner:  'bg-[#C9B99A]',
    text:   'text-[#9B8870]',
    aura:   'bg-[#C9A96E]/10',
    ring:   'border-[#C9A96E]/20',
  },
  active: {
    outer:  'bg-gradient-to-br from-[#A0572B] to-[#7B3F1A] border-[#4E2510]',
    inner:  'bg-gradient-to-br from-[#B5693A] to-[#8B4A22]',
    text:   'text-white',
    aura:   'bg-[#7B3F1A]/25',
    ring:   'border-[#D4A43E]',
  },
  completed: {
    outer:  'bg-gradient-to-br from-[#D4A43E] to-[#A87D28] border-[#7A5C1A]',
    inner:  'bg-gradient-to-br from-[#F0CC7A] to-[#D4A43E]',
    text:   'text-[#4E2510]',
    aura:   'bg-[#D4A43E]/25',
    ring:   'border-[#D4A43E]',
  },
};

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
  const [cinematicCity, setCinematicCity]   = useState<City | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

  const handleShowCitySheet  = (city: City) => { 
    if (city.status !== 'locked') { 
      playSound('whoosh');
      setSelectedCityId(city.id); 
      setIsDescriptionExpanded(true); 
    } 
  };
  const handleLaunchAdventure = (city: City) => {
    playSound('click');
    if (city.cinematicIntro && city.status !== 'completed') { setCinematicCity(city); }
    else { onSelectCity(city); }
  };

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

  const activeCity  = (cities?.length > 0) ? (cities.find(c => c.status === 'active') || cities[0]) : null;
  const displayCity = selectedCityId ? cities.find(c => c.id === selectedCityId) : null;

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
                  className="max-w-lg space-y-10 relative z-10 py-12"
                >
                    <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-28 h-28 mx-auto rounded-full flex items-center justify-center shadow-2xl border-4 border-[#D4A43E]/50"
                    style={{ background: getCityTheme(cinematicCity).bgGradient }}
                  >
                    {resolveCityIcon(cinematicCity, 144, "text-white")}
                  </motion.div>

                  <div className="space-y-3">
                    <p className="text-[#D4A43E] font-black uppercase tracking-[0.3em] text-xs">
                      Le Voyage des Compétences
                    </p>
                    <h1 className="text-5xl font-headline font-black text-white tracking-tight">
                      {cinematicCity.name}
                    </h1>
                    <p className="arabic-font text-[#C9A96E] text-xl">{cinematicCity.arabicName}</p>
                  </div>

                  <p className="text-xl font-bold text-white/85 leading-relaxed italic font-serif px-4">
                    "{cinematicCity.cinematicIntro}"
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { 
                      playSound('click');
                      const c = cinematicCity; setCinematicCity(null); onSelectCity(c); 
                    }}
                    className="btn-voyage-accent px-10 py-4 text-lg w-full"
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
      <main className="flex-grow overflow-y-auto relative pt-6 pb-48 scrollbar-hide">

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
              <div key={city.id} style={{ marginBottom: index < cities.length - 1 ? '140px' : 0 }}>
                <CityNode
                  city={city}
                  onSelect={() => handleShowCitySheet(city)}
                  isSelected={selectedCityId === city.id}
                  delay={index * 0.12}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

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
                  className="rounded-[2rem] p-6 shadow-2xl relative overflow-hidden border border-[#C9A96E]/30"
                  style={{ background: 'linear-gradient(160deg, #FBF3E3 0%, #F5E8C8 100%)' }}
                >
                  {/* Décoration coin */}
                  <div className="absolute top-0 right-0 w-28 h-28 opacity-10 pointer-events-none flex items-start justify-end pr-4 pt-4">
                    {resolveCityIcon(displayCity, 165, "text-voyage-primary")}
                  </div>

                  {/* Fermer */}
                  <button
                    onClick={() => {
                      playSound('click');
                      setSelectedCityId(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/60 hover:bg-white rounded-xl transition-colors z-50 border border-[#C9A96E]/30"
                  >
                    <X size={18} className="text-[#7B3F1A]" />
                  </button>

                  {/* En-tête */}
                  <div className="flex items-start gap-4 mb-4 pr-10">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white/40 shadow-md"
                      style={{ background: getCityTheme(displayCity).bgGradient }}
                    >
                      {resolveCityIcon(displayCity, 86, "text-white")}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#D4A43E] rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-[#7B3F1A] uppercase tracking-widest">
                          {displayCity.focus}
                        </span>
                      </div>
                      <h2 className="text-3xl font-headline font-black text-[#4E2510] tracking-tight leading-none">
                        {displayCity.name}
                      </h2>
                      <p className="arabic-font text-sm font-black text-[#A0572B]">
                        {displayCity.arabicName}
                      </p>
                    </div>
                    {/* Badge progression */}
                    <div
                      className="ml-auto shrink-0 px-3 py-2 rounded-2xl flex flex-col items-center border border-[#D4A43E]/40"
                      style={{ background: 'linear-gradient(135deg, #D4A43E22, #D4A43E44)' }}
                    >
                      <span className="text-[9px] font-black text-[#A87D28] uppercase tracking-widest">Progrès</span>
                      <span className="text-[#7B3F1A] font-black text-xl leading-none mt-0.5">
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
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-white/50 border border-[#C9A96E]/20 hover:bg-white/80 transition-all mb-2 group"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-[#D4A43E]" />
                        <span className="text-[10px] font-black text-[#A0572B] uppercase tracking-widest">
                          {isDescriptionExpanded ? "Réduire la description" : "En savoir plus sur la ville"}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isDescriptionExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight size={14} strokeWidth={3} className="text-[#A0572B] group-hover:translate-x-0.5 transition-transform" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isDescriptionExpanded && (
                        <motion.p 
                          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
                          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="text-[#7B3F1A]/70 text-sm leading-relaxed font-bold overflow-hidden"
                        >
                          {displayCity.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-5 space-y-1">
                    <div className="flex justify-between text-[10px] font-black text-[#A0572B]/60 uppercase tracking-widest">
                      <span>Progression</span>
                      <span>{displayCity.stepNum}/{displayCity.totalSteps} missions</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#C9A96E]/20 rounded-full overflow-hidden border border-[#C9A96E]/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(displayCity.stepNum / displayCity.totalSteps) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #D4A43E, #A0572B)' }}
                      />
                    </div>
                  </div>

                  {/* Missions */}
                  <div className="mb-5">
                    <h4 className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest opacity-50 mb-2">
                      Missions de la ville
                    </h4>
                    <div className={cn(
                      "space-y-2 overflow-y-auto pr-1 scrollbar-hide transition-all duration-300",
                      isDescriptionExpanded ? "max-h-[28vh]" : "max-h-[45vh]"
                    )}>
                      <MissionsList 
                        cityId={displayCity.id} 
                        completedMissions={completedMissions} 
                        cityTheme={getCityTheme(displayCity)}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLaunchAdventure(displayCity)}
                    className="btn-voyage w-full flex items-center justify-center gap-3 text-base py-4"
                  >
                    <span className="font-black uppercase tracking-tight">
                      {displayCity.status === 'completed' ? 'Relever de nouveau' : "Continuer l'aventure"}
                    </span>
                    <ChevronRight size={22} strokeWidth={3} />
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
  const amp   = 70;
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
}> = ({ city, onSelect, isSelected, delay }) => {
  const isLocked    = city.status === 'locked';
  const isCompleted = city.status === 'completed';
  const isActive    = city.status === 'active';
  const style       = NODE_STYLES[city.status];
  const theme       = getCityTheme(city);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.85 }}
      animate={{ y: 0, opacity: 1, scale: isSelected ? 1.1 : 1 }}
      transition={{
        delay,
        scale: { type: 'spring', stiffness: 300, damping: 22 },
      }}
      className="flex flex-col items-center relative"
    >
      {/* Aura extérieure pulsante */}
      {!isLocked && (
        <>
          <div
            className={cn(
              'absolute rounded-full city-aura pointer-events-none',
              style.aura,
            )}
            style={{ width: 140, height: 140, top: -22, left: -22 }}
          />
          {isActive && (
            <div
              className="absolute rounded-full pointer-events-none border-2 border-dashed ring-spin"
              style={{ width: 128, height: 128, top: -16, left: -16, borderColor: `${theme.color}66` }}
            />
          )}
        </>
      )}

      {/* Bouton principal */}
      <button
        disabled={isLocked}
        onClick={onSelect}
        className={cn(
          'relative w-24 h-24 rounded-full flex items-center justify-center',
          'border-[6px] shadow-2xl transition-all duration-300',
          'focus:outline-none',
          style.outer,
          isSelected && 'ring-4 ring-[#D4A43E]/50 scale-110',
          isLocked && 'opacity-40 grayscale cursor-not-allowed',
        )}
      >
        {/* Cercle intérieur */}
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            style.inner,
          )}
        >
          {isCompleted ? (
            <div className="flex flex-col items-center">
              <Check size={32} className="text-[#4E2510] stroke-[3px]" />
            </div>
          ) : isLocked ? (
            <Lock size={28} className="text-[#9B8870]" />
          ) : (
            <motion.span
              animate={{ y: [0, -6, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
              className="leading-none select-none flex items-center justify-center"
            >
              {resolveCityIcon(city, 86, isLocked ? "text-[#9B8870]" : "text-white")}
            </motion.span>
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
              className="absolute -right-1 top-1 text-[#D4A43E] fill-[#D4A43E] star-twinkle"
              style={{ animationDelay: '0.3s' }}
            />
            <Star
              size={10}
              className="absolute -left-1 bottom-2 text-[#D4A43E] fill-[#D4A43E] star-twinkle"
              style={{ animationDelay: '0.8s' }}
            />
          </>
        )}
      </button>

      {/* Label ville */}
      <div className="mt-6 text-center space-y-0.5">
        <p className={cn(
          'font-headline font-black text-sm tracking-tight',
          isLocked ? 'text-[#C9A96E]/40' : 'text-[#4E2510]',
        )}>
          {city.name}
        </p>
        <p className={cn(
          'arabic-font text-xs font-black',
          isLocked ? 'text-[#C9A96E]/30' : 'text-[#A0572B]',
        )}>
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
        return (
          <div
            key={mission.id}
            className={cn(
              'p-3 rounded-xl border-2 flex items-center justify-between transition-all',
              isDone
                ? 'bg-[#D4A43E]/10 border-[#D4A43E]/30'
                : 'bg-white/60 border-[#C9A96E]/20',
            )}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-colors"
                style={{ 
                  backgroundColor: isDone ? cityTheme?.color : `${cityTheme?.color}22`,
                  color: isDone ? 'white' : cityTheme?.color
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
                  style={{ color: cityTheme?.color }}
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
