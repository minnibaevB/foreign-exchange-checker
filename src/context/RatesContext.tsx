import { createContext, useContext, useState } from 'react';
import useRequestRates from '../hooks/useRequestRates';
import type { RatesResponse } from '../requests';
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

const RatesContext = createContext<{
  data: RatesResponse[] | null;
  error: Error | null;
} | null>(null);
const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState({
    base: BASE_CURRENCY,
    quotes: QUOTES_CURRENCY,
  });
  const { data, error } = useRequestRates({
    ...getPeriodDates(TIMEFRAMES.mounth),
    base: currency.base,
    quotes: currency.quotes,
  });

  return (
    <RatesContext value={{ data, error }}>
      <CurrencyContext value={{ currency, setCurrency }}>
        {children}
      </CurrencyContext>
    </RatesContext>
  );
}

export function useRates() {
  const context = useContext(RatesContext);

  if (!context) {
    throw new Error('useRates must be used within RatesProvider');
  }

  return context;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency must be used within RatesProvider');
  }

  return context;
}
