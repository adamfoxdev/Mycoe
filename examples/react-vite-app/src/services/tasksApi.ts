/** Shape of a Task returned by the API. */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

/** Request body for creating a new task. */
export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

/** Request body for updating an existing task. */
export interface UpdateTaskRequest {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7000';

async function request<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/** Fetch all tasks, optionally filtered by status. */
export function fetchTasks(token: string, status?: string): Promise<Task[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return request<Task[]>(`/api/tasks${query}`, undefined, token);
}

/** Fetch a single task by ID. */
export function fetchTask(id: string, token: string): Promise<Task> {
  return request<Task>(`/api/tasks/${id}`, undefined, token);
}

/** Create a new task. */
export function createTask(data: CreateTaskRequest, token: string): Promise<Task> {
  return request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(data) }, token);
}

/** Update an existing task. */
export function updateTask(id: string, data: UpdateTaskRequest, token: string): Promise<Task> {
  return request<Task>(
    `/api/tasks/${id}`,
    { method: 'PUT', body: JSON.stringify(data) },
    token,
  );
}

/** Delete a task. */
export function deleteTask(id: string, token: string): Promise<void> {
  return request<void>(`/api/tasks/${id}`, { method: 'DELETE' }, token);
}
