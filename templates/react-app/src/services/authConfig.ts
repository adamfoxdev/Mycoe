import { Configuration, LogLevel } from '@azure/msal-browser';

/**
 * MSAL configuration.
 * Replace the clientId and tenantId values with your application's values.
 * These should be read from environment variables in production.
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

/**
 * Scopes for the application's own API.
 * Replace with your API's scope URI.
 */
export const apiScopes = {
  default: [`api://${import.meta.env.VITE_AAD_CLIENT_ID as string}/access_as_user`],
};

/**
 * Microsoft Graph scopes (add only what is needed).
 */
export const graphScopes = {
  profile: ['User.Read'],
};
