import { Card, CardHeader, Text, Badge, Button, Tooltip } from '@fluentui/react-components';
import type { VoteProposal } from '../../types';
import { useHubStore } from '../../store/hubStore';

interface VoteCardProps {
  proposal: VoteProposal;
}

export function VoteCard({ proposal }: VoteCardProps): JSX.Element {
  const castVote = useHubStore((s) => s.castVote);
  const currentUser = useHubStore((s) => s.currentUser);

  const upvotes = Object.values(proposal.votes).filter((v) => v === 1).length;
  const downvotes = Object.values(proposal.votes).filter((v) => v === -1).length;
  const userVote = proposal.votes[currentUser.id];

  return (
    <Card style={{ marginBottom: '1rem' }}>
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            {proposal.title}
          </Text>
        }
        description={
          <Text size={200} style={{ color: '#666' }}>
            {proposal.author.name} · {new Date(proposal.createdAt).toLocaleDateString()}
          </Text>
        }
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Badge
              appearance="tint"
              color={proposal.type === 'process' ? 'brand' : 'success'}
            >
              {proposal.type}
            </Badge>
            <Badge
              appearance="tint"
              color={proposal.status === 'open' ? 'success' : 'subtle'}
            >
              {proposal.status}
            </Badge>
          </div>
        }
      />
      <Text size={300} style={{ padding: '0 1rem' }}>
        {proposal.description}
      </Text>
      {proposal.status === 'open' && (
        <div
          style={{
            padding: '0.75rem 1rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Tooltip content="Upvote" relationship="label">
            <Button
              appearance={userVote === 1 ? 'primary' : 'outline'}
              size="small"
              onClick={() => castVote(proposal.id, 1)}
            >
              👍 {upvotes}
            </Button>
          </Tooltip>
          <Tooltip content="Downvote" relationship="label">
            <Button
              appearance={userVote === -1 ? 'primary' : 'outline'}
              size="small"
              onClick={() => castVote(proposal.id, -1)}
            >
              👎 {downvotes}
            </Button>
          </Tooltip>
          <Text size={200} style={{ color: '#666' }}>
            Net: {upvotes - downvotes}
          </Text>
        </div>
      )}
    </Card>
  );
}
