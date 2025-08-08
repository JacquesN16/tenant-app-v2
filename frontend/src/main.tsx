import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n';
import App from './App.tsx'
import './global.css';
import 'react-day-picker/dist/style.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)