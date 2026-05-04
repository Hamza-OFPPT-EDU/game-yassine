/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { X, MoreVertical, MapPin, ArrowRight, User, BookOpen } from 'lucide-react';
import { type City, type Mission } from '../types';
import { useAudio } from '../hooks/useAudio';
import { getCityTheme } from '../lib/city-theme';

interface StoryScreenProps {
  city: City;
  mission?: Mission;
  loadingMission?: boolean;
  onClose: () => void;
  onStartChallenge: () => void;
}

export default function StoryScreen({ city, onClose, onStartChallenge, mission, loadingMission }: StoryScreenProps) {
  const { playSound } = useAudio();

  // Show error if mission loading is complete but no mission found
  if (!loadingMission && !mission) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-md space-y-6 relative z-10"
        >
          <div className="w-24 h-24 mx-auto bg-duo-orange/10 rounded-full flex items-center justify-center border-2 border-duo-orange">
            <X size={48} className="text-duo-orange" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-duo-eel tracking-tight">Oups !</h2>
            <p className="text-duo-wolf font-bold">Aucune mission trouvée pour cette ville. Réessayez plus tard.</p>
          </div>
          <button onClick={onClose} className="btn-voyage-accent w-full py-4 uppercase font-black tracking-tight">
            Retour à la carte
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden bg-white">
      {/* Hero Background Illustration */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 z-0"
      >
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent" />
      </motion.div>

      {/* Header Overlay */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent">
        <button onClick={() => { playSound('click'); onClose(); }} className="p-2 hover:bg-voyage-accent/10 rounded-xl transition-colors">
          <X size={24} className="text-voyage-primary/60" />
        </button>

        <div className="flex-1 px-8">
          <div className="h-3 w-full bg-voyage-accent/10 rounded-full overflow-hidden border-2 border-voyage-accent/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
              className="h-full bg-voyage-primary rounded-full shadow-lg"
            />
          </div>
        </div>

        <button className="p-2 hover:bg-voyage-accent/10 rounded-xl transition-colors">
          <MoreVertical size={24} className="text-voyage-primary/60" />
        </button>
      </header>

      {/* Narrative Panel */}
      <main className="relative z-10 h-full flex flex-col justify-end">
        <motion.section
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t-2 border-voyage-accent/20 max-h-[85vh] overflow-y-auto scrollbar-hide"
        >
          <div className="max-w-md mx-auto space-y-8">
            {/* Mission Type Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-voyage-accent/10 rounded-full border-2 border-voyage-accent/20">
                <BookOpen className="text-voyage-accent" size={14} />
                <span className="font-headline font-black text-voyage-accent text-[10px] uppercase tracking-widest">
                  Mission {city.stepNum} • {city.name}
                </span>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-4">
              <div className="space-y-1">
                <h1 className="font-headline font-black text-3xl text-voyage-primary tracking-tight leading-tight">
                  {mission?.title_fr || "Prêt pour le défi ?"}
                </h1>
                {mission?.title_ar && (
                  <h2 className="font-bold text-2xl text-voyage-accent arabic-font" dir="rtl">
                    {mission.title_ar}
                  </h2>
                )}
              </div>

              <div className="bg-voyage-accent/5 rounded-3xl p-6 border-2 border-voyage-accent/20 relative">
                <div className="absolute -top-4 left-6 bg-white border-2 border-voyage-accent/20 px-3 py-1 rounded-full text-[9px] font-black text-voyage-primary uppercase tracking-widest">
                  {mission?.narration?.intro?.objectif ? "Objectif" : "Objectif"}
                </div>
                <p className="text-voyage-primary/80 font-bold leading-relaxed">
                  {mission?.narration?.intro?.texte || mission?.description_fr || city.description}
                </p>
                {mission?.description_ar && (
                  <p className="text-voyage-accent font-bold text-lg mt-4 arabic-font" dir="rtl">
                    {mission.description_ar}
                  </p>
                )}
                {mission?.narration?.intro?.consigne && (
                  <div className="mt-4 pt-4 border-t border-voyage-accent/10">
                    <p className="text-[10px] font-black text-voyage-accent uppercase tracking-[0.2em] mb-1">Consigne</p>
                    <p className="text-xs font-bold text-voyage-primary/60 italic">
                      {mission.narration.intro.consigne}
                    </p>
                  </div>
                )}
              </div>

              {/* Mentor Dialogue */}
              <div className="text-left mt-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-voyage-primary/10 flex items-center justify-center shrink-0 border-2 border-voyage-primary/20 shadow-sm">
                  <User className="text-voyage-primary" size={24} />
                </div>
                <div className="bg-white border-2 border-voyage-accent/20 p-4 rounded-3xl relative shadow-sm flex-1">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-l-2 border-t-2 border-voyage-accent/20 rotate-[-45deg]" />
                  <p className="text-sm font-bold text-voyage-primary italic">
                    <span className="text-[10px] uppercase tracking-widest text-voyage-primary/60 block not-italic mb-1">
                      {mission?.mentor_name || "Coach Yassine"} 
                      {mission?.mentor_role ? ` (${mission.mentor_role})` : ''}
                    </span>
                    "{mission?.script_opening || "Allez, on y va ! Montre-moi ce que tu sais faire."}"
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Action */}
            <div className="pt-4">
              <motion.button
                whileTap={{ scale: loadingMission ? 1 : 0.95 }}
                onClick={() => { playSound('click'); onStartChallenge(); }}
                disabled={loadingMission || !mission}
                className={`w-full text-xl py-5 flex items-center justify-center gap-3 rounded-2xl font-black text-white shadow-lg transition-all ${loadingMission || !mission ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'
                  }`}
                style={{
                  background: `linear-gradient(135deg, ${getCityTheme(city).colorLight || getCityTheme(city).color}, ${getCityTheme(city).colorDark || getCityTheme(city).color})`,
                  boxShadow: `0 8px 25px ${getCityTheme(city).color}50`,
                }}
              >
                {loadingMission ? (
                  <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-black uppercase tracking-tight">Préparation...</span>
                  </>
                ) : (
                  <>
                    <span className="font-black uppercase tracking-tight">C'est parti !</span>
                    <ArrowRight size={24} strokeWidth={3} />
                  </>
                )}
              </motion.button>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-voyage-accent/10 flex items-center justify-center overflow-hidden">
                      <User size={20} className="text-voyage-primary/40" />
                    </div>
                  ))}
                </div>
                <span className="text-voyage-primary/60 text-[10px] font-black uppercase tracking-widest opacity-60">
                  +15 voyageurs actifs
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

