/**
 * Storage permission handling for video access.
 * Android: READ_MEDIA_VIDEO (API 33+) or READ_EXTERNAL_STORAGE (older).
 * iOS: Not implemented in this phase (Android-first).
 */
import { Platform } from 'react-native';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';
import type { StoragePermissionState } from '../types';

const ANDROID_VIDEO_PERMISSION =
  Platform.OS === 'android' && Number(Platform.Version) >= 33
    ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

/**
 * Map react-native-permissions result to our app status.
 */
function toStorageState(status: PermissionStatus): StoragePermissionState {
  const canAccessVideos = status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  const isBlocked = status === RESULTS.BLOCKED;
  return {
    status,
    canAccessVideos,
    isBlocked,
  };
}

/**
 * Check current storage permission status.
 */
export async function checkStoragePermission(): Promise<StoragePermissionState> {
  if (Platform.OS !== 'android') {
    return toStorageState(RESULTS.UNAVAILABLE);
  }
  try {
    const status = await check(ANDROID_VIDEO_PERMISSION);
    return toStorageState(status);
  } catch (e) {
    return toStorageState(RESULTS.UNAVAILABLE);
  }
}

/**
 * Request storage permission. On Android, request the appropriate permission
 * for the API level. Returns the resulting state.
 */
export async function requestStoragePermission(): Promise<StoragePermissionState> {
  if (Platform.OS !== 'android') {
    return toStorageState(RESULTS.UNAVAILABLE);
  }
  try {
    const status = await request(ANDROID_VIDEO_PERMISSION, {
      title: 'Storage access',
      message:
        'VideoPlayer needs access to your videos to play them. Grant storage or video access to continue.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    });
    return toStorageState(status);
  } catch (e) {
    return toStorageState(RESULTS.UNAVAILABLE);
  }
}

/**
 * Open app settings so user can grant permission manually (e.g. when blocked).
 */
export async function openAppSettings(): Promise<void> {
  await openSettings();
}
