import { useFavorites } from '../context/FavoriteContext';
import { FavoriteRow } from './FavoriteRow';

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
          return (
            <FavoriteRow
              key={`${favorite.base}/${favorite.quote}`}
              favorite={favorite}
              removeFavorite={removeFavorite}
            />
          );
        })}
      </div>
    </div>
  );
}
