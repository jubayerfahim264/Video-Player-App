/**
 * Scans device storage for video files.
 * Uses react-native-fs to list directories recursively.
 * Android: requires READ_MEDIA_VIDEO (API 33+) or READ_EXTERNAL_STORAGE.
 */
import RNFS from 'react-native-fs';
import { isVideoFile } from '../constants/videoExtensions';
import {
  DEFAULT_SCAN_PATHS,
  MAX_SCAN_DEPTH,
} from '../constants/storagePaths';
import type { VideoItem, VideoScanResult, FolderItem, VideosByFolder } from '../types';

/** Generate a stable id from file path */
function videoId(path: string): string {
  return path.replace(/[/\\]/g, '_');
}

/** Get file name without extension */
function titleFromName(name: string): string {
  const lastDot = name.lastIndexOf('.');
  return lastDot > 0 ? name.slice(0, lastDot) : name;
}

/** Build VideoItem from path and file item (has path, name, size?, mtime?) */
function toVideoItem(
  path: string,
  name: string,
  stat: { size?: number; mtime?: string }
): VideoItem {
  const folderPath = path.slice(0, Math.max(0, path.length - name.length - 1));
  return {
    id: videoId(path),
    path,
    name,
    title: titleFromName(name),
    size: stat?.size ?? 0,
    modifiedAt: stat?.mtime ? new Date(stat.mtime).getTime() : 0,
    folderPath,
  };
}

/**
 * Recursively scan a directory for video files.
 * Stops at MAX_SCAN_DEPTH to avoid scanning entire device.
 */
async function scanDirectory(
  dirPath: string,
  depth: number,
  acc: VideoItem[]
): Promise<void> {
  if (depth > MAX_SCAN_DEPTH) return;
  let items: RNFS.ReadDirItem[];
  try {
    items = await RNFS.readDir(dirPath);
  } catch {
    return;
  }
  for (const item of items) {
    const fullPath = item.path;
    const isDir = typeof item.isDirectory === 'function' ? item.isDirectory() : false;
    const isFile = typeof item.isFile === 'function' ? item.isFile() : !isDir;
    if (isDir) {
      await scanDirectory(fullPath, depth + 1, acc);
    } else if (isFile && isVideoFile(item.name)) {
      acc.push(toVideoItem(fullPath, item.name, item));
    }
  }
}

/**
 * Get root paths to scan: external storage + optional subdirs.
 * On Android, ExternalStorageDirectoryPath is typically /storage/emulated/0.
 */
async function getScanRoots(): Promise<string[]> {
  const roots: string[] = [];
  try {
    const external = RNFS.ExternalStorageDirectoryPath ?? RNFS.DocumentDirectoryPath;
    roots.push(external);
    for (const sub of DEFAULT_SCAN_PATHS) {
      if (sub === '') continue;
      const combined = `${external}/${sub}`;
      try {
        const stat = await RNFS.stat(combined);
        if (stat.isDirectory()) roots.push(combined);
      } catch {
        // skip missing dirs
      }
    }
  } catch (e) {
    roots.push(RNFS.DocumentDirectoryPath);
  }
  return roots.length > 0 ? roots : [RNFS.DocumentDirectoryPath];
}

/**
 * Build folders and byFolder map from flat video list.
 */
function buildFoldersAndMap(allVideos: VideoItem[]): {
  byFolder: VideosByFolder;
  folders: FolderItem[];
} {
  const byFolder: VideosByFolder = {};
  for (const v of allVideos) {
    const key = v.folderPath || v.path;
    if (!byFolder[key]) byFolder[key] = [];
    byFolder[key].push(v);
  }
  const folders: FolderItem[] = Object.entries(byFolder).map(([path, videos]) => ({
    id: videoId(path),
    path,
    name: path.split('/').filter(Boolean).pop() ?? path,
    videoCount: videos.length,
    previewVideoPath: videos[0]?.path,
  }));
  return { byFolder, folders };
}

/**
 * Run full device video scan.
 * Returns all videos, grouped by folder, and folder list.
 */
export async function scanDeviceVideos(): Promise<VideoScanResult> {
  const start = Date.now();
  const allVideos: VideoItem[] = [];
  const roots = await getScanRoots();

  for (const root of roots) {
    await scanDirectory(root, 0, allVideos);
  }

  const { byFolder, folders } = buildFoldersAndMap(allVideos);
  const scanDurationMs = Date.now() - start;

  return {
    allVideos,
    byFolder,
    folders,
    scanDurationMs,
  };
}
