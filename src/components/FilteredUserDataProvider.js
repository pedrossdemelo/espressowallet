import { useUserData } from "hooks";
import React, { createContext } from "react";

export const FilteredExpenses = createContext([[], true, null]);
export const FilteredIncomes = createContext([[], true, null]);

function ExpenseProvider({ children }) {
  const [expensesValues, loadingExpenses, errorExpenses] =
    useUserData("expenses");

  const expenses = [expensesValues, loadingExpenses, errorExpenses];

  return (
    <FilteredExpenses.Provider value={expenses}>
      {children}
    </FilteredExpenses.Provider>
  );
}

function IncomeProvider({ children }) {
  const [incomesValues, loadingIncomes, errorIncomes] = useUserData("incomes");
  const incomes = [incomesValues, loadingIncomes, errorIncomes];

  return (
    <FilteredIncomes.Provider value={incomes}>
      {children}
    </FilteredIncomes.Provider>
  );
}

export default function FilteredUserDataProvider({ children }) {
  return (
    <ExpenseProvider>
      <IncomeProvider>{children}</IncomeProvider>
    </ExpenseProvider>
  );
}
