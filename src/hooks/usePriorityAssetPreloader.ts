import { useState, useEffect, useRef } from 'react';
import { type Asset } from './useAssetPreloader';

export function usePriorityAssetPreloader(priorityGroups: Asset[][]) {
  const loadedUrls = useRef<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);

  const totalAssets = priorityGroups.reduce((acc, group) => acc + group.length, 0);

  useEffect(() => {
    if (totalAssets === 0) {
      setIsComplete(true);
      setProgress(100);
      return;
    }

    let mounted = true;

    const loadGroup = async (groupIdx: number) => {
      if (groupIdx >= priorityGroups.length) {
        if (mounted) setIsComplete(true);
        return;
      }

      const group = priorityGroups[groupIdx];
      const groupPromises = group.map(asset => {
        if (loadedUrls.current.has(asset.url)) return Promise.resolve();

        return new Promise<void>((resolve) => {
          const onComplete = () => {
            if (mounted) {
              loadedUrls.current.add(asset.url);
              const totalLoaded = Array.from(loadedUrls.current).length;
              setProgress(Math.round((totalLoaded / totalAssets) * 100));
            }
            resolve();
          };

          if (asset.type === 'image') {
            const img = new Image();
            img.src = asset.url;
            img.onload = onComplete;
            img.onerror = onComplete; // Continue on error
          } else if (asset.type === 'audio') {
            const audio = new Audio();
            audio.src = asset.url;
            audio.oncanplaythrough = onComplete;
            audio.onerror = onComplete;
            audio.load();
          } else if (asset.type === 'video') {
            const video = document.createElement('video');
            video.src = asset.url;
            video.oncanplaythrough = onComplete;
            video.onerror = onComplete;
            video.load();
          }
        });
      });

      await Promise.all(groupPromises);
      if (mounted) {
        setCurrentGroupIdx(groupIdx + 1);
      }
    };

    loadGroup(currentGroupIdx);

    return () => {
      mounted = false;
    };
  }, [currentGroupIdx, priorityGroups, totalAssets]);

  return { progress, isComplete, currentGroupIdx };
}
