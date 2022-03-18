import getRates from "../../services/getRates";
import store from "../index";

export const t = () => "hey";

export function login(payload) {
  return {
    type: "user/login",
    payload,
  };
}

const fetchRates = () => ({
  type: "wallet/fetchRates",
});

const requestFailed = payload => ({
  type: "wallet/requestFailed",
  payload,
});

const addExpense = payload => ({
  type: "wallet/addExpense",
  payload,
});

const addIncome = payload => ({
  type: "wallet/addIncome",
  payload,
});

export const deleteExpense = payload => ({
  type: "wallet/deleteExpense",
  payload,
});

export const deleteIncome = payload => ({
  type: "wallet/deleteIncome",
  payload,
});

export const setDateFilter = payload => ({
  type: "filter/setDateFilter",
  payload,
});

export const setFilteredExpenses = payload => ({
  type: "filter/setFilteredExpenses",
  payload,
});

export const setFilteredIncomes = payload => ({
  type: "filter/setFilteredIncomes",
  payload,
});

export const addFilteredIncome = payload => ({
  type: "filter/addFilteredIncome",
  payload,
});

export const addFilteredExpense = payload => ({
  type: "filter/addFilteredExpense",
  payload,
});

export const deleteFilteredExpense = payload => ({
  type: "filter/deleteFilteredExpense",
  payload,
});

export const deleteFilteredIncome = payload => ({
  type: "filter/deleteFilteredIncome",
  payload,
});

export const addExpenseThunk = payload => async dispatch => {
  dispatch(fetchRates());
  const { data, error } = await getRates();
  if (error) return dispatch(requestFailed(error));
  const expense = { ...payload, exchangeRates: data };
  dispatch(addExpense(expense));

  const { start, end } = store.getState().filter.date;

  if (expense.createdAt >= start && expense.createdAt <= end)
    dispatch(addFilteredExpense(expense));
};

export const addIncomeThunk = payload => async dispatch => {
  dispatch(fetchRates());
  const { data, error } = await getRates();
  if (error) return dispatch(requestFailed(error));
  const income = { ...payload, exchangeRates: data };
  dispatch(addIncome(income));

  const { start, end } = store.getState().filter.date;

  if (income.createdAt >= start && income.createdAt <= end)
    dispatch(addFilteredIncome(income));
};

export const updateFilteredResultsThunk = () => async dispatch => {
  const { start, end } = store.getState().filter.date;
  const { expenses, incomes } = store.getState().wallet;

  const filteredExpenses = expenses.filter(
    expense => expense.createdAt >= start && expense.createdAt <= end
  );

  const filteredIncomes = incomes.filter(
    income => income.createdAt >= start && income.createdAt <= end
  );

  dispatch(setFilteredExpenses(filteredExpenses));
  dispatch(setFilteredIncomes(filteredIncomes));
}