import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type FeatureFlagContextValue = {
  useDemoData: boolean;
  setUseDemoData: (value: boolean) => void;
  toggleDemoData: () => void;
};

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

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

export const FeatureFlagProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const getInitialValue = () => {
    const fallback = normalizeBoolean(import.meta.env.VITE_USE_DEMO_DATA ?? false);

    if (typeof window === 'undefined') {
      return fallback;
    }

    const persisted = window.localStorage.getItem('pm0-use-demo-data');
    return persisted === null ? fallback : normalizeBoolean(persisted);
  };

  const [useDemoData, setUseDemoDataState] = useState<boolean>(getInitialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('pm0-use-demo-data', String(useDemoData));
  }, [useDemoData]);

  const setUseDemoData = useCallback((value: boolean) => {
    setUseDemoDataState(value);
  }, []);

  const toggleDemoData = useCallback(() => {
    setUseDemoDataState((previous) => !previous);
  }, []);

  const value = useMemo<FeatureFlagContextValue>(
    () => ({ useDemoData, setUseDemoData, toggleDemoData }),
    [setUseDemoData, toggleDemoData, useDemoData],
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
