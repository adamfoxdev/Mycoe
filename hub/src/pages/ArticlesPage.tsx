import { Text, Input, Select, Field } from '@fluentui/react-components';
import { useState } from 'react';
import { useHubStore } from '../store/hubStore';
import { ArticleCard } from '../components/Articles/ArticleCard';
import { ArticleForm } from '../components/Articles/ArticleForm';
import type { Category } from '../types';

export function ArticlesPage(): JSX.Element {
  const articles = useHubStore((s) => s.articles);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || a.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <Text as="h1" size={700} weight="bold">
          Articles
        </Text>
        <ArticleForm />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Field label="Search" style={{ flex: 1 }}>
          <Input
            value={search}
            onChange={(_, d) => setSearch(d.value)}
            placeholder="Search articles…"
          />
        </Field>
        <Field label="Category">
          <Select
            value={filterCategory}
            onChange={(_, d) => setFilterCategory(d.value as Category | 'all')}
          >
            <option value="all">All categories</option>
            <option value="general">General</option>
            <option value="process">Process</option>
            <option value="design-pattern">Design Pattern</option>
            <option value="tooling">Tooling</option>
          </Select>
        </Field>
      </div>

      {filtered.length === 0 ? (
        <Text size={400} style={{ color: '#666' }}>
          No articles found.
        </Text>
      ) : (
        filtered.map((a) => <ArticleCard key={a.id} article={a} />)
      )}
    </div>
  );
}
