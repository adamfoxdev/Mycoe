import { Text, Select, Field, TabList, Tab } from '@fluentui/react-components';
import { useState } from 'react';
import { useHubStore } from '../store/hubStore';
import { VoteCard } from '../components/Votes/VoteCard';
import { VoteForm } from '../components/Votes/VoteForm';

export function VotingPage(): JSX.Element {
  const proposals = useHubStore((s) => s.proposals);
  const [filterType, setFilterType] = useState<'all' | 'process' | 'design-pattern'>('all');
  const [filterStatus, setFilterStatus] = useState<'open' | 'closed' | 'all'>('open');

  const filtered = proposals.filter((p) => {
    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesType && matchesStatus;
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
        <div>
          <Text as="h1" size={700} weight="bold" block>
            Voting
          </Text>
          <Text size={300} style={{ color: '#555' }}>
            Vote on proposed processes and design patterns for the CoE.
          </Text>
        </div>
        <VoteForm />
      </div>

      <TabList
        selectedValue={filterStatus}
        onTabSelect={(_, d) => setFilterStatus(d.value as 'open' | 'closed' | 'all')}
        style={{ marginBottom: '1rem' }}
      >
        <Tab value="open">Open</Tab>
        <Tab value="closed">Closed</Tab>
        <Tab value="all">All</Tab>
      </TabList>

      <div style={{ marginBottom: '1.5rem' }}>
        <Field label="Filter by type">
          <Select
            value={filterType}
            onChange={(_, d) =>
              setFilterType(d.value as 'all' | 'process' | 'design-pattern')
            }
          >
            <option value="all">All types</option>
            <option value="process">Process</option>
            <option value="design-pattern">Design Pattern</option>
          </Select>
        </Field>
      </div>

      {filtered.length === 0 ? (
        <Text size={400} style={{ color: '#666' }}>
          No proposals found.
        </Text>
      ) : (
        filtered.map((p) => <VoteCard key={p.id} proposal={p} />)
      )}
    </div>
  );
}
