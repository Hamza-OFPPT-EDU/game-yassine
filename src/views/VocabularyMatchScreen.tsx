/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, Info, Apple, Sun, Droplets, Star, Volume2, Lightbulb, X, VolumeX, Music, Bell, Save, Play, User } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { cn } from '../lib/utils';

interface VocabularyMatchScreenProps {
  onBack: () => void;
}

type MatchItem = {
  id: string;
  text: string;
  icon?: any;
  category?: string;
};

const LEFT_ITEMS: MatchItem[] = [
  { id: 'apple', text: 'Apple', icon: Apple, category: 'fruit' },
  { id: 'sun', text: 'Sun', icon: Sun, category: 'star' },
  { id: 'water', text: 'Water', icon: Droplets, category: 'liquid' },
];

const RIGHT_ITEMS: MatchItem[] = [
  { id: 'fruit', text: 'Fruit' },
  { id: 'liquid', text: 'Liquid' },
  { id: 'star', text: 'Star' },
];

export default function VocabularyMatchScreen({ onBack }: VocabularyMatchScreenProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [isSavingAudio, setIsSavingAudio] = useState(false);
  const { settings: audio, updateSettings: updateAudio, playSound: playEffect, saveToCloud: saveAudioToCloud } = useAudio();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});

  const updatePositions = () => {
    const newPositions: Record<string, { x: number, y: number }> = {};
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    [...LEFT_ITEMS, ...RIGHT_ITEMS].forEach(item => {
      const el = document.getElementById(`anchor-${item.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        newPositions[item.id] = {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      }
    });
    setPositions(newPositions);
  };

  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  const handleLeftClick = (id: string) => {
    if (matches[id]) return;
    setSelectedLeft(id === selectedLeft ? null : id);
  };

  const handleRightClick = (id: string) => {
    if (!selectedLeft) return;
    
    const leftItem = LEFT_ITEMS.find(item => item.id === selectedLeft);
    if (leftItem?.category === id) {
      const newMatches = { ...matches, [selectedLeft]: id };
      setMatches(newMatches);
      setSelectedLeft(null);
      
      if (Object.keys(newMatches).length === LEFT_ITEMS.length) {
        setShowSuccess(true);
      }
    } else {
      // Wrong match animation?
      setSelectedLeft(null);
    }
  };

  return (
    <div className="h-full w-full bg-voyage-sand text-voyage-primary-dark flex flex-col font-sans overflow-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-voyage-accent/10 transition-all">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-voyage-sand transition-all rounded-full scale-95 duration-150"
          >
            <ArrowLeft className="text-voyage-primary" size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-on-surface leading-none">Lesson Tracker</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-2 bg-voyage-accent/10 rounded-full overflow-hidden">
                <motion.div 
                   animate={{ width: `${(Object.keys(matches).length / LEFT_ITEMS.length) * 100}%` }}
                   className="h-full bg-voyage-accent shadow-[0_0_8px_rgba(212,164,62,0.5)]" 
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {Math.round((Object.keys(matches).length / LEFT_ITEMS.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
        <div className="bg-voyage-accent/20 px-4 py-1.5 rounded-full flex items-center gap-2">
           <span className="text-voyage-primary-dark font-black text-sm tracking-tight">⭐ 120</span>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow pt-24 pb-32 px-6 max-w-2xl mx-auto w-full flex flex-col items-center overflow-y-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-voyage-primary mb-2 tracking-tight">Connectez les Savoirs !</h1>
          <p className="text-slate-500 font-medium">Reliez chaque mot à sa catégorie correspondante.</p>
        </div>

        {/* Matching Interaction Area */}
        <div className="relative w-full grid grid-cols-2 gap-12 md:gap-24 items-center" ref={containerRef}>
          {/* SVG Overlay for Connecting Lines */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full">
              {Object.entries(matches).map(([leftId, rightId]) => {
                const start = positions[leftId];
                const end = positions[rightId];
                if (!start || !end) return null;
                return (
                  <motion.line
                    key={`${leftId}-${rightId}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    x1={start.x} y1={start.y}
                    x2={end.x} y2={end.y}
                    stroke="var(--color-voyage-primary)"
                    strokeWidth="4"
                    strokeDasharray="8,8"
                  />
                );
              })}
            </svg>
          </div>

          {/* Left Column: Words */}
          <div className="space-y-6 relative z-10">
            {LEFT_ITEMS.map((item) => {
              const matched = !!matches[item.id];
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative">
                  <motion.div
                    onClick={() => handleLeftClick(item.id)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "p-5 rounded-xl shadow-[0_4px_0_0_var(--color-voyage-secondary-light)] flex items-center justify-between border-2 transition-all cursor-pointer",
                      matched ? "bg-voyage-primary text-white border-voyage-primary shadow-[0_4px_0_0_var(--color-voyage-primary-dark)]" : (selectedLeft === item.id ? "bg-white border-voyage-accent ring-2 ring-voyage-accent/20" : "bg-white border-transparent")
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon size={24} className={matched ? "text-white" : "text-[#8b4b00]"} />}
                      <span className="font-bold text-lg">{item.text}</span>
                    </div>
                    <div 
                      id={`anchor-${item.id}`}
                      className={cn(
                        "w-4 h-4 rounded-full absolute -right-2 ring-4 ring-voyage-sand transition-colors",
                        matched ? "bg-voyage-primary" : "bg-voyage-secondary-light"
                      )} 
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Categories */}
          <div className="space-y-6 relative z-10">
            {RIGHT_ITEMS.map((item) => {
              const isTargetedBy = Object.entries(matches).find(([_, rId]) => rId === item.id)?.[0];
              const matched = !!isTargetedBy;
              
              return (
                <div key={item.id} className="relative">
                  <motion.div
                    onClick={() => handleRightClick(item.id)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "p-5 rounded-xl shadow-[0_4px_0_0_var(--color-voyage-secondary-light)] flex items-center justify-start border-2 transition-all cursor-pointer",
                      matched ? "bg-voyage-primary text-white border-voyage-primary shadow-[0_4px_0_0_var(--color-voyage-primary-dark)]" : "bg-white border-transparent hover:bg-slate-50"
                    )}
                  >
                    <div 
                      id={`anchor-${item.id}`}
                      className={cn(
                        "w-4 h-4 rounded-full absolute -left-2 ring-4 ring-voyage-sand transition-colors",
                        matched ? "bg-voyage-primary" : "bg-voyage-secondary-light"
                      )} 
                    />
                    <span className="font-bold text-lg ml-2">{item.text}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Illustration */}
        <div className="mt-12 w-full max-w-lg">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4 border-l-4 border-voyage-primary shadow-sm">
            <Info className="text-voyage-primary shrink-0" size={32} />
            <p className="text-sm font-medium text-slate-600">
              {Object.keys(matches).length > 0 
                ? "Excellent travail ! Vous avez trouvé une paire. Continuez pour devenir un expert !"
                : "Associez chaque mot à sa catégorie correspondante pour obtenir votre insigne."}
            </p>
          </div>
        </div>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl flex justify-center items-center gap-4 z-50 border-t border-slate-100">
         <div className="w-full max-w-2xl flex items-center gap-4">
           <button 
             onClick={() => { playEffect('click'); setShowSoundModal(true); }} 
             className="p-4 bg-voyage-sand/30 border-2 border-voyage-secondary/20 rounded-2xl text-voyage-accent hover:bg-voyage-sand/50 transition-colors border-b-4"
             title="Réglages audio"
           >
             <Volume2 size={24} />
           </button>
           <button 
             onClick={() => { setShowHintModal(true); }} 
             className="p-4 bg-voyage-accent/10 border-2 border-voyage-accent/30 rounded-2xl text-voyage-accent hover:bg-voyage-accent/20 transition-colors border-b-4"
             title="Obtenir un indice"
           >
             <Lightbulb size={24} />
           </button>
           <motion.button 
             disabled={Object.keys(matches).length < LEFT_ITEMS.length}
             whileTap={{ scale: Object.keys(matches).length === LEFT_ITEMS.length ? 0.95 : 1 }}
             onClick={() => setShowSuccess(true)}
             className={cn(
               "grow py-4 px-8 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-all",
               Object.keys(matches).length === LEFT_ITEMS.length 
                 ? "bg-voyage-primary text-white shadow-voyage-primary/30 border-b-4 border-voyage-primary-dark" 
                 : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
             )}
           >
             <span>Vérifier</span>
             <CheckCircle2 size={24} />
           </motion.button>
         </div>
      </div>

      {/* Grand Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-voyage-primary/90 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-voyage-accent/20 rounded-full mx-auto flex items-center justify-center mb-6">
                <CheckCircle2 className="text-voyage-accent" size={48} />
              </div>
              <h2 className="text-3xl font-black text-voyage-primary mb-2 font-headline">Félicitations !</h2>
              <p className="text-slate-500 mb-8 font-medium">Vous maîtrisez parfaitement ce vocabulaire.</p>
              <button 
                onClick={onBack}
                className="w-full bg-voyage-accent text-voyage-primary-dark py-4 rounded-xl font-black text-lg shadow-[0_4px_0_0_var(--color-voyage-accent-dark)] hover:scale-105 active:translate-y-1 active:shadow-none transition-all"
              >
                Continuer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setShowHintModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative border-2 border-voyage-accent/20"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowHintModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} className="text-duo-wolf" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-voyage-accent/10 rounded-2xl flex items-center justify-center border-b-4 border-voyage-accent/20">
                    <Lightbulb size={32} className="text-voyage-accent" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-voyage-accent/60">Coup de pouce pédagogique</h3>
                    <h2 className="text-2xl font-black text-duo-eel">Indice & Explication</h2>
                  </div>
                </div>

                <div className="bg-voyage-sand/30 p-6 rounded-3xl border-2 border-dashed border-voyage-accent/20">
                  <p className="text-lg font-bold text-duo-eel leading-relaxed text-center italic">
                    "Identifiez les relations logiques entre les concepts. Par exemple, la 'Pomme' est un type de 'Fruit'. Chaque élément de gauche appartient à une seule catégorie de droite."
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                   <button 
                    onClick={() => setShowHintModal(false)}
                    className="btn-voyage-accent px-10 py-4 w-full"
                  >
                    J'AI COMPRIS
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Audio Settings Modal */}
      <AnimatePresence>
        {showSoundModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setShowSoundModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative border-2 border-voyage-accent/20 overflow-y-auto max-h-[90vh] scrollbar-hide"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowSoundModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} className="text-duo-wolf" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-voyage-accent/10 rounded-2xl flex items-center justify-center border-b-4 border-voyage-accent/20">
                    <Volume2 size={32} className="text-voyage-accent" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-voyage-accent/60">Réglages immersifs</h3>
                    <h2 className="text-2xl font-black text-duo-eel">Audio & Son</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Master Volume */}
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <Volume2 size={18} className="text-voyage-primary" />
                         <span className="font-black text-voyage-primary text-sm uppercase tracking-tight">Volume Global</span>
                      </div>
                      <span className="text-xs font-black text-voyage-primary">{audio.masterVolume}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <VolumeX size={16} className="text-slate-300" />
                      <input
                        type="range" min={0} max={100}
                        value={audio.masterVolume}
                        onChange={e => updateAudio({ masterVolume: Number(e.target.value) })}
                        className="flex-1 accent-voyage-primary h-2 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Effects Toggle */}
                  <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <Bell size={20} className={audio.soundEffectsEnabled ? "text-voyage-accent" : "text-slate-400"} />
                      <span className="font-black text-voyage-primary text-sm">Effets Sonores</span>
                    </div>
                    <button
                      onClick={() => updateAudio({ soundEffectsEnabled: !audio.soundEffectsEnabled })}
                      className={cn(
                        "relative w-14 h-7 rounded-full transition-colors duration-300 border-b-4",
                        audio.soundEffectsEnabled ? "bg-voyage-accent border-voyage-accent/60" : "bg-slate-200 border-slate-300"
                      )}
                    >
                      <motion.span
                        layout
                        className={cn(
                          "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md",
                          audio.soundEffectsEnabled ? "left-[calc(100%-1.75rem)]" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>

                  {/* Music Toggle */}
                  <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <Music size={20} className={audio.musicEnabled ? "text-voyage-primary" : "text-slate-400"} />
                      <span className="font-black text-voyage-primary text-sm">Musique de fond</span>
                    </div>
                    <button
                      onClick={() => updateAudio({ musicEnabled: !audio.musicEnabled })}
                      className={cn(
                        "relative w-14 h-7 rounded-full transition-colors duration-300 border-b-4",
                        audio.musicEnabled ? "bg-voyage-primary border-voyage-primary/60" : "bg-slate-200 border-slate-300"
                      )}
                    >
                      <motion.span
                        layout
                        className={cn(
                          "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md",
                          audio.musicEnabled ? "left-[calc(100%-1.75rem)]" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>

                   {/* Voice Toggle */}
                   <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <User size={20} className={audio.voicesEnabled ? "text-voyage-terracotta" : "text-slate-400"} />
                      <span className="font-black text-voyage-primary text-sm">Voix & Narrations</span>
                    </div>
                    <button
                      onClick={() => updateAudio({ voicesEnabled: !audio.voicesEnabled })}
                      className={cn(
                        "relative w-14 h-7 rounded-full transition-colors duration-300 border-b-4",
                        audio.voicesEnabled ? "bg-voyage-terracotta border-voyage-terracotta/60" : "bg-slate-200 border-slate-300"
                      )}
                    >
                      <motion.span
                        layout
                        className={cn(
                          "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md",
                          audio.voicesEnabled ? "left-[calc(100%-1.75rem)]" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={async () => {
                      try {
+                        setIsSavingAudio(true);
                         await saveAudioToCloud();
                         playEffect('success');
-                        setShowSoundModal(false);
+                        // Show green state for a brief moment
+                        setTimeout(() => {
+                          setShowSoundModal(false);
+                          setIsSavingAudio(false);
+                        }, 800);
                       } catch (e) {
                         console.error(e);
+                        setIsSavingAudio(false);
                         setShowSoundModal(false);
                       }
                     }}
-                    className="btn-voyage-primary w-full py-4 flex items-center justify-center gap-3"
-                  >
-                    <Save size={20} />
-                    ENREGISTRER LES RÉGLAGES
+                    className={cn(
+                      "w-full py-4 flex items-center justify-center gap-3 transition-all duration-300 rounded-2xl font-black uppercase tracking-wide",
+                      isSavingAudio 
+                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-b-4 border-emerald-700" 
+                        : "btn-voyage-primary"
+                    )}
+                  >
+                    {isSavingAudio ? (
+                      <>
+                        <CheckCircle2 size={20} />
+                        RÉGLAGES ENREGISTRÉS !
+                      </>
+                    ) : (
+                      <>
+                        <Save size={20} />
+                        ENREGISTRER LES RÉGLAGES
+                      </>
+                    )}
                   </button>
                  <button 
                    onClick={() => setShowSoundModal(false)}
                    className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors"
                  >
                    Fermer sans sauvegarder
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
