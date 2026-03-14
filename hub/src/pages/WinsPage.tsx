import { Text, TabList, Tab } from '@fluentui/react-components';
import { useState } from 'react';
import { useHubStore } from '../store/hubStore';
import { WinCard } from '../components/Wins/WinCard';
import { WinForm } from '../components/Wins/WinForm';
import type { WinType } from '../types';

export function WinsPage(): JSX.Element {
  const wins = useHubStore((s) => s.wins);
  const [filter, setFilter] = useState<WinType | 'all'>('all');

  const filtered = wins.filter((w) => filter === 'all' || w.type === filter);

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
        <div>
          <Text as="h1" size={700} weight="bold" block>
            Wins & Issues
          </Text>
          <Text size={300} style={{ color: '#555' }}>
            Celebrate wins and track issues across the engineering community.
          </Text>
        </div>
        <WinForm />
      </div>

      <TabList
        selectedValue={filter}
        onTabSelect={(_, d) => setFilter(d.value as WinType | 'all')}
        style={{ marginBottom: '1.5rem' }}
      >
        <Tab value="all">All</Tab>
        <Tab value="win">🎉 Wins</Tab>
        <Tab value="issue">⚠️ Issues</Tab>
      </TabList>

      {filtered.length === 0 ? (
        <Text size={400} style={{ color: '#666' }}>
          Nothing here yet.
        </Text>
      ) : (
        filtered.map((w) => <WinCard key={w.id} entry={w} />)
      )}
    </div>
  );
}
