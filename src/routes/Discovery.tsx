import { useNavigate } from 'react-router-dom';
import { DiscoveryWizard } from '@/components/DiscoveryWizard';
import { useToast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataAdapter } from '@/data';
import type { DiscoveryFormData } from '@/types/discovery';
import type { Project } from '@/data/types';

/**
 * Discovery & Intake page
 * Multi-step wizard for creating new projects
 */
export function Discovery() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Load draft from localStorage
  const loadDraft = (): Partial<DiscoveryFormData> | undefined => {
    try {
      const draft = localStorage.getItem('pm0_discovery_draft');
      return draft ? JSON.parse(draft) : undefined;
    } catch (error) {
      console.warn('Failed to load draft:', error);
      return undefined;
    }
  };

  // Auto-save draft to localStorage
  const handleDataChange = (data: Partial<DiscoveryFormData>) => {
    try {
      localStorage.setItem('pm0_discovery_draft', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save draft:', error);
    }
  };

  const createProjectMutation = useMutation({
    mutationFn: async (data: DiscoveryFormData): Promise<Project> => {
      const adapter = getDataAdapter();
      
      // Calculate complexity score (simple heuristic for now)
      // TODO: Store complexity score in project metadata
      calculateComplexityScore(data);
      
      // Create project via adapter
      // Note: This is a placeholder - real implementation will use Supabase
      const project: Project = {
        id: `project-${Date.now()}`,
        name: data.projectName,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In demo mode, we can't actually create, so we'll simulate
      if (adapter.constructor.name === 'demoAdapter') {
        // Simulate success
        return project;
      }

      // TODO: Implement Supabase project creation
      // const supabase = getSupabaseClient();
      // const { data: newProject, error } = await supabase
      //   .from('projects')
      //   .insert({ ... })
      //   .select()
      //   .single();

      throw new Error('Project creation not yet implemented for Supabase');
    },
    onSuccess: (project) => {
      // Clear draft
      localStorage.removeItem('pm0_discovery_draft');
      
      // Invalidate projects query to refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      toast.success('Project created!', `"${project.name}" has been added to your portfolio.`);
      navigate('/projects');
    },
    onError: (error) => {
      toast.error('Failed to create project', error instanceof Error ? error.message : 'Unknown error');
    },
  });

  const handleSubmit = async (data: DiscoveryFormData) => {
    try {
      await createProjectMutation.mutateAsync(data);
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Your progress will be saved as a draft.')) {
      navigate('/projects');
    }
  };

  // Simple complexity scoring algorithm
  const calculateComplexityScore = (data: DiscoveryFormData): number => {
    let score = 0;
    
    // User count (0-30 points)
    if (data.userCount < 100) score += 10;
    else if (data.userCount < 500) score += 20;
    else score += 30;
    
    // Geographic locations (0-20 points)
    score += Math.min(data.geographicLocations.length * 5, 20);
    
    // Business units (0-20 points)
    score += Math.min(data.businessUnits.length * 5, 20);
    
    // Migration type (0-15 points)
    if (data.migrationType === 'new-implementation') score += 5;
    else if (data.migrationType === 'upgrade') score += 10;
    else if (data.migrationType === 'migration') score += 15;
    else score += 12; // replacement
    
    // Change management readiness (0-15 points)
    if (data.changeManagementReadiness === 'low') score += 15;
    else if (data.changeManagementReadiness === 'medium') score += 10;
    else score += 5;
    
    return Math.min(score, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discovery & Intake</h1>
        <p className="text-gray-600">
          Create a new transformation project by answering a few questions
        </p>
      </div>

      <DiscoveryWizard
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={loadDraft()}
        onDataChange={handleDataChange}
      />
    </div>
  );
}

