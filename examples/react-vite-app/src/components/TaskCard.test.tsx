import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from './TaskCard';
import type { Task } from '@/services/tasksApi';

const mockTask: Task = {
  id: '1',
  title: 'Fix login bug',
  description: 'Users cannot log in on mobile devices.',
  status: 'in-progress',
  priority: 'high',
  createdAt: '2024-01-15T09:00:00Z',
};

describe('TaskCard', () => {
  it('renders the task title', () => {
    render(<TaskCard task={mockTask} onDelete={vi.fn()} />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renders the task description', () => {
    render(<TaskCard task={mockTask} onDelete={vi.fn()} />);
    expect(screen.getByText('Users cannot log in on mobile devices.')).toBeInTheDocument();
  });

  it('renders the task status badge', () => {
    render(<TaskCard task={mockTask} onDelete={vi.fn()} />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('calls onDelete with the task id when Delete is clicked', async () => {
    const onDelete = vi.fn();
    render(<TaskCard task={mockTask} onDelete={onDelete} />);

    screen.getByRole('button', { name: /delete task: fix login bug/i }).click();

    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
