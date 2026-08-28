import {
  AreaSeries,
  ColorType,
  createChart,
  type Time,
} from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { type RatesResponse } from '../requests';
import { transformRatesData } from '../helpers';
import { type timeFrameType, TIMEFRAMES } from './ChartComponent';

interface ChartProps {
  data: RatesResponse[] | null;
  activeTimeframe: timeFrameType;
}

export interface TransformedData {
  time: string;
  value: number;
}
interface TooltipData {
  x: number;
  y: number;
  time: string;
  value: number;
}

const colors = {
  backgroundColor: '#171719',
  lineColor: '#cef739',
  textColor: 'rgba(255, 255, 255, 0.5)',
  areaTopColor: '#cef739',
  areaBottomColor: 'rgba(7, 15, 36, 0.28)',
};

const { backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor } =
  colors;

export default function Chart({ data, activeTimeframe }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const lastMonthRef = useRef<string | null>(null);

  useEffect(() => {
    const continaer = chartContainerRef.current;

    if (!continaer) {
      return;
    }

    const handleResize = () => {
      chart.applyOptions({
        width: continaer.clientWidth,
      });
    };

    const chart = createChart(continaer, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: backgroundColor,
        },
        textColor,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },

      width: continaer.clientWidth,
      height: 400,

      handleScale: {
        mouseWheel: false,
        pinch: false,
        axisPressedMouseMove: false,
      },
      leftPriceScale: {
        visible: true,
        borderVisible: false,
      },

      rightPriceScale: {
        visible: false,
      },

      localization: {
        priceFormatter: (price: number) => price.toFixed(4),
      },

      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          labelVisible: false,
        },
      },

      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: true,
          style: 4,
        },
      },

      timeScale: {
        tickMarkFormatter: (time: Time) => {
          if (typeof time !== 'string') {
            return '';
          }

          const date = new Date(`${time}T00:00:00`);

          if (
            activeTimeframe === TIMEFRAMES.mounth ||
            activeTimeframe === TIMEFRAMES.week ||
            activeTimeframe === TIMEFRAMES.day
          ) {
            return date.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            });
          } else {
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

            if (monthKey === lastMonthRef.current) {
              return '';
            }

            lastMonthRef.current = monthKey;

            if (activeTimeframe === TIMEFRAMES.years) {
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              });
            } else {
              return date.toLocaleDateString('en-US', {
                month: 'short',
              });
            }
          }
        },

        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        rightOffset: 0,
        minBarSpacing: 0,
      },
    });

    const newSeries = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    const chartData = transformRatesData(data ?? []);

    newSeries.setData(chartData);

    if (
      activeTimeframe === TIMEFRAMES.day ||
      activeTimeframe === TIMEFRAMES.mounth ||
      activeTimeframe === TIMEFRAMES.week
    ) {
      chart
        .timeScale()
        .setVisibleLogicalRange({ from: -1, to: chartData.length - 1 });
    }

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setTooltip(null);
        return;
      }

      const point = param.seriesData.get(newSeries) as
        | TransformedData
        | undefined;

      if (!point) {
        setTooltip(null);
        return;
      }

      setTooltip({
        x: param.point.x,
        y: param.point.y,
        time: String(param.time),
        value: point.value,
      });
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [data, activeTimeframe]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 400,
      }}
    >
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 15,
            top: tooltip.y + 15,
            padding: '10px 12px',
            background: '#1e1e1e',
            color: '#fff',
            borderRadius: 6,
            pointerEvents: 'none',
            zIndex: 10,
            fontSize: 13,
          }}
        >
          <div>{tooltip.time}</div>
          <div>{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}
