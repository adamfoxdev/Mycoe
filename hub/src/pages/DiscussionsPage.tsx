import { Text, Input, Select, Field } from '@fluentui/react-components';
import { useState } from 'react';
import { useHubStore } from '../store/hubStore';
import { DiscussionCard } from '../components/Discussions/DiscussionCard';
import { DiscussionForm } from '../components/Discussions/DiscussionForm';
import type { Category } from '../types';

export function DiscussionsPage(): JSX.Element {
  const discussions = useHubStore((s) => s.discussions);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

  const filtered = discussions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.body.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
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
          Discussions
        </Text>
        <DiscussionForm />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Field label="Search" style={{ flex: 1 }}>
          <Input
            value={search}
            onChange={(_, d) => setSearch(d.value)}
            placeholder="Search discussions…"
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
          No discussions found.
        </Text>
      ) : (
        filtered.map((d) => <DiscussionCard key={d.id} discussion={d} />)
      )}
    </div>
  );
}
