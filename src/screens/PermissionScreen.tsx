/**
 * Shown when storage permission is not granted.
 * Lets user request permission or open settings if blocked.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { usePermissions } from '../hooks/usePermissions';

export function PermissionScreen() {
  const { status, canAccessVideos, isBlocked, requestPermission, openSettings, loading } =
    usePermissions();

  if (canAccessVideos) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storage access needed</Text>
      <Text style={styles.message}>
        VideoPlayer needs permission to find and play videos on your device.
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : (
        <View style={styles.buttons}>
          {!isBlocked && status !== 'blocked' ? (
            <TouchableOpacity style={styles.button} onPress={requestPermission} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Allow access</Text>
            </TouchableOpacity>
          ) : null}
          {(isBlocked || status === 'blocked') && (
            <TouchableOpacity style={styles.button} onPress={openSettings} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Open settings</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
  buttons: {
    gap: 12,
  },
  button: {
    backgroundColor: '#4a9eff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
