import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface TimerBarProps {
  percentRemaining: number;
  secondsRemaining: number;
  isWarning: boolean;
  isCritical: boolean;
  isPaused: boolean;
}

export function TimerBar({
  percentRemaining,
  secondsRemaining,
  isWarning,
  isCritical,
  isPaused,
}: TimerBarProps) {
  const displaySeconds = Math.max(0, Math.ceil(secondsRemaining));

  return (
    <div className="w-full bg-gradient-to-b from-white to-voyage-secondary/10 backdrop-blur-sm border-b border-voyage-secondary/20 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        {/* Timer Display */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: isCritical ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: isCritical ? Infinity : 0,
              }}
            >
              <Clock
                size={20}
                className={cn(
                  'transition-colors',
                  isCritical
                    ? 'text-red-500'
                    : isWarning
                      ? 'text-yellow-500'
                      : 'text-voyage-primary'
                )}
              />
            </motion.div>
            <span
              className={cn(
                'font-black text-lg transition-colors',
                isCritical
                  ? 'text-red-500'
                  : isWarning
                    ? 'text-yellow-600'
                    : 'text-voyage-primary'
              )}
            >
              {displaySeconds}s
            </span>
          </div>
          {isPaused && (
            <span className="text-xs font-bold uppercase text-voyage-secondary tracking-widest">
              ⏸ Suspendu
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-voyage-secondary/20 rounded-full overflow-hidden border border-voyage-secondary/30">
          <motion.div
            className={cn(
              'h-full rounded-full transition-all',
              isCritical
                ? 'bg-gradient-to-r from-red-500 to-red-400'
                : isWarning
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                  : 'bg-gradient-to-r from-voyage-primary to-voyage-primary/80'
            )}
            initial={{ width: '100%' }}
            animate={{ width: `${percentRemaining}%` }}
            transition={{ type: 'linear', duration: 0.1 }}
          />
        </div>

        {/* Warning message at critical */}
        {isCritical && !isPaused && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs font-bold text-red-600 text-center uppercase tracking-widest"
          >
            ⚠️ Temps limite approche!
          </motion.div>
        )}
      </div>
    </div>
  );
}
