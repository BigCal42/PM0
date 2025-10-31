import { lazy, Suspense } from 'react';
import { Loading } from '@/components/Loading';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';

const ProjectsContent = lazy(() =>
  import('./ProjectsContent').then((m) => ({ default: m.ProjectsContent }))
);

export function Projects() {
  const { data: projects, isLoading, error } = useProjects();
  const toast = useToast();

  if (error) {
    toast.error('Failed to load projects', 'Please try refreshing the page.');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">
          Manage your strategic planning projects
        </p>
      </div>

      {isLoading ? (
        <Loading message="Loading projects..." />
      ) : projects && projects.length > 0 ? (
        <Card title="Your Projects">
          <Table
            headers={['Name', 'Status', 'Created', 'Updated']}
            rows={projects.map((project) => [
              project.name,
              <span
                key={`status-${project.id}`}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {project.status}
              </span>,
              new Date(project.createdAt).toLocaleDateString(),
              new Date(project.updatedAt).toLocaleDateString(),
            ])}
          />
        </Card>
      ) : (
        <Suspense fallback={<Loading message="Loading projects..." />}>
          <ProjectsContent />
        </Suspense>
      )}
    </div>
  );
}

