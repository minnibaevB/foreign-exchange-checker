import { useMemo } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import useRequestRates from '../hooks/useRequestRates';
import { currencies, popularCurrencies, flagMap } from '../mock';
import { formatAmount } from '../helpers';
import { useFavorites } from '../context/FavoriteContext';

const MAX_COMPARE_ITEMS = 8;
const AMOUNT = 1000;

export function Compare() {
  const { currency } = useCurrency();
  const { toggleFavorite, isFavorite } = useFavorites();

  const currencyCompare = useMemo(
    () =>
      [...currencies, ...popularCurrencies]
        .filter((c) => c.code !== currency.base && c.code !== currency.quotes)
        .slice(0, MAX_COMPARE_ITEMS),
    [currency.base, currency.quotes],
  );

  const { data, error, isLoading } = useRequestRates({
    base: currency.base,
    quotes: currencyCompare.map((c) => c.code).join(','),
  });

  return (
    <div className="compare-panel">
      {isLoading && (
        <div className="panel-state">
          <span className="panel-state-spinner" />
          Loading rates...
        </div>
      )}

      {error && (
        <div className="panel-state panel-state-error">
          Unable to load comparison rates.
        </div>
      )}

      {data && data.length === 0 && (
        <div className="empty-state">
          <p className="empty-state-title">NO COMPARISON AVAILABLE</p>
          <p className="empty-state-description">
            Enter an amount in SEND above to see what your money is worth in
            other currencies.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="currency-compare">
          <div className="panel-header">
            <h3 className="panel-title">
              <span className="panel-title-muted">MULTI-CURRENCY</span>
              <strong>{AMOUNT.toLocaleString()}</strong>
              <span>FROM {currency.base}</span>
            </h3>

            <span className="panel-count">{data.length} PAIRS</span>
          </div>

          <div className="compare-list">
            {data.map((rate) => {
              const currencyInfo = currencyCompare.find(
                (c) => c.code === rate.quote,
              );

              const favorite = isFavorite({
                base: currency.base,
                quote: rate.quote,
              });

              return (
                <div key={rate.quote} className="compare-row">
                  <div className="compare-currency">
                    <img
                      src={flagMap[rate.quote]}
                      className="compare-flag"
                      alt=""
                    />

                    <div>
                      <div className="compare-code">{rate.quote}</div>

                      <div className="compare-name">{currencyInfo?.name}</div>
                    </div>
                  </div>

                  <div className="compare-value">
                    <div className="compare-amount">
                      {formatAmount(AMOUNT * rate.rate, 2)}
                    </div>

                    <div className="compare-rate">@ {rate.rate.toFixed(4)}</div>
                  </div>

                  <button
                    className={`compare-favorite ${
                      favorite ? 'is-favorite' : ''
                    }`}
                    onClick={() =>
                      toggleFavorite({
                        base: currency.base,
                        quote: rate.quote,
                      })
                    }
                    aria-label={
                      favorite ? 'Remove from favorites' : 'Add to favorites'
                    }
                  >
                    {favorite ? '★' : '☆'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
