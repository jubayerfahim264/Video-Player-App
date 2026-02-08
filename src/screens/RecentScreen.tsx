/**
 * Recent tab: recently played videos.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useVideoLibrary } from '../contexts/VideoLibraryContext';
import { VideoList } from '../components/video/VideoList';
import type { VideoItem } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export function RecentScreen() {
  const navigation = useNavigation<Nav>();
  const { recentVideos, toggleFavorite, favoriteIds } = useVideoLibrary();

  const openPlayer = (video: VideoItem) => {
    navigation.navigate('Player', { video, list: recentVideos });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent</Text>
      </View>
      <VideoList
        videos={recentVideos}
        onPressVideo={openPlayer}
        emptyMessage="No recent videos. Play something from All Videos."
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
