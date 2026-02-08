/**
 * Folders tab: list of folders; tap to open folder detail.
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useVideoLibrary } from '../contexts/VideoLibraryContext';
import type { FolderItem } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export function FoldersScreen() {
  const navigation = useNavigation<Nav>();
  const { folders } = useVideoLibrary();

  const openFolder = (folder: FolderItem) => {
    navigation.navigate('FolderDetail', { folder });
  };

  if (folders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No folders. Scan videos from All Videos tab.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
      </View>
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openFolder(item)} activeOpacity={0.7}>
            <View style={styles.folderIcon}>
              <Text style={styles.folderIconText}>📁</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name || item.path}
              </Text>
              <Text style={styles.count}>{item.videoCount} video{item.videoCount !== 1 ? 's' : ''}</Text>
            </View>
          </TouchableOpacity>
        )}
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
  list: { padding: 12, paddingBottom: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  folderIcon: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  folderIconText: { fontSize: 24 },
  info: { flex: 1 },
  name: { fontSize: 15, color: '#fff', fontWeight: '500' },
  count: { fontSize: 12, color: '#888', marginTop: 2 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  empty: { color: '#888', fontSize: 16, textAlign: 'center' },
});
