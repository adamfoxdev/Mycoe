import { Tab, TabList } from '@fluentui/react-components';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { value: '/', label: 'Home' },
  { value: '/articles', label: 'Articles' },
  { value: '/discussions', label: 'Discussions' },
  { value: '/voting', label: 'Voting' },
  { value: '/wins', label: 'Wins & Issues' },
];

export function NavBar(): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        background: '#0f6cbd',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <span
        style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginRight: '1rem' }}
      >
        Mycoe Hub
      </span>
      <TabList
        selectedValue={pathname}
        onTabSelect={(_, data) => navigate(data.value as string)}
        appearance="subtle"
        style={{ color: '#fff' }}
      >
        {NAV_ITEMS.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            style={{ color: pathname === item.value ? '#fff' : 'rgba(255,255,255,0.8)' }}
          >
            {item.label}
          </Tab>
        ))}
      </TabList>
    </nav>
  );
}
