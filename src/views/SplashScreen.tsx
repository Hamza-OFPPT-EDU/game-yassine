import { useMemo, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Star, Loader2, Sparkles } from 'lucide-react';
import { useAssetPreloader, type Asset } from '../hooks/useAssetPreloader';
import { getAllAssets } from '../lib/assets';

interface SplashScreenProps {
  onComplete?: () => void;
  extraAssets?: Asset[];
  canContinue?: boolean;
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';

export default function SplashScreen({ onComplete, extraAssets = [], canContinue = true }: SplashScreenProps) {
  const [videoStage, setVideoStage] = useState<'video' | 'ui'>('video');
  const assetsToPreload = useMemo(() => getAllAssets(extraAssets), [extraAssets]);
  const { progress, isComplete } = useAssetPreloader(assetsToPreload);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Show video for 3 seconds
    const videoTimer = setTimeout(() => {
      setVideoStage('ui');
    }, 3000);

    return () => clearTimeout(videoTimer);
  }, []);

  useEffect(() => {
    // Notify parent when assets are ready AND video is done AND canContinue is true
    if (isComplete && videoStage === 'ui' && canContinue) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1500); // Give user time to see the animated UI
      return () => clearTimeout(timer);
    }
  }, [isComplete, videoStage, onComplete, canContinue]);

  return (
    <div
      className="relative h-full w-full flex flex-col items-center justify-center bg-white overflow-hidden cursor-pointer"
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => { });
        }
      }}
    >
      <AnimatePresence mode="wait">
        {videoStage === 'video' ? (
          <motion.div
            key="video-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setVideoStage('ui')}
            >
              <source src={SPLASH_VIDEO_URL} type="video/mp4" />
            </video>

            {/* Subtle Skip/Wait hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <p className="text-white/60 text-[7px] font-black uppercase tracking-[0.2em] text-center">Initialisation du voyage...</p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="ui-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full px-10"
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-80 h-80 bg-voyage-accent/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [0, -90, 0],
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute -bottom-20 -right-20 w-80 h-80 bg-voyage-primary/10 rounded-full blur-3xl"
              />
            </div>

            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="relative w-36 h-36 mb-8 flex items-center justify-center"
            >
              {/* Pulsing rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5 + (i * 0.2), 1],
                    opacity: [0.2 - (i * 0.05), 0, 0.2 - (i * 0.05)]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-voyage-accent"
                />
              ))}

              <div className="w-28 h-28 rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center relative border-4 border-[#E5D5B8] overflow-hidden group p-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src="https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Shine effect */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-1 -right-1 w-10 h-10 rounded-xl bg-[#D4A43E] flex items-center justify-center shadow-lg border-b-4 border-[#B58B60]"
              >
                <Sparkles className="text-white" size={20} fill="currentColor" />
              </motion.div>
            </motion.div>

            {/* Title & Slogan Animation - Reduced by 30% */}
            <div className="space-y-4 mb-12 relative z-10 w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-1.5 text-center"
              >
                <h1 className="font-headline font-black text-[18px] text-[#4E2510] tracking-tight">
                  Le Voyage des <span className="text-[#D4A43E]">Soft Skills</span>
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[12px] font-black text-[#7B3F1A] arabic-font"
                  dir="rtl"
                >
                  رحلة المهارات الناعمة
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-1 w-16 bg-gradient-to-r from-transparent via-[#D4A43E] to-transparent mx-auto"
              />
            </div>

            {/* Progress Bar Animation */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-64 space-y-4"
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  {!isComplete && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={10} className="text-[#D4A43E]" />
                    </motion.div>
                  )}
                  <p className="text-[8px] font-black text-[#7B3F1A]/60 uppercase tracking-[0.2em]">
                    {isComplete ? 'Prêt à explorer !' : 'Chargement...'}
                  </p>
                </div>
                <p className="text-[8px] font-black text-[#D4A43E]">
                  {progress}%
                </p>
              </div>

              <div className="h-6 w-full bg-[#E5D5B8]/20 rounded-2xl overflow-hidden border-2 border-[#E5D5B8] p-1 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-[#7B3F1A] to-[#4E2510] rounded-xl relative shadow-lg"
                >
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/20 rounded-xl"
                  />
                </motion.div>
              </div>

              <AnimatePresence>
                {!isComplete && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-[7px] font-bold text-[#7B3F1A]/40 italic"
                  >
                    Préparation du voyage au Maroc...
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
