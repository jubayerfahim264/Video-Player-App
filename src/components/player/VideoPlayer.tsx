/**
 * Custom video player: MX-style UI, fullscreen, smooth animations.
 * Play/pause, seek ±5s/±10s, speed, aspect ratio, PiP, background play, rotation lock.
 * Double-tap video area to play/pause; controls auto-hide after 3s with fade.
 * Plays in default (current) orientation until user locks rotation in settings.
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import Video, { OnProgressData, OnLoadData } from 'react-native-video';
import type { VideoItem } from '../../types';
import {
  PLAYBACK_SPEEDS,
  ASPECT_RESIZE_MODE,
  ASPECT_RATIO,
  type PlaybackSpeed,
  type AspectMode,
} from '../../constants/player';
import Orientation from 'react-native-orientation-locker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SEEK_STEP_SMALL = 5;
const SEEK_STEP_LARGE = 10;

const ASPECT_MODES: AspectMode[] = ['fit', 'fill', '16:9', '4:3'];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export interface VideoPlayerProps {
  video: VideoItem;
  onBack: () => void;
  onAddToRecent?: (video: VideoItem) => void;
  /** Called when user leaves so parent can save last position */
  onSavePosition?: (position: number, duration: number) => void;
  initialPosition?: number;
}

export function VideoPlayer({
  video,
  onBack,
  onAddToRecent,
  onSavePosition,
  initialPosition = 0,
}: VideoPlayerProps) {
  const ref = useRef<Video>(null);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(initialPosition);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState<PlaybackSpeed>(1);
  const [aspectMode, setAspectMode] = useState<AspectMode>('fit');
  const [playInBackground, setPlayInBackground] = useState(false);
  const [rotationLocked, setRotationLocked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sleepTimerSeconds, setSleepTimerSeconds] = useState(0);
  const [sleepTimerLabel, setSleepTimerLabel] = useState<string | null>(null);
  const [subtitleOn, setSubtitleOn] = useState(false);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTimeRef = useRef(0);
  const addedToRecent = useRef(false);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const CONTROLS_HIDE_DELAY_MS = 3000;
  const DOUBLE_TAP_MS = 280;

  const uri =
    video.path.startsWith('file://') || video.path.startsWith('content://')
      ? video.path
      : `file://${video.path}`;
  const srtUri = video.path.replace(/\.[^.]+$/, '.srt');
  const srtUriFormatted = srtUri.startsWith('file://') ? srtUri : `file://${srtUri}`;
  const textTracks = [
    { title: 'Default', language: 'en' as const, type: 'application/x-subrip' as const, uri: srtUriFormatted },
  ];
  const source = { uri, textTracks };
  const resizeMode = ASPECT_RESIZE_MODE[aspectMode];
  const aspectValue = ASPECT_RATIO[aspectMode];

  const seekBy = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(duration, currentTime + delta));
      ref.current?.seek(next);
      setCurrentTime(next);
    },
    [currentTime, duration]
  );

  const onLoad = useCallback(
    (data: OnLoadData) => {
      setDuration(data.duration);
      setLoading(false);
      setError(null);
      if (initialPosition > 0) ref.current?.seek(initialPosition);
      if (onAddToRecent && !addedToRecent.current) {
        addedToRecent.current = true;
        onAddToRecent(video);
      }
    },
    [initialPosition, onAddToRecent, video]
  );

  const onProgress = useCallback((data: OnProgressData) => {
    setCurrentTime(data.currentTime);
  }, []);

  const onError = useCallback((e: { error: { errorString?: string } }) => {
    setLoading(false);
    setError(e?.error?.errorString ?? 'Playback error');
  }, []);

  useEffect(() => {
    if (onAddToRecent && !addedToRecent.current && !loading && duration > 0) {
      addedToRecent.current = true;
      onAddToRecent(video);
    }
  }, [loading, duration, onAddToRecent, video]);

  useEffect(() => {
    if (rotationLocked) {
      const { width, height } = Dimensions.get('window');
      if (height >= width) {
        Orientation.lockToPortrait();
      } else {
        Orientation.lockToLandscapeLeft();
      }
    } else {
      Orientation.unlockAllOrientations();
    }
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [rotationLocked]);

  useEffect(() => {
    if (sleepTimerSeconds <= 0) {
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
        sleepTimerRef.current = null;
      }
      setSleepTimerLabel(null);
      return;
    }
    const mins = Math.floor(sleepTimerSeconds / 60);
    const secs = sleepTimerSeconds % 60;
    setSleepTimerLabel(secs > 0 ? `${mins}m ${secs}s` : `${mins} min`);
    sleepTimerRef.current = setTimeout(() => {
      setPaused(true);
      setSleepTimerSeconds(0);
      setSleepTimerLabel(null);
      sleepTimerRef.current = null;
    }, sleepTimerSeconds * 1000);
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [sleepTimerSeconds]);

  const handleBack = () => {
    onSavePosition?.(currentTime, duration);
    onBack();
  };

  const cycleSpeed = () => {
    const i = PLAYBACK_SPEEDS.indexOf(rate);
    const next = PLAYBACK_SPEEDS[(i + 1) % PLAYBACK_SPEEDS.length];
    setRate(next);
  };

  const cycleAspect = () => {
    const i = ASPECT_MODES.indexOf(aspectMode);
    setAspectMode(ASPECT_MODES[(i + 1) % ASPECT_MODES.length]);
  };

  const enterPiP = () => {
    if (Platform.OS === 'android') ref.current?.enterPictureInPicture();
  };

  const showControls = useCallback(() => {
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
      hideControlsTimerRef.current = null;
    }
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    hideControlsTimerRef.current = setTimeout(() => {
      hideControlsTimerRef.current = null;
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, CONTROLS_HIDE_DELAY_MS);
  }, [controlsOpacity]);

  useEffect(() => {
    showControls();
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [showControls]);

  const onVideoAreaPress = useCallback(() => {
    const now = Date.now();
    const isDoubleTap = now - lastTapTimeRef.current < DOUBLE_TAP_MS;
    lastTapTimeRef.current = now;
    if (isDoubleTap) {
      setPaused((p) => !p);
      showControls();
    } else {
      showControls();
    }
  }, [showControls]);

  const progress = duration > 0 ? currentTime / duration : 0;

  const videoStyle =
    aspectValue != null
      ? {
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH / aspectValue,
          position: 'relative' as const,
          alignSelf: 'center' as const,
        }
      : styles.video;

  return (
    <View style={styles.container}>
      <View style={aspectValue != null ? styles.videoWrapper : undefined}>
        <Video
          ref={ref}
          source={source}
          style={videoStyle}
          resizeMode={resizeMode}
          paused={paused}
          rate={rate}
          onLoad={onLoad}
          onProgress={onProgress}
          onError={onError}
          onEnd={() => setPaused(true)}
          progressUpdateInterval={500}
          ignoreSilentSwitch="ignore"
          playInBackground={playInBackground}
          selectedTextTrack={subtitleOn ? { type: 'index', value: 0 } : { type: 'disabled' }}
          bufferConfig={{ minBufferMs: 2000, maxBufferMs: 10000, bufferForPlaybackMs: 1000 }}
        />
      </View>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {/* MX-style gradient overlays for readability */}
      <View style={styles.gradientTop} pointerEvents="none" />
      <View style={styles.gradientBottom} pointerEvents="none" />
      {/* Center tap zone: double-tap = play/pause, single tap = show controls */}
      <Pressable style={styles.tapZone} onPress={onVideoAreaPress} />
      <Animated.View style={[styles.controls, { opacity: controlsOpacity }]} pointerEvents="box-none">
        <View style={styles.topRow}>
          <TouchableOpacity onPress={handleBack} style={styles.iconBtn} onPressIn={showControls}>
            <Text style={styles.iconText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {video.title}
          </Text>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.iconBtn} onPressIn={showControls}>
            <Text style={styles.iconText}>⚙</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerRow}>
          <TouchableOpacity onPress={() => { seekBy(-SEEK_STEP_LARGE); showControls(); }} style={styles.seekBtn}>
            <Text style={styles.seekText}>−10</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setPaused((p) => !p); showControls(); }} style={styles.playBtn}>
            <Text style={styles.playText}>{paused ? '▶' : '⏸'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { seekBy(SEEK_STEP_LARGE); showControls(); }} style={styles.seekBtn}>
            <Text style={styles.seekText}>+10</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
        <View style={styles.quickRow}>
          <TouchableOpacity onPress={() => { seekBy(-SEEK_STEP_SMALL); showControls(); }}>
            <Text style={styles.quickSeekText}>−5s</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { cycleSpeed(); showControls(); }}>
            <Text style={styles.quickSeekText}>{rate}x</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { cycleAspect(); showControls(); }}>
            <Text style={styles.quickSeekText}>{aspectMode}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { seekBy(SEEK_STEP_SMALL); showControls(); }}>
            <Text style={styles.quickSeekText}>+5s</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Modal visible={showSettings} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettings(false)}
        >
          <View style={styles.settingsPanel} onStartShouldSetResponder={() => true}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Background play (audio)</Text>
              <TouchableOpacity
                onPress={() => setPlayInBackground((b) => !b)}
                style={[styles.toggle, playInBackground && styles.toggleOn]}
              >
                <Text style={styles.toggleText}>{playInBackground ? 'On' : 'Off'}</Text>
              </TouchableOpacity>
            </View>
            {Platform.OS === 'android' && (
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Picture-in-Picture</Text>
                <TouchableOpacity onPress={() => { enterPiP(); setShowSettings(false); }} style={styles.toggle}>
                  <Text style={styles.toggleText}>Enter PiP</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Subtitles (.srt)</Text>
              <TouchableOpacity
                onPress={() => setSubtitleOn((s) => !s)}
                style={[styles.toggle, subtitleOn && styles.toggleOn]}
              >
                <Text style={styles.toggleText}>{subtitleOn ? 'On' : 'Off'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Rotation lock</Text>
              <TouchableOpacity
                onPress={() => setRotationLocked((r) => !r)}
                style={[styles.toggle, rotationLocked && styles.toggleOn]}
              >
                <Text style={styles.toggleText}>{rotationLocked ? 'Locked' : 'Auto'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sleep timer</Text>
              <View style={styles.sleepRow}>
                {([0, 5, 10, 15, 30] as const).map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    onPress={() => setSleepTimerSeconds(mins * 60)}
                    style={[styles.sleepBtn, sleepTimerSeconds === mins * 60 && styles.toggleOn]}
                  >
                    <Text style={styles.toggleText}>{mins === 0 ? 'Off' : `${mins}m`}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {sleepTimerLabel && (
              <Text style={styles.sleepLabel}>Timer: {sleepTimerLabel}</Text>
            )}
            <TouchableOpacity onPress={() => setShowSettings(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoWrapper: { flex: 1, justifyContent: 'center' },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { color: '#e57373', fontSize: 16, textAlign: 'center', padding: 24 },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  tapZone: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 10, marginRight: 4 },
  iconText: { color: '#fff', fontSize: 26 },
  title: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '500' },
  centerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 28 },
  seekBtn: { paddingVertical: 14, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12 },
  seekText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  playBtn: { padding: 20, backgroundColor: 'rgba(74, 158, 255, 0.92)', borderRadius: 36 },
  playText: { color: '#fff', fontSize: 28 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, minWidth: 38 },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#4a9eff', borderRadius: 3 },
  quickRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22 },
  quickSeekText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  settingsPanel: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
  },
  settingsTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  settingLabel: { color: '#ccc', fontSize: 14 },
  toggle: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#333', borderRadius: 8 },
  toggleOn: { backgroundColor: '#4a9eff' },
  toggleText: { color: '#fff', fontSize: 13 },
  closeBtn: { marginTop: 16, padding: 12, alignItems: 'center' },
  closeBtnText: { color: '#4a9eff', fontSize: 16 },
  sleepRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  sleepBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#333', borderRadius: 8 },
  sleepLabel: { color: '#888', fontSize: 12, marginTop: 4 },
});
