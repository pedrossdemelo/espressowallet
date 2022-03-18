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

export const addExpenseThunk = payload => async dispatch => {
  dispatch(fetchRates());
  const { data, error } = await getRates();
  if (error) return dispatch(requestFailed(error));
  const expense = { ...payload, exchangeRates: data };
  dispatch(addExpense(expense));

  const expenses = store.getState().wallet.expenses;
  const { start, end } = store.getState().filter.date;

  expenses.filter(expense => expense.createdAt >= start && expense.createdAt <= end);
  dispatch(setFilteredExpenses(expenses));
};

export const addIncomeThunk = payload => async dispatch => {
  dispatch(fetchRates());
  const { data, error } = await getRates();
  if (error) return dispatch(requestFailed(error));
  const income = { ...payload, exchangeRates: data };
  dispatch(addIncome(income));

  const incomes = store.getState().wallet.incomes;
  const { start, end } = store.getState().filter.date;

  incomes.filter(expense => expense.createdAt >= start && expense.createdAt <= end);
  dispatch(setFilteredIncomes(incomes));
};
