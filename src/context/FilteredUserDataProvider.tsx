import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useUserData, useUserMetadata } from "hooks";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TransactionWithId, UserMetadata as UserMetadataValue } from "types";
import { AppDispatch } from "../store";
import getWalletDataStatus from "./walletDataStatus";

const walletLoadTimeoutMs = 10_000;

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
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
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

  const loadingStates = [loadingExpenses, loadingIncomes, loading];
  const isLoading = loadingStates.some(Boolean);

  useEffect(() => {
    if (!isLoading) return;

    const timeout = window.setTimeout(
      () => setLoadingTimedOut(true),
      walletLoadTimeoutMs,
    );

    return () => window.clearTimeout(timeout);
  }, [isLoading]);

  const status = getWalletDataStatus(
    loadingStates,
    [errorExpenses, errorIncomes, error],
    loadingTimedOut,
  );

  let content = children;
  if (status === "error") {
    content = (
      <Box sx={statusStyle} role="alert">
        <Alert
          severity="error"
          sx={{ maxWidth: 560 }}
          action={
            <Button color="inherit" size="small" onClick={retry}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Couldn't connect to your wallet</AlertTitle>A browser
          extension or network filter may be blocking Firebase. Allow requests
          to <strong>firestore.googleapis.com</strong>, then retry.
        </Alert>
      </Box>
    );
  } else if (status === "loading") {
    content = (
      <Box sx={statusStyle} role="status" aria-label="Loading wallet">
        <CircularProgress />
        <Typography color="text.secondary">Loading your wallet…</Typography>
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
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  px: 2,
};
