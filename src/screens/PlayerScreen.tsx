/**
 * Fullscreen video player: resume dialog, save position on back.
 * Fullscreen immersive: hide status bar while player is focused.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { useVideoLibrary } from '../contexts/VideoLibraryContext';
import { getLastPosition, setLastPosition } from '../services/playbackStorageService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Player'>;
type Route = RouteProp<RootStackParamList, 'Player'>;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

const MIN_POSITION_FOR_RESUME = 5;

export function PlayerScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { video } = params;
  const { addToRecent } = useVideoLibrary();
  const [resumeDialog, setResumeDialog] = useState<{ position: number; duration: number } | null>(null);
  const [initialPosition, setInitialPosition] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const last = await getLastPosition(video.id);
      if (cancelled) return;
      if (
        last &&
        last.position >= MIN_POSITION_FOR_RESUME &&
        last.duration > 0 &&
        last.position < last.duration - 5
      ) {
        setResumeDialog({ position: last.position, duration: last.duration });
      } else {
        setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [video.id]);

  const handleResume = () => {
    if (resumeDialog) setInitialPosition(resumeDialog.position);
    setResumeDialog(null);
    setReady(true);
  };

  const handleStartFromBeginning = () => {
    setInitialPosition(0);
    setResumeDialog(null);
    setReady(true);
  };

  const handleBack = () => navigation.goBack();

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setHidden(true, 'fade');
      return () => StatusBar.setHidden(false, 'fade');
    }, [])
  );

  const handleSavePosition = (position: number, duration: number) => {
    setLastPosition(video.id, position, duration).catch(() => {});
  };

  if (!ready && !resumeDialog) {
    return (
      <View style={[styles.centered, { backgroundColor: '#000' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {ready && (
        <VideoPlayer
          video={video}
          onBack={handleBack}
          onAddToRecent={addToRecent}
          onSavePosition={handleSavePosition}
          initialPosition={initialPosition}
        />
      )}
      <Modal visible={resumeDialog !== null} transparent animationType="fade">
        <View style={styles.resumeOverlay}>
          <View style={styles.resumeBox}>
            <Text style={styles.resumeTitle}>Resume playback?</Text>
            <Text style={styles.resumeSub}>
              {resumeDialog ? `Continue from ${formatTime(resumeDialog.position)}` : ''}
            </Text>
            <View style={styles.resumeButtons}>
              <TouchableOpacity onPress={handleStartFromBeginning} style={styles.resumeBtn}>
                <Text style={styles.resumeBtnText}>Start from beginning</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleResume} style={[styles.resumeBtn, styles.resumeBtnPrimary]}>
                <Text style={styles.resumeBtnText}>Resume</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  resumeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  resumeBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
  },
  resumeTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  resumeSub: { color: '#888', fontSize: 14, marginBottom: 20 },
  resumeButtons: { gap: 12 },
  resumeBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  resumeBtnPrimary: { backgroundColor: '#4a9eff' },
  resumeBtnText: { color: '#fff', fontSize: 16 },
});
