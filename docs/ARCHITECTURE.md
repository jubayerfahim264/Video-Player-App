# VideoPlayer App – Project Architecture

## Overview

Offline-first video player (MX Player–style) for React Native with Android as primary target. Modular, scalable structure with clear separation of concerns.

## Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/           # Buttons, icons, layout primitives
│   ├── video/            # Video list items, thumbnails, player overlays
│   └── ui/               # Modals, bottom sheets, headers
├── screens/              # App screens (one folder per feature when needed)
│   ├── HomeScreen/       # Tabs: All Videos, Folders, Recent, Favorites
│   ├── FolderDetailScreen/
│   ├── VideoPlayerScreen/ # Fullscreen player
│   └── PermissionScreen/ # Storage permission request / denied
├── navigation/           # React Navigation setup, types
├── contexts/             # React Context providers
│   ├── PermissionContext.tsx
│   ├── VideoLibraryContext.tsx
│   ├── PlaybackContext.tsx    # Current video, position, settings
│   └── ThemeContext.tsx      # Dark mode (default)
├── hooks/                # Custom hooks
│   ├── usePermissions.ts
│   ├── useVideoLibrary.ts
│   ├── usePlaybackState.ts
│   └── useVideoScanner.ts
├── services/             # Business logic & native/API layer
│   ├── permissionService.ts
│   ├── videoScannerService.ts
│   ├── playbackStorageService.ts  # Last position, favorites
│   └── subtitleService.ts
├── store/                # Optional Redux/Context state (playlist, favorites)
├── types/                # TypeScript types & interfaces
├── constants/            # App constants, video extensions, config
├── utils/                # Helpers (format duration, paths, etc.)
└── assets/               # Images, fonts (if any)
```

## Data Flow

- **Permissions**: App launch → `PermissionContext` checks storage → request if needed → `videoScannerService` runs when granted.
- **Video library**: `VideoLibraryContext` holds all/folders/recent/favorites; populated by `videoScannerService` and user actions (favorite, recent from playback).
- **Playback**: `PlaybackContext` holds current source, position, speed, aspect ratio; `playbackStorageService` persists position and loads resume dialog.

## Key Design Decisions

| Area | Choice | Reason |
|------|--------|--------|
| State | Context API first | Simpler; add Redux later if needed |
| Navigation | React Navigation (stack + bottom tabs) | Standard, good for Android |
| Video scanning | Service + hook | Async scan, progress, cache |
| Permissions | Dedicated context + service | Single source of truth, reusable |
| Player | Custom component wrapping react-native-video | Gestures, PiP, subtitles in one place |

## Platform Notes

- **Android**: Storage permissions depend on API level (READ_EXTERNAL_STORAGE vs READ_MEDIA_VIDEO). PiP and background audio require manifest and optional native config.
- **iOS**: Optional; Photo Library / Media Library permissions if we add iOS later.

## Security & Performance

- No storage of raw file content; only paths, metadata, and playback position.
- Scanner runs on a background-friendly approach (chunks/batching) to avoid UI freezes.
- Thumbnails: generate on demand or via optional native module; cache in app storage.

## Next Steps (Incremental Build)

1. **Navigation**: Add `NavigationContainer`, bottom tabs (All Videos, Folders, Recent, Favorites), stack for player and folder detail.
2. **Custom Video Player**: Wrap `react-native-video` with gesture controls (seek, volume, brightness), speed, aspect ratio, PiP, background audio.
3. **Persistence**: Use AsyncStorage for favorites, recent list, last position, resume dialog, sleep timer.
4. **Subtitles**: Parse .srt/.vtt, subtitle sync delay, manual selection.
5. **Polish**: Thumbnails, dark theme refinements, fullscreen immersive mode.
