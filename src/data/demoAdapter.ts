import { DataAdapter, Project, Scenario } from './types';
import demoData from '../../data/demo.json';

/**
 * Demo data adapter for offline/local development
 */
export const demoAdapter: DataAdapter = {
  async getProjects(): Promise<Project[]> {
    return (demoData.projects || []) as Project[];
  },

  async getProject(id: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id) || null;
  },

  async getScenarios(projectId: string): Promise<Scenario[]> {
    return ((demoData.scenarios || []).filter((s) => s.projectId === projectId)) as Scenario[];
  },
};

