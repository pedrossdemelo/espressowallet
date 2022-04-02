import { useUserData, useUserMetadata } from "hooks";
import React, { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";

export const FilteredExpenses = createContext([[], true, null]);
export const FilteredIncomes = createContext([[], true, null]);
export const UserMetadata = createContext([{}, true, null]);

function ExpenseProvider({ children }) {
  const [expensesValues, loadingExpenses, errorExpenses] =
    useUserData("expenses");

  const expenses = [expensesValues ?? [], loadingExpenses, errorExpenses];

  return (
    <FilteredExpenses.Provider value={expenses}>
      {children}
    </FilteredExpenses.Provider>
  );
}

function IncomeProvider({ children }) {
  const [incomesValues, loadingIncomes, errorIncomes] = useUserData("incomes");
  const incomes = [incomesValues ?? [], loadingIncomes, errorIncomes];

  return (
    <FilteredIncomes.Provider value={incomes}>
      {children}
    </FilteredIncomes.Provider>
  );
}

function UserMetadataProvider({ children }) {
  const [metadata, loading, error] = useUserMetadata();
  const dispatch = useDispatch();

  const { currency } = metadata;

  useEffect(() => {
    dispatch({
      type: "wallet/updateBaseCurrency",
      payload: {
        currency,
        loading,
      },
    });
  }, [currency, loading, dispatch]);

  return (
    <UserMetadata.Provider value={[metadata, loading, error]}>
      {children}
    </UserMetadata.Provider>
  );
}

export default function FilteredUserDataProvider({ children }) {
  return (
    <ExpenseProvider>
      <IncomeProvider>
        <UserMetadataProvider>{children}</UserMetadataProvider>
      </IncomeProvider>
    </ExpenseProvider>
  );
}
