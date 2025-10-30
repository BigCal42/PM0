/**
 * Common data types and repository interface
 */

export interface Project {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Scenario {
  id: string;
  projectId: string;
  name: string;
  type: 'baseline' | 'accelerated' | 'lean' | 'scope-lite';
  createdAt: string;
}

export interface DataAdapter {
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  getScenarios(projectId: string): Promise<Scenario[]>;
}

