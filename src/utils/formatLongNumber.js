export default function formatLongNumber(number, maxLength = 5) {
  const trillions = number / 1000000000000;
  if (trillions > 1) {
    return `${trillions.toFixed(2)}T`;
  }

  const billions = number / 1000000000;
  if (billions > 1) {
    return `${billions.toFixed(2)}B`;
  }

  const millions = number / 1000000;
  if (millions > 1) {
    return `${millions.toFixed(2)}M`;
  }

  const centithousands = number / 100000;
  if (centithousands > 1) {
    const thousands = centithousands * 100;
    return `${thousands.toFixed(2)}K`;
  }

  return number.toFixed(2);
}
