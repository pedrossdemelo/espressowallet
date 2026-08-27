import { describe, expect, it, vi } from "vitest";
import { ExchangeRates, TransactionWithId } from "../../types";
import resolveTransactionRates from "../resolveTransactionRates";

const storedRates = { USD: 1 } as ExchangeRates;

const existing = {
  createdAt: new Date(2026, 6, 9, 9),
  exchangeRates: storedRates,
} as TransactionWithId;

describe("resolveTransactionRates", () => {
  it("preserves stored rates when an edit stays on the same day", async () => {
    const fetchRates = vi.fn();

    await expect(
      resolveTransactionRates(existing, new Date(2026, 6, 9, 18), fetchRates),
    ).resolves.toBe(storedRates);
    expect(fetchRates).not.toHaveBeenCalled();
  });

  it("fetches a new snapshot when the transaction date changes", async () => {
    const newRates = { USD: 2 } as ExchangeRates;
    const fetchRates = vi.fn().mockResolvedValue(newRates);
    const newDate = new Date(2026, 6, 10);

    await expect(
      resolveTransactionRates(existing, newDate, fetchRates),
    ).resolves.toBe(newRates);
    expect(fetchRates).toHaveBeenCalledWith(newDate);
  });
});
