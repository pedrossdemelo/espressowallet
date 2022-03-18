import { getMonthRange } from "../../utils";

const { start, end } = getMonthRange(new Date());

const initialState = {
  date: { start, end },
  expenses: [],
  incomes: [],
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case "filter/setDateFilter":
      let range;

      if (action.payload instanceof Date) {
        range = getMonthRange(action.payload);
      } else {
        range = action.payload;
      }

      return {
        ...state,
        date: range,
      };

    case "filter/setFilteredExpenses":
      return {
        ...state,
        expenses: action.payload,
      };

    case "filter/setFilteredIncomes":
      return {
        ...state,
        incomes: action.payload,
      };

    case "filter/addFilteredIncome":
      return {
        ...state,
        incomes: [...state.incomes, action.payload],
      };

    case "filter/addFilteredExpense":
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };

    case "filter/deleteFilteredExpense":
      return {
        ...state,
        expenses: state.expenses.filter(
          expense => expense.id !== action.payload
        ),
      };

    case "filter/deleteFilteredIncome":
      return {
        ...state,
        incomes: state.incomes.filter(income => income.id !== action.payload),
      };
    
    case "filter/editFilteredExpense":
      return {
        ...state,
        expenses: state.expenses.map(expense => {
          if (expense.id === action.payload.id) {
            return action.payload;
          }
          return expense;
        }),
      };
    
    case "filter/editFilteredIncome":
      return {
        ...state,
        incomes: state.incomes.map(income => {
          if (income.id === action.payload.id) {
            return action.payload;
          }
          return income;
        }),
      };

    default:
      return state;
  }
}
