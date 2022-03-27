import { currencies } from "constants";

const ratesCache = localStorage.getItem("rates")
  ? JSON.parse(localStorage.getItem("rates"))
  : {};

export default async function getRates(date) {
  const dateFormatted = date.toISOString().slice(0, 10);
  ratesCache[dateFormatted] =
    ratesCache[dateFormatted] ?? (await dataFromOpenExchangeRates(date));
  localStorage.setItem("rates", JSON.stringify(ratesCache));
  return ratesCache[dateFormatted];
}

async function dataFromOpenExchangeRates(date) {
  const request = `https://openexchangerates.org/api/historical/${date
    .toISOString()
    .slice(0, 10)}.json?app_id=${"0bca78c8a0b7413b8faa8f2f7ccf24bb"}`;

  const res = await fetch(request);
  const data = await res.json();

  if (!data.rates) throw new Error("Couldn't fetch rates");

  const rates = {};
  currencies.forEach(curr => (rates[curr] = data.rates[curr]));

  return rates;
}
