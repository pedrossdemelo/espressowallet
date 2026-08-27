import { describe, expect, it } from "vitest";
import { ExchangeRates } from "../../types";
import calculateRate from "../calculateRate";

// USD-based table, the shape getRates produces.
const exchangeRates = {
  USD: 1,
  EUR: 0.5,
  BRL: 5,
} as unknown as ExchangeRates;

describe("calculateRate", () => {
  it("returns the value unchanged when currency matches base", () => {
    expect(
      calculateRate({
        currency: "EUR",
        baseCurrency: "EUR",
        value: 42.5,
        exchangeRates,
      })
    ).toBe(42.5);
  });

  it("converts into the base currency", () => {
    // 10 EUR at EUR=0.5, base USD=1 -> 10 * (1 / 0.5) = 20 USD
    expect(
      calculateRate({
        currency: "EUR",
        baseCurrency: "USD",
        value: 10,
        exchangeRates,
      })
    ).toBe(20);
  });

  it("converts between two non-base currencies", () => {
    // 10 BRL at BRL=5, base EUR=0.5 -> 10 * (0.5 / 5) = 1 EUR
    expect(
      calculateRate({
        currency: "BRL",
        baseCurrency: "EUR",
        value: 10,
        exchangeRates,
      })
    ).toBe(1);
  });

  it("coerces string values, which is how income forms used to store them", () => {
    expect(
      calculateRate({
        currency: "EUR",
        baseCurrency: "USD",
        value: "10" as unknown as number,
        exchangeRates,
      })
    ).toBe(20);
  });
});
