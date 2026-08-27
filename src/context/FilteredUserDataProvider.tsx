import { useUserData, useUserMetadata } from "hooks";
import React, { createContext, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { TransactionWithId, UserMetadata as UserMetadataValue } from "types";

type TransactionsContextValue = readonly [
  TransactionWithId[],
  boolean,
  Error | null | undefined,
];

type UserMetadataContextValue = readonly [
  UserMetadataValue,
  boolean,
  Error | null | undefined,
];

export const FilteredExpenses = createContext<TransactionsContextValue>([
  [],
  true,
  null,
]);
export const FilteredIncomes = createContext<TransactionsContextValue>([
  [],
  true,
  null,
]);
export const UserMetadata = createContext<UserMetadataContextValue>([
  {},
  true,
  null,
]);

function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expensesValues, loadingExpenses, errorExpenses] =
    useUserData("expenses");

  const expenses: TransactionsContextValue = [
    expensesValues ?? [],
    loadingExpenses,
    errorExpenses,
  ];

  return (
    <FilteredExpenses.Provider value={expenses}>
      {children}
    </FilteredExpenses.Provider>
  );
}

function IncomeProvider({ children }: { children: ReactNode }) {
  const [incomesValues, loadingIncomes, errorIncomes] = useUserData("incomes");
  const incomes: TransactionsContextValue = [
    incomesValues ?? [],
    loadingIncomes,
    errorIncomes,
  ];

  return (
    <FilteredIncomes.Provider value={incomes}>
      {children}
    </FilteredIncomes.Provider>
  );
}

function UserMetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, loading, error] = useUserMetadata();
  const dispatch = useDispatch<AppDispatch>();

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

export default function FilteredUserDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ExpenseProvider>
      <IncomeProvider>
        <UserMetadataProvider>{children}</UserMetadataProvider>
      </IncomeProvider>
    </ExpenseProvider>
  );
}
