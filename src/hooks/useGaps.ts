/**
 * Hooks for gaps and phases data access
 * Provides React Query hooks for gap analysis and phase data
 */

import { useQuery } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';
import type { PhaseGap } from '@/lib/derive/kpi';

/**
 * Mock gaps data for demo/offline mode
 */
function getMockGaps(projectId: string): PhaseGap[] {
  const phases = [
    'M1: Discovery',
    'M2: Design',
    'M3: Build',
    'M4: Test',
    'M5: Deploy',
    'M6: Cutover',
    'M7: Go-Live',
    'M8: Stabilization',
  ];

  const roles = [
    'Solution Architect',
    'Business Analyst',
    'Developer',
    'Tester',
    'Project Manager',
    'Security Analyst',
  ];

  const gaps: PhaseGap[] = [];

  phases.forEach((phaseName, phaseIdx) => {
    roles.forEach((roleName, roleIdx) => {
      // Create some gaps (not all phases need all roles)
      if (phaseIdx % 2 === 0 || roleIdx % 2 === 0) {
        const requiredCapacity = Math.random() * 2 + 0.5;
        const assignedCapacity = requiredCapacity * (0.6 + Math.random() * 0.3); // 60-90% coverage
        const gap = requiredCapacity - assignedCapacity;

        if (gap > 0) {
          gaps.push({
            phaseId: `phase-${phaseIdx}`,
            phaseName,
            roleId: `role-${roleIdx}`,
            roleName,
            requiredCapacity: Math.round(requiredCapacity * 10) / 10,
            assignedCapacity: Math.round(assignedCapacity * 10) / 10,
            gap: Math.round(gap * 10) / 10,
          });
        }
      }
    });
  });

  return gaps;
}

/**
 * React Query hook for fetching phase gaps
 * Falls back to mock data if Supabase is unavailable
 */
export function usePhaseGaps(projectId: string) {
  return useQuery<PhaseGap[]>({
    queryKey: ['phase-gaps', projectId],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      if (!supabase) {
        logger.warn('Supabase not available, using mock gaps data');
        return getMockGaps(projectId);
      }

      try {
        // Try to call RPC if available
        const { data, error } = await supabase.rpc('compute_phase_gaps', {
          project_id: projectId,
        });

        if (error) {
          logger.warn('RPC not available, using mock gaps data', error);
          return getMockGaps(projectId);
        }

        // Transform RPC response to PhaseGap format
        if (data && Array.isArray(data)) {
          return data.map((row: any) => ({
            phaseId: row.phase_id || row.phaseId,
            phaseName: row.phase_name || row.phaseName,
            roleId: row.role_id || row.roleId,
            roleName: row.role_name || row.roleName,
            requiredCapacity: row.required_capacity || row.requiredCapacity || 0,
            assignedCapacity: row.assigned_capacity || row.assignedCapacity || 0,
            gap: row.gap || 0,
          }));
        }

        return getMockGaps(projectId);
      } catch (err) {
        logger.error('Error fetching phase gaps', err);
        return getMockGaps(projectId);
      }
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * React Query hook for fetching project phases
 */
export function useProjectPhases(projectId: string) {
  return useQuery<any[]>({
    queryKey: ['project-phases', projectId],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      if (!supabase) {
        return [];
      }

      try {
        const { data, error } = await supabase.rpc('list_project_phases', {
          project_id: projectId,
        });

        if (error) {
          logger.warn('RPC not available', error);
          return [];
        }

        return data || [];
      } catch (err) {
        logger.error('Error fetching project phases', err);
        return [];
      }
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}
