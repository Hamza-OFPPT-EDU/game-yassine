/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import AudioSettingsModal from '../components/AudioSettingsModal';

interface WelcomeScreenProps {
  onStart: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';

export default function WelcomeScreen({ onStart, onLogin, onRegister }: WelcomeScreenProps) {
  const { playSound } = useAudio();
  const [showContent, setShowContent] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-[#0a0f1e] pb-[10px]">
      {/* Background Video with enhanced overlay */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source src={SPLASH_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/60 via-transparent to-[#0a0f1e]/90" />
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 h-full w-full flex flex-col"
          >
            {/* Floating Audio Control */}
            <div className="absolute top-6 right-6 z-50">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSoundModal(true)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all"
                title="Réglages Audio"
              >
                <Volume2 size={24} />
              </motion.button>
            </div>

            <AudioSettingsModal 
              isOpen={showSoundModal} 
              onClose={() => setShowSoundModal(false)} 
            />

            {/* Hero section with Logo Image */}
            <section className="relative w-full shrink-0 flex items-center justify-center px-6 pt-12 pb-4">
              <motion.img
                initial={{ scale: 0.8, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 20 }}
                src="https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/paneau.png"
                alt="Le Voyage des Compétences"
                className="w-full max-w-[380px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </section>

            {/* Content (Glassmorphic block) */}
            <main className="flex-grow flex flex-col items-center justify-center px-8 text-center mt-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-[340px] mx-auto w-full relative overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#F4A261]/20 rounded-full blur-2xl group-hover:bg-[#F4A261]/30 transition-colors" />
                <p className="text-white text-lg font-black leading-tight uppercase tracking-tight mb-2">
                  Bienvenue Voyageur
                </p>
                <p className="text-white/80 font-bold leading-relaxed text-[15px]">
                  Développe ton potentiel avec la famille Ben Ali à travers un parcours ludique au cœur du Maroc.
                </p>
              </motion.div>
            </main>

            {/* Buttons (Redesigned for Premium Look) */}
            <section className="px-8 pb-10 pt-6 space-y-4 w-full max-w-md mx-auto shrink-0">
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('click');
                  onStart();
                }}
                className="w-full bg-[#F1Dbb1] text-[#4E2510] py-4 rounded-[28px] font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(241,219,177,0.4)] transition-all border-b-4 border-[#B58B60]/40"
              >
                <span>Lancer démo</span>
                <ArrowRight size={20} strokeWidth={3} />
              </motion.button>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playSound('click');
                    onRegister();
                  }}
                  className="py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-[28px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Inscription
                </motion.button>

                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playSound('click');
                    onLogin();
                  }}
                  className="py-4 bg-gradient-to-br from-[#7B3F1A] to-[#4E2510] border-b-4 border-black/30 rounded-[28px] text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} className="text-[#F4A261]" fill="currentColor" />
                  Connection
                </motion.button>
              </div>
            </section>
            <div className="h-[10px] shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

