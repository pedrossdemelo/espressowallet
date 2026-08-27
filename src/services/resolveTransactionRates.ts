import { ExchangeRates, TransactionWithId } from "types";
import getRates, { formatRateDate } from "./getRates";

export default function resolveTransactionRates(
  existing: TransactionWithId | null,
  date: Date,
  fetchRates: (date: Date) => Promise<ExchangeRates> = getRates,
): Promise<ExchangeRates> {
  // A snapshot contains every supported currency, so changing tag,
  // description, value, or currency does not require another network request.
  if (existing && formatRateDate(existing.createdAt) === formatRateDate(date)) {
    return Promise.resolve(existing.exchangeRates);
  }

  return fetchRates(date);
}
