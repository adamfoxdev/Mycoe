import React from 'react';
import ReactDOM from 'react-dom/client';
import { MsalProvider, MsalProviderProps } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { msalConfig } from '@/services/authConfig';
import App from './App';
import './index.css';

export const msalInstance = new PublicClientApplication(msalConfig);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Satisfy TypeScript: MsalProvider expects instance to be initialised before render.
// The initialisation happens synchronously via the PublicClientApplication constructor.
const MsalWrapper = MsalProvider as React.ComponentType<MsalProviderProps>;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalWrapper instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </MsalWrapper>
  </React.StrictMode>,
);
