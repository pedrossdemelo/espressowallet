import { currencies } from "constants";
import { ExchangeRates } from "types";

const RATES_CACHE_KEY = "rates";
// One entry per date ever looked up would grow this forever; keep a rolling
// window instead. Keys are "YYYY-MM-DD", so lexicographic sort is chronological.
const MAX_CACHED_DATES = 90;

const rawRatesCache = localStorage.getItem(RATES_CACHE_KEY);
const ratesCache: Record<string, ExchangeRates> = rawRatesCache
  ? JSON.parse(rawRatesCache)
  : {};

function pruneCache() {
  const dates = Object.keys(ratesCache).sort();
  const excess = dates.length - MAX_CACHED_DATES;
  if (excess > 0) dates.slice(0, excess).forEach(date => delete ratesCache[date]);
}

export default async function getRates(date: Date): Promise<ExchangeRates> {
  const dateFormatted = date.toISOString().slice(0, 10);
  ratesCache[dateFormatted] =
    ratesCache[dateFormatted] ?? (await dataFromFrankfurter(date));
  pruneCache();
  localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(ratesCache));
  return ratesCache[dateFormatted];
}

// https://frankfurter.dev — ECB reference rates, no API key required.
async function dataFromFrankfurter(date: Date): Promise<ExchangeRates> {
  const dateFormatted = date.toISOString().slice(0, 10);
  const request = `https://api.frankfurter.dev/v1/${dateFormatted}?base=USD`;

  const res = await fetch(request);
  const data = await res.json();

  if (!data.rates) throw new Error("Couldn't fetch rates");

  // Frankfurter omits the base currency from `rates` (unlike the previous
  // provider, which included it), so USD has to be filled in explicitly.
  const rates: Partial<ExchangeRates> = { USD: 1 };
  currencies.forEach(curr => {
    if (curr === "USD") return;
    rates[curr] = data.rates[curr];
  });

  const missing = currencies.filter(curr => rates[curr] === undefined);
  if (missing.length > 0) {
    throw new Error(`Rates response is missing: ${missing.join(", ")}`);
  }

  return rates as ExchangeRates;
}
