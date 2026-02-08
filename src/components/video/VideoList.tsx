/**
 * Reusable list of videos: used in All Videos, Recent, Favorites, and folder detail.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import type { VideoItem } from '../../types';

interface VideoListProps {
  videos: VideoItem[];
  onPressVideo: (video: VideoItem) => void;
  emptyMessage?: string;
  /** Optional: show folder path under title */
  showFolder?: boolean;
  /** Optional: show favorite heart and call on toggle */
  favoriteIds?: Set<string>;
  onToggleFavorite?: (videoId: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function VideoList({
  videos,
  onPressVideo,
  emptyMessage = 'No videos',
  showFolder = true,
  favoriteIds,
  onToggleFavorite,
}: VideoListProps) {
  const renderItem: ListRenderItem<VideoItem> = ({ item }) => {
    const isFav = favoriteIds?.has(item.id);
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onPressVideo(item)}
        activeOpacity={0.7}
      >
        <View style={styles.thumbPlaceholder}>
          <Text style={styles.thumbIcon}>▶</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {showFolder && (
            <Text style={styles.sub} numberOfLines={1}>
              {item.folderPath}
            </Text>
          )}
          <Text style={styles.sub}>{formatSize(item.size)}</Text>
        </View>
        {onToggleFavorite && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            style={styles.favBtn}
          >
            <Text style={[styles.favIcon, isFav ? styles.favOn : styles.favOff]}>{isFav ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (videos.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 12,
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  thumbPlaceholder: {
    width: 72,
    height: 48,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  thumbIcon: {
    color: '#666',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  sub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  favBtn: { padding: 8 },
  favIcon: { fontSize: 20 },
  favOn: { color: '#e57373' },
  favOff: { color: '#555' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
