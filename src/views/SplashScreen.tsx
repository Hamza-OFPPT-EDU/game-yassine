/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map, Star, Loader2 } from 'lucide-react';
import { useAssetPreloader } from '../hooks/useAssetPreloader';
import { CITIES } from '../types';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';
const INTRO_CHAR_URL = '/assets/intro_caracter.gif';
const DEFAULT_AVATAR_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEnuCj82UkKXzGW0tKpWXPsCMVxp-ze2cDdCMYUcyGp-bxmqiPpfxq6WS0cLA0F_4fHZzo4EBdyjNNcqb9EcIdChW45pSIDd_OMNlxBs2UULMjeZb2S6M0FhkIqKFBdiqI4bNtjf7siSxvoJNR3P4LXULObMP_bndo_xMDfHHGdDqFrQyP4ULR99TUdOXKujPVQ3mYRW1jJmEkXQ4lBCWbjptm_vK9MKgBqWPRBIayk4fWtmzHlrXjpeDW1uLbJwRYWp5wCddpNOM';

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  // Define assets to preload
  const assetsToPreload = useMemo(() => {
    const images = [
      INTRO_CHAR_URL,
      DEFAULT_AVATAR_URL,
      ...CITIES.map(city => city.image),
    ].map(url => ({ url, type: 'image' as const }));

    const audio = [
      '/audio/correct.mp3',
      '/audio/wrong.mp3',
      '/audio/click.mp3',
      '/audio/match.mp3',
      '/audio/success.mp3',
      '/audio/whoosh.mp3',
      '/audio/rabat_intro_voice.mp3',
    ].map(url => ({ url, type: 'audio' as const }));

    const videos = [
      { url: SPLASH_VIDEO_URL, type: 'video' as const }
    ];

    return [...images, ...audio, ...videos];
  }, []);

  const { progress, isComplete } = useAssetPreloader(assetsToPreload);

  // Notify parent when complete (with a small extra delay for smooth transition)
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-white overflow-hidden">
      <div className="z-10 flex flex-col items-center text-center px-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-40 h-40 mb-12 flex items-center justify-center"
        >
          {/* Animated Background Rings */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-voyage-accent/10"
          />
          <motion.div 
            animate={{ scale: [1.2, 1.4, 1.2], opacity: [0.1, 0.05, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute inset-0 rounded-full bg-voyage-accent/5"
          />
          
          <div className="w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center relative border-4 border-voyage-accent/20 overflow-hidden">
            <Map className="text-voyage-accent" size={64} strokeWidth={2.5} />
          </div>
          
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-voyage-accent flex items-center justify-center shadow-lg border-b-4 border-voyage-accent-dark"
          >
            <Star className="text-white" size={20} fill="currentColor" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="font-headline font-black text-3xl text-voyage-primary tracking-tight">
            Le Voyage des Compétences
          </h1>
          <p className="text-2xl font-black text-voyage-accent arabic-font" dir="rtl">
            رحلة المهارات والتعلم
          </p>
        </motion.div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-24 w-48 space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {!isComplete && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={12} className="text-voyage-accent" />
              </motion.div>
            )}
            <p className="text-[10px] font-black text-duo-wolf uppercase tracking-widest">
              {isComplete ? 'Prêt !' : 'Chargement...'}
            </p>
          </div>
          <p className="text-[10px] font-black text-voyage-accent">
            {progress}%
          </p>
        </div>
        
        <div className="h-4 w-full bg-voyage-accent/10 rounded-full overflow-hidden border-2 border-voyage-accent/20 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="h-full bg-voyage-primary rounded-full relative"
          >
             <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/30 rounded-full" />
          </motion.div>
        </div>
        
        {!isComplete && (
          <p className="text-center text-[9px] font-bold text-duo-wolf/60 italic">
            Préparation du voyage au Maroc...
          </p>
        )}
      </div>
    </div>
  );
}
