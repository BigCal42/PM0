import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/Toaster';
import { Dashboard } from '@/routes/Dashboard';
import { Projects } from '@/routes/Projects';
import { Scenarios } from '@/routes/Scenarios';
import { Discovery } from '@/routes/Discovery';
import { Login } from '@/routes/Login';
import { Budget } from '@/routes/Budget';
import { Scheduling } from '@/routes/Scheduling';
import { queryClient } from '@/lib/queryClient';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

logger.info('App initialized', { useDemoData: env.useDemoData });

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/scenarios" element={<Scenarios />} />
                            <Route path="/discovery" element={<Discovery />} />
                            <Route path="/finance/budget" element={<Budget />} />
                            <Route path="/workforce/scheduling" element={<Scheduling />} />
                            <Route path="/admin" element={<div>Admin (guarded)</div>} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Routes>
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

