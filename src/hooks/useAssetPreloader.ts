import { useState, useEffect, useRef } from 'react';

export type AssetType = 'image' | 'audio' | 'video';

export interface Asset {
  url: string;
  type: AssetType;
}

export function useAssetPreloader(assets: Asset[]) {
  const loadedUrls = useRef<Set<string>>(new Set());
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
    // Count how many of the currently requested assets are already loaded
    let loadedCount = assets.filter(a => loadedUrls.current.has(a.url)).length;

    const updateProgress = (url: string) => {
      if (url && !loadedUrls.current.has(url)) {
        loadedUrls.current.add(url);
        loadedCount++;
      }
      
      if (mounted) {
        const newProgress = Math.round((loadedCount / assets.length) * 100);
        setProgress(newProgress);
        if (loadedCount >= assets.length) {
          setIsComplete(true);
        }
      }
    };

    const handleError = (url: string) => {
      console.error(`Failed to load asset: ${url}`);
      updateProgress(url);
    };

    assets.forEach((asset) => {
      if (loadedUrls.current.has(asset.url)) return;

      if (asset.type === 'image') {
        const img = new Image();
        img.src = asset.url;
        img.onload = () => updateProgress(asset.url);
        img.onerror = () => handleError(asset.url);
      } else if (asset.type === 'audio') {
        const audio = new Audio();
        audio.src = asset.url;
        audio.oncanplaythrough = () => updateProgress(asset.url);
        audio.onerror = () => handleError(asset.url);
        audio.load();
      } else if (asset.type === 'video') {
        const video = document.createElement('video');
        video.src = asset.url;
        video.oncanplaythrough = () => updateProgress(asset.url);
        video.onerror = () => handleError(asset.url);
        video.load();
      }
    });

    // Set initial progress for already loaded assets
    if (mounted) {
      const initialProgress = Math.round((loadedCount / assets.length) * 100);
      setProgress(initialProgress);
      if (loadedCount >= assets.length) setIsComplete(true);
    }

    return () => {
      mounted = false;
    };
  }, [assets]);

  return { progress, isComplete, error };
}
