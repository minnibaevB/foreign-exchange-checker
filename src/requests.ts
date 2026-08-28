const API_URL = 'https://api.frankfurter.dev/v2';

export type RatesResponse = {
  base: string;
  date: string;
  rate: number;
  quote: string;
};

export type GetRatesParams = {
  from?: string;
  to?: string;
  base?: string;
  quotes?: string;
};

export async function getRates(
  params: GetRatesParams,
): Promise<RatesResponse[]> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, value);
    }
  });

  const response = await fetch(`${API_URL}/rates?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rates: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
