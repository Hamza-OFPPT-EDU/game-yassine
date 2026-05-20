import { useMemo, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Sparkles, CheckCircle2, XCircle, SkipForward, Info } from 'lucide-react';
import { useAssetPreloader, type Asset } from '../hooks/useAssetPreloader';
import { getAllAssets } from '../lib/assets';
import { type CacheLog } from '../hooks/useResourceCache';

interface SplashScreenProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  progress?: number;
  extraAssets?: Asset[];
  canContinue?: boolean;
  logs?: CacheLog[];
}

const SPLASH_VIDEO_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4';

export default function SplashScreen({ onProgress, progress: externalProgress, logs = [] }: SplashScreenProps) {
  const [videoStage, setVideoStage] = useState<'video' | 'ui'>('video');
  const logEndRef = useRef<HTMLDivElement>(null);
  
  const progress = externalProgress !== undefined ? externalProgress : 0;

  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Show video for 4 seconds max (matching the 4s requirement)
    const videoTimer = setTimeout(() => {
      setVideoStage('ui');
    }, 4000);

    return () => clearTimeout(videoTimer);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);


  return (
    <div
      className="relative h-full w-full flex flex-col items-center justify-center bg-voyage-sand overflow-hidden cursor-pointer"
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
              onError={() => {
                console.warn("Splash video failed to load, skipping to UI");
                setVideoStage('ui');
              }}
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

              <div className="w-28 h-28 rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center relative border-4 border-voyage-secondary/30 overflow-hidden group p-4">
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
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-1 -right-1 w-10 h-10 rounded-xl bg-voyage-accent flex items-center justify-center shadow-lg border-b-4 border-voyage-accent-dark"
              >
                <Sparkles className="text-white" size={20} fill="currentColor" />
              </motion.div>
            </motion.div>

            {/* Title & Slogan Animation */}
            <div className="space-y-4 mb-8 relative z-10 w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-1.5 text-center"
              >
                <h1 className="font-headline font-black text-[18px] text-voyage-primary-dark tracking-tight">
                  Le Voyage des <span className="text-voyage-accent">Soft Skills</span>
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[12px] font-black text-voyage-primary arabic-font"
                  dir="rtl"
                >
                  رحلة المهارات الناعمة
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-1 w-16 bg-linear-to-r from-transparent via-voyage-accent to-transparent mx-auto"
              />
            </div>

            {/* Loading Progress Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="w-full max-w-[200px] space-y-3"
            >
              <div className="relative h-1.5 w-full bg-voyage-secondary-light/20 rounded-full overflow-hidden border border-slate-50/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                  className="absolute inset-0 bg-linear-to-r from-voyage-accent via-voyage-accent-light to-voyage-accent bg-size-[200%_100%]"
                />
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                />
              </div>
              <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-voyage-primary/60">
                <div className="flex items-center gap-1.5">
                  <Loader2 size={8} className="animate-spin" />
                  <span>Chargement des ressources</span>
                </div>
                <span>{Math.round(progress)}%</span>
              </div>
            </motion.div>

            {/* Log Area — shown during UI phase */}
            {logs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="w-full max-w-[260px] mt-4"
              >
                <div className="bg-voyage-primary-dark/5 rounded-2xl p-3 max-h-[80px] overflow-hidden relative">
                  <div className="space-y-0.5 overflow-y-auto max-h-[72px] scrollbar-hide">
                    {logs.slice(-6).map(log => (
                      <div key={log.id} className="flex items-center gap-1.5">
                        <span className={[
                          'text-[8px] font-bold leading-tight break-all',
                          log.status === 'success' ? 'text-emerald-600' :
                          log.status === 'error'   ? 'text-red-400' :
                          log.status === 'skip'    ? 'text-voyage-primary/30' :
                                                     'text-voyage-primary/50'
                        ].join(' ')}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                  {/* Fade overlay to hide overflow */}
                  <div className="absolute bottom-0 inset-x-0 h-4 bg-linear-to-t from-voyage-sand to-transparent rounded-b-2xl pointer-events-none" />
                </div>
              </motion.div>
            )}

            <div className="h-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
