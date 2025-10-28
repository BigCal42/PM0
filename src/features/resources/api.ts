import { z } from 'zod';
import { nanoid } from '../../utils/nanoid';
import { Supabase } from '../auth/SupabaseAuthProvider';
import { demoHeatmap, demoResources, demoRoles, demoScenarios } from '../../lib/demoData';
import type { HeatmapCell, Resource, Role, Scenario } from '../../store/useProjectStore';
import { useFeatureFlags } from '../../store/useFeatureFlags';

const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  monthlyCapacity: z.number().min(0),
});

const resourceSchema = z.object({
  id: z.string().optional(),
  roleId: z.string().min(1),
  name: z.string().min(1),
  availability: z.number().min(0).max(1.5),
});

const scenarioSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  multipliers: z.object({
    id: z.string(),
    label: z.string(),
    effortMultiplier: z.number(),
    durationMultiplier: z.number(),
    costMultiplier: z.number(),
  }),
  assumptions: z.record(z.any()),
  results: z.object({
    totalCost: z.number(),
    totalFte: z.number().optional(),
    riskScore: z.number().optional(),
    totalHours: z.number().optional(),
    vendorSpendPct: z.number().optional(),
    readinessScore: z.number().optional(),
    durationMonths: z.number().optional(),
  }),
});

export const useResourceDataSource = () => {
  const { useDemoData } = useFeatureFlags();

  const fetchRoles = async (): Promise<Role[]> => {
    if (useDemoData) return demoRoles;
    const { data, error } = await Supabase.from('roles').select('*');
    if (error) throw error;
    return data ?? [];
  };

  const fetchResources = async (): Promise<Resource[]> => {
    if (useDemoData) return demoResources;
    const { data, error } = await Supabase.from('resources').select('*');
    if (error) throw error;
    return data ?? [];
  };

  const fetchHeatmap = async (): Promise<HeatmapCell[]> => {
    if (useDemoData) return demoHeatmap;
    const { data, error } = await Supabase.from('heatmap_cells').select('*');
    if (error) throw error;
    return data?.map((item) => ({
      id: item.id,
      roleId: item.role_id,
      month: item.month,
      severity: item.severity,
      gap: item.gap,
    })) ?? [];
  };

  const fetchScenarios = async (): Promise<Scenario[]> => {
    if (useDemoData) return demoScenarios;
    const { data, error } = await Supabase.from('scenarios').select('*');
    if (error) throw error;
    return data?.map((scenario) => ({
      id: scenario.id,
      name: scenario.name,
      multipliers: scenario.multipliers,
      assumptions: scenario.assumptions,
      results: scenario.results,
    })) ?? [];
  };

  const persistRole = async (payload: Role): Promise<Role> => {
    const parsed = roleSchema.parse(payload);
    if (useDemoData) {
      return { ...parsed, id: parsed.id ?? nanoid() };
    }
    const { data, error } = await Supabase.from('roles')
      .upsert({
        id: parsed.id,
        name: parsed.name,
        description: parsed.description,
        monthly_capacity: parsed.monthlyCapacity,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      description: data.description ?? undefined,
      monthlyCapacity: data.monthly_capacity,
    };
  };

  const removeRole = async (id: string): Promise<void> => {
    if (useDemoData) return;
    const { error } = await Supabase.from('roles').delete().eq('id', id);
    if (error) throw error;
  };

  const persistResource = async (payload: Resource): Promise<Resource> => {
    const parsed = resourceSchema.parse(payload);
    if (useDemoData) {
      return { ...parsed, id: parsed.id ?? nanoid() };
    }
    const { data, error } = await Supabase.from('resources')
      .upsert({
        id: parsed.id,
        role_id: parsed.roleId,
        name: parsed.name,
        availability: parsed.availability,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      roleId: data.role_id,
      name: data.name,
      availability: data.availability,
    };
  };

  const removeResource = async (id: string): Promise<void> => {
    if (useDemoData) return;
    const { error } = await Supabase.from('resources').delete().eq('id', id);
    if (error) throw error;
  };

  const persistScenario = async (payload: Scenario): Promise<Scenario> => {
    const parsed = scenarioSchema.parse(payload);
    if (useDemoData) {
      return { ...parsed, id: parsed.id ?? nanoid() };
    }
    const { data, error } = await Supabase.from('scenarios')
      .upsert({
        id: parsed.id,
        name: parsed.name,
        multipliers: parsed.multipliers,
        assumptions: parsed.assumptions,
        results: parsed.results,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Scenario;
  };

  const removeScenario = async (id: string): Promise<void> => {
    if (useDemoData) return;
    const { error } = await Supabase.from('scenarios').delete().eq('id', id);
    if (error) throw error;
  };

  return {
    fetchRoles,
    fetchResources,
    fetchHeatmap,
    fetchScenarios,
    persistRole,
    removeRole,
    persistResource,
    removeResource,
    persistScenario,
    removeScenario,
  };
};
