export default function calculateRate(transaction) {
  const { currency, value, exchangeRates } = transaction;
  const {
    [currency]: { ask: rate },
  } = exchangeRates;
  return value * rate;
}
