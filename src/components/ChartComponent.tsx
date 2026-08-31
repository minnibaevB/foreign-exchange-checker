import { useState } from 'react';
import Chart from './Chart';
import useRequestRates from '../hooks/useRequestRates';
import { getPeriodDates } from '../helpers';
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
  const { data } = useRequestRates({
    ...getPeriodDates(activeTimeframe),
    ...currency,
  });

  return (
    <>
      {/* Stats and timeframes card below tabs */}
      <div className="stats-and-timeframe-row" data-node-id="75:483">
        <div className="stats-grid" data-node-id="75:484">
          <div className="stat-card" data-node-id="75:485">
            <p className="stat-label">OPEN</p>
            <p className="stat-value">0.8516</p>
          </div>
          <div className="stat-card" data-node-id="75:488">
            <p className="stat-label">LAST</p>
            <p className="stat-value">0.8530</p>
          </div>
          <div className="stat-card" data-node-id="75:491">
            <p className="stat-label">CHANGE</p>
            <p className="stat-value up">+0.0014</p>
          </div>
          <div className="stat-card" data-node-id="75:494">
            <p className="stat-label">% CHANGE</p>
            <p className="stat-value up">▲ +0.16%</p>
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
            <span>0.8612</span> · MAY 14 16:00 CET
          </p>
        </div>

        <div className="chart-body" data-node-id="94:1737">
          <Chart data={data} activeTimeframe={activeTimeframe} />
        </div>
      </div>
    </>
  );
}
