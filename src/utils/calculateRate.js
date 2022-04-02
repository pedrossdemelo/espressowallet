export default function calculateRate(transaction) {
  const { currency, value, exchangeRates, baseCurrency } = transaction;

  const nValue = Number(value);

  if (currency === baseCurrency) return nValue;

  const { [currency]: targetRate, [baseCurrency]: baseRate } = exchangeRates;

  const realRate = baseRate / targetRate;

  return nValue * realRate;
}
