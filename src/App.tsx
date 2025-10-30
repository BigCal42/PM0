import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppProvider } from '@/contexts/AppContext';
import { Dashboard } from '@/routes/Dashboard';
import { Projects } from '@/routes/Projects';
import { Scenarios } from '@/routes/Scenarios';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

logger.info('App initialized', { useDemoData: env.useDemoData });

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/admin" element={<div>Admin (guarded)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

