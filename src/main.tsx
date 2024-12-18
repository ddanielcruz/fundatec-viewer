import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import { ThemeProvider } from './components/theme/theme-provider';
import { RecordsProvider } from './contexts/records';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="@fundatec/theme">
      <RecordsProvider>
        <App />
      </RecordsProvider>
    </ThemeProvider>
  </StrictMode>,
);
