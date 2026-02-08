/**
 * AdMob SDK initialization. Call once at app launch.
 * Handles lifecycle safely: load, show, error, reload are handled by ad components.
 */
import mobileAds from 'react-native-google-mobile-ads';

let initialized = false;

/**
 * Initialize Google Mobile Ads SDK. Safe to call multiple times; runs only once.
 * Call before rendering any ad components.
 */
export async function initializeAdMob(): Promise<void> {
  if (initialized) return;
  try {
    await mobileAds().initialize();
    initialized = true;
  } catch (e) {
    // Log but don't throw – app can still run without ads
    if (__DEV__) {
      console.warn('AdMob initialization failed:', e);
    }
  }
}

export function isAdMobInitialized(): boolean {
  return initialized;
}
