import { useQuery } from '@tanstack/react-query';
import { getDataAdapter } from '@/data';
import type { Project } from '@/data/types';

/**
 * React Query hook for fetching projects
 * Provides zero-latency UX with caching and optimistic updates
 */
export function useProjects() {
  const adapter = getDataAdapter();

  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      return await adapter.getProjects();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for projects
  });
}

/**
 * React Query hook for fetching a single project
 */
export function useProject(id: string) {
  const adapter = getDataAdapter();

  return useQuery<Project | null>({
    queryKey: ['project', id],
    queryFn: async () => {
      return await adapter.getProject(id);
    },
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes for single project
  });
}

