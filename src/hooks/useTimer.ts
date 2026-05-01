import { useState, useEffect, useRef } from 'react';

interface UseTimerProps {
  initialSeconds: number;
  enabled?: boolean;
  onTimeExpired?: () => void;
}

export function useTimer({
  initialSeconds,
  enabled = true,
  onTimeExpired,
}: UseTimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const deadlineRef = useRef<number>(Date.now() + initialSeconds * 1000);
  const expiredRef = useRef(false);

  // Start/stop interval based on enabled prop
  useEffect(() => {
    if (!enabled || remaining <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start interval
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const nextVal = Math.max(0, (deadlineRef.current - Date.now()) / 1000);
        
        if (nextVal <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (!expiredRef.current) {
            expiredRef.current = true;
            onTimeExpired?.();
          }
          return 0;
        }
        
        return nextVal;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, onTimeExpired]);

  const reset = (newTime?: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const nextTime = newTime ?? initialSeconds;
    deadlineRef.current = Date.now() + nextTime * 1000;
    expiredRef.current = false;
    setRemaining(nextTime);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resume = () => {
    deadlineRef.current = Date.now() + remaining * 1000;
  };

  const clampedRemaining = Math.max(0, remaining);
  const percentRemaining = initialSeconds > 0 ? (clampedRemaining / initialSeconds) * 100 : 0;

  return {
    remaining: clampedRemaining,
    percentRemaining,
    isActive: clampedRemaining > 0 && enabled,
    isWarning: percentRemaining <= 25,
    isCritical: percentRemaining <= 10,
    isExpired: clampedRemaining <= 0,
    pause,
    resume,
    reset,
  };
}
