import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';
import { isPlaygroundEnabled } from '@/lib/flags';

export function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleViewProjects = () => {
    navigate('/projects');
    toast.info('Navigating to projects...');
  };

  const handleExploreScenarios = () => {
    navigate('/scenarios');
    toast.info('Opening scenario modeler...');
  };

  const handleRunAnalysis = () => {
    toast.warning('Gap analysis coming soon!', 'This feature will be available in the next release.');
  };

  const handleCreateProject = () => {
    navigate('/discovery');
  };

  const handleOpenPlayground = () => {
    navigate('/hub');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          PM0 Dashboard
        </h1>
        <p className="text-dark-text-muted text-lg">
          Plan Smarter. Start Aligned.
        </p>
      </div>

      <div className="mb-8">
        <Button onClick={handleCreateProject} className="mb-4 shadow-2xl">
          ✨ Create New Project
        </Button>
        {isPlaygroundEnabled() && (
          <Button onClick={handleOpenPlayground} variant="secondary" className="mb-4 ml-2">
            🚀 Open Playground
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Projects" className="hover:shadow-blue-500/20">
          <p className="text-dark-text-muted mb-4">
            Manage your strategic planning projects
          </p>
          <Button onClick={handleViewProjects} variant="secondary">View Projects</Button>
        </Card>

        <Card title="Scenarios" className="hover:shadow-purple-500/20">
          <p className="text-dark-text-muted mb-4">
            Generate and compare planning scenarios
          </p>
          <Button onClick={handleExploreScenarios} variant="secondary">Explore Scenarios</Button>
        </Card>

        <Card title="Gap Analysis" className="hover:shadow-pink-500/20">
          <p className="text-dark-text-muted mb-4">
            Identify resource and capability gaps
          </p>
          <Button onClick={handleRunAnalysis} variant="secondary">Run Analysis</Button>
        </Card>
      </div>
    </div>
  );
}

