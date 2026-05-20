import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, XCircle, SkipForward, Info } from 'lucide-react';
import { type CacheLog, type ResourceCacheState } from '../hooks/useResourceCache';

interface LoadingModalProps extends ResourceCacheState {
  visible: boolean;
  onDismiss: () => void;
}

const STATUS_ICON = {
  success: <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />,
  error:   <XCircle     size={10} className="text-red-400 shrink-0" />,
  skip:    <SkipForward size={10} className="text-slate-400 shrink-0" />,
  info:    <Info        size={10} className="text-voyage-accent shrink-0" />,
};

const STATUS_TEXT: Record<CacheLog['status'], string> = {
  success: 'text-emerald-700',
  error:   'text-red-500',
  skip:    'text-slate-400',
  info:    'text-voyage-primary/70',
};

const GROUP_LABELS = [
  'Priorité 1 — Intro & Logo',
  'Priorité 2 — Sons & Effets',
  'Priorité 3 — Illustrations',
  'Priorité 4 — Cinématiques & Audio',
];

export default function LoadingModal({
  visible,
  onDismiss,
  logs,
  progress,
  groupProgress,
  currentGroup,
  totalGroups,
  isComplete,
  loadedCount,
  totalCount,
}: LoadingModalProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as new logs arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  const canDismiss = isComplete || progress >= 30;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#1A0F07]/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="w-full max-w-lg bg-voyage-sand border-t-2 border-voyage-secondary/30 rounded-t-[32px] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
            style={{ maxHeight: '75vh' }}
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-voyage-secondary/20">
              <div className="flex items-center gap-3">
                {!isComplete ? (
                  <Loader2 size={18} className="text-voyage-accent animate-spin" />
                ) : (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                )}
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-voyage-primary">
                    {isComplete ? 'Ressources prêtes' : 'Chargement en cours…'}
                  </p>
                  <p className="text-[9px] font-bold text-voyage-primary/40 uppercase tracking-widest mt-0.5">
                    {GROUP_LABELS[Math.min(currentGroup, GROUP_LABELS.length - 1)]}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-voyage-primary-dark tabular-nums">
                  {Math.round(progress)}%
                </span>
                <p className="text-[9px] font-bold text-voyage-primary/40 uppercase tracking-widest">
                  {loadedCount}/{totalCount}
                </p>
              </div>
            </div>

            {/* Global Progress Bar */}
            <div className="px-6 py-3 space-y-1.5">
              {/* Total */}
              <div className="relative h-2 w-full bg-voyage-secondary/20 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
                  className="absolute inset-y-0 left-0 bg-voyage-accent rounded-full"
                />
              </div>

              {/* Current group */}
              {!isComplete && (
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-voyage-primary/40 uppercase tracking-widest shrink-0">
                    Groupe {currentGroup + 1}/{totalGroups}
                  </span>
                  <div className="flex-1 h-1 bg-voyage-secondary/15 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${groupProgress}%` }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                      className="h-full bg-voyage-primary/40 rounded-full"
                    />
                  </div>
                  <span className="text-[8px] font-black text-voyage-primary/40 tabular-nums shrink-0">
                    {groupProgress}%
                  </span>
                </div>
              )}
            </div>

            {/* Log Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-0.5 scrollbar-hide min-h-0">
              <div className="bg-[#1A0F07]/5 rounded-2xl p-3 font-mono space-y-1">
                {logs.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-0.5">{STATUS_ICON[log.status]}</span>
                    <span className={`text-[10px] leading-relaxed ${STATUS_TEXT[log.status]} break-all`}>
                      {log.message}
                    </span>
                    <span className="text-[8px] text-slate-300 shrink-0 ml-auto">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Footer Action */}
            <div className="px-6 py-4 border-t border-voyage-secondary/20">
              <motion.button
                whileHover={canDismiss ? { scale: 1.02 } : {}}
                whileTap={canDismiss ? { scale: 0.98 } : {}}
                onClick={canDismiss ? onDismiss : undefined}
                disabled={!canDismiss}
                className={[
                  'w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2',
                  canDismiss
                    ? 'bg-voyage-primary text-white shadow-lg shadow-voyage-primary/20 active:scale-95'
                    : 'bg-voyage-secondary/20 text-voyage-primary/30 cursor-not-allowed',
                ].join(' ')}
              >
                {isComplete ? (
                  <>
                    <CheckCircle2 size={14} />
                    Tout est prêt — Continuer
                  </>
                ) : canDismiss ? (
                  <>
                    <SkipForward size={14} />
                    Continuer en arrière-plan
                  </>
                ) : (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Chargement de l'essentiel…
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
