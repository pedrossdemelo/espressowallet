import { currencies } from "constants";
import { ExchangeRates } from "types";

const rawRatesCache = localStorage.getItem("rates");
const ratesCache: Record<string, ExchangeRates> = rawRatesCache
  ? JSON.parse(rawRatesCache)
  : {};

export default async function getRates(date: Date): Promise<ExchangeRates> {
  const dateFormatted = date.toISOString().slice(0, 10);
  ratesCache[dateFormatted] =
    ratesCache[dateFormatted] ?? (await dataFromOpenExchangeRates(date));
  localStorage.setItem("rates", JSON.stringify(ratesCache));
  return ratesCache[dateFormatted];
}

async function dataFromOpenExchangeRates(date: Date): Promise<ExchangeRates> {
  const request = `https://openexchangerates.org/api/historical/${date
    .toISOString()
    .slice(0, 10)}.json?app_id=${"c57af901ca824ab9bd1c49bfccc11fa5"}`;

  const res = await fetch(request);
  const data = await res.json();

  if (!data.rates) throw new Error("Couldn't fetch rates");

  const rates: Partial<ExchangeRates> = {};
  currencies.forEach(curr => (rates[curr] = data.rates[curr]));

  // Built up one currency at a time above; by convention every entry in
  // `currencies` gets filled in, matching the original untyped behavior.
  return rates as ExchangeRates;
}
