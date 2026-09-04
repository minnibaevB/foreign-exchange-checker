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

export const formatAmount = (
  num: number | null,
  fractionDigits: number = 2,
): string => {
  if (num === 0 || num === null) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
};

export const parseAmount = (val: string): number => {
  const clean = val.replace(/,/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

const formatViewRtf = (rtf: string) => {
  console.log(rtf);
  const splitRtf = rtf.split(' ');
  const numberRtf = splitRtf[0];
  const firstLetterRtf = splitRtf[1][0];
  return `${numberRtf}${firstLetterRtf.toUpperCase()}`;
};

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const date = new Date(now);
  const diffInSeconds = Math.floor((timestamp - now) / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  if (absSeconds < 45) {
    return 'just now';
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (absSeconds < 3600) {
    return formatViewRtf(rtf.format(Math.round(diffInSeconds / 60), 'minute'));
  }

  if (absSeconds < 86400) {
    return formatViewRtf(rtf.format(Math.round(diffInSeconds / 3600), 'hour'));
  }

  if (absSeconds < 2592000) {
    return formatViewRtf(rtf.format(Math.round(diffInSeconds / 86400), 'day'));
  }

  if (absSeconds < 31536000) {
    return date.toLocaleDateString('en', { day: 'numeric', month: 'short' });
  }

  return date.toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
