const initialState = {
  currencies: [],
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case "wallet/fetchRates":
      return {
        ...state,
        isFetching: true,
      };

    default:
      return state;
  }
}
