/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface WelcomeScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';

export default function WelcomeScreen({ onStart, onLogin }: WelcomeScreenProps) {
  const { playSound } = useAudio();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-[#0a0f1e] pb-[20px]">
      {/* Background Video with enhanced overlay */}
      <div className="absolute inset-0 z-0">
        <video
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
            <section className="px-8 pb-12 pt-6 space-y-5 w-full max-w-md mx-auto shrink-0">
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
                className="w-full bg-gradient-to-br from-[#2D6A4F] to-[#1D3557] text-white py-5 rounded-[28px] font-black text-xl uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(45,106,79,0.4)] transition-all"
              >
                <span>C'est parti !</span>
                <ArrowRight size={24} strokeWidth={3} />
              </motion.button>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('click');
                  onLogin();
                }}
                className="w-full py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-[28px] text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white/20 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles size={18} className="text-[#F4A261]" fill="currentColor" />
                Se connecter
              </motion.button>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

