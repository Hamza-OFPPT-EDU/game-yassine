import { useState, useEffect } from 'react';

export type AssetType = 'image' | 'audio' | 'video';

export interface Asset {
  url: string;
  type: AssetType;
}

export function useAssetPreloader(assets: Asset[]) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assets.length === 0) {
      setIsComplete(true);
      setProgress(100);
      return;
    }

    let mounted = true;
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      if (mounted) {
        const newProgress = Math.round((loadedCount / assets.length) * 100);
        setProgress(newProgress);
        if (loadedCount === assets.length) {
          setIsComplete(true);
        }
      }
    };

    const handleError = (url: string) => {
      console.error(`Failed to load asset: ${url}`);
      // We still update progress to not block the app indefinitely
      updateProgress();
    };

    assets.forEach((asset) => {
      if (asset.type === 'image') {
        const img = new Image();
        img.src = asset.url;
        img.onload = updateProgress;
        img.onerror = () => handleError(asset.url);
      } else if (asset.type === 'audio') {
        const audio = new Audio();
        audio.src = asset.url;
        audio.oncanplaythrough = updateProgress;
        audio.onerror = () => handleError(asset.url);
        audio.load();
      } else if (asset.type === 'video') {
        const video = document.createElement('video');
        video.src = asset.url;
        video.oncanplaythrough = updateProgress;
        video.onerror = () => handleError(asset.url);
        video.load();
      }
    });

    return () => {
      mounted = false;
    };
  }, [assets]);

  return { progress, isComplete, error };
}
