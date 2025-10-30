import { describe, it, expect } from 'vitest';
import { demoAdapter } from '@/data/demoAdapter';

describe('Data Adapters', () => {
  describe('demoAdapter', () => {
    it('should fetch projects', async () => {
      const projects = await demoAdapter.getProjects();
      expect(projects).toBeInstanceOf(Array);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should fetch a specific project', async () => {
      const projects = await demoAdapter.getProjects();
      if (projects.length > 0) {
        const project = await demoAdapter.getProject(projects[0].id);
        expect(project).not.toBeNull();
        expect(project?.id).toBe(projects[0].id);
      }
    });

    it('should return null for non-existent project', async () => {
      const project = await demoAdapter.getProject('non-existent-id');
      expect(project).toBeNull();
    });
  });
});

