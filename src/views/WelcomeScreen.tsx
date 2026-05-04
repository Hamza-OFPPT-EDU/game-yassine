/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

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
    }, 5000);
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
          className="w-full h-full object-cover opacity-60"
        >
          <source src={SPLASH_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
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
                className="w-full max-w-[400px] object-contain drop-shadow-2xl"
              />
            </section>

            {/* Content (Glassmorphic block) */}
            <main className="flex-grow flex flex-col items-start justify-center px-6 text-center mt-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-black/30 backdrop-blur-xl border border-white/20 p-6 rounded-[24px] shadow-2xl max-w-[340px] mx-auto w-full"
              >
                <p className="text-white/90 font-bold leading-relaxed text-[17px]">
                  Développe ton potentiel avec la famille Ben Ali à travers un parcours ludique au cœur du Maroc.
                </p>
              </motion.div>
            </main>

            {/* Buttons (Glassmorphic) */}
            <section className="px-8 pb-12 pt-6 space-y-4 w-full max-w-md mx-auto shrink-0">
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playSound('click');
                  onStart();
                }}
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xl py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-white/30 transition-all"
              >
                <span className="font-black uppercase tracking-tight">C'est parti !</span>
                <ArrowRight size={24} strokeWidth={3} />
              </motion.button>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  playSound('click');
                  onStart();
                }}
                className="w-full py-4 bg-transparent border-2 border-white/20 backdrop-blur-sm rounded-2xl text-white font-black uppercase tracking-tight hover:bg-white/10 transition-all shadow-lg"
              >
                Se connecter
              </motion.button>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
