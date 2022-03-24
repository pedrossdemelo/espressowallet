const fetchRates = () => ({
  type: "wallet/fetchRates",
});

export const setDateFilter = payload => ({
  type: "filter/setDateFilter",
  payload,
});
