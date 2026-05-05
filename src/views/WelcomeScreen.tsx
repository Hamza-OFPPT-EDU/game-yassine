/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { optimizeSupabaseUrl } from '../lib/city-theme';

interface WelcomeScreenProps {
  onStart: () => void;
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { playSound } = useAudio();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 scale-105"
        >
          <source src={SPLASH_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * 400,
              y: Math.random() * 800
            }}
            animate={{
              opacity: [0, 0.4, 0],
              y: [null, '-=100'],
              x: [null, Math.random() > 0.5 ? '+=20' : '-=20']
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-[#D4A43E] rounded-full blur-[1px]"
          />
        ))}
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
            <section className="relative w-full shrink-0 flex flex-col items-center justify-center px-6 pt-16 pb-4">
              <motion.img
                initial={{ scale: 0.8, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 20 }}
                src="https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/paneau.png"
                alt="Le Voyage des Compétences"
                className="w-full max-w-[400px] object-contain drop-shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-2"
              >
                <p className="arabic-font text-[#C9A96E] text-2xl font-black tracking-widest drop-shadow-lg">
                  رحلة المهارات
                </p>
              </motion.div>
            </section>

            {/* Content (Glassmorphic block) */}
            <main className="flex-grow flex flex-col items-center justify-center px-6 text-center">
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-[#D4A43E]/10 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] max-w-[340px] mx-auto w-full">
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#D4A43E] to-transparent mx-auto mb-6 opacity-60" />
                  <p className="text-white/90 font-medium leading-relaxed text-[18px] italic">
                    "Accompagne la <span className="text-[#D4A43E] font-black">famille Ben Ali</span> dans une aventure épique à travers les joyaux du Maroc."
                  </p>
                </div>
              </motion.div>
            </main>

            {/* Buttons (Glassmorphic) */}
            <section className="px-8 pb-16 pt-6 space-y-5 w-full max-w-md mx-auto shrink-0">
              <div className="relative">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playSound('click');
                    onStart();
                  }}
                  className="relative overflow-hidden w-full bg-gradient-to-br from-[#D4A43E] to-[#7B3F1A] text-white text-xl py-5 rounded-[24px] font-black flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(123,63,26,0.4)] border border-white/20 transition-all"
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />

                  <span className="font-black uppercase tracking-widest relative z-10">Commencer le Voyage</span>
                  <ArrowRight size={24} strokeWidth={3} className="relative z-10" />
                </motion.button>
              </div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                onClick={() => playSound('click')}
                className="w-full py-4 bg-black/20 border-2 border-white/10 backdrop-blur-md rounded-[24px] text-white/70 font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-all shadow-lg"
              >
                Espace Connexion
              </motion.button>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}