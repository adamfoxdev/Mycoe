import { AccountInfo, InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, apiScopes } from './authConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Acquires an access token silently for the current user.
 * Falls back to an interactive redirect if silent acquisition fails.
 */
export async function acquireApiToken(account: AccountInfo): Promise<string> {
  try {
    const response = await msalInstance.acquireTokenSilent({
      scopes: apiScopes.default,
      account,
    });
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({
        scopes: apiScopes.default,
      });
    }
    throw error;
  }
}
