import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProviders } from './providers/AppProviders';
import { FeatureFlagProvider } from './store/useFeatureFlags';
import { SupabaseAuthProvider } from './features/auth/SupabaseAuthProvider';
import { AuthGate } from './features/auth/AuthGate';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to locate root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <FeatureFlagProvider>
        <SupabaseAuthProvider>
          <AuthGate>
            <App />
          </AuthGate>
        </SupabaseAuthProvider>
      </FeatureFlagProvider>
    </AppProviders>
  </StrictMode>,
);
