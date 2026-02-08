/**
 * Holds the video library: all videos, folders, recent, favorites.
 * Favorites and recent are persisted via playbackStorageService.
 */
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import type {
  VideoItem,
  FolderItem,
  VideosByFolder,
  VideoScanResult,
} from '../types';
import { getFavoriteIds, getRecentVideos, setFavoriteIds, setRecentVideos } from '../services/playbackStorageService';

interface VideoLibraryState {
  allVideos: VideoItem[];
  folders: FolderItem[];
  byFolder: VideosByFolder;
  recentVideos: VideoItem[];
  favoriteIds: Set<string>;
  /** Last full scan duration in ms */
  scanDurationMs: number;
}

interface VideoLibraryContextValue extends VideoLibraryState {
  /** Set library from a scan result (e.g. from useVideoScanner) */
  setScanResult: (result: VideoScanResult | null) => void;
  /** Mark video as favorite / unfavorite (persistence in next phase) */
  toggleFavorite: (videoId: string) => void;
  /** Add video to recent list (called when playback starts; persistence in next phase) */
  addToRecent: (video: VideoItem) => void;
  /** Clear all data (e.g. after permission revoked) */
  clear: () => void;
}

const defaultState: VideoLibraryState = {
  allVideos: [],
  folders: [],
  byFolder: {},
  recentVideos: [],
  favoriteIds: new Set(),
  scanDurationMs: 0,
};

const defaultValue: VideoLibraryContextValue = {
  ...defaultState,
  setScanResult: () => {},
  toggleFavorite: () => {},
  addToRecent: () => {},
  clear: () => {},
};

export const VideoLibraryContext = createContext<VideoLibraryContextValue>(defaultValue);

export function VideoLibraryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VideoLibraryState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [favs, recent] = await Promise.all([getFavoriteIds(), getRecentVideos()]);
      if (!cancelled) {
        setState((prev) => ({ ...prev, favoriteIds: favs, recentVideos: recent }));
        setHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setFavoriteIds(state.favoriteIds).catch(() => {});
  }, [hydrated, state.favoriteIds]);

  useEffect(() => {
    if (!hydrated) return;
    setRecentVideos(state.recentVideos).catch(() => {});
  }, [hydrated, state.recentVideos]);

  const setScanResult = useCallback((result: VideoScanResult | null) => {
    if (!result) {
      setState(defaultState);
      return;
    }
    setState((prev) => ({
      ...prev,
      allVideos: result.allVideos,
      folders: result.folders,
      byFolder: result.byFolder,
      scanDurationMs: result.scanDurationMs,
    }));
  }, []);

  const toggleFavorite = useCallback((videoId: string) => {
    setState((prev) => {
      const next = new Set(prev.favoriteIds);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      return { ...prev, favoriteIds: next };
    });
  }, []);

  const addToRecent = useCallback((video: VideoItem) => {
    setState((prev) => {
      const without = prev.recentVideos.filter((v) => v.id !== video.id);
      const recentVideos = [video, ...without].slice(0, 50);
      return { ...prev, recentVideos };
    });
  }, []);

  const clear = useCallback(() => {
    setState(defaultState);
  }, []);

  const value: VideoLibraryContextValue = {
    ...state,
    setScanResult,
    toggleFavorite,
    addToRecent,
    clear,
  };

  return (
    <VideoLibraryContext.Provider value={value}>
      {children}
    </VideoLibraryContext.Provider>
  );
}

export function useVideoLibrary() {
  const context = useContext(VideoLibraryContext);
  if (!context) {
    throw new Error('useVideoLibrary must be used within VideoLibraryProvider');
  }
  return context;
}
