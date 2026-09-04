import type { CurrencyPair } from '../context/FavoriteContext';
import { getPeriodDates } from '../helpers';
import useRequestRates from '../hooks/useRequestRates';
import { TIMEFRAMES } from './ChartComponent';

interface FavoriteRowProps {
  favorite: CurrencyPair;
  removeFavorite: (pair: CurrencyPair) => void;
}

export function FavoriteRow({ favorite, removeFavorite }: FavoriteRowProps) {
  const { data, error, isLoading } = useRequestRates({
    ...getPeriodDates(TIMEFRAMES.day),
    base: favorite.base,
    quotes: favorite.quote,
  });

  if (isLoading) {
    return (
      <div className="favorite-row">
        <span className="favorite-pair">
          {favorite.base}
          <span>→</span>
          {favorite.quote}
        </span>

        <span className="favorite-status">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorite-row">
        <span className="favorite-pair">
          {favorite.base}
          <span>→</span>
          {favorite.quote}
        </span>

        <span className="favorite-status favorite-status-error">
          Failed to load
        </span>
      </div>
    );
  }

  const currencies = data ?? [];

  if (currencies.length === 0) {
    return (
      <div className="favorite-row">
        <span className="favorite-pair">
          {favorite.base}
          <span>→</span>
          {favorite.quote}
        </span>

        <span className="favorite-status">No data</span>
      </div>
    );
  }

  const prevCurrency = currencies[0];
  const lastCurrency = currencies[currencies.length - 1];

  const todayRate = lastCurrency.rate;
  const previousRate = prevCurrency.rate;

  const change =
    previousRate !== 0 ? ((todayRate - previousRate) / previousRate) * 100 : 0;

  return (
    <div className="favorite-row">
      <span className="favorite-pair">
        {favorite.base}
        <span>→</span>
        {favorite.quote}
      </span>

      <div className="favorite-rate">
        <span className="favorite-rate-value">{todayRate.toFixed(4)}</span>

        <span
          className={`favorite-change ${change >= 0 ? 'is-up' : 'is-down'}`}
        >
          {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </span>
      </div>

      <button
        className="favorite-remove"
        onClick={() => removeFavorite(favorite)}
        aria-label="Remove favorite"
      >
        ★
      </button>
    </div>
  );
}
