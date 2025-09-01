import './index.css';
import 'react-datepicker/dist/react-datepicker.css';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BoxContextProvider } from './utils/FileContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './utils/AuthContext';
import { FileSearchProvider } from './utils/SearchContext';

const queryClient = new QueryClient();

const rootEl = document.getElementById('root') as HTMLElement | null;
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FileSearchProvider>
            <BoxContextProvider>
              <App />
            </BoxContextProvider>
          </FileSearchProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
}
