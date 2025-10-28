import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Section } from '../../components/Section';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useProjectStore, type Resource, type Role } from '../../store/useProjectStore';
import { useResourceDataSource } from './api';
import { nanoid } from '../../utils/nanoid';
import { useFeatureFlags } from '../../store/useFeatureFlags';

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
  }));
  const { fetchRoles, fetchResources, persistRole, persistResource, removeRole, removeResource } =
    useResourceDataSource();
  const [error, setError] = useState<string | null>(null);

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
      queryClient.setQueryData<Role[]>(rolesQueryKey, (current = []) => {
        const existingIndex = current.findIndex((item) => item.id === role.id);
        if (existingIndex >= 0) {
          const next = [...current];
          next[existingIndex] = role;
          return next;
        }
        return [...current, role];
      });
      setError(null);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: removeRole,
    onError: (mutationError: unknown) => {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to delete role');
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Role[]>(rolesQueryKey, (current = []) => current.filter((role) => role.id !== id));
      setError(null);
    },
  });

  const createResourceMutation = useMutation({
    mutationFn: persistResource,
    onError: (mutationError: unknown) => {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to save resource');
    },
    onSuccess: (resource) => {
      queryClient.setQueryData<Resource[]>(resourcesQueryKey, (current = []) => {
        const existingIndex = current.findIndex((item) => item.id === resource.id);
        if (existingIndex >= 0) {
          const next = [...current];
          next[existingIndex] = resource;
          return next;
        }
        return [...current, resource];
      });
      setError(null);
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: removeResource,
    onError: (mutationError: unknown) => {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to delete resource');
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Resource[]>(resourcesQueryKey, (current = []) =>
        current.filter((resource) => resource.id !== id),
      );
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
    const description = String(formData.get('description') ?? '').trim();
    const monthlyCapacity = Number(formData.get('monthlyCapacity') ?? '0');
    if (!name) return;
    createRoleMutation.mutate({ id: useDemoData ? nanoid() : undefined, name, description, monthlyCapacity });
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
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleCreateRole} className="space-y-3 rounded-md border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Add Role</h3>
          <input
            name="name"
            placeholder="Role name"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={2}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="monthlyCapacity"
            type="number"
            step="1"
            min="0"
            placeholder="Monthly capacity"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save role
          </button>
        </form>
        <form onSubmit={handleCreateResource} className="space-y-3 rounded-md border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Add Resource</h3>
          <select name="roleId" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
            <option value="">Select role</option>
            {roleOptions}
          </select>
          <input
            name="name"
            placeholder="Resource name"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="availability"
            type="number"
            min="0"
            max="1.5"
            step="0.05"
            placeholder="Availability (FTE)"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save resource
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
                  {role.description && <p className="mt-1 text-xs text-slate-600">{role.description}</p>}
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
