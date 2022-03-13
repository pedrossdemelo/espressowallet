const initialState = {
  isFetching: false,
  error: null,
  expenses: [],
  currencies: [],
  updating: null,
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
  case 'wallet/fetchRates':
    return {
      ...state,
      isFetching: true,
    };
  case 'wallet/requestFailed':
    return {
      ...state,
      isFetching: false,
      error: action.payload,
    };
  case 'wallet/addExpense':
    if (state.updating === action.payload.id) {
      return {
        ...state,
        isFetching: false,
        updating: null,
        expenses: state.expenses.map((expense) => {
          if (expense.id === action.payload.id) {
            return action.payload;
          }
          return expense;
        }),
      };
    }
    return {
      ...state,
      isFetching: false,
      updating: null,
      expenses: [...state.expenses, action.payload],
    };
  case 'wallet/deleteExpense':
    return {
      ...state,
      isFetching: false,
      updating: null,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload,
      ),
    };
  case 'wallet/editExpense':
    return {
      ...state,
      isFetching: false,
      updating: action.payload,
    };
  default:
    return state;
  }
}
