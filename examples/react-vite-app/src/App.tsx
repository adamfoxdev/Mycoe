import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { graphScopes } from '@/services/authConfig';
import { TasksPage } from '@/pages/TasksPage';

export default function App(): JSX.Element {
  return (
    <FluentProvider theme={webLightTheme}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={{ scopes: graphScopes.profile }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TasksPage />} />
          </Routes>
        </BrowserRouter>
      </MsalAuthenticationTemplate>
    </FluentProvider>
  );
}
