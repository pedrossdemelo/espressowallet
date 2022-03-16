export default function calculateRate(expense) {
  const { currency, value, exchangeRates } = expense;
  const {
    [currency]: { ask: rate },
  } = exchangeRates;
  return value * rate;
}
