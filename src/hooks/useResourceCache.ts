import { useState, useEffect, useRef, useCallback } from 'react';
import { type Asset } from './useAssetPreloader';

// ─── Types ───────────────────────────────────────────────────────────────────

export type LogStatus = 'info' | 'success' | 'error' | 'skip';

export interface CacheLog {
  id: number;
  timestamp: number;
  message: string;
  status: LogStatus;
  assetUrl?: string;
}

export interface ResourceCacheState {
  logs: CacheLog[];
  progress: number;         // 0–100 global
  groupProgress: number;    // 0–100 current group
  currentGroup: number;     // 0-based index
  totalGroups: number;
  isComplete: boolean;
  loadedCount: number;
  totalCount: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CACHE_PREFIX = 'resource_cache_v1_';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const VIDEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day
const DB_QUERY_TTL_MS = 60 * 60 * 1000; // 1 hour

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashUrl(url: string): string {
  // Simple hash for use as localStorage key suffix
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash * 31 + url.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

function getCacheKey(url: string): string {
  return CACHE_PREFIX + hashUrl(url);
}

function isCached(url: string, type: Asset['type']): boolean {
  try {
    const key = getCacheKey(url);
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const entry = JSON.parse(raw);
    const ttl = type === 'video' ? VIDEO_CACHE_TTL_MS : CACHE_TTL_MS;
    return Date.now() - entry.timestamp < ttl;
  } catch {
    return false;
  }
}

function markCached(url: string): void {
  try {
    const key = getCacheKey(url);
    localStorage.setItem(key, JSON.stringify({ cached: true, timestamp: Date.now() }));
  } catch {
    // localStorage full — ignore silently
  }
}

function shortName(url: string): string {
  try {
    const parts = url.split('/');
    const name = parts[parts.length - 1].split('?')[0];
    return name.length > 40 ? name.slice(0, 37) + '…' : name;
  } catch {
    return url;
  }
}

// ─── Cache DB Query ───────────────────────────────────────────────────────────

const DB_CACHE_KEY = 'resource_cache_asset_list_v1';

export function getCachedAssetList(): Asset[][] | null {
  try {
    const raw = localStorage.getItem(DB_CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > DB_QUERY_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function setCachedAssetList(groups: Asset[][]): void {
  try {
    localStorage.setItem(DB_CACHE_KEY, JSON.stringify({ data: groups, timestamp: Date.now() }));
  } catch {
    // ignore
  }
}

// ─── Main Hook ───────────────────────────────────────────────────────────────

let logIdCounter = 0;

export function useResourceCache(priorityGroups: Asset[][]): ResourceCacheState {
  const [logs, setLogs] = useState<CacheLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [groupProgress, setGroupProgress] = useState(0);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const loadedUrlsRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  const totalCount = priorityGroups.reduce((acc, g) => acc + g.length, 0);
  const totalGroups = priorityGroups.length;

  const addLog = useCallback((message: string, status: LogStatus, assetUrl?: string) => {
    if (!mountedRef.current) return;
    setLogs(prev => {
      const entry: CacheLog = {
        id: ++logIdCounter,
        timestamp: Date.now(),
        message,
        status,
        assetUrl,
      };
      // Keep last 80 logs to avoid memory bloat
      const next = [...prev, entry];
      return next.length > 80 ? next.slice(next.length - 80) : next;
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (totalCount === 0) {
      setIsComplete(true);
      setProgress(100);
      return;
    }

    let globalLoaded = 0;

    const updateProgress = (loaded: number) => {
      if (!mountedRef.current) return;
      globalLoaded = loaded;
      const pct = Math.round((loaded / totalCount) * 100);
      setProgress(pct);
      setLoadedCount(loaded);
    };

    const loadAsset = (asset: Asset): Promise<void> => {
      const name = shortName(asset.url);

      // Already loaded this session
      if (loadedUrlsRef.current.has(asset.url)) {
        addLog(`↩ Déjà chargé : ${name}`, 'skip', asset.url);
        return Promise.resolve();
      }

      // Check localStorage cache
      if (isCached(asset.url, asset.type)) {
        loadedUrlsRef.current.add(asset.url);
        addLog(`📦 Cache local : ${name}`, 'skip', asset.url);
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const onSuccess = () => {
          if (!mountedRef.current) { resolve(); return; }
          loadedUrlsRef.current.add(asset.url);
          markCached(asset.url);
          addLog(`✓ Chargé : ${name}`, 'success', asset.url);
          resolve();
        };

        const onError = () => {
          if (!mountedRef.current) { resolve(); return; }
          addLog(`✗ Erreur : ${name}`, 'error', asset.url);
          resolve(); // continue even on error
        };

        if (asset.type === 'image') {
          const img = new Image();
          img.src = asset.url;
          img.onload = onSuccess;
          img.onerror = onError;
        } else if (asset.type === 'audio') {
          const audio = new Audio();
          audio.src = asset.url;
          audio.oncanplaythrough = onSuccess;
          audio.onerror = onError;
          audio.load();
        } else if (asset.type === 'video') {
          const video = document.createElement('video');
          video.src = asset.url;
          video.oncanplaythrough = onSuccess;
          video.onerror = onError;
          video.preload = 'auto';
          video.load();
        } else {
          onSuccess();
        }
      });
    };

    const loadGroups = async () => {
      for (let gi = 0; gi < priorityGroups.length; gi++) {
        if (!mountedRef.current) return;

        const group = priorityGroups[gi];
        if (group.length === 0) continue;

        addLog(`⬇ Groupe ${gi + 1}/${priorityGroups.length} — ${group.length} ressource(s)`, 'info');
        if (mountedRef.current) {
          setCurrentGroup(gi);
          setGroupProgress(0);
        }

        let groupDone = 0;
        await Promise.all(
          group.map(asset =>
            loadAsset(asset).then(() => {
              groupDone++;
              globalLoaded++;
              if (mountedRef.current) {
                setGroupProgress(Math.round((groupDone / group.length) * 100));
                updateProgress(globalLoaded);
              }
            })
          )
        );

        addLog(`✅ Groupe ${gi + 1} terminé`, 'success');
      }

      if (mountedRef.current) {
        setIsComplete(true);
        setProgress(100);
        setCurrentGroup(priorityGroups.length);
        addLog('🎉 Toutes les ressources sont prêtes !', 'success');
      }
    };

    addLog('🚀 Démarrage du chargement des ressources…', 'info');
    loadGroups();
  }, [priorityGroups, totalCount, addLog]);

  return {
    logs,
    progress,
    groupProgress,
    currentGroup,
    totalGroups,
    isComplete,
    loadedCount,
    totalCount,
  };
}
