import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useUserData, useUserMetadata } from "hooks";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { TransactionWithId, UserMetadata as UserMetadataValue } from "types";
import getWalletDataStatus from "./walletDataStatus";

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

function UserDataSubscriptions({
  children,
  retry,
}: {
  children: ReactNode;
  retry: () => void;
}) {
  const [expenses, loadingExpenses, errorExpenses] = useUserData("expenses");
  const [incomes, loadingIncomes, errorIncomes] = useUserData("incomes");
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

  const status = getWalletDataStatus(
    [loadingExpenses, loadingIncomes, loading],
    [errorExpenses, errorIncomes, error],
  );

  let content = children;
  if (status === "error") {
    content = (
      <Box sx={statusStyle}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={retry}>
              Retry
            </Button>
          }
        >
          Couldn't load your wallet. Check your connection and try again.
        </Alert>
      </Box>
    );
  } else if (status === "loading") {
    content = (
      <Box sx={statusStyle} role="status" aria-label="Loading wallet">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FilteredExpenses.Provider
      value={[expenses, loadingExpenses, errorExpenses]}
    >
      <FilteredIncomes.Provider value={[incomes, loadingIncomes, errorIncomes]}>
        <UserMetadata.Provider value={[metadata, loading, error]}>
          {content}
        </UserMetadata.Provider>
      </FilteredIncomes.Provider>
    </FilteredExpenses.Provider>
  );
}

export default function FilteredUserDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <UserDataSubscriptions
      key={retryKey}
      retry={() => setRetryKey(key => key + 1)}
    >
      {children}
    </UserDataSubscriptions>
  );
}

const statusStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 2,
};
