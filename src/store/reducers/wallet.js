const initialState = {
  isFetching: false,
  error: null,
  expenses: [],
  incomes: [],
  currencies: [],
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
    return {
      ...state,
      isFetching: false,
      expenses: [...state.expenses, action.payload],
    };

  case 'wallet/deleteExpense':
    return {
      ...state,
      isFetching: false,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload,
      ),
    };

  case 'wallet/addIncome':
    return {
      ...state,
      isFetching: false,
      incomes: [...state.incomes, action.payload],
    };
  
  case 'wallet/deleteIncome':
    return {
      ...state,
      isFetching: false,
      incomes: state.incomes.filter(
        (income) => income.id !== action.payload,
      ),
    };

  default:
    return state;
  }
}
