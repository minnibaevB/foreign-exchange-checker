import { useState, useEffect } from 'react';
import { getRates, type GetRatesParams, type RatesResponse } from '../requests';

type UseRatesProps = Partial<GetRatesParams>;

const cache = new Map<string, RatesResponse[]>();
const pending = new Map<string, Promise<RatesResponse[]>>();

function useRequestRates({ from, to, base, quotes }: UseRatesProps) {
  const [data, setData] = useState<RatesResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const key = JSON.stringify({ from, to, base, quotes });
  const requestRates = async () => {
    const cached = cache.get(key);

    if (cached) {
      setData(cached);
      return;
    }

    const existingRequest = pending.get(key);

    if (existingRequest) {
      try {
        setIsLoading(true);
        const response = await existingRequest;
        setData(response);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }

      return;
    }

    const request = getRates({ from, to, base, quotes });

    pending.set(key, request);

    try {
      setIsLoading(true);
      const response = await request;

      cache.set(key, response);
      setData(response);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
      pending.delete(key);
    }
  };

  useEffect(() => {
    requestRates();
  }, [from, to, base, quotes]);

  return { data, error, isLoading };
}

export default useRequestRates;
