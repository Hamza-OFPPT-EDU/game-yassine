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
  onDemo: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';

export default function WelcomeScreen({ onDemo, onLogin, onRegister }: WelcomeScreenProps) {
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
            className="relative z-10 h-full w-full flex flex-col justify-between pt-[30px] pb-[30px]"
          >
            {/* Hero section with Logo Image - Reduced top padding and scale */}
            <section className="relative w-full shrink-0 flex flex-col items-center justify-center px-6 pt-2 pb-2">
              <motion.img
                initial={{ scale: 0.8, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 20 }}
                src="https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/paneau%20(2).png"
                alt="Le Voyage des Compétences"
                className="w-full max-w-[280px] object-contain drop-shadow-2xl"
              />
            </section>

            {/* Content (Glassmorphic block) */}
            <main className="flex flex-col items-center justify-center px-3 text-center">
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-[#D4A43E]/10 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[300px] mx-auto w-full">
                  <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-[#D4A43E] to-transparent mx-auto mb-4 opacity-60" />
                  <p className="text-white/90 font-medium leading-relaxed text-[13px] italic">
                    "Accompagne la <span className="text-[#D4A43E] font-black">famille Ben Ali</span> dans une aventure épique à travers les joyaux du Maroc."
                  </p>
                </div>
              </motion.div>
            </main>

            {/* Buttons (Glassmorphic) - Reduced spacing */}
            <section className="px-8 pb-4 pt-2 space-y-3 w-full max-w-md mx-auto shrink-0">
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('click');
                  onDemo();
                }}
                className="relative overflow-hidden w-full bg-gradient-to-br from-[#D4A43E] to-[#7B3F1A] text-white text-[15px] py-4 rounded-[18px] font-black flex items-center justify-center gap-2 shadow-[0_12px_25px_rgba(123,63,26,0.4)] border border-white/20 transition-all"
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
                <span className="font-black uppercase tracking-widest relative z-10">Mode Démo</span>
                <ArrowRight size={20} strokeWidth={3} className="relative z-10" />
              </motion.button>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => {
                    playSound('click');
                    onLogin();
                  }}
                  className="py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all"
                >
                  Connexion
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => {
                    playSound('click');
                    onRegister();
                  }}
                  className="py-3.5 bg-[#D4A43E]/20 backdrop-blur-md border border-[#D4A43E]/30 rounded-[16px] text-[#D4A43E] font-black uppercase tracking-widest text-[10px] hover:bg-[#D4A43E]/30 transition-all"
                >
                  S'inscrire
                </motion.button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}