import { useFavorites } from '../context/FavoriteContext';

const MOCK_RATES: Record<string, number> = {
  'USD/EUR': 0.853,
  'GBP/USD': 1.3575,
  'USD/JPY': 157.91,
  'USD/BDT': 122.92,
  'EUR/GBP': 0.8633,
  'AUD/NZD': 1.2217,
  'USD/INR': 94.91,
  'EUR/CHF': 1.0668,
  'GBP/JPY': 213.21,
  'USD/TRY': 38.642,
};

const MOCK_CHANGES: Record<string, number> = {
  'USD/EUR': 0.16,
  'GBP/USD': -0.22,
  'USD/JPY': 0.04,
  'USD/BDT': -0.18,
  'EUR/GBP': 0.11,
  'AUD/NZD': 0.23,
  'USD/INR': 0.05,
  'EUR/CHF': -0.15,
  'GBP/JPY': 0.13,
  'USD/TRY': 0.54,
};

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">NO PINNED PAIRS YET</p>

        <p className="empty-state-description">
          Pin a pair to track its rate here. Tap the star icon on any conversion
          or comparison row.
        </p>
      </div>
    );
  }

  return (
    <div className="favorites-panel">
      <div className="panel-header">
        <h2 className="panel-title">PINNED PAIRS</h2>

        <span className="panel-count">{favorites.length} FAVORITES</span>
      </div>

      <div className="favorites-list">
        {favorites.map((favorite) => {
          const pair = `${favorite.base}/${favorite.quote}`;
          const rate = MOCK_RATES[pair] ?? 1;
          const change = MOCK_CHANGES[pair] ?? 0;

          return (
            <div
              key={`${favorite.base}-${favorite.quote}`}
              className="favorite-row"
            >
              <span className="favorite-pair">
                {favorite.base}
                <span>→</span>
                {favorite.quote}
              </span>

              <div className="favorite-rate">
                <span className="favorite-rate-value">{rate.toFixed(4)}</span>

                <span
                  className={`favorite-change ${
                    change >= 0 ? 'is-up' : 'is-down'
                  }`}
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
        })}
      </div>
    </div>
  );
}
