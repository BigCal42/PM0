// This file is auto-generated via scripts/typegen.sh.
// Do not edit by hand.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_month: string | null
          id: string
          name: string
          start_month: string | null
          status: 'active' | 'archived'
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_month?: string | null
          id?: string
          name: string
          start_month?: string | null
          status?: 'active' | 'archived'
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_month?: string | null
          id?: string
          name?: string
          start_month?: string | null
          status?: 'active' | 'archived'
          updated_at?: string | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          created_at: string | null
          invited_by: string | null
          project_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          user_id: string
        }
        Insert: {
          created_at?: string | null
          invited_by?: string | null
          project_id: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          user_id: string
        }
        Update: {
          created_at?: string | null
          invited_by?: string | null
          project_id?: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_members_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      role_definitions: {
        Row: {
          created_at: string | null
          discipline: string | null
          fte_required: number
          id: string
          name: string
          notes: string | null
          project_id: string
          severity_level: number
          updated_at: string | null
          workstream: string | null
        }
        Insert: {
          created_at?: string | null
          discipline?: string | null
          fte_required?: number
          id?: string
          name: string
          notes?: string | null
          project_id: string
          severity_level?: number
          updated_at?: string | null
          workstream?: string | null
        }
        Update: {
          created_at?: string | null
          discipline?: string | null
          fte_required?: number
          id?: string
          name?: string
          notes?: string | null
          project_id?: string
          severity_level?: number
          updated_at?: string | null
          workstream?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'role_definitions_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      resources: {
        Row: {
          availability: number
          cost_center: string | null
          created_at: string | null
          currency: string
          email: string | null
          full_name: string
          hourly_rate: number | null
          id: string
          project_id: string
          role_id: string | null
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          availability?: number
          cost_center?: string | null
          created_at?: string | null
          currency?: string
          email?: string | null
          full_name: string
          hourly_rate?: number | null
          id?: string
          project_id: string
          role_id?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          availability?: number
          cost_center?: string | null
          created_at?: string | null
          currency?: string
          email?: string | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          project_id?: string
          role_id?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'resources_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resources_role_id_fkey'
            columns: ['role_id']
            referencedRelation: 'role_definitions'
            referencedColumns: ['id']
          }
        ]
      }
      resource_allocations: {
        Row: {
          allocation_hours: number
          created_at: string | null
          id: string
          month: string
          notes: string | null
          project_id: string
          resource_id: string
          role_id: string | null
          severity_level: number
          status: 'planned' | 'committed' | 'actual'
          updated_at: string | null
        }
        Insert: {
          allocation_hours?: number
          created_at?: string | null
          id?: string
          month: string
          notes?: string | null
          project_id: string
          resource_id: string
          role_id?: string | null
          severity_level?: number
          status?: 'planned' | 'committed' | 'actual'
          updated_at?: string | null
        }
        Update: {
          allocation_hours?: number
          created_at?: string | null
          id?: string
          month?: string
          notes?: string | null
          project_id?: string
          resource_id?: string
          role_id?: string | null
          severity_level?: number
          status?: 'planned' | 'committed' | 'actual'
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'resource_allocations_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocations_resource_id_fkey'
            columns: ['resource_id']
            referencedRelation: 'resources'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'resource_allocations_role_id_fkey'
            columns: ['role_id']
            referencedRelation: 'role_definitions'
            referencedColumns: ['id']
          }
        ]
      }
      scenarios: {
        Row: {
          assumptions: Json
          created_at: string | null
          created_by: string
          id: string
          is_primary: boolean
          name: string
          project_id: string
          results: Json
          scenario_type: 'baseline' | 'accelerated' | 'lean' | 'scope-lite' | 'high-scope' | 'custom'
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          assumptions?: Json
          created_at?: string | null
          created_by: string
          id?: string
          is_primary?: boolean
          name: string
          project_id: string
          results?: Json
          scenario_type?: 'baseline' | 'accelerated' | 'lean' | 'scope-lite' | 'high-scope' | 'custom'
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          assumptions?: Json
          created_at?: string | null
          created_by?: string
          id?: string
          is_primary?: boolean
          name?: string
          project_id?: string
          results?: Json
          scenario_type?: 'baseline' | 'accelerated' | 'lean' | 'scope-lite' | 'high-scope' | 'custom'
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'scenarios_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      scenario_timeframes: {
        Row: {
          created_at: string | null
          demand_multiplier: number
          id: string
          month: string
          notes: string | null
          scenario_id: string
          supply_multiplier: number
        }
        Insert: {
          created_at?: string | null
          demand_multiplier?: number
          id?: string
          month: string
          notes?: string | null
          scenario_id: string
          supply_multiplier?: number
        }
        Update: {
          created_at?: string | null
          demand_multiplier?: number
          id?: string
          month?: string
          notes?: string | null
          scenario_id?: string
          supply_multiplier?: number
        }
        Relationships: [
          {
            foreignKeyName: 'scenario_timeframes_scenario_id_fkey'
            columns: ['scenario_id']
            referencedRelation: 'scenarios'
            referencedColumns: ['id']
          }
        ]
      }
      estimation_inputs: {
        Row: {
          category: string
          created_at: string | null
          id: string
          input_key: string
          metadata: Json
          project_id: string
          unit: string | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          input_key: string
          metadata?: Json
          project_id: string
          unit?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          input_key?: string
          metadata?: Json
          project_id?: string
          unit?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'estimation_inputs_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      kpi_snapshots: {
        Row: {
          created_at: string | null
          id: string
          metrics: Json
          project_id: string
          recorded_for: string | null
          scenario_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metrics?: Json
          project_id: string
          recorded_for?: string | null
          scenario_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metrics?: Json
          project_id?: string
          recorded_for?: string | null
          scenario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'kpi_snapshots_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'kpi_snapshots_scenario_id_fkey'
            columns: ['scenario_id']
            referencedRelation: 'scenarios'
            referencedColumns: ['id']
          }
        ]
      }
      readiness_checklist_items: {
        Row: {
          category: string | null
          created_at: string | null
          due_date: string | null
          id: string
          item: string
          notes: string | null
          owner: string | null
          owner_id: string | null
          project_id: string
          status: 'not_started' | 'in_progress' | 'blocked' | 'complete'
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          item: string
          notes?: string | null
          owner?: string | null
          owner_id?: string | null
          project_id: string
          status?: 'not_started' | 'in_progress' | 'blocked' | 'complete'
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          item?: string
          notes?: string | null
          owner?: string | null
          owner_id?: string | null
          project_id?: string
          status?: 'not_started' | 'in_progress' | 'blocked' | 'complete'
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'readiness_checklist_items_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      vendor_catalog_rates: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          metadata: Json
          project_id: string
          rate: number
          rate_type: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'fixed'
          service: string
          vendor_name: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json
          project_id: string
          rate: number
          rate_type: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'fixed'
          service: string
          vendor_name: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json
          project_id?: string
          rate?: number
          rate_type?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'fixed'
          service?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vendor_catalog_rates_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      import_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error: string | null
          id: string
          job_type: string
          payload: Json
          project_id: string
          status: 'pending' | 'running' | 'complete' | 'failed'
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          job_type: string
          payload?: Json
          project_id: string
          status?: 'pending' | 'running' | 'complete' | 'failed'
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          job_type?: string
          payload?: Json
          project_id?: string
          status?: 'pending' | 'running' | 'complete' | 'failed'
        }
        Relationships: [
          {
            foreignKeyName: 'import_jobs_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {}
    Functions: {
      is_project_admin: {
        Args: { target_project: string }
        Returns: boolean
      }
      is_project_member: {
        Args: { target_project: string }
        Returns: boolean
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
