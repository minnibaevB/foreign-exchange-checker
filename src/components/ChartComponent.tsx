import { useState } from 'react';
import Chart from './Chart';
import useRequestRates from '../hooks/useRequestRates';
import { formatAmount, getPeriodDates } from '../helpers';
import { useCurrency } from '../context/RatesContext';

export const TIMEFRAMES = {
  day: '1D',
  week: '1W',
  mounth: '1M',
  year: '1Y',
  years: '5Y',
} as const;

export type timeFrameType = (typeof TIMEFRAMES)[keyof typeof TIMEFRAMES];

export default function ChartComponent() {
  const [activeTimeframe, setActiveTimeframe] = useState<timeFrameType>(
    TIMEFRAMES.mounth,
  );

  const { currency } = useCurrency();
  const { data, isLoading, error } = useRequestRates({
    ...getPeriodDates(activeTimeframe),
    ...currency,
  });

  const lastRate = data && data.length > 0 ? data[data.length - 1].rate : null;
  const openRate = data && data.length > 0 ? data[0].rate : null;
  const change =
    lastRate !== null && openRate !== null ? lastRate - openRate : null;
  const percentChange =
    change !== null && openRate !== null ? (change / openRate) * 100 : null;
  const now = new Date();

  const result = now.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <>
      {/* Stats and timeframes card below tabs */}
      <div className="stats-and-timeframe-row" data-node-id="75:483">
        <div className="stats-grid" data-node-id="75:484">
          <div className="stat-card" data-node-id="75:485">
            <p className="stat-label">OPEN</p>
            <p className="stat-value">
              {openRate !== null ? String(openRate) : 'N/A'}
            </p>
          </div>
          <div className="stat-card" data-node-id="75:488">
            <p className="stat-label">LAST</p>
            <p className="stat-value">
              {lastRate !== null ? String(lastRate) : 'N/A'}
            </p>
          </div>
          <div className="stat-card" data-node-id="75:491">
            <p className="stat-label">CHANGE</p>
            <p className={`stat-value ${change && change > 0 ? 'up' : 'down'}`}>
              {change !== null
                ? `${change > 0 ? '▲ +' : '▼ '}${formatAmount(change, 2)}`
                : 'N/A'}
            </p>
          </div>
          <div className="stat-card" data-node-id="75:494">
            <p className="stat-label">% CHANGE</p>
            <p
              className={`stat-value ${percentChange && percentChange > 0 ? 'up' : 'down'}`}
            >
              {percentChange !== null
                ? ` ${percentChange > 0 ? '▲ +' : '▼ '}${String(percentChange.toFixed(2))}%`
                : 'N/A'}
            </p>
          </div>
        </div>

        <div className="timeframe-bar" data-node-id="75:497">
          {Object.values(TIMEFRAMES).map((tf) => (
            <button
              key={tf}
              className={`timeframe-button ${activeTimeframe === tf ? 'active' : ''}`}
              onClick={() => {
                setActiveTimeframe(tf);
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Rate graph Card */}
      <div className="chart-card" data-node-id="75:510">
        <div className="chart-header">
          <h2 className="chart-title">
            {currency.base}/{currency.quotes}
          </h2>
          <p className="chart-meta">
            <span>{lastRate !== null ? String(lastRate) : 'N/A'}</span> ·{' '}
            {result}
          </p>
        </div>

        <div className="chart-body" data-node-id="94:1737">
          <>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!isLoading && !error && (
              <Chart data={data} activeTimeframe={activeTimeframe} />
            )}
          </>
        </div>
      </div>
    </>
  );
}
