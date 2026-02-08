/**
 * AdMob configuration – Ad Unit IDs and App ID.
 * Use test IDs in development; replace with real IDs from AdMob console for production.
 * @see https://developers.google.com/admob/android/test-ads
 */
import { TestIds } from 'react-native-google-mobile-ads';

/** Use test ads in dev (__DEV__ is set by React Native bundler) */
const useTestAds = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

/** Production Ad Unit IDs – replace with your real IDs from AdMob dashboard */
export const AD_UNIT_IDS = {
  /** Banner (bottom of main screen) */
  BANNER: useTestAds ? TestIds.BANNER : 'ca-app-pub-3781453093578120/9637418803',
  /** Interstitial (after user action, not during playback) */
  INTERSTITIAL: useTestAds ? TestIds.INTERSTITIAL : 'ca-app-pub-3781453093578120/8951866988',
  /** Rewarded (optional – unlock premium features) */
  REWARDED: useTestAds ? TestIds.REWARDED : 'ca-app-pub-3781453093578120/2965043138',
} as const;

/** Use test ads when true; real ads when false (e.g. release build) */
export const USE_TEST_ADS = useTestAds;
