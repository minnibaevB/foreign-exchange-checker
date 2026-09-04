import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';

export interface CurrencyPair {
  base: string;
  quote: string;
}

type Action =
  | { type: 'ADD_FAVORITE'; payload: CurrencyPair }
  | { type: 'REMOVE_FAVORITE'; payload: CurrencyPair }
  | { type: 'TOGGLE_FAVORITE'; payload: CurrencyPair };

const STORAGE_KEY = 'favorites';

const getInitialState = (): CurrencyPair[] => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

const isSamePair = (p1: CurrencyPair, p2: CurrencyPair) =>
  p1.base.toUpperCase() === p2.base.toUpperCase() &&
  p1.quote.toUpperCase() === p2.quote.toUpperCase();

const favoritesReducer = (
  state: CurrencyPair[],
  action: Action,
): CurrencyPair[] => {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      if (state.some((p) => isSamePair(p, action.payload))) return state;
      return [
        ...state,
        {
          base: action.payload.base.toUpperCase(),
          quote: action.payload.quote.toUpperCase(),
        },
      ];
    }
    case 'REMOVE_FAVORITE': {
      return state.filter((p) => !isSamePair(p, action.payload));
    }
    case 'TOGGLE_FAVORITE': {
      const exists = state.some((p) => isSamePair(p, action.payload));
      return exists
        ? state.filter((p) => !isSamePair(p, action.payload))
        : [
            ...state,
            {
              base: action.payload.base.toUpperCase(),
              quote: action.payload.quote.toUpperCase(),
            },
          ];
    }
    default:
      return state;
  }
};

interface FavoritesContextType {
  favorites: CurrencyPair[];
  isFavorite: (pair: CurrencyPair) => boolean;
  toggleFavorite: (pair: CurrencyPair) => void;
  addFavorite: (pair: CurrencyPair) => void;
  removeFavorite: (pair: CurrencyPair) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    [],
    getInitialState,
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (pair: CurrencyPair) =>
    favorites.some((p) => isSamePair(p, pair));

  const toggleFavorite = (pair: CurrencyPair) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: pair });
  };

  const addFavorite = (pair: CurrencyPair) => {
    dispatch({ type: 'ADD_FAVORITE', payload: pair });
  };

  const removeFavorite = (pair: CurrencyPair) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: pair });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
