import { type timeFrameType, TIMEFRAMES } from './components/ChartComponent';
import { type RatesResponse } from './requests';
import { type TransformedData } from './components/Chart';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

export const transformRatesData = (
  data: RatesResponse[],
): TransformedData[] => {
  return data.map((item) => ({
    time: item.date,
    value: item.rate,
  }));
};

export const formatDate = (dateMs: number) => {
  return new Date(dateMs).toISOString().split('T')[0];
};

export function getPeriodDates(tf: timeFrameType) {
  const now = Date.now();
  let from = null;

  switch (tf) {
    case TIMEFRAMES.day:
      from = now - MS_IN_DAY;
      break;
    case TIMEFRAMES.week:
      from = now - MS_IN_DAY * 7;
      break;
    case TIMEFRAMES.mounth: {
      const date = new Date();
      const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
      ).getDate();
      from = now - MS_IN_DAY * daysInMonth;
      break;
    }
    case TIMEFRAMES.year:
      from = now - MS_IN_DAY * 365;
      break;
    case TIMEFRAMES.years:
      from = now - MS_IN_DAY * 365 * 5;
      break;
  }

  return {
    from: formatDate(from),
    to: formatDate(Date.now()),
  };
}

export const formatAmount = (num: number): string => {
  if (num === 0) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const parseAmount = (val: string): number => {
  const clean = val.replace(/,/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};
