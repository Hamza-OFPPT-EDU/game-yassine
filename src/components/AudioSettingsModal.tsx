import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Bell, Music, User, Save, CheckCircle2, X } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { cn } from '../lib/utils';
import { useSettings } from '../contexts/SettingsContext';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioSettingsModal({ isOpen, onClose }: AudioSettingsModalProps) {
  const { settings: audio, updateSettings: updateAudio, saveToCloud: saveAudioToCloud, playSound: playEffect } = useAudio();
  const [isSavingAudio, setIsSavingAudio] = useState(false);
  const { language } = useSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-999999 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="p-8 space-y-8">
              <div className={cn("flex items-start justify-between", language === 'ar' && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse text-right")}>
                  <div className="w-12 h-12 rounded-2xl bg-voyage-primary/10 flex items-center justify-center">
                    <Volume2 className="text-voyage-primary" size={24} />
                  </div>
                  <div>
                    <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em] text-voyage-accent/60", language === 'ar' && "arabic-font")}>
                      {language === 'ar' ? 'إعدادات الصوت' : 'Réglages immersifs'}
                    </h3>
                    <h2 className={cn("text-2xl font-black text-slate-800", language === 'ar' && "arabic-font")}>
                      {language === 'ar' ? 'الصوت والمؤثرات' : 'Audio & Son'}
                    </h2>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Master Volume */}
                <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                  <div className={cn("flex justify-between items-center", language === 'ar' && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-3", language === 'ar' && "flex-row-reverse")}>
                       <Volume2 size={18} className="text-voyage-primary" />
                       <span className={cn("font-black text-voyage-primary text-sm uppercase tracking-tight", language === 'ar' && "arabic-font")}>
                         {language === 'ar' ? 'الصوت العام' : 'Volume Global'}
                       </span>
                    </div>
                    <span className="text-xs font-black text-voyage-primary">{audio.masterVolume}%</span>
                  </div>
                  <div className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse")}>
                    <VolumeX size={16} className="text-slate-300" />
                    <input
                      type="range" min={0} max={100}
                      value={audio.masterVolume}
                      onChange={e => updateAudio({ masterVolume: Number(e.target.value) })}
                      className="flex-1 accent-voyage-primary h-2 cursor-pointer"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                {/* Effects Toggle */}
                <div className={cn("flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl", language === 'ar' && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse")}>
                    <Bell size={20} className={audio.soundEffectsEnabled ? "text-voyage-accent" : "text-slate-400"} />
                    <span className={cn("font-black text-voyage-primary text-sm", language === 'ar' && "arabic-font")}>
                      {language === 'ar' ? 'المؤثرات الصوتية' : 'Effets Sonores'}
                    </span>
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
                        audio.soundEffectsEnabled ? (language === 'ar' ? "right-[calc(100%-1.75rem)]" : "left-[calc(100%-1.75rem)]") : (language === 'ar' ? "right-0.5" : "left-0.5")
                      )}
                    />
                  </button>
                </div>

                {/* Music Toggle */}
                <div className={cn("flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl", language === 'ar' && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse")}>
                    <Music size={20} className={audio.musicEnabled ? "text-voyage-primary" : "text-slate-400"} />
                    <span className={cn("font-black text-voyage-primary text-sm", language === 'ar' && "arabic-font")}>
                      {language === 'ar' ? 'الموسيقى الخلفية' : 'Musique de fond'}
                    </span>
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
                        audio.musicEnabled ? (language === 'ar' ? "right-[calc(100%-1.75rem)]" : "left-[calc(100%-1.75rem)]") : (language === 'ar' ? "right-0.5" : "left-0.5")
                      )}
                    />
                  </button>
                </div>

                 {/* Voice Toggle */}
                 <div className={cn("flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl", language === 'ar' && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-4", language === 'ar' && "flex-row-reverse")}>
                    <User size={20} className={audio.voicesEnabled ? "text-voyage-terracotta" : "text-slate-400"} />
                    <span className={cn("font-black text-voyage-primary text-sm", language === 'ar' && "arabic-font")}>
                      {language === 'ar' ? 'الأصوات والتعليق' : 'Voix & Narrations'}
                    </span>
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
                        audio.voicesEnabled ? (language === 'ar' ? "right-[calc(100%-1.75rem)]" : "left-[calc(100%-1.75rem)]") : (language === 'ar' ? "right-0.5" : "left-0.5")
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={async () => {
                    try {
                      setIsSavingAudio(true);
                      await saveAudioToCloud();
                      playEffect('success');
                      setTimeout(() => {
                        onClose();
                        setIsSavingAudio(false);
                      }, 800);
                    } catch (e) {
                      console.error(e);
                      setIsSavingAudio(false);
                      onClose();
                    }
                  }}
                  className={cn(
                    "w-full py-4 flex items-center justify-center gap-3 transition-all duration-300 rounded-2xl font-black uppercase tracking-wide",
                    isSavingAudio 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-b-4 border-emerald-700" 
                      : "btn-voyage-primary",
                    language === 'ar' && "flex-row-reverse arabic-font text-xs"
                  )}
                >
                  {isSavingAudio ? (
                    <>
                      <CheckCircle2 size={20} />
                      {language === 'ar' ? 'تم حفظ الإعدادات!' : 'RÉGLAGES ENREGISTRÉS !'}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {language === 'ar' ? 'حفظ الإعدادات' : 'ENREGISTRER LES RÉGLAGES'}
                    </>
                  )}
                </button>
                <button 
                  onClick={onClose}
                  className={cn("w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors", language === 'ar' && "arabic-font")}
                >
                  {language === 'ar' ? 'إغلاق بدون حفظ' : 'Fermer sans sauvegarder'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
