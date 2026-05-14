/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Volume2, Loader2 } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import { useSupabaseSettings } from '../hooks/useSupabase';
import GameButton from '../components/GameButton';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';

export default function WelcomeScreen({ onLogin, onRegister }: WelcomeScreenProps) {
  const { playSound, openSettings } = useAudio();
  const { getSetting } = useSupabaseSettings();
  const welcomeConfig = getSetting('welcome_screen_content') || {};

  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
    // Show content immediately or with a very short fade-in
    setShowContent(true);
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
                onClick={openSettings}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all"
                title="Réglages Audio"
              >
                <Volume2 size={24} />
              </motion.button>
            </div>

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
                <p
                  className="text-white text-lg font-black leading-tight uppercase tracking-tight mb-2"
                  style={welcomeConfig.titleStyle}
                >
                  {welcomeConfig.title || "Bienvenue Voyageur"}
                </p>
                <p
                  className="text-white/80 font-bold leading-relaxed text-[15px]"
                  style={welcomeConfig.subtitleStyle}
                >
                  {welcomeConfig.subtitle || (
                    <>
                      Développe ton potentiel avec la <span className="text-voyage-primary font-black">famille Boulyali</span> à travers un parcours ludique au cœur du Maroc.
                    </>
                  )}
                </p>
              </motion.div>
            </main>

            <section className="px-8 pb-36 pt-6 space-y-4 w-full max-w-md mx-auto shrink-0">
              <GameButton
                variant="primary"
                size="lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  playSound('click');
                  onLogin();
                }}
                className="w-full relative overflow-hidden group"
              >
                <div className="flex items-center justify-center gap-2 w-full">
                  <Sparkles size={20} className="text-[#F4A261] animate-pulse" fill="currentColor" />
                  <span className="font-black text-xl">Se Connecter</span>
                  <ArrowRight size={20} strokeWidth={3} className="ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </GameButton>

              <GameButton
                variant="glass"
                size="lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  playSound('click');
                  onRegister();
                }}
                className="w-full"
              >
                <span className="font-bold">Créer un compte</span>
              </GameButton>
            </section>
            <div className="h-[10px] shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

