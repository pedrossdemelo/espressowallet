import { Currency } from "types";

export interface BaseCurrency {
  currency: Currency | null | undefined;
  loading: boolean;
}

const initialState = {
  baseCurrency: {
    currency: null,
    loading: true,
  } as BaseCurrency,
};

export interface UpdateBaseCurrencyAction {
  type: "wallet/updateBaseCurrency";
  payload: BaseCurrency;
}

export type WalletAction = UpdateBaseCurrencyAction;

export default function walletReducer(
  state = initialState,
  action: WalletAction
) {
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
