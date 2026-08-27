// Every currency the Frankfurter API (https://frankfurter.dev, ECB reference
// rates) supports, plus USD as the implicit base — see getRates.ts. Frankfurter
// doesn't cover LKR or TWD (both supported by the previous provider), which
// only matters for a user whose *base* currency is one of those; existing
// transactions in either currency keep working, since each one stores its own
// exchange-rate snapshot at write time and never re-fetches it.
const currencies = [
  "AUD",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR",
] as const;

export default currencies;
