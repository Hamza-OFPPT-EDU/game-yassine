import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
  initialSeconds: number;
  enabled?: boolean;
  onTimeExpired?: () => void;
  onTick?: (remaining: number) => void;
}

export function useTimer({
  initialSeconds,
  enabled = true,
  onTimeExpired,
  onTick,
}: UseTimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(enabled);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle time expiration
  useEffect(() => {
    if (!isActive || remaining > 0) return;

    setIsActive(false);
    onTimeExpired?.();
  }, [remaining, isActive, onTimeExpired]);

  // Timer tick effect
  useEffect(() => {
    if (!isActive || remaining <= 0) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 0.1;
        onTick?.(Math.max(0, next));
        return Math.max(0, next);
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onTick]);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const resume = useCallback(() => {
    if (remaining > 0) {
      setIsActive(true);
    }
  }, [remaining]);

  const reset = useCallback((newTime?: number) => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setRemaining(newTime ?? initialSeconds);
  }, [initialSeconds]);

  const percentRemaining = (remaining / initialSeconds) * 100;
  const isWarning = percentRemaining <= 25;
  const isCritical = percentRemaining <= 10;

  return {
    remaining: Math.max(0, remaining),
    percentRemaining,
    isActive,
    isWarning,
    isCritical,
    isExpired: remaining <= 0,
    pause,
    resume,
    reset,
  };
}
