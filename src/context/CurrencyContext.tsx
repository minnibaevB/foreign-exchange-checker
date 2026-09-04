import { createContext, useContext, useState } from 'react';
import useRequestRates from '../hooks/useRequestRates';
import { getPeriodDates } from '../helpers';
import { TIMEFRAMES } from '../components/ChartComponent';

type Currency = {
  base: string;
  quotes: string;
};

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const BASE_CURRENCY = 'USD';
const QUOTES_CURRENCY = 'EUR';

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState({
    base: BASE_CURRENCY,
    quotes: QUOTES_CURRENCY,
  });

  return (
    <CurrencyContext value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used within RatesProvider');
  }

  return context;
}
