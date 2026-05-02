/**
 * Utility to preload assets (Images, Audio, Video)
 */

export type AssetType = 'image' | 'audio' | 'video';

export interface Asset {
  url: string;
  type: AssetType;
}

export async function preloadAssets(
  assets: Asset[],
  onProgress?: (progress: number) => void
): Promise<void> {
  let loadedCount = 0;
  const totalCount = assets.length;

  if (totalCount === 0) {
    onProgress?.(100);
    return;
  }

  const updateProgress = () => {
    loadedCount++;
    onProgress?.(Math.round((loadedCount / totalCount) * 100));
  };

  const promises = assets.map((asset) => {
    switch (asset.type) {
      case 'image':
        return preloadImage(asset.url).then(updateProgress).catch(e => {
          console.warn(`Failed to preload image: ${asset.url}`, e);
          updateProgress();
        });
      case 'audio':
        return preloadAudio(asset.url).then(updateProgress).catch(e => {
          console.warn(`Failed to preload audio: ${asset.url}`, e);
          updateProgress();
        });
      case 'video':
        return preloadVideo(asset.url).then(updateProgress).catch(e => {
          console.warn(`Failed to preload video: ${asset.url}`, e);
          updateProgress();
        });
      default:
        updateProgress();
        return Promise.resolve();
    }
  });

  await Promise.all(promises);
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = reject;
  });
}

function preloadAudio(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = url;
    audio.oncanplaythrough = () => resolve();
    audio.onerror = reject;
    // For audio, we don't necessarily need to wait for it to be fully downloaded, 
    // but canplaythrough is a good indicator it's ready.
    // However, some browsers might not fire it if not interacted with.
    // So we add a timeout just in case.
    setTimeout(resolve, 5000); 
  });
}

function preloadVideo(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;
    video.oncanplaythrough = () => resolve();
    video.onerror = reject;
    setTimeout(resolve, 10000); // Videos can be large
  });
}
