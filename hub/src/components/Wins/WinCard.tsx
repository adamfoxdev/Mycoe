import { Card, CardHeader, Text, Badge, Button } from '@fluentui/react-components';
import type { WinEntry } from '../../types';
import { useHubStore } from '../../store/hubStore';

interface WinCardProps {
  entry: WinEntry;
}

export function WinCard({ entry }: WinCardProps): JSX.Element {
  const resolveIssue = useHubStore((s) => s.resolveIssue);

  return (
    <Card style={{ marginBottom: '1rem' }}>
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            {entry.title}
          </Text>
        }
        description={
          <Text size={200} style={{ color: '#666' }}>
            {entry.author.name} · {new Date(entry.createdAt).toLocaleDateString()}
          </Text>
        }
        action={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Badge appearance="tint" color={entry.type === 'win' ? 'success' : 'danger'}>
              {entry.type === 'win' ? '🎉 Win' : '⚠️ Issue'}
            </Badge>
            {entry.type === 'issue' && entry.resolved && (
              <Badge appearance="tint" color="subtle">
                Resolved
              </Badge>
            )}
          </div>
        }
      />
      <Text size={300} style={{ padding: '0 1rem 1rem' }}>
        {entry.description}
      </Text>
      {entry.type === 'issue' && !entry.resolved && (
        <div style={{ padding: '0 1rem 1rem' }}>
          <Button size="small" appearance="outline" onClick={() => resolveIssue(entry.id)}>
            Mark as Resolved
          </Button>
        </div>
      )}
    </Card>
  );
}
