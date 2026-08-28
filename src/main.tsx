import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { RatesProvider } from './context/RatesContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RatesProvider>
      <App />
    </RatesProvider>
  </StrictMode>,
);
