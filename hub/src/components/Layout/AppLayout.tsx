import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';

export function AppLayout(): JSX.Element {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <main
        style={{
          flex: 1,
          padding: '1.5rem',
          maxWidth: '960px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
