/**
 * Supported video file extensions for scanning.
 * Uppercase variants are included for case-insensitive matching.
 */
export const VIDEO_EXTENSIONS = [
  '3g2',
  '3gp',
  'avi',
  'm4v',
  'mkv',
  'mov',
  'mp4',
  'mpeg',
  'mpg',
  'webm',
  'wmv',
] as const;

export type VideoExtension = (typeof VIDEO_EXTENSIONS)[number];

/** Set for O(1) lookup when filtering files */
export const VIDEO_EXTENSION_SET = new Set<string>(
  VIDEO_EXTENSIONS.flatMap((ext) => [ext, ext.toUpperCase()])
);

export function isVideoFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXTENSION_SET.has(ext);
}
