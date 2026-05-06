import { useMemo, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Star, Loader2, Sparkles } from 'lucide-react';
import { useAssetPreloader, type Asset } from '../hooks/useAssetPreloader';
import { getAllAssets } from '../lib/assets';

interface SplashScreenProps {
  onComplete?: () => void;
  extraAssets?: Asset[];
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';

export default function SplashScreen({ onComplete, extraAssets = [] }: SplashScreenProps) {
  const [videoStage, setVideoStage] = useState<'video' | 'ui'>('video');
  const assetsToPreload = useMemo(() => getAllAssets(extraAssets), [extraAssets]);
  const { progress, isComplete } = useAssetPreloader(assetsToPreload);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Show video for 4 seconds
    const videoTimer = setTimeout(() => {
      setVideoStage('ui');
    }, 4000);

    return () => clearTimeout(videoTimer);
  }, []);

  useEffect(() => {
    // Notify parent when assets are ready AND video is done
    if (isComplete && videoStage === 'ui') {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1500); // Give user time to see the animated UI
      return () => clearTimeout(timer);
    }
  }, [isComplete, videoStage, onComplete]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-white overflow-hidden">
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
            
            {/* Premium Interaction Block for Fullscreen Request */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              id="fs-block"
              className="absolute inset-0 flex items-center justify-center z-60 bg-[#0f172a]"
            >
               {/* Background Glow */}
               <div className="absolute w-[500px] h-[500px] bg-[#D4A43E]/10 rounded-full blur-[120px] animate-pulse" />
               
               <div className="relative flex flex-col items-center gap-12 px-8 py-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl max-w-[320px] w-full text-center">
                  {/* Decorative Sparkles */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#D4A43E] rounded-2xl flex items-center justify-center shadow-lg rotate-12">
                    <Sparkles className="text-white" size={24} fill="currentColor" />
                  </div>

                  {/* Icon/Logo Placeholder in Block */}
                  <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center shadow-xl border-4 border-[#E5D5B8]">
                    <Map className="text-[#7B3F1A]" size={48} strokeWidth={2.5} />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                      Le Voyage des <span className="text-[#D4A43E]">Soft Skills</span>
                    </h2>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] italic">
                      Préparez-vous pour l'aventure
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen().catch(e => console.warn(e));
                      }
                      // Start video and hide block
                      if (videoRef.current) {
                        videoRef.current.play().catch(e => console.warn("Video play failed:", e));
                      }
                      const block = document.getElementById('fs-block');
                      if (block) block.style.display = 'none';
                    }}
                    className="group relative overflow-hidden w-full bg-gradient-to-br from-[#D4A43E] to-[#7B3F1A] text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-[#7B3F1A]/20 transition-all active:scale-95"
                  >
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                    Explorer
                  </button>
               </div>
            </motion.div>

            {/* Subtle Skip/Wait hint */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 whitespace-nowrap"
            >
              <p className="text-white/60 text-[7px] font-bold uppercase tracking-[0.2em] text-center">Initialisation du voyage...</p>
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

              <div className="w-28 h-28 rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center relative border-4 border-[#E5D5B8] overflow-hidden group">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Map className="text-[#7B3F1A]" size={56} strokeWidth={2.5} />
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
