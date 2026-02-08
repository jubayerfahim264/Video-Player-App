/**
 * Default storage paths to scan for videos (Android).
 * react-native-fs provides ExternalStorageDirectoryPath (e.g. /storage/emulated/0).
 * We also scan common subdirs and, when available, secondary storage (SD card).
 */
export const DEFAULT_SCAN_PATHS = [
  '', // root of external storage
  'DCIM',
  'Movies',
  'Download',
  'Downloads',
  'Video',
  'Videos',
  'Pictures',
  'Documents',
] as const;

/** Max depth for recursive directory scan to avoid runaway scans */
export const MAX_SCAN_DEPTH = 8;

/** Approximate max files to scan before yielding (batch size) */
export const SCAN_BATCH_SIZE = 100;
