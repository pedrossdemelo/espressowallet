const initialState = {
  baseCurrency: {
    currency: null,
    loading: true,
  },
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case "wallet/updateBaseCurrency":
      return {
        ...state,
        baseCurrency: action.payload,
      };
    default:
      return state;
  }
}
