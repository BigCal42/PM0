import React, { createContext, useContext, ReactNode } from 'react';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

interface AppConfig {
  useDemoData: boolean;
  isSupabaseEnabled: boolean;
}

interface AppContextType {
  config: AppConfig;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const config: AppConfig = {
    useDemoData: env.useDemoData,
    isSupabaseEnabled: !env.useDemoData,
  };

  logger.debug('AppContext initialized', config);

  return (
    <AppContext.Provider value={{ config }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

