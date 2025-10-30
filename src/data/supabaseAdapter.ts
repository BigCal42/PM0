import { DataAdapter, Project, Scenario } from './types';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';

/**
 * Supabase data adapter for production use
 */
export const supabaseAdapter: DataAdapter = {
  async getProjects(): Promise<Project[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch projects:', error);
      throw error;
    }

    return (
      data?.map((row) => ({
        id: row.id,
        name: row.name,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })) || []
    );
  },

  async getProject(id: string): Promise<Project | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      logger.error('Failed to fetch project:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async getScenarios(projectId: string): Promise<Scenario[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch scenarios:', error);
      throw error;
    }

    return (
      data?.map((row) => ({
        id: row.id,
        projectId: row.project_id,
        name: row.name,
        type: row.type,
        createdAt: row.created_at,
      })) || []
    );
  },
};

