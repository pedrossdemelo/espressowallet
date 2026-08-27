import { Currency, MonthMetadata, Transaction } from "types";
import { calculateRate, dateToMMYYYY } from "utils";

// The `userData/{uid}` document: base currency, overall balance, and one
// "MM/YYYY" bucket per month that has any activity.
export type ConvertedMetadata = {
  currency: Currency;
  balance: number;
} & { [monthKey: string]: MonthMetadata | Currency | number };

const emptyMonth = (): MonthMetadata => ({
  balance: 0,
  incomes: 0,
  totalIncome: 0,
  expenses: 0,
  totalExpense: 0,
});

// `metadata[key]` can statically be a MonthMetadata, a Currency, or a number
// (see ConvertedMetadata above) — but by convention every key besides
// "currency" and "balance" is an "MM/YYYY" string holding a month bucket.
// Always seeds all four counters so the arithmetic below can never hit
// `undefined + 1` (which used to produce NaN for months holding both an
// income and an expense).
function getOrCreateMonth(
  metadata: ConvertedMetadata,
  key: string
): MonthMetadata {
  const value = metadata[key];
  if (typeof value === "object") return value;
  const month = emptyMonth();
  metadata[key] = month;
  return month;
}

/**
 * Recomputes the whole metadata document for a new base currency.
 *
 * Each transaction carries its own `exchangeRates` snapshot from the moment it
 * was written, so conversion is a pure function of the stored data — no rate
 * fetching, no clock, no network. That's what makes this testable.
 */
export default function buildConvertedMetadata(
  incomes: Transaction[],
  expenses: Transaction[],
  newBaseCurrency: Currency
): ConvertedMetadata {
  const metadata: ConvertedMetadata = {
    currency: newBaseCurrency,
    balance: 0,
  };

  incomes.forEach(transaction => {
    const total = calculateRate({
      ...transaction,
      baseCurrency: newBaseCurrency,
    });
    const month = getOrCreateMonth(metadata, dateToMMYYYY(transaction.createdAt));

    metadata.balance += total;
    month.balance += total;
    month.incomes += 1;
    month.totalIncome += total;
  });

  expenses.forEach(transaction => {
    const total = calculateRate({
      ...transaction,
      baseCurrency: newBaseCurrency,
    });
    const month = getOrCreateMonth(metadata, dateToMMYYYY(transaction.createdAt));

    metadata.balance -= total;
    month.balance -= total;
    month.expenses += 1;
    month.totalExpense += total;
  });

  return metadata;
}
