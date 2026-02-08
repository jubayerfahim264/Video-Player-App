/**
 * All Videos tab: flat list of every scanned video.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { usePermissions } from '../hooks/usePermissions';
import { useVideoScanner } from '../hooks/useVideoScanner';
import { useVideoLibrary } from '../contexts/VideoLibraryContext';
import { useAppUi } from '../contexts/AppUiContext';
import { t } from '../i18n';
import { VideoList } from '../components/video/VideoList';
import type { VideoItem } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export function AllVideosScreen() {
  const navigation = useNavigation<Nav>();
  const { canAccessVideos } = usePermissions();
  const { result, loading, error, scan } = useVideoScanner();
  const { allVideos, setScanResult, toggleFavorite, favoriteIds } = useVideoLibrary();
  const { openPrivacyPolicy } = useAppUi();

  useEffect(() => {
    if (canAccessVideos && !result && !loading) scan();
  }, [canAccessVideos, result, loading, scan]);

  useEffect(() => {
    if (result) setScanResult(result);
  }, [result, setScanResult]);

  const openPlayer = (video: VideoItem) => {
    navigation.navigate('Player', { video, list: allVideos });
  };

  if (!canAccessVideos) {
    return (
      <View style={styles.centered}>
        <Text style={styles.hint}>Grant storage access to see videos.</Text>
      </View>
    );
  }

  if (loading && allVideos.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a9eff" />
        <Text style={styles.hint}>Scanning for videos…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.btn} onPress={scan}>
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Videos</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={scan} disabled={loading}>
            <Text style={styles.actionText}>{loading ? '…' : 'Refresh'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openPrivacyPolicy}>
            <Text style={styles.actionSub}>{t('common.privacyPolicy')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <VideoList
        videos={allVideos}
        onPressVideo={openPlayer}
        emptyMessage="No videos found. Tap Refresh to scan."
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  title: { fontSize: 18, fontWeight: '600', color: '#fff' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionText: { color: '#4a9eff', fontSize: 14 },
  actionSub: { color: '#888', fontSize: 13 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  hint: { color: '#888', fontSize: 16, textAlign: 'center' },
  error: { color: '#e57373', fontSize: 16, textAlign: 'center', marginBottom: 12 },
  btn: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#333', borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 14 },
});
