import { useEffect, useRef, useState, RefObject } from 'react';

interface UseAutoScrollProps {
  targetRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
  offset?: number; // pixels to offset from center
  onScrolDone?: () => void;
}

export function useAutoScroll({
  targetRef,
  enabled = true,
  offset = 0,
  onScrolDone,
}: UseAutoScrollProps) {
  const [isInView, setIsInView] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    // Petit délai pour laisser les animations d'entrée se faire
    scrollTimeoutRef.current = setTimeout(() => {
      targetRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      onScrolDone?.();
    }, 300); // Délai après le montage pour que les animations commencent

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [enabled, targetRef, onScrolDone]);

  // Intersection Observer pour savoir si l'élément est visible
  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }, // Au moins 50% visible
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [targetRef]);

  return { isInView };
}
