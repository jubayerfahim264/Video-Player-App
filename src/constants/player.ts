/**
 * Player options: speed, aspect ratio.
 */
export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export type AspectMode = 'fit' | 'fill' | '16:9' | '4:3';

/** Maps to react-native-video resizeMode */
export const ASPECT_RESIZE_MODE: Record<AspectMode, 'contain' | 'cover'> = {
  fit: 'contain',
  fill: 'cover',
  '16:9': 'contain',
  '4:3': 'contain',
};

export const ASPECT_RATIO: Partial<Record<AspectMode, number>> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
};
