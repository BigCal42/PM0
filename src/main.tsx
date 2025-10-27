import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { SupabaseAuthProvider } from './features/auth/SupabaseAuthProvider';
import { FeatureFlagProvider } from './store/useFeatureFlags';

const queryClient = new QueryClient();

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element "#root" not found. Ensure index.html contains <div id="root"></div>.');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <FeatureFlagProvider>
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider>
          <App />
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </FeatureFlagProvider>
  </React.StrictMode>,
);
