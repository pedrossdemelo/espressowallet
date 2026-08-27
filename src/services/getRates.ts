import currencies from "../constants/currencies";
import { ExchangeRates } from "types";

const RATES_CACHE_KEY = "rates";
// One entry per date ever looked up would grow this forever; keep a rolling
// window instead. Keys are "YYYY-MM-DD", so lexicographic sort is chronological.
const MAX_CACHED_DATES = 90;

let ratesCache: Record<string, ExchangeRates> | undefined;

export function formatRateDate(date: Date): string {
  if (Number.isNaN(date.getTime())) throw new Error("Invalid transaction date");

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isExchangeRates(value: unknown): value is ExchangeRates {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  return currencies.every(
    currency =>
      typeof candidate[currency] === "number" &&
      Number.isFinite(candidate[currency]),
  );
}

export function parseRatesCache(
  raw: string | null,
): Record<string, ExchangeRates> {
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([, rates]) => isExchangeRates(rates)),
    );
  } catch {
    return {};
  }
}

function storage(): Storage | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

function getCache(): Record<string, ExchangeRates> {
  if (ratesCache) return ratesCache;

  const localStorage = storage();
  try {
    ratesCache = parseRatesCache(
      localStorage?.getItem(RATES_CACHE_KEY) ?? null,
    );
  } catch {
    ratesCache = {};
  }
  return ratesCache;
}

function pruneCache() {
  const cache = getCache();
  const dates = Object.keys(cache).sort();
  const excess = dates.length - MAX_CACHED_DATES;
  if (excess > 0) dates.slice(0, excess).forEach(date => delete cache[date]);
}

export default async function getRates(date: Date): Promise<ExchangeRates> {
  const dateFormatted = formatRateDate(date);
  const cache = getCache();
  cache[dateFormatted] =
    cache[dateFormatted] ?? (await dataFromFrankfurter(dateFormatted));
  pruneCache();
  try {
    storage()?.setItem(RATES_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage can be disabled or full. Rates are still usable for this session.
  }
  return cache[dateFormatted];
}

// https://frankfurter.dev — ECB reference rates, no API key required.
async function dataFromFrankfurter(
  dateFormatted: string,
): Promise<ExchangeRates> {
  const request = `https://api.frankfurter.dev/v1/${dateFormatted}?base=USD`;

  const res = await fetch(request);
  if (!res.ok) throw new Error(`Couldn't fetch rates (${res.status})`);

  const data: unknown = await res.json();

  if (
    !data ||
    typeof data !== "object" ||
    !("rates" in data) ||
    !data.rates ||
    typeof data.rates !== "object" ||
    Array.isArray(data.rates)
  )
    throw new Error("Couldn't fetch rates");

  const responseRates = data.rates as Record<string, unknown>;

  // Frankfurter omits the base currency from `rates` (unlike the previous
  // provider, which included it), so USD has to be filled in explicitly.
  const rates: Partial<ExchangeRates> = { USD: 1 };
  currencies.forEach(curr => {
    if (curr === "USD") return;
    const rate = responseRates[curr];
    if (typeof rate === "number" && Number.isFinite(rate)) rates[curr] = rate;
  });

  const missing = currencies.filter(curr => rates[curr] === undefined);
  if (missing.length > 0) {
    throw new Error(`Rates response is missing: ${missing.join(", ")}`);
  }

  return rates as ExchangeRates;
}
