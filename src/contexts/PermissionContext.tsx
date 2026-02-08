/**
 * Provides storage permission state and request/openSettings to the app.
 * Consumed by screens that need to know if we can scan videos.
 */
import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
  checkStoragePermission,
  requestStoragePermission,
  openAppSettings,
} from '../services/permissionService';
import type { StoragePermissionState } from '../types';

interface PermissionContextValue extends StoragePermissionState {
  /** Re-check permission (e.g. after returning from settings) */
  refresh: () => Promise<void>;
  /** Request permission; updates state when done */
  requestPermission: () => Promise<void>;
  /** Open app settings */
  openSettings: () => Promise<void>;
  /** True while checking or requesting */
  loading: boolean;
}

const defaultValue: PermissionContextValue = {
  status: 'unavailable',
  canAccessVideos: false,
  isBlocked: false,
  refresh: async () => {},
  requestPermission: async () => {},
  openSettings: async () => {},
  loading: false,
};

export const PermissionContext = createContext<PermissionContextValue>(defaultValue);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoragePermissionState>({
    status: 'unavailable',
    canAccessVideos: false,
    isBlocked: false,
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await checkStoragePermission();
      setState(next);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setLoading(true);
    try {
      const next = await requestStoragePermission();
      setState(next);
    } finally {
      setLoading(false);
    }
  }, []);

  const openSettings = useCallback(async () => {
    await openAppSettings();
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value: PermissionContextValue = {
    ...state,
    refresh,
    requestPermission,
    openSettings,
    loading,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}
