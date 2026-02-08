/**
 * React Navigation param lists for type-safe navigation.
 */
import type { VideoItem, FolderItem } from '../types';

export type RootStackParamList = {
  MainTabs: undefined;
  FolderDetail: { folder: FolderItem };
  Player: { video: VideoItem; list?: VideoItem[] };
};

export type MainTabsParamList = {
  AllVideos: undefined;
  Folders: undefined;
  Recent: undefined;
  Favorites: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
