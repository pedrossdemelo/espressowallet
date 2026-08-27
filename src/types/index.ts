import colorMap from "constants/colorMap";
import currencies from "constants/currencies";

export type Currency = (typeof currencies)[number];

export type Tag = keyof typeof colorMap;

export type TransactionType = "expense" | "income";

export type TransactionCollection = "expenses" | "incomes";

export type ExchangeRates = Record<Currency, number>;

// The shape actually stored in a Firestore document — Firestore never stores
// the document id as a field, so `id` isn't part of it.
export interface Transaction {
  tag: Tag;
  description: string;
  value: number;
  currency: Currency;
  baseCurrency: Currency;
  createdAt: Date;
  type: TransactionType;
  exchangeRates: ExchangeRates;
}

// What UI code actually works with: a Transaction plus the id the read-side
// converter (see hooks/useUserData) stitches on from the document snapshot.
export type TransactionWithId = Transaction & { id: string };

// The `userData/{uid}` document. Besides `currency`/`balance` it carries one
// dynamic "MM/YYYY" key per month with a per-month rollup (see changeCurrency,
// addTransaction, editTransaction, deleteTransaction for the shape they write).
export interface UserMetadata {
  currency?: Currency;
  balance?: number;
  [monthKey: string]: unknown;
}

export interface MonthMetadata {
  balance: number;
  incomes?: number;
  totalIncome?: number;
  expenses?: number;
  totalExpense?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}
