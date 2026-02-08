/**
 * VideoPlayer – Offline video player app (Android first).
 * AdMob + Privacy Policy + Navigation (All Videos, Folders, Recent, Favorites).
 * Native splash (Android) + JS splash overlay with "Made by Jubayer Fahim" and fade animation.
 * @format
 */
import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionProvider } from './src/contexts/PermissionContext';
import { VideoLibraryProvider } from './src/contexts/VideoLibraryContext';
import { AppUiProvider, useAppUi } from './src/contexts/AppUiContext';
import { PermissionScreen } from './src/screens/PermissionScreen';
import { PrivacyPolicyScreen } from './src/screens/PrivacyPolicyScreen';
import { BannerAd } from './src/components/ads/BannerAd';
import { SplashScreen } from './src/components/splash/SplashScreen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initializeAdMob } from './src/services/adMobService';
import { setI18nLocaleFromDevice } from './src/i18n';
import { usePermissions } from './src/hooks/usePermissions';

function MainContent() {
  const { showPrivacyPolicy } = useAppUi();
  const { canAccessVideos } = usePermissions();

  useEffect(() => {
    setI18nLocaleFromDevice();
  }, []);

  if (showPrivacyPolicy) {
    return <PrivacyPolicyScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <PermissionScreen />
      {canAccessVideos && (
        <>
          <View style={{ flex: 1 }}>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </View>
          <BannerAd />
        </>
      )}
    </View>
  );
}

function AppContent() {
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <AppUiProvider>
        <MainContent />
      </AppUiProvider>
    </View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initializeAdMob();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={showSplash ? '#0D0D0D' : '#121212'}
      />
      <SafeAreaProvider>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <PermissionProvider>
            <VideoLibraryProvider>
              <AppContent />
            </VideoLibraryProvider>
          </PermissionProvider>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
