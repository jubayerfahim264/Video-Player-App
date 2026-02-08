/**
 * Banner ad for bottom of main screen.
 * Uses test ID in development and real ID in production (from adMob config).
 * Handles load, error, and optional reload on foreground (iOS).
 */
import React, { useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../../config/adMob';

export function BannerAd() {
  const bannerRef = useRef<RNBannerAd>(null);

  // On iOS, WKWebView can show empty banner after app returns from background; reload when foregrounded.
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  return (
    <View style={styles.container}>
      <RNBannerAd
        ref={bannerRef}
        unitId={AD_UNIT_IDS.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          // Optional: track load success
        }}
        onAdFailedToLoad={(error) => {
          if (__DEV__) {
            console.warn('Banner ad failed to load:', error);
          }
        }}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 4,
  },
});
