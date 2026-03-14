import { Spinner, Text, Button, Select } from '@fluentui/react-components';
import { useState } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import type { Task } from '@/services/tasksApi';

export function TasksPage(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: tasks, isLoading, isError, error } = useTasks(statusFilter);
  const deleteMutation = useDeleteTask();

  function handleDelete(id: string): void {
    deleteMutation.mutate(id);
  }

  if (isLoading) {
    return (
      <main>
        <Spinner label="Loading tasks..." />
      </main>
    );
  }

  if (isError) {
    return (
      <main>
        <Text as="p" style={{ color: 'red' }}>
          Failed to load tasks: {(error as Error).message}
        </Text>
      </main>
    );
  }

  return (
    <main>
      <Text as="h1" size={800} weight="bold" block style={{ marginBottom: '1.5rem' }}>
        My Tasks
      </Text>

      <div style={{ marginBottom: '1rem' }}>
        <Select
          value={statusFilter ?? ''}
          onChange={(_ev, data) => setStatusFilter(data.value || undefined)}
        >
          <option value="">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
      </div>

      {tasks?.length === 0 && (
        <Text as="p" size={400}>
          No tasks found.{' '}
          <Button appearance="transparent" size="small">
            Create one
          </Button>
        </Text>
      )}

      {tasks?.map((task: Task) => (
        <TaskCard key={task.id} task={task} onDelete={handleDelete} />
      ))}
    </main>
  );
}
