/**
 * Favorites tab: videos marked as favorite.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useVideoLibrary } from '../contexts/VideoLibraryContext';
import { VideoList } from '../components/video/VideoList';
import type { VideoItem } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { allVideos, favoriteIds, toggleFavorite } = useVideoLibrary();

  const favoriteVideos = useMemo(() => {
    return allVideos.filter((v) => favoriteIds.has(v.id));
  }, [allVideos, favoriteIds]);

  const openPlayer = (video: VideoItem) => {
    navigation.navigate('Player', { video, list: favoriteVideos });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      <VideoList
        videos={favoriteVideos}
        onPressVideo={openPlayer}
        emptyMessage="No favorites. Tap the heart on a video to add it here."
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
  title: { fontSize: 18, fontWeight: '600', color: '#fff' },
});
