import { Badge, Card, CardHeader, Text, Button, tokens } from '@fluentui/react-components';
import type { Task } from '@/services/tasksApi';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const priorityColours: Record<Task['priority'], string> = {
  low: tokens.colorPaletteGreenBorderActive,
  medium: tokens.colorPaletteYellowBorderActive,
  high: tokens.colorPaletteCranberryBorderActive,
};

const statusLabels: Record<Task['status'], string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export function TaskCard({ task, onDelete }: TaskCardProps): JSX.Element {
  return (
    <Card
      style={{
        marginBottom: '1rem',
        borderLeft: `4px solid ${priorityColours[task.priority]}`,
      }}
    >
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            {task.title}
          </Text>
        }
        action={
          <Button
            appearance="subtle"
            aria-label={`Delete task: ${task.title}`}
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        }
      />
      <Text as="p" size={300} style={{ marginBottom: '0.5rem' }}>
        {task.description}
      </Text>
      <Badge appearance="filled" color="informative" size="small">
        {statusLabels[task.status]}
      </Badge>
    </Card>
  );
}
