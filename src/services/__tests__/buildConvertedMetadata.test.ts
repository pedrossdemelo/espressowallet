import { describe, expect, it } from "vitest";
import { ExchangeRates, MonthMetadata, Transaction } from "../../types";
import buildConvertedMetadata from "../buildConvertedMetadata";

const rates = { USD: 1, EUR: 0.5 } as unknown as ExchangeRates;

const tx = (overrides: Partial<Transaction>): Transaction => ({
  tag: "Other",
  description: "t",
  value: 100,
  currency: "USD",
  baseCurrency: "USD",
  createdAt: new Date(2026, 2, 10),
  type: "expense",
  exchangeRates: rates,
  ...overrides,
});

const month = (metadata: ReturnType<typeof buildConvertedMetadata>, key: string) =>
  metadata[key] as MonthMetadata;

describe("buildConvertedMetadata", () => {
  it("records the requested base currency", () => {
    expect(buildConvertedMetadata([], [], "EUR").currency).toBe("EUR");
    expect(buildConvertedMetadata([], [], "EUR").balance).toBe(0);
  });

  // Regression lock: a month holding BOTH an income and an expense used to
  // increment counters that the other loop never initialized, producing NaN
  // that was then persisted to Firestore. Fixed in 156d10f.
  it("produces finite counters for a month with both an income and an expense", () => {
    const incomes = [tx({ type: "income", value: 300 })];
    const expenses = [tx({ type: "expense", value: 100 })];

    const metadata = buildConvertedMetadata(incomes, expenses, "USD");
    const march = month(metadata, "3/2026");

    expect(march.incomes).toBe(1);
    expect(march.expenses).toBe(1);
    expect(march.totalIncome).toBe(300);
    expect(march.totalExpense).toBe(100);
    expect(march.balance).toBe(200);

    Object.values(march).forEach(value => expect(Number.isNaN(value)).toBe(false));
  });

  // Regression lock: the expenses loop updated only the month bucket and never
  // the top-level balance, so a conversion reported the sum of incomes and
  // silently dropped every expense.
  it("subtracts expenses from the top-level balance", () => {
    const incomes = [tx({ type: "income", value: 300 })];
    const expenses = [tx({ type: "expense", value: 100 })];

    expect(buildConvertedMetadata(incomes, expenses, "USD").balance).toBe(200);
  });

  it("keeps months separate", () => {
    const incomes = [
      tx({ type: "income", value: 50, createdAt: new Date(2026, 0, 5) }),
    ];
    const expenses = [
      tx({ type: "expense", value: 20, createdAt: new Date(2026, 1, 5) }),
    ];

    const metadata = buildConvertedMetadata(incomes, expenses, "USD");

    expect(month(metadata, "1/2026").totalIncome).toBe(50);
    expect(month(metadata, "1/2026").expenses).toBe(0);
    expect(month(metadata, "2/2026").totalExpense).toBe(20);
    expect(month(metadata, "2/2026").incomes).toBe(0);
    expect(metadata.balance).toBe(30);
  });

  it("converts into the new base currency using each stored rate snapshot", () => {
    // 100 USD converted into EUR (EUR=0.5, USD=1) -> 100 * (0.5/1) = 50
    const incomes = [tx({ type: "income", value: 100, currency: "USD" })];

    const metadata = buildConvertedMetadata(incomes, [], "EUR");

    expect(metadata.balance).toBe(50);
    expect(month(metadata, "3/2026").totalIncome).toBe(50);
  });

  it("does not mutate the transactions it is given", () => {
    const income = tx({ type: "income", baseCurrency: "USD" });
    buildConvertedMetadata([income], [], "EUR");
    expect(income.baseCurrency).toBe("USD");
  });
});
