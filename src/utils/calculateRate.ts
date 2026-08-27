import { Transaction } from "types";

type RateInput = Pick<
  Transaction,
  "currency" | "value" | "exchangeRates" | "baseCurrency"
>;

export default function calculateRate(transaction: RateInput) {
  const { currency, value, exchangeRates, baseCurrency } = transaction;

  const nValue = Number(value);

  if (currency === baseCurrency) return nValue;

  const { [currency]: targetRate, [baseCurrency]: baseRate } = exchangeRates;

  const realRate = baseRate / targetRate;

  return nValue * realRate;
}
