import React, { createContext, useContext, useMemo } from 'react';

type FeatureFlagContextValue = {
  useDemoData: boolean;
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
  const useDemoData = useMemo(
    () => normalizeBoolean(import.meta.env.VITE_USE_DEMO_DATA ?? false),
    [],
  );

  const value = useMemo<FeatureFlagContextValue>(() => ({ useDemoData }), [useDemoData]);

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
};

export const useFeatureFlags = (): FeatureFlagContextValue => {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }

  return context;
};
