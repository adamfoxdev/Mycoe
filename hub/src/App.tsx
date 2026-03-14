import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AppLayout } from './components/Layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ArticlesPage } from './pages/ArticlesPage';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { VotingPage } from './pages/VotingPage';
import { WinsPage } from './pages/WinsPage';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App(): JSX.Element {
  return (
    <FluentProvider theme={webLightTheme}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/discussions" element={<DiscussionsPage />} />
              <Route path="/voting" element={<VotingPage />} />
              <Route path="/wins" element={<WinsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </FluentProvider>
  );
}
