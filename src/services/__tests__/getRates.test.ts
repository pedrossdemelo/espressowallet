import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ExchangeRates } from "../../types";
import currencies from "../../constants/currencies";
import { formatRateDate, parseRatesCache } from "../getRates";

const rates = Object.fromEntries(
  currencies.map((currency, index) => [currency, index + 1]),
) as ExchangeRates;

describe("rate dates and cache parsing", () => {
  it("formats the user's local calendar date", () => {
    const date = new Date(2026, 6, 9, 0, 30);
    expect(formatRateDate(date)).toBe("2026-07-09");
  });

  it("recovers from malformed or invalid cached data", () => {
    expect(parseRatesCache("not json")).toEqual({});
    expect(
      parseRatesCache(JSON.stringify({ "2026-07-09": { USD: 1 } })),
    ).toEqual({});
  });

  it("keeps valid cached rate tables", () => {
    expect(parseRatesCache(JSON.stringify({ "2026-07-09": rates }))).toEqual({
      "2026-07-09": rates,
    });
  });
});

describe("getRates", () => {
  const values = new Map<string, string>();

  beforeEach(() => {
    vi.resetModules();
    values.clear();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses a valid cached response without fetching", async () => {
    values.set("rates", JSON.stringify({ "2026-07-09": rates }));
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { default: getRates } = await import("../getRates");

    await expect(getRates(new Date(2026, 6, 9))).resolves.toEqual(rates);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects unsuccessful HTTP responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );
    const { default: getRates } = await import("../getRates");

    await expect(getRates(new Date(2026, 6, 9))).rejects.toThrow(
      "Couldn't fetch rates (503)",
    );
  });
});
