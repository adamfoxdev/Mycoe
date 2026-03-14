import { Text, Card, CardHeader } from '@fluentui/react-components';
import { Link } from 'react-router-dom';
import { useHubStore } from '../store/hubStore';

export function HomePage(): JSX.Element {
  const { articles, discussions, proposals, wins } = useHubStore();
  const openIssues = wins.filter((w) => w.type === 'issue' && !w.resolved).length;

  return (
    <div>
      <Text as="h1" size={800} weight="bold" block style={{ marginBottom: '0.5rem' }}>
        Welcome to the Mycoe Hub
      </Text>
      <Text as="p" size={400} block style={{ marginBottom: '2rem', color: '#555' }}>
        The central space for developers to share knowledge, communicate, and shape CoE standards.
      </Text>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { label: 'Articles', count: articles.length, path: '/articles', emoji: '📝' },
          { label: 'Discussions', count: discussions.length, path: '/discussions', emoji: '💬' },
          {
            label: 'Open Proposals',
            count: proposals.filter((p) => p.status === 'open').length,
            path: '/voting',
            emoji: '🗳️',
          },
          { label: 'Open Issues', count: openIssues, path: '/wins', emoji: '⚠️' },
        ].map((stat) => (
          <Link key={stat.path} to={stat.path} style={{ textDecoration: 'none' }}>
            <Card style={{ textAlign: 'center', padding: '1.5rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem' }}>{stat.emoji}</div>
              <Text size={700} weight="bold" block>
                {stat.count}
              </Text>
              <Text size={300} style={{ color: '#555' }}>
                {stat.label}
              </Text>
            </Card>
          </Link>
        ))}
      </div>

      <Text as="h2" size={600} weight="semibold" block style={{ marginBottom: '1rem' }}>
        Recent Activity
      </Text>
      {articles.slice(0, 1).map((a) => (
        <Card key={a.id} style={{ marginBottom: '0.75rem' }}>
          <CardHeader
            header={<Text weight="semibold">📝 {a.title}</Text>}
            description={<Text size={200}>Article by {a.author.name}</Text>}
          />
        </Card>
      ))}
      {discussions.slice(0, 1).map((d) => (
        <Card key={d.id} style={{ marginBottom: '0.75rem' }}>
          <CardHeader
            header={<Text weight="semibold">💬 {d.title}</Text>}
            description={<Text size={200}>Discussion by {d.author.name}</Text>}
          />
        </Card>
      ))}
      {wins.slice(0, 1).map((w) => (
        <Card key={w.id} style={{ marginBottom: '0.75rem' }}>
          <CardHeader
            header={
              <Text weight="semibold">
                {w.type === 'win' ? '🎉' : '⚠️'} {w.title}
              </Text>
            }
            description={
              <Text size={200}>
                {w.type === 'win' ? 'Win' : 'Issue'} by {w.author.name}
              </Text>
            }
          />
        </Card>
      ))}
    </div>
  );
}
