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
const PANEAU_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/paneau.png';

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
            className="relative z-10 h-full w-full flex flex-col items-center"
          >
            {/* Logo at the top - Increased size (+50%) */}
            <header className="w-full h-[22vh] flex items-center justify-center pt-4">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-[80%] max-h-[180px]"
              >
                <img
                  src={optimizeSupabaseUrl(PANEAU_URL, 1000)}
                  alt="Logo"
                  className="h-full object-contain drop-shadow-[0_15px_30px_rgba(255,255,255,0.25)]"
                />
              </motion.div>
            </header>

            {/* Content (Glassmorphic block) */}
            <main className="grow flex flex-col items-center justify-center px-8 text-center pt-10">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-black/30 backdrop-blur-[30px] border border-white/10 p-10 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] max-w-[420px] mx-auto w-full flex flex-col items-center gap-8 relative overflow-hidden"
              >
                {/* Glow Effect */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-voyage-accent/20 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <h2 className="arabic-font text-3xl font-black text-voyage-accent drop-shadow-sm">عِش المغامرة، اكتشف مواهبك</h2>
                    <div className="h-0.5 w-16 bg-voyage-accent/40 mx-auto rounded-full" />
                  </div>
                  
                  <p className="text-white font-medium leading-relaxed text-xl tracking-wide text-center">
                    Développe ton potentiel avec la <span className="text-voyage-accent font-bold">famille Ben Ali</span> à travers un parcours ludique au cœur du Maroc.
                  </p>
                </div>
              </motion.div>
            </main>


            {/* Buttons (Glassmorphic) */}
            <section className="w-full max-w-md px-10 pb-16 pt-8 flex flex-col gap-5 shrink-0">
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('click');
                  onStart();
                }}
                className="group w-full bg-white text-slate-950 py-5 rounded-2xl font-black text-xl uppercase tracking-wider flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-950/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">C'est parti</span>
                <ArrowRight size={26} strokeWidth={3} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('click');
                  onStart();
                }}
                className="w-full py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-black text-lg uppercase tracking-widest hover:bg-white/20 transition-all shadow-lg"
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
