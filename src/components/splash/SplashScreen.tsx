/**
 * Splash screen overlay: shows "Made by Jubayer Fahim" with a smooth fade-in,
 * then fades out and calls onFinish after 2.5s so the app can hide it.
 * Matches the native Android splash (dark background) for a seamless transition.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Match native splash colors (see android res/values/colors.xml)
const SPLASH_BG = '#0D0D0D';
const TEXT_COLOR = 'rgba(255, 255, 255, 0.9)';

const DISPLAY_DURATION_MS = 2500;
const FADE_IN_DURATION_MS = 400;
const FADE_OUT_DURATION_MS = 350;

export interface SplashScreenProps {
  /** Called when splash has finished (after fade-out). Parent should unmount splash. */
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    // Fade-in + slight scale on mount
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_IN_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: FADE_IN_DURATION_MS,
        useNativeDriver: true,
      }),
    ]).start();

    const hideTimer = setTimeout(() => {
      // Fade out, then notify parent
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: FADE_OUT_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.02,
          duration: FADE_OUT_DURATION_MS,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, DISPLAY_DURATION_MS);

    return () => clearTimeout(hideTimer);
  }, [opacity, scale, onFinish]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.text}>Made by Jubayer Fahim</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SPLASH_BG,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: SCREEN_WIDTH * 0.85,
  },
  text: {
    color: TEXT_COLOR,
    fontSize: 18,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
});
