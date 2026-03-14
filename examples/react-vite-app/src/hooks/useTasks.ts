import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMsal } from '@azure/msal-react';
import { AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalInstance } from '../main';
import { apiScopes } from '@/services/authConfig';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/tasksApi';
import type { CreateTaskRequest, UpdateTaskRequest } from '@/services/tasksApi';

async function getToken(account: AccountInfo): Promise<string> {
  try {
    const result = await msalInstance.acquireTokenSilent({
      scopes: apiScopes.tasks,
      account,
    });
    return result.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({ scopes: apiScopes.tasks });
    }
    throw error;
  }
}

/** Hook for fetching the tasks list. Optionally filter by status. */
export function useTasks(status?: string): ReturnType<typeof useQuery> {
  const { accounts } = useMsal();
  const account = accounts[0];

  return useQuery({
    queryKey: ['tasks', status],
    queryFn: async () => {
      const token = await getToken(account);
      return fetchTasks(token, status);
    },
    enabled: !!account,
  });
}

/** Hook for creating a new task. */
export function useCreateTask(): ReturnType<typeof useMutation> {
  const { accounts } = useMsal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      const token = await getToken(accounts[0]);
      return createTask(data, token);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/** Hook for updating an existing task. */
export function useUpdateTask(): ReturnType<typeof useMutation> {
  const { accounts } = useMsal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskRequest }) => {
      const token = await getToken(accounts[0]);
      return updateTask(id, data, token);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/** Hook for deleting a task. */
export function useDeleteTask(): ReturnType<typeof useMutation> {
  const { accounts } = useMsal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken(accounts[0]);
      return deleteTask(id, token);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
