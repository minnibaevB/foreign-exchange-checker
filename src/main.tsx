import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { FavoritesProvider } from './context/FavoriteContext.tsx';
import { LogProvider } from './context/LogContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritesProvider>
      <LogProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </LogProvider>
    </FavoritesProvider>
  </StrictMode>,
);
