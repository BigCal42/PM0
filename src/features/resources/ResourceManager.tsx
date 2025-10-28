import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Section } from '../../components/Section';
import { ErrorMessage } from '../../components/ErrorMessage';
import {
  useProjectStore,
  type HeatmapCell,
  type Resource,
  type Role,
  type Scenario,
} from '../../store/useProjectStore';
import { useResourceDataSource } from './api';
import { nanoid } from '../../utils/nanoid';
import { useFeatureFlags } from '../../store/useFeatureFlags';
import { demoHeatmap, demoResources, demoRoles, demoScenarios } from '../../lib/demoData';

const rolesQueryKey = ['roles'];
const resourcesQueryKey = ['resources'];

type ProjectTemplate = {
  label: string;
  roles: Role[];
  resources: Resource[];
  heatmap: HeatmapCell[];
  scenarios: Scenario[];
};

const projectTemplates: Record<string, ProjectTemplate> = {
  workday: {
    label: 'Workday Transformation Accelerator',
    roles: demoRoles,
    resources: demoResources,
    heatmap: demoHeatmap,
    scenarios: demoScenarios,
  },
  blank: {
    label: 'Blank Project',
    roles: [],
    resources: [],
    heatmap: [],
    scenarios: [],
  },
};

export const ResourceManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { useDemoData } = useFeatureFlags();
  const {
    setRoles,
    setResources,
    setHeatmap,
    setScenarios,
    setProjectMetadata,
    roles,
    resources,
    projectName,
    projectTemplateId,
  } = useProjectStore((state) => ({
export const ResourceManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { useDemoData } = useFeatureFlags();
  const modeKey = useDemoData ? 'demo' : 'live';
  const rolesQueryKey = ['roles', modeKey] as const;
  const resourcesQueryKey = ['resources', modeKey] as const;
  const { setRoles, setResources, roles, resources } = useProjectStore((state) => ({
    roles: state.roles,
    resources: state.resources,
    setRoles: state.setRoles,
    setResources: state.setResources,
    setHeatmap: state.setHeatmap,
    setScenarios: state.setScenarios,
    setProjectMetadata: state.setProjectMetadata,
    projectName: state.projectName,
    projectTemplateId: state.projectTemplateId,
  }));
  const { fetchRoles, fetchResources, persistRole, persistResource, removeRole, removeResource } =
    useResourceDataSource();
  const [error, setError] = useState<string | null>(null);
  const [isProjectFormOpen, setProjectFormOpen] = useState(false);
  const [isRoleFormVisible, setRoleFormVisible] = useState(false);
  const roleNameInputRef = useRef<HTMLInputElement | null>(null);

  const rolesQuery = useQuery({
    queryKey: rolesQueryKey,
    queryFn: fetchRoles,
  });

  const resourcesQuery = useQuery({
    queryKey: resourcesQueryKey,
    queryFn: fetchResources,
  });

  useEffect(() => {
    if (rolesQuery.data) {
      setRoles(rolesQuery.data);
    }
  }, [rolesQuery.data, setRoles]);

  useEffect(() => {
    if (resourcesQuery.data) {
      setResources(resourcesQuery.data);
    }
  }, [resourcesQuery.data, setResources]);

  const createRoleMutation = useMutation({
    mutationFn: persistRole,
    onError: (mutationError: unknown) => {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to save role');
    },
    onSuccess: (role) => {
      const nextRoles = queryClient.setQueryData<Role[]>(rolesQueryKey, (current = []) => {
        const existingIndex = current.findIndex((item) => item.id === role.id);
        if (existingIndex >= 0) {
          const next = [...current];
          next[existingIndex] = role;
          return next;
        }
        return [...current, role];
      });
      if (nextRoles) {
        setRoles(nextRoles);
      }
      setError(null);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: removeRole,
    onError: (mutationError: unknown) => {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to delete role');
    },
    onSuccess: (_, id) => {
      const nextRoles = queryClient.setQueryData<Role[]>(rolesQueryKey, (current = []) =>
        current.filter((role) => role.id !== id),
      );
      if (nextRoles) {
        setRoles(nextRoles);
      }
      setError(null);
    },
  });

  const createResourceMutation = useMutation({
    mutationFn: persistResource,
    onError: (mutationError: unknown) => {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to save resource');
    },
    onSuccess: (resource) => {
      const nextResources = queryClient.setQueryData<Resource[]>(resourcesQueryKey, (current = []) => {
        const existingIndex = current.findIndex((item) => item.id === resource.id);
        if (existingIndex >= 0) {
          const next = [...current];
          next[existingIndex] = resource;
          return next;
        }
        return [...current, resource];
      });
      if (nextResources) {
        setResources(nextResources);
      }
      setError(null);
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: removeResource,
    onError: (mutationError: unknown) => {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to delete resource');
    },
    onSuccess: (_, id) => {
      const nextResources = queryClient.setQueryData<Resource[]>(resourcesQueryKey, (current = []) =>
        current.filter((resource) => resource.id !== id),
      );
      if (nextResources) {
        setResources(nextResources);
      }
      setError(null);
    },
  });

  const roleOptions = useMemo(
    () =>
      roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.name}
        </option>
      )),
    [roles],
  );

  const handleCreateRole: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim();
    const monthlyCapacityRaw = Number(formData.get('monthlyCapacity') ?? '0');
    const monthlyCapacity = Number.isFinite(monthlyCapacityRaw) && monthlyCapacityRaw > 0 ? monthlyCapacityRaw : 160;
    if (!name) return;
    createRoleMutation.mutate({
      id: useDemoData ? nanoid() : undefined,
      name,
      description: category,
      monthlyCapacity,
    });
    event.currentTarget.reset();
  };

  const handleCreateResource: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roleId = String(formData.get('roleId') ?? '');
    const name = String(formData.get('name') ?? '').trim();
    const availability = Number(formData.get('availability') ?? '0');
    if (!roleId || !name) return;
    createResourceMutation.mutate({ id: useDemoData ? nanoid() : undefined, roleId, name, availability });
    event.currentTarget.reset();
  };

  const handleCreateProject: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('projectName') ?? '').trim();
    const templateId = String(formData.get('template') ?? '').trim();
    if (!name || !templateId) return;
    const template = projectTemplates[templateId];
    if (!template) return;

    setProjectMetadata(name, templateId);
    setRoles(template.roles);
    setResources(template.resources);
    setHeatmap(template.heatmap);
    setScenarios(template.scenarios);
    queryClient.setQueryData<Role[]>(rolesQueryKey, template.roles);
    queryClient.setQueryData<Resource[]>(resourcesQueryKey, template.resources);
    setProjectFormOpen(false);
    event.currentTarget.reset();
  };

  const handleRevealRoleForm = () => {
    setRoleFormVisible(true);
    requestAnimationFrame(() => {
      roleNameInputRef.current?.focus();
    });
  };

  const templateDescription = projectTemplateId ? projectTemplates[projectTemplateId]?.label ?? 'Custom' : null;

  return (
    <Section
      title="Roles & Resources"
      actions={
        <span className="text-xs font-medium text-slate-500">
          {roles.length} roles • {resources.length} resources
        </span>
      }
    >
      <ErrorMessage error={error} />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3 rounded-md border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Project Templates</h3>
            <button
              type="button"
              data-testid="create-project"
              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              onClick={() => setProjectFormOpen((previous) => !previous)}
            >
              {isProjectFormOpen ? 'Close' : 'Create Project'}
            </button>
          </div>
          {projectName && (
            <div className="rounded-md bg-slate-50 p-3 text-sm">
              <h3 className="text-base font-semibold text-slate-900">{projectName}</h3>
              {templateDescription && (
                <p className="text-xs text-slate-500">Template: {templateDescription}</p>
              )}
            </div>
          )}
          {isProjectFormOpen && (
            <form onSubmit={handleCreateProject} className="space-y-3" data-testid="create-project-form">
              <div className="space-y-1">
                <label htmlFor="project-name" className="text-xs font-semibold text-slate-600">
                  Project Name
                </label>
                <input
                  id="project-name"
                  name="projectName"
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="e.g. Orion Workday Transformation"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="project-template" className="text-xs font-semibold text-slate-600">
                  Template
                </label>
                <select
                  id="project-template"
                  name="template"
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a template
                  </option>
                  {Object.entries(projectTemplates).map(([id, template]) => (
                    <option key={id} value={id}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Create Project
              </button>
            </form>
          )}
        </div>
        <div className="space-y-3 rounded-md border border-slate-200 p-4 md:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Role Builder</h3>
            <button
              type="button"
              data-testid="add-role"
              onClick={handleRevealRoleForm}
              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Add Role
            </button>
          </div>
          {isRoleFormVisible && (
            <form onSubmit={handleCreateRole} className="space-y-3" data-testid="role-form">
              <div className="space-y-1">
                <label htmlFor="role-name" className="text-xs font-semibold text-slate-600">
                  Role Name
                </label>
                <input
                  id="role-name"
                  name="name"
                  ref={roleNameInputRef}
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="role-category" className="text-xs font-semibold text-slate-600">
                  Category
                </label>
                <input
                  id="role-category"
                  name="category"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="e.g. Change Management"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="role-billable-rate" className="text-xs font-semibold text-slate-600">
                  Billable Rate
                </label>
                <input
                  id="role-billable-rate"
                  name="monthlyCapacity"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={160}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Save Role
              </button>
            </form>
          )}
        </div>
        <form onSubmit={handleCreateResource} className="space-y-3 rounded-md border border-slate-200 p-4" data-testid="resource-form">
          <h3 className="text-sm font-semibold text-slate-900">Add Resource</h3>
          <div className="space-y-1">
            <label htmlFor="resource-role" className="text-xs font-semibold text-slate-600">
              Role
            </label>
            <select
              id="resource-role"
              name="roleId"
              required
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Select role</option>
              {roleOptions}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="resource-name" className="text-xs font-semibold text-slate-600">
              Resource Name
            </label>
            <input
              id="resource-name"
              name="name"
              required
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="resource-availability" className="text-xs font-semibold text-slate-600">
              Availability (FTE)
            </label>
            <input
              id="resource-availability"
              name="availability"
              type="number"
              min="0"
              max="1.5"
              step="0.05"
              defaultValue={1}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save Resource
          </button>
        </form>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Roles</h3>
          <ul className="mt-2 space-y-2">
            {roles.map((role) => (
              <li key={role.id} className="flex items-start justify-between rounded-md border border-slate-200 p-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{role.name}</p>
                  <p className="text-xs text-slate-500">Monthly capacity: {role.monthlyCapacity} hrs</p>
                  {role.description && <p className="mt-1 text-xs text-slate-600">Category: {role.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => deleteRoleMutation.mutate(role.id)}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Resources</h3>
          <ul className="mt-2 space-y-2">
            {resources.map((resource) => {
              const roleName = roles.find((role) => role.id === resource.roleId)?.name ?? 'Unknown role';
              return (
                <li
                  key={resource.id}
                  className="flex items-start justify-between rounded-md border border-slate-200 p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{resource.name}</p>
                    <p className="text-xs text-slate-500">{roleName}</p>
                    <p className="text-xs text-slate-500">Availability: {(resource.availability * 100).toFixed(0)}%</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteResourceMutation.mutate(resource.id)}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
};
