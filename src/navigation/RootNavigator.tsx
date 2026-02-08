/**
 * Root navigator: stack with MainTabs (bottom tabs) + FolderDetail + Player.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabsParamList } from './types';
import { AllVideosScreen } from '../screens/AllVideosScreen';
import { FoldersScreen } from '../screens/FoldersScreen';
import { RecentScreen } from '../screens/RecentScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { FolderDetailScreen } from '../screens/FolderDetailScreen';
import { PlayerScreen } from '../screens/PlayerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

const tabScreenOptions = {
  headerShown: false,
  tabBarStyle: { backgroundColor: '#1a1a1a', borderTopColor: '#2a2a2a' },
  tabBarActiveTintColor: '#4a9eff',
  tabBarInactiveTintColor: '#888',
  tabBarLabelStyle: { fontSize: 12 },
};

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="AllVideos" options={{ title: 'All Videos', tabBarLabel: 'Videos' }} component={AllVideosScreen} />
      <Tab.Screen name="Folders" options={{ title: 'Folders' }} component={FoldersScreen} />
      <Tab.Screen name="Recent" options={{ title: 'Recent' }} component={RecentScreen} />
      <Tab.Screen name="Favorites" options={{ title: 'Favorites' }} component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="FolderDetail" component={FolderDetailScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} options={{ presentation: 'fullScreenModal' }} />
    </Stack.Navigator>
  );
}
