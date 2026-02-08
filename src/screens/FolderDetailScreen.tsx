/**
 * Folder detail: list of videos in one folder.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useVideoLibrary } from '../contexts/VideoLibraryContext';
import { VideoList } from '../components/video/VideoList';
import type { VideoItem } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'FolderDetail'>;
type Route = RouteProp<RootStackParamList, 'FolderDetail'>;

export function FolderDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { folder } = params;
  const { byFolder, toggleFavorite, favoriteIds } = useVideoLibrary();
  const videos: VideoItem[] = byFolder[folder.path] ?? [];

  const openPlayer = (video: VideoItem) => {
    navigation.navigate('Player', { video, list: videos });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {folder.name || folder.path}
        </Text>
        <Text style={styles.sub}>{videos.length} video{videos.length !== 1 ? 's' : ''}</Text>
      </View>
      <VideoList
        videos={videos}
        onPressVideo={openPlayer}
        emptyMessage="No videos in this folder."
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backBtn: { marginBottom: 8 },
  backText: { color: '#4a9eff', fontSize: 16 },
  title: { fontSize: 18, fontWeight: '600', color: '#fff' },
  sub: { fontSize: 13, color: '#888', marginTop: 4 },
});
