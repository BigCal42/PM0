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
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Projects</h1>
        <p className="text-dark-text-muted text-lg">
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
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : project.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-dark-surface text-dark-text-muted border border-dark-border'
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

