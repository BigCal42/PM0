/**
 * Real-time Data Refresh Hook
 */

import { useEffect, useRef, useState } from 'react';

interface UseDataRefreshOptions {
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
  onRefresh?: () => void | Promise<void>;
}

export function useDataRefresh({
  refreshInterval = 60000, // Default: 1 minute
  enabled = true,
  onRefresh,
}: UseDataRefreshOptions = {}) {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start interval
    intervalRef.current = setInterval(refresh, refreshInterval);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, enabled]);

  return {
    lastRefresh,
    isRefreshing,
    refresh,
  };
}

/**
 * Hook for tracking online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook for visibility change (tab/window focus)
 */
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

/**
 * Combined hook for smart data refresh
 * - Pauses when tab is not visible
 * - Pauses when offline
 * - Resumes and refreshes when conditions are met
 */
export function useSmartDataRefresh(options: UseDataRefreshOptions = {}) {
  const isOnline = useOnlineStatus();
  const isVisible = usePageVisibility();
  const shouldRefresh = isOnline && isVisible && (options.enabled ?? true);

  return useDataRefresh({
    ...options,
    enabled: shouldRefresh,
  });
}

