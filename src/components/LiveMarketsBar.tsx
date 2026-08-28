import { useEffect, useRef } from 'react';
import useRequestRates from '../hooks/useRequestRates';
import { getPeriodDates } from '../helpers';
import { TIMEFRAMES } from './ChartComponent';

type MarketDirection = 'up' | 'down';

interface Market {
  pair: string;
  value: number;
  change: string;
  direction: MarketDirection;
}
interface TickerGroupProps {
  hidden?: boolean;
}

const MAX_DIFF_PAIR_RATES_COUNT = 15;

const TickerGroup = ({ hidden = false }: TickerGroupProps) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const { data } = useRequestRates({
    ...getPeriodDates(TIMEFRAMES.day),
    base: 'USD',
  });
  let countPairsWithDiffRates = 0;
  const pairRates = new Map<string, { rate: number }>();
  let markets: Market[] = [];

  for (const currency of data ?? []) {
    if (countPairsWithDiffRates === MAX_DIFF_PAIR_RATES_COUNT) {
      break;
    }
    const key = `${currency.base}/${currency.quote}`;
    const currentPair = pairRates.get(key);
    if (currentPair && currency.rate !== currentPair.rate) {
      const change =
        ((currency.rate - currentPair.rate) / currentPair.rate) * 100;
      markets.push({
        pair: key,
        value: currency.rate,
        change: `${change >= 0 ? '+' : '-'}${Math.abs(change).toFixed(3)}%`,
        direction: change >= 0 ? 'up' : 'down',
      });
      countPairsWithDiffRates++;
    } else {
      pairRates.set(key, {
        rate: currency.rate,
      });
    }
  }

  useEffect(() => {
    if (!groupRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const speed = 50;

      entry.target.parentElement?.style.setProperty(
        '--ticker-duration',
        `${width / speed}s`,
      );
    });

    observer.observe(groupRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="ticker-group" aria-hidden={hidden} ref={groupRef}>
      {markets.map((market) => (
        <div className="ticker-item" key={market.pair}>
          <span className="ticker-pair">{market.pair}</span>

          <span className="ticker-value">{market.value}</span>

          <span className={`ticker-change ${market.direction}`}>
            {market.direction === 'up' ? '▲' : '▼'} {market.change}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function LiveMarketsBar() {
  return (
    <section className="live-markets-bar">
      <div className="live-badge">
        <div className="live-badge-dot" />
        <span className="live-badge-text">LIVE MARKETS</span>
      </div>

      <div className="ticker-wrapper">
        <div className="ticker-track">
          <TickerGroup />
          <TickerGroup hidden />
        </div>
      </div>
    </section>
  );
}
