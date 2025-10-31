import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          PM0 Dashboard
        </h1>
        <p className="text-gray-600">
          Plan Smarter. Start Aligned.
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={handleCreateProject} className="mb-4">
          + Create New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Projects">
          <p className="text-gray-600 mb-4">
            Manage your strategic planning projects
          </p>
          <Button onClick={handleViewProjects}>View Projects</Button>
        </Card>

        <Card title="Scenarios">
          <p className="text-gray-600 mb-4">
            Generate and compare planning scenarios
          </p>
          <Button onClick={handleExploreScenarios}>Explore Scenarios</Button>
        </Card>

        <Card title="Gap Analysis">
          <p className="text-gray-600 mb-4">
            Identify resource and capability gaps
          </p>
          <Button onClick={handleRunAnalysis}>Run Analysis</Button>
        </Card>
      </div>
    </div>
  );
}

