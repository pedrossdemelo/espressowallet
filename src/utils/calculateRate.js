export default function calculateRate(transaction) {
  const { currency, value, exchangeRates, baseCurrency } = transaction;

  if (currency === baseCurrency) return value;

  const { [currency]: targetRate, [baseCurrency]: baseRate } = exchangeRates;

  const realRate = baseRate / targetRate;

  return value * realRate;
}
