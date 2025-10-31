import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/Toaster';
import { Loading } from '@/components/Loading';
import { Dashboard } from '@/routes/Dashboard';
import { Projects } from '@/routes/Projects';
import { Scenarios } from '@/routes/Scenarios';
import { Discovery } from '@/routes/Discovery';
import { Login } from '@/routes/Login';
import { queryClient } from '@/lib/queryClient';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import { isPlaygroundEnabled } from '@/lib/flags';

// Lazy load playground pages (only if flag is enabled)
const HomeHub = isPlaygroundEnabled() ? lazy(() => import('@/pages/HomeHub').then(m => ({ default: m.HomeHub }))) : null;
const ProjectCanvas = isPlaygroundEnabled() ? lazy(() => import('@/pages/ProjectCanvas').then(m => ({ default: m.ProjectCanvas }))) : null;
const ScenarioLab = isPlaygroundEnabled() ? lazy(() => import('@/pages/ScenarioLab').then(m => ({ default: m.ScenarioLab }))) : null;

logger.info('App initialized', { useDemoData: env.useDemoData, playgroundEnabled: isPlaygroundEnabled() });

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
                            <Route path="/admin" element={<div>Admin (guarded)</div>} />
                            {/* Playground routes (feature-flagged) */}
                            {isPlaygroundEnabled() && HomeHub && (
                              <Route
                                path="/hub"
                                element={
                                  <Suspense fallback={<Loading message="Loading..." />}>
                                    <HomeHub />
                                  </Suspense>
                                }
                              />
                            )}
                            {isPlaygroundEnabled() && ProjectCanvas && (
                              <Route
                                path="/project/:id/canvas"
                                element={
                                  <Suspense fallback={<Loading message="Loading..." />}>
                                    <ProjectCanvas />
                                  </Suspense>
                                }
                              />
                            )}
                            {isPlaygroundEnabled() && ScenarioLab && (
                              <Route
                                path="/project/:id/scenario-lab"
                                element={
                                  <Suspense fallback={<Loading message="Loading..." />}>
                                    <ScenarioLab />
                                  </Suspense>
                                }
                              />
                            )}
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

