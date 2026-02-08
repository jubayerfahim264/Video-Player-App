/**
 * Hook to run device video scan and expose result + loading/error state.
 * Call scan() when permission is granted.
 */
import { useCallback, useState } from 'react';
import { scanDeviceVideos } from '../services/videoScannerService';
import type { VideoScanResult } from '../types';

export interface UseVideoScannerResult {
  result: VideoScanResult | null;
  loading: boolean;
  error: string | null;
  scan: () => Promise<void>;
}

export function useVideoScanner(): UseVideoScannerResult {
  const [result, setResult] = useState<VideoScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scanDeviceVideos();
      setResult(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Scan failed';
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, scan };
}
