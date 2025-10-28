import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type FeatureFlagContextValue = {
  useDemoData: boolean;
  setUseDemoData: React.Dispatch<React.SetStateAction<boolean>>;
};

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

const STORAGE_KEY = 'pm0:useDemoData';

const normalizeBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  return false;
};

const getStoredPreference = (): boolean | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (storedValue == null) {
      return null;
    }
    return normalizeBoolean(storedValue);
  } catch (error) {
    console.warn('Failed to read demo mode preference from localStorage', error);
    return null;
  }
};

export const FeatureFlagProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [useDemoData, setUseDemoData] = useState<boolean>(() => {
    const storedPreference = getStoredPreference();
    if (storedPreference !== null) {
      return storedPreference;
    }

    return normalizeBoolean(import.meta.env.VITE_USE_DEMO_DATA ?? false);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, String(useDemoData));
    } catch (error) {
      console.warn('Failed to persist demo mode preference to localStorage', error);
    }
  }, [useDemoData]);

  const value = useMemo<FeatureFlagContextValue>(
    () => ({ useDemoData, setUseDemoData }),
    [useDemoData, setUseDemoData],
  );

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
};

export const useFeatureFlags = (): FeatureFlagContextValue => {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }

  return context;
};
