import { Card, CardHeader, Text, Badge } from '@fluentui/react-components';
import type { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps): JSX.Element {
  return (
    <Card style={{ marginBottom: '1rem' }}>
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            {article.title}
          </Text>
        }
        description={
          <Text size={200} style={{ color: '#666' }}>
            {article.author.name} · {new Date(article.createdAt).toLocaleDateString()}
          </Text>
        }
        action={
          <Badge appearance="tint" color="brand">
            {article.category}
          </Badge>
        }
      />
      <Text size={300} style={{ padding: '0 1rem 1rem' }}>
        {article.body.length > 200 ? `${article.body.slice(0, 200)}…` : article.body}
      </Text>
      {article.tags.length > 0 && (
        <div style={{ padding: '0 1rem 1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {article.tags.map((tag) => (
            <Badge key={tag} appearance="outline" size="small">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
