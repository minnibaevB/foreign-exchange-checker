import { useState, useEffect, useRef } from 'react';
import { getRates, type GetRatesParams, type RatesResponse } from '../requests';

type UseRatesProps = Partial<GetRatesParams>;

function useRequestRates({ from, to, base, quotes }: UseRatesProps) {
  //нужно сделать очередь, так как вызов в коде может быть несколько

  const [data, setData] = useState<RatesResponse[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const memoRef = useRef(new Map());
  const stringParam = JSON.stringify({ from, to, base, quotes });

  useEffect(() => {
    if (memoRef.current.has(stringParam)) {
      const data = memoRef.current.get(stringParam);
      setData(data);
    } else {
      async function load() {
        try {
          const data = await getRates({ from, to, base, quotes });
          setData(data);
          memoRef.current.set(stringParam, data);
        } catch (error) {
          setError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }

      load();
    }
  }, [from, to, base, quotes]);

  return { data, error };
}

export default useRequestRates;
