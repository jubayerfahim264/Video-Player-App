/**
 * Core types for the VideoPlayer app.
 */

/** Single video file as returned by scanner or library */
export interface VideoItem {
  id: string;
  path: string;
  name: string;
  /** File name without extension */
  title: string;
  /** File size in bytes */
  size: number;
  /** Duration in seconds; may be 0 until loaded by player */
  duration?: number;
  /** MIME type if available */
  mimeType?: string;
  /** Last modified timestamp (ms) */
  modifiedAt: number;
  /** Parent directory path (for folder grouping) */
  folderPath: string;
  /** Optional thumbnail path (generated or cached) */
  thumbnailPath?: string;
}

/** Folder containing one or more videos */
export interface FolderItem {
  id: string;
  path: string;
  name: string;
  videoCount: number;
  /** First video path for folder thumbnail preview */
  previewVideoPath?: string;
}

/** Grouped view: folder path -> videos */
export type VideosByFolder = Record<string, VideoItem[]>;

/** Result of a full device scan */
export interface VideoScanResult {
  allVideos: VideoItem[];
  byFolder: VideosByFolder;
  folders: FolderItem[];
  /** Scan duration in ms */
  scanDurationMs: number;
}

/** Permission status from react-native-permissions */
export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'limited'
  | 'unavailable';

/** Storage permission state for the app */
export interface StoragePermissionState {
  status: PermissionStatus;
  /** True when we have any form of access to read videos */
  canAccessVideos: boolean;
  /** User has permanently denied (should show "open settings") */
  isBlocked: boolean;
}
