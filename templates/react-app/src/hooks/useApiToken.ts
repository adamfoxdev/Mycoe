import { useMsal } from '@azure/msal-react';
import { acquireApiToken } from '../services/authService';

/**
 * Returns a function that fetches the API token for the current user.
 * Usage:
 *   const getToken = useApiToken();
 *   const token = await getToken();
 */
export function useApiToken(): () => Promise<string> {
  const { accounts } = useMsal();

  return async (): Promise<string> => {
    const account = accounts[0];
    if (!account) throw new Error('No authenticated account found.');
    return acquireApiToken(account);
  };
}
