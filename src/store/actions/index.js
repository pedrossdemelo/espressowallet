import getRates from '../../services/getRates';

export const t = () => 'hey';

export function login(payload) {
  return {
    type: 'user/login',
    payload,
  };
}

const fetchRates = () => ({
  type: 'wallet/fetchRates',
});

const requestFailed = (payload) => ({
  type: 'wallet/requestFailed',
  payload,
});

const addExpense = (payload) => ({
  type: 'wallet/addExpense',
  payload,
});

const addIncome = (payload) => ({
  type: 'wallet/addIncome',
  payload,
});

export const deleteExpense = (payload) => ({
  type: 'wallet/deleteExpense',
  payload,
});

export const deleteIncome = (payload) => ({
  type: 'wallet/deleteIncome',
  payload,
});

export const setDateFilter = (payload) => ({
  type: 'filters/setDateFilter',
  payload,
})

export const addExpenseThunk = (payload) => async (dispatch) => {
  dispatch(fetchRates());
  const { data, error } = await getRates();
  if (error) return dispatch(requestFailed(error));
  const expense = { ...payload, exchangeRates: data };
  dispatch(addExpense(expense));
};

export const addIncomeThunk = (payload) => async (dispatch) => {
  dispatch(fetchRates());
  const { data, error } = await getRates();
  if (error) return dispatch(requestFailed(error));
  const income = { ...payload, exchangeRates: data };
  dispatch(addIncome(income));
}