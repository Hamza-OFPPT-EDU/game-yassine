/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { X, MoreVertical, MapPin, ArrowRight, User, BookOpen, Sparkles, Clapperboard } from 'lucide-react';
import { type City, type Mission } from '../types';
import { useAudio } from '../hooks/useAudio';
import { getCityTheme, optimizeSupabaseUrl, resolveCityIcon, resolveAssetUrl } from '../lib/city-theme';
import { cn } from '../lib/utils';
import { useSettings } from '../contexts/SettingsContext';

interface StoryScreenProps {
  city: City;
  mission?: Mission;
  loadingMission?: boolean;
  onClose: () => void;
  onStartChallenge: () => void;
}

export default function StoryScreen({ city, onClose, onStartChallenge, mission, loadingMission }: StoryScreenProps) {
  const { playSound } = useAudio();
  const { language } = useSettings();

  // Show error if mission loading is complete but no mission found
  if (!loadingMission && !mission) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-md space-y-6 relative z-10"
        >
          <div className="w-24 h-24 mx-auto bg-duo-orange/10 rounded-full flex items-center justify-center border-2 border-duo-orange">
            <X size={48} className="text-duo-orange" />
          </div>
          <div className="space-y-2">
            <h2 className={cn("text-2xl font-black text-duo-eel tracking-tight", language === 'ar' && "arabic-font")}>
              {language === 'ar' ? 'عذراً !' : 'Oups !'}
            </h2>
            <p className={cn("text-duo-wolf font-bold", language === 'ar' && "arabic-font")}>
              {language === 'ar' ? 'لم يتم العثور على أي مهمة لهذه المدينة. يرجى المحاولة لاحقاً.' : 'Aucune mission trouvée pour cette ville. Réessayez plus tard.'}
            </p>
          </div>
          <button onClick={onClose} className={cn("btn-voyage-accent w-full py-4 uppercase font-black tracking-tight", language === 'ar' && "arabic-font")}>
            {language === 'ar' ? 'العودة إلى الخريطة' : 'Retour à la carte'}
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
          src={optimizeSupabaseUrl(mission?.illustration_url || city.image, 1000, 70)}
          alt={mission?.title_fr || city.name}
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent" />
      </motion.div>

      {/* Header Overlay */}
      <header className={cn("fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent", language === 'ar' ? 'flex-row-reverse' : 'flex-row')}>
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
          className="bg-white rounded-t-[3rem] p-8 pb-24 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t-2 border-voyage-accent/20 max-h-[85vh] overflow-y-auto scrollbar-hide"
        >
          <div className="max-w-md mx-auto space-y-8">
            {/* Mission Type Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-voyage-accent/10 rounded-full border-2 border-voyage-accent/20">
                <div className="text-voyage-accent">
                  {resolveCityIcon(city, 14)}
                </div>
                <span className={cn("font-headline font-black text-voyage-accent text-[10px] uppercase tracking-widest", language === 'ar' && "arabic-font text-[12px] tracking-normal")}>
                  {language === 'ar' ? `المهمة ${city.stepNum} • ${city.arabicName || city.name}` : `Mission ${city.stepNum} • ${city.name}`}
                </span>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-4">
              <div className="space-y-1">
                <h1 className={cn("font-headline font-black text-3xl text-voyage-primary tracking-tight leading-tight", language === 'ar' && "arabic-font")}>
                  {language === 'ar' ? (mission?.title_ar || "هل أنت مستعد للتحدي؟") : (mission?.title_fr || "Prêt pour le défi ?")}
                </h1>
                
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {mission?.soft_skill_dominant && (
                    <span className={cn("bg-voyage-accent/10 border border-voyage-accent/20 px-3 py-1 rounded-full text-[10px] font-black text-voyage-accent uppercase tracking-widest flex items-center gap-1.5", language === 'ar' && "arabic-font text-[11px] tracking-normal")}>
                      <Sparkles size={12} />
                      {language === 'ar' ? `المهارة الناعمة: ${mission.soft_skill_dominant}` : `Soft Skill: ${mission.soft_skill_dominant}`}
                    </span>
                  )}
                  {mission?.title_ar && language !== 'ar' && (
                    <span className="bg-voyage-primary/5 border border-voyage-primary/10 px-3 py-1 rounded-full text-sm font-bold text-voyage-primary arabic-font" dir="rtl">
                      {mission.title_ar}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Scénario Situé supprimé selon demande */}

                <div className={cn("bg-voyage-accent/5 rounded-3xl p-6 border-2 border-voyage-accent/20 relative", language === 'ar' ? "text-right" : "text-left")} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <div className={cn("absolute -top-4 bg-white border-2 border-voyage-accent/20 px-3 py-1 rounded-full text-[9px] font-black text-voyage-primary uppercase tracking-widest", language === 'ar' ? "right-6 arabic-font" : "left-6")}>
                    {language === 'ar' ? "الهدف" : "Objectif"}
                  </div>
                  <p className={cn("text-voyage-primary/80 font-bold leading-relaxed", language === 'ar' && "arabic-font text-[16px]")}>
                    {language === 'ar' ? (mission?.description_ar || city.arabicDescription || mission?.narration?.intro?.texte || mission?.description_fr || city.description) : (mission?.narration?.intro?.texte || mission?.description_fr || city.description)}
                  </p>
                  {mission?.narration?.intro?.consigne && (
                    <div className="mt-4 pt-4 border-t border-voyage-accent/10">
                      <p className={cn("text-[10px] font-black text-voyage-accent uppercase tracking-[0.2em] mb-1", language === 'ar' && "arabic-font text-[11px] tracking-normal")}>
                        {language === 'ar' ? 'التعليمات' : 'Consigne'}
                      </p>
                      <p className={cn("text-xs font-bold text-voyage-primary/60 italic", language === 'ar' && "arabic-font text-[13px] not-italic")}>
                        {mission.narration.intro.consigne}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mentor Dialogue */}
              <div className={cn("mt-6 flex gap-4 items-start", language === 'ar' ? "flex-row-reverse text-right" : "flex-row text-left")} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="w-12 h-12 rounded-2xl bg-voyage-primary/10 flex items-center justify-center shrink-0 border-2 border-voyage-primary/20 shadow-sm">
                  <User className="text-voyage-primary" size={24} />
                </div>
                <div className="bg-white border-2 border-voyage-accent/20 p-4 rounded-3xl relative shadow-sm flex-1">
                  <div className={cn("absolute top-4 w-4 h-4 bg-white border-l-2 border-t-2 border-voyage-accent/20 -rotate-45", language === 'ar' ? "-right-2 border-r-2 border-b-2 border-l-0 border-t-0 rotate-135" : "-left-2")} />
                  <p className={cn("text-sm font-bold text-voyage-primary italic", language === 'ar' && "arabic-font text-[15px] not-italic")}>
                    <span className={cn("text-[10px] uppercase tracking-widest text-voyage-primary/60 block not-italic mb-1", language === 'ar' && "arabic-font text-[11px] tracking-normal")}>
                      {language === 'ar' ? (mission?.mentor_name_ar || mission?.mentor_name || "المدرب ياسين") : (mission?.mentor_name || "Coach Yassine")} 
                      {mission?.mentor_role ? ` (${language === 'ar' ? (mission.mentor_role_ar || mission.mentor_role) : mission.mentor_role})` : ''}
                    </span>
                    "{language === 'ar' ? (mission?.script_opening_ar || "هيا بنا! أرني ماذا يمكنك أن تفعل.") : (mission?.script_opening || "Allez, on y va ! Montre-moi ce que tu sais faire.")}"
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={!(loadingMission || !mission) ? { scale: 1.02, y: -2, brightness: 1.1 } : {}}
                whileTap={!(loadingMission || !mission) ? { scale: 0.98, y: 0 } : {}}
                onClick={() => { playSound('click'); onStartChallenge(); }}
                disabled={loadingMission || !mission}
                className={cn(
                  "w-full text-xl py-5.5 flex items-center justify-center gap-3 rounded-[32px] font-black text-white shadow-2xl transition-all border-b-4 border-black/20",
                  language === 'ar' ? "flex-row-reverse" : "flex-row",
                  (loadingMission || !mission) ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:shadow-inner'
                )}
                style={{
                  background: `linear-gradient(135deg, ${getCityTheme(city).color}, ${getCityTheme(city).colorDark || getCityTheme(city).color})`,
                  boxShadow: `0 12px 30px ${getCityTheme(city).color}50`,
                }}
              >
                {loadingMission ? (
                  <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className={cn("font-black uppercase tracking-tight", language === 'ar' && "arabic-font")}>
                      {language === 'ar' ? 'جاري التحضير...' : 'Préparation...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={cn("font-black uppercase tracking-tight", language === 'ar' && "arabic-font text-[22px] tracking-normal")}>
                      {language === 'ar' ? 'لنبدأ التحدي !' : "C'est parti !"}
                    </span>
                    <ArrowRight size={24} strokeWidth={3} className={cn("relative z-10 transition-transform", language === 'ar' && "rotate-180")} />
                  </>
                )}
              </motion.button>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className={cn("flex items-center gap-3", language === 'ar' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn("flex", language === 'ar' ? "space-x-reverse -space-x-3" : "-space-x-3")}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-voyage-accent/10 flex items-center justify-center overflow-hidden">
                      <User size={20} className="text-voyage-primary/40" />
                    </div>
                  ))}
                </div>
                <span className={cn("text-voyage-primary/60 text-[10px] font-black uppercase tracking-widest opacity-60", language === 'ar' && "arabic-font text-[11px] tracking-normal")}>
                  {language === 'ar' ? '+١٥ مسافر نشط' : '+15 voyageurs actifs'}
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

