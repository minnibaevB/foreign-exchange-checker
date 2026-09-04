import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';

import { type CurrencyPair } from './FavoriteContext';

interface Amount {
  sendAmount: string;
  reciveAmount: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  pair: CurrencyPair;
  amount: Amount;
}

type LogAction =
  | {
      type: 'ADD_LOG';
      payload: { pair: CurrencyPair; amount: Amount };
    }
  | { type: 'REMOVE_LOG'; payload: { id: string } }
  | { type: 'ClEAR_LOGS' };

const STORAGE_KEY = 'app_logs';

// Чтение из localStorage при старте
const getInitialState = (): LogEntry[] => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Ошибка чтения логов из localStorage:', error);
    return [];
  }
};

const logReducer = (state: LogEntry[], action: LogAction): LogEntry[] => {
  switch (action.type) {
    case 'ADD_LOG': {
      const newEntry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        pair: action.payload.pair,
        amount: action.payload.amount,
      };
      return [newEntry, ...state];
    }
    case 'REMOVE_LOG': {
      return state.filter((log) => log.id !== action.payload.id);
    }
    case 'ClEAR_LOGS': {
      return [];
    }
    default:
      return state;
  }
};

interface LogContextType {
  logs: LogEntry[];
  addLog: (pair: CurrencyPair, amount: Amount) => void;
  removeLog: (id: string) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, dispatch] = useReducer(logReducer, [], getInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Ошибка сохранения логов в localStorage:', error);
    }
  }, [logs]);

  const addLog = (pair: CurrencyPair, amount: Amount) => {
    dispatch({ type: 'ADD_LOG', payload: { pair, amount } });
  };

  const removeLog = (id: string) => {
    dispatch({ type: 'REMOVE_LOG', payload: { id } });
  };

  const clearLogs = () => {
    dispatch({ type: 'ClEAR_LOGS' });
  };

  return (
    <LogContext.Provider value={{ logs, addLog, removeLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within LogProvider');
  }
  return context;
};
