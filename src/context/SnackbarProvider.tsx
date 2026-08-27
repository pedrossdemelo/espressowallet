import { Alert, Snackbar } from "@mui/material";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface SnackbarContextValue {
  showError: (message: string) => void;
}

export const SnackbarContext = createContext<SnackbarContextValue>({
  showError: () => {},
});

export function useSnackbar() {
  return useContext(SnackbarContext);
}

// Extracts a readable message from whatever a write path throws — an Error,
// a Firestore error-like object, or something else entirely.
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export default function SnackbarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [message, setMessage] = useState<string | null>(null);

  const showError = (newMessage: string) => setMessage(newMessage);
  const close = () => setMessage(null);

  return (
    <SnackbarContext.Provider value={{ showError }}>
      {children}
      <Snackbar
        open={message !== null}
        autoHideDuration={6000}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={close} severity="error" variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
