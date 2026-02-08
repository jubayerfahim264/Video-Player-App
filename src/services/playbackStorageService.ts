/**
 * Persist favorites, recent videos, and last playback position via AsyncStorage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { VideoItem } from '../types';

const KEYS = {
  FAVORITE_IDS: '@VideoPlayer/favoriteIds',
  RECENT_VIDEOS: '@VideoPlayer/recentVideos',
  LAST_POSITIONS: '@VideoPlayer/lastPositions',
} as const;

const MAX_RECENT = 50;
const RECENT_VIDEOS_MAX_ITEMS = 50;

/** Last position in seconds and duration for resume dialog */
export interface LastPosition {
  position: number;
  duration: number;
  updatedAt: number;
}

export async function getFavoriteIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FAVORITE_IDS);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export async function setFavoriteIds(ids: Set<string>): Promise<void> {
  await AsyncStorage.setItem(KEYS.FAVORITE_IDS, JSON.stringify([...ids]));
}

export async function getRecentVideos(): Promise<VideoItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.RECENT_VIDEOS);
    if (!raw) return [];
    const arr = JSON.parse(raw) as VideoItem[];
    return Array.isArray(arr) ? arr.slice(0, RECENT_VIDEOS_MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

export async function setRecentVideos(videos: VideoItem[]): Promise<void> {
  await AsyncStorage.setItem(
    KEYS.RECENT_VIDEOS,
    JSON.stringify(videos.slice(0, RECENT_VIDEOS_MAX_ITEMS))
  );
}

export async function getLastPositions(): Promise<Record<string, LastPosition>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.LAST_POSITIONS);
    if (!raw) return {};
    const obj = JSON.parse(raw) as Record<string, LastPosition>;
    return typeof obj === 'object' && obj !== null ? obj : {};
  } catch {
    return {};
  }
}

export async function setLastPosition(
  videoId: string,
  position: number,
  duration: number
): Promise<void> {
  const all = await getLastPositions();
  all[videoId] = { position, duration, updatedAt: Date.now() };
  await AsyncStorage.setItem(KEYS.LAST_POSITIONS, JSON.stringify(all));
}

export async function getLastPosition(videoId: string): Promise<LastPosition | null> {
  const all = await getLastPositions();
  return all[videoId] ?? null;
}
