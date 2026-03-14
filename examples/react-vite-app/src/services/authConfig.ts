import { Configuration, LogLevel } from '@azure/msal-browser';

/**
 * MSAL configuration.
 * Values are read from environment variables — see README for required .env.local variables.
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AAD_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AAD_TENANT_ID as string}`,
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
  tasks: [import.meta.env.VITE_AAD_API_SCOPE as string],
};

/** Microsoft Graph scopes (add only what is needed). */
export const graphScopes = {
  profile: ['User.Read'],
};
