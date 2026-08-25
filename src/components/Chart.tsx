import {
  AreaSeries,
  createChart,
  ColorType,
  type CandlestickData,
} from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

let chart: any = null;
const initialData = [
  { time: '2018-12-22', value: 32.51 },
  { time: '2018-12-23', value: 31.11 },
  { time: '2018-12-24', value: 27.02 },
  { time: '2018-12-25', value: 27.32 },
  { time: '2018-12-26', value: 25.17 },
  { time: '2018-12-27', value: 28.89 },
  { time: '2018-12-28', value: 25.46 },
  { time: '2018-12-29', value: 23.92 },
  { time: '2018-12-30', value: 22.68 },
  { time: '2018-12-31', value: 22.67 },
];

const colors = {
  backgroundColor: '#0a0a0a',
  lineColor: '#cef739',
  textColor: 'white',
  areaTopColor: '#cef739',
  areaBottomColor: 'rgba(7, 15, 36, 0.28)',
};

const { backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor } =
  colors;

export default function Chart() {
  const chartContainerRef = useRef({} as HTMLDivElement);
  const [tooltip, setTooltip] = useState<any | null>(null);

  useEffect(() => {
    if (chart === null) {
      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor,
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
        handleScale: {
          mouseWheel: false,
          pinch: false,
        },
        handleScroll: {
          mouseWheel: false,
          pressedMouseMove: false,
          horzTouchDrag: false,
          vertTouchDrag: false,
        },
      });
      chart.timeScale().fitContent();
      chart.applyOptions({
        crosshair: {
          // hide the horizontal crosshair line
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          // hide the vertical crosshair label
          vertLine: {
            labelVisible: false,
          },
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
      });

      const newSeries = chart.addSeries(AreaSeries, {
        lineColor,
        topColor: areaTopColor,
        bottomColor: areaBottomColor,
      });
      newSeries.setData(initialData);

      chart.subscribeCrosshairMove((param: any) => {
        if (!param.time || !param.point) {
          setTooltip(null);
          return;
        }

        const candle = param.seriesData.get(newSeries) as
          | CandlestickData
          | undefined;

        if (!candle) {
          setTooltip(null);
          return;
        }

        console.log(candle);

        setTooltip({
          x: param.point.x,
          y: param.point.y,
          time: String(param.time),
          value: candle.value,
        });
      });
    }

    // window.addEventListener('resize', handleResize);

    // return () => {
    //   window.removeEventListener('resize', handleResize);

    //   chart.remove();
    // };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 500,
      }}
      ref={chartContainerRef}
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
