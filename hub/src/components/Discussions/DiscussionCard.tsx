import { useState } from 'react';
import { Card, CardHeader, Text, Badge, Button, Textarea, Field } from '@fluentui/react-components';
import type { Discussion } from '../../types';
import { useHubStore } from '../../store/hubStore';

interface DiscussionCardProps {
  discussion: Discussion;
}

export function DiscussionCard({ discussion }: DiscussionCardProps): JSX.Element {
  const addReply = useHubStore((s) => s.addReply);
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  function handleReply(): void {
    if (!replyText.trim()) return;
    addReply(discussion.id, replyText.trim());
    setReplyText('');
    setShowReplyForm(false);
  }

  return (
    <Card style={{ marginBottom: '1rem' }}>
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            {discussion.title}
          </Text>
        }
        description={
          <Text size={200} style={{ color: '#666' }}>
            {discussion.author.name} · {new Date(discussion.createdAt).toLocaleDateString()} ·{' '}
            {discussion.replies.length}{' '}
            {discussion.replies.length === 1 ? 'reply' : 'replies'}
          </Text>
        }
        action={<Badge appearance="tint">{discussion.category}</Badge>}
      />
      <Text size={300} style={{ padding: '0 1rem' }}>
        {discussion.body}
      </Text>
      <div style={{ padding: '0.5rem 1rem 0' }}>
        <Button
          appearance="subtle"
          size="small"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Hide replies' : `View ${discussion.replies.length} replies`}
        </Button>
        <Button
          appearance="subtle"
          size="small"
          onClick={() => setShowReplyForm((s) => !s)}
        >
          Reply
        </Button>
      </div>
      {expanded && discussion.replies.length > 0 && (
        <div
          style={{
            margin: '0.5rem 1rem 0',
            borderLeft: '3px solid #e0e0e0',
            paddingLeft: '1rem',
          }}
        >
          {discussion.replies.map((reply) => (
            <div key={reply.id} style={{ marginBottom: '0.75rem' }}>
              <Text weight="semibold" size={200}>
                {reply.author.name}
              </Text>{' '}
              <Text size={200} style={{ color: '#666' }}>
                {new Date(reply.createdAt).toLocaleDateString()}
              </Text>
              <Text as="p" size={300} style={{ margin: '0.25rem 0 0' }}>
                {reply.body}
              </Text>
            </div>
          ))}
        </div>
      )}
      {showReplyForm && (
        <div style={{ padding: '0.5rem 1rem 1rem' }}>
          <Field label="Your reply">
            <Textarea
              value={replyText}
              onChange={(_, d) => setReplyText(d.value)}
              rows={3}
              placeholder="Write a reply…"
            />
          </Field>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Button
              appearance="primary"
              size="small"
              onClick={handleReply}
              disabled={!replyText.trim()}
            >
              Submit
            </Button>
            <Button
              appearance="secondary"
              size="small"
              onClick={() => setShowReplyForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
