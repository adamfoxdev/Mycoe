import { Configuration, LogLevel } from '@azure/msal-browser';

/**
 * Validates that a required environment variable is present.
 * Throws at startup rather than producing a confusing runtime auth failure.
 */
function requireEnv(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        'Create a .env.local file — see the README for the required variables.',
    );
  }
  return value;
}

/**
 * MSAL configuration.
 * Values are read from environment variables — see README for required .env.local variables.
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: requireEnv('VITE_AAD_CLIENT_ID'),
    authority: `https://login.microsoftonline.com/${requireEnv('VITE_AAD_TENANT_ID')}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            break;
        }
      },
    },
  },
};

/** Scopes for the Tasks API. */
export const apiScopes = {
  tasks: [requireEnv('VITE_AAD_API_SCOPE')],
};

/** Microsoft Graph scopes (add only what is needed). */
export const graphScopes = {
  profile: ['User.Read'],
};
