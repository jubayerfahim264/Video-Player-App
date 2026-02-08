# Required Libraries – VideoPlayer App

## Core (already in project)

| Package | Version | Purpose |
|---------|---------|--------|
| react | 19.2.0 | UI |
| react-native | 0.83.1 | Framework |
| react-native-safe-area-context | ^5.5.2 | Safe areas |

## To Add

### Video & Playback

| Package | Version | Purpose |
|---------|---------|--------|
| **react-native-video** | ^6.19.0 | Playback, PiP, speed, aspect ratio, subtitles, hardware acceleration |

### Storage & File System

| Package | Version | Purpose |
|---------|---------|--------|
| **react-native-fs** | ^2.20.0 | List directories, scan for video files (internal + SD paths), file paths |
| **@react-native-async-storage/async-storage** | ^2.1.0 | Persist favorites, last position, recent list, settings |

### Permissions

| Package | Version | Purpose |
|---------|---------|--------|
| **react-native-permissions** | ^5.0.0 | Runtime storage/media permissions (READ_MEDIA_VIDEO, READ_EXTERNAL_STORAGE) |

### Navigation & UI

| Package | Version | Purpose |
|---------|---------|--------|
| **@react-navigation/native** | ^7.x | Navigation container |
| **@react-navigation/native-stack** | ^7.x | Stack (player, folder detail) |
| **@react-navigation/bottom-tabs** | ^7.x | Tabs: All Videos, Folders, Recent, Favorites |
| **react-native-screens** | ^4.x | Native stack screens |
| **react-native-gesture-handler** | ^2.x | Gestures (swipe seek, volume, brightness) |
| **react-native-reanimated** | ^3.x | Smooth animations (optional, for gestures) |

### Optional (later phases)

| Package | Purpose |
|---------|--------|
| react-native-pip-android | PiP on Android (if not fully covered by react-native-video) |
| react-native-orientation-locker | Lock rotation, auto-rotate |
| react-native-subtitle | Parse .srt/.vtt (or implement in JS) |
| react-native-video-thumbnail | Generate thumbnails (or native module) |

## Install Order

1. Navigation: `@react-navigation/native`, `react-native-screens`, `react-native-safe-area-context` (have it), then stack + bottom-tabs.
2. Permissions: `react-native-permissions`.
3. Storage: `react-native-fs`, `@react-native-async-storage/async-storage`.
4. Video: `react-native-video`.
5. Gestures: `react-native-gesture-handler` (and optionally `react-native-reanimated`).

After adding native packages, run:

- Android: `cd android && ./gradlew clean` then `npm run android`.
- iOS: `cd ios && pod install` then `npm run ios`.
