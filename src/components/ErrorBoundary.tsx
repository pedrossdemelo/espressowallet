import { Box, Button, Typography } from "@mui/material";
import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Today, any render-time throw anywhere in the tree is a permanent white
// screen — no component above catches it. This is the top-level backstop.
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box
        sx={{
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          height: "100vh",
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography variant="h6">Something went wrong.</Typography>
        <Typography color="text.secondary">
          Reloading the page usually fixes it. Your data is safe — nothing was
          lost.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Box>
    );
  }
}
