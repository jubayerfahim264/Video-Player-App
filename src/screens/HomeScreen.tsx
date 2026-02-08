/**
 * Main home: placeholder that shows permission status and triggers video scan.
 * Will be expanded to tabs (All Videos, Folders, Recent, Favorites) in next phase.
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { usePermissions } from '../hooks/usePermissions';
import { useVideoScanner } from '../hooks/useVideoScanner';
import { useVideoLibrary } from '../contexts/VideoLibraryContext';
import { useAppUi } from '../contexts/AppUiContext';
import { t } from '../i18n';
import type { VideoItem } from '../types';

function VideoListItem({ item }: { item: VideoItem }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.itemPath} numberOfLines={1}>
        {item.folderPath}
      </Text>
    </View>
  );
}

export function HomeScreen() {
  const { canAccessVideos } = usePermissions();
  const { result, loading, error, scan } = useVideoScanner();
  const { allVideos, setScanResult } = useVideoLibrary();
  const { openPrivacyPolicy } = useAppUi();

  useEffect(() => {
    if (canAccessVideos && !result && !loading) {
      scan();
    }
  }, [canAccessVideos, result, loading, scan]);

  useEffect(() => {
    if (result) setScanResult(result);
  }, [result, setScanResult]);

  if (!canAccessVideos) {
    return null;
  }

  const list = allVideos.length > 0 ? allVideos : [];
  // Show empty state when there are no videos (including when scan completed with 0 results).
  const showEmpty = !loading && !error && list.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Videos</Text>
        <View style={styles.headerActions}>
          {list.length > 0 && (
            <TouchableOpacity onPress={scan} disabled={loading}>
              <Text style={styles.refreshText}>{loading ? 'Scanning…' : 'Refresh'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={openPrivacyPolicy} style={styles.privacyButton}>
            <Text style={styles.privacyText}>{t('common.privacyPolicy')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && list.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4a9eff" />
          <Text style={styles.hint}>Scanning for videos…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={scan}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : showEmpty ? (
        <View style={styles.centered}>
          <Text style={styles.hint}>No videos found. Tap Refresh to scan again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={scan}>
            <Text style={styles.retryText}>Scan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VideoListItem item={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  refreshText: {
    color: '#4a9eff',
    fontSize: 14,
  },
  privacyButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  privacyText: {
    color: '#888',
    fontSize: 13,
  },
  list: {
    padding: 16,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  itemTitle: {
    fontSize: 16,
    color: '#fff',
  },
  itemPath: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  hint: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  error: {
    color: '#e57373',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
  },
});
