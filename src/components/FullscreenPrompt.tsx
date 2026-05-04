import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Sparkles, Loader2 } from 'lucide-react';
import { useAssetPreloader } from '../hooks/useAssetPreloader';
import { getAllAssets } from '../lib/assets';
import { useMemo } from 'react';

interface FullscreenPromptProps {
  show: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function FullscreenPrompt({ show, onAccept, onDecline }: FullscreenPromptProps) {
  const acceptRef = useRef<HTMLButtonElement>(null);

  const assets = useMemo(() => getAllAssets(), []);
  const { progress } = useAssetPreloader(assets);

  useEffect(() => {
    if (show) {
      // Auto-focus the accept button for keyboard users
      const t = setTimeout(() => acceptRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [show]);

  const handleAccept = async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        await (el as any).webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen may be blocked — silently ignore
    }
    onAccept();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{ background: 'rgba(30, 14, 6, 0.75)', backdropFilter: 'blur(12px)' }}
          onClick={onDecline}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.88, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border border-[#D4A43E]/30"
            style={{
              background: 'linear-gradient(160deg, #2A1206 0%, #3D1A08 50%, #4E2510 100%)',
            }}
          >
            {/* Decorative glow top */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, #D4A43E55 0%, transparent 70%)',
                filter: 'blur(24px)',
              }}
            />

            {/* Dismiss button */}
            <button
              onClick={onDecline}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#C9A96E]/60 hover:text-[#C9A96E] hover:bg-white/10 transition-all z-10"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 p-8 flex flex-col items-center text-center gap-6">
              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-[#D4A43E]/40 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #A0572B, #7B3F1A)' }}
              >
                <Maximize2 size={36} className="text-[#D4A43E]" />
              </motion.div>

              {/* Sparkle badges */}
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-[#D4A43E]" />
                <span className="text-[10px] font-black text-[#D4A43E] uppercase tracking-[0.25em]">
                  Mode Immersif
                </span>
                <Sparkles size={12} className="text-[#D4A43E]" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-black text-white tracking-tight leading-tight">
                  Passer en plein écran ?
                </h2>
                <p className="text-[#C9A96E]/80 text-sm font-bold leading-relaxed">
                  Pour une meilleure expérience de jeu, nous recommandons d'activer le mode plein écran.
                </p>
              </div>

              {/* Decorative divider & Progress */}
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4A43E]/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A43E]/50" />
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4A43E]/30" />
                </div>
                
                {/* Background preloading indicator */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#C9A96E]/50 uppercase tracking-widest">
                    <Loader2 size={10} className="animate-spin" />
                    Chargement des ressources... {progress}%
                  </div>
                  <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-[#A87D28] to-[#D4A43E]"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col gap-3">
                <motion.button
                  ref={acceptRef}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAccept}
                  className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-tight text-[#4E2510] flex items-center justify-center gap-2.5 shadow-lg border-b-4 border-[#A87D28] active:translate-y-0.5 active:border-b-0 transition-all"
                  style={{ background: 'linear-gradient(135deg, #F0CC7A, #D4A43E)' }}
                >
                  <Maximize2 size={18} />
                  Oui, plein écran !
                </motion.button>

                <button
                  onClick={onDecline}
                  className="w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-[#C9A96E]/60 hover:text-[#C9A96E] transition-colors"
                >
                  Non merci, continuer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
