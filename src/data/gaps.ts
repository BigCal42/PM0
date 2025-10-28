import { getSupabaseClient } from '@/lib/supabaseClient';

const supabase = getSupabaseClient();

export type PhaseRow = { phase_id: string; phase_name: string; sort_order: number };
export type GapRow = {
  phase_id: string;
  phase_name: string;
  role_id: string;
  role_name: string;
  required: number; // FTEs
  assigned: number; // FTEs
  gap: number; // FTEs (required - assigned)
};

/**
 * Returns ordered phases for a project
 */
export async function getPhases(projectId: string): Promise<PhaseRow[]> {
  const { data, error } = await supabase.rpc('list_project_phases', { p_project_id: projectId });
  if (error) throw error;
  return (data ?? []) as PhaseRow[];
}

/**
 * Returns computed gaps (required, assigned, gap) by phase and role
 */
export async function getGaps(projectId: string): Promise<GapRow[]> {
  const { data, error } = await supabase.rpc('compute_phase_gaps', { p_project_id: projectId });
  if (error) throw error;
  return (data ?? []) as GapRow[];
}
