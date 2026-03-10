import { useMsal } from '@azure/msal-react';
import { Text, Button } from '@fluentui/react-components';

export function HomePage(): JSX.Element {
  const { accounts, instance } = useMsal();
  const user = accounts[0];

  function handleSignOut(): void {
    instance.logoutRedirect();
  }

  return (
    <main style={{ padding: '2rem' }}>
      <Text as="h1" size={800}>
        Welcome, {user?.name ?? 'User'}
      </Text>
      <Text as="p" size={400} block>
        You are signed in as {user?.username}.
      </Text>
      <Button appearance="secondary" onClick={handleSignOut}>
        Sign out
      </Button>
    </main>
  );
}
