import { lazy, Suspense } from 'react';
import { Loading } from '@/components/Loading';

const ProjectsContent = lazy(() =>
  import('./ProjectsContent').then((m) => ({ default: m.ProjectsContent }))
);

export function Projects() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">
          Manage your strategic planning projects
        </p>
      </div>

      <Suspense fallback={<Loading message="Loading projects..." />}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}

