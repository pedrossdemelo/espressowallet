import { Google, LocalCafe } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { errorMessage, useSnackbar } from "context";
import { useAuth } from "hooks";
import React, { useRef, useState } from "react";
import {
  loginEmail,
  logout,
  sendVerificationEmail,
  signUpEmail,
} from "services";
import signInGoogle from "services/signInGoogle";
import { authErrorMessage, noAuthErrors as noErrors } from "utils";

const notLoading = {
  loginLoading: false,
  signUpLoading: false,
};

const emptyForm = {
  email: "",
  password: "",
};

export default function Login() {
  const { showError } = useSnackbar();
  const [user] = useAuth();
  const [loading, setLoading] = useState(notLoading);
  const { loginLoading, signUpLoading } = loading;

  const [form, setForm] = useState(emptyForm);
  const { email, password } = form;

  const [errorState, setErrorState] = useState(noErrors);
  const { emailError, passwordError } = errorState;

  const isSignUp = useRef(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  // SyntheticEvent (not FormEvent): also invoked from the "Sign up" button's
  // onClick below, which only ever calls .preventDefault() on it too.
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    setErrorState(noErrors);

    if (isSignUp.current) {
      setLoading({ ...notLoading, signUpLoading: true });
      const { error, verificationError } = await signUpEmail(email, password);
      setLoading(notLoading);
      if (error !== null) setErrorState(authErrorMessage(error));
      if (verificationError)
        showError(
          `Your account was created, but the verification email could not be sent (${verificationError}). Use Resend to try again.`,
        );
    }

    if (!isSignUp.current) {
      setLoading({ ...notLoading, loginLoading: true });
      const { error } = await loginEmail(email, password);
      setLoading(notLoading);
      if (error !== null) setErrorState(authErrorMessage(error));
    }

    isSignUp.current = false;
  }

  async function handleGoogleSignIn() {
    setLoading({ ...notLoading, loginLoading: true });
    const { error } = await signInGoogle();
    setLoading(notLoading);
    if (error !== null) setErrorState(authErrorMessage(error));
  }

  // Signing up leaves the user authenticated but unverified, and the router
  // keeps them on /login until they verify. Rendering the form again made a
  // successful signup look like a failure, so people pressed Sign up a second
  // time and got auth/email-already-in-use back.
  if (user && !user.emailVerified)
    return <PendingVerification email={user.email} />;

  const emailRegex = /^[\w-.]+@([\w-]+\.)+\w{2,4}$/g;
  const minPasswordLength = 6;
  const disabled =
    !emailRegex.test(email) || password.length < minPasswordLength;

  return (
    <Box sx={containerStyle}>
      <Paper
        component="form"
        sx={formStyle}
        elevation={0}
        onSubmit={handleSubmit}
      >
        <Typography mb={2} textAlign="center" variant="h5">
          Espresso Wallet <LocalCafe sx={{ mb: -0.5 }} />
        </Typography>

        <TextField
          name="email"
          type="email"
          label="Email"
          size="small"
          value={email}
          onChange={handleChange}
          error={emailError !== " "}
          helperText={emailError}
        />

        <TextField
          name="password"
          type="password"
          label="Password"
          size="small"
          value={password}
          onChange={handleChange}
          error={passwordError !== " "}
          helperText={passwordError}
        />

        <Stack direction="row" justifyContent="space-between">
          <LoadingButton
            onClick={e => {
              isSignUp.current = true;
              handleSubmit(e);
            }}
            disabled={disabled || loading !== notLoading}
            loading={signUpLoading}
          >
            Sign up
          </LoadingButton>

          <LoadingButton
            disabled={disabled || loading !== notLoading}
            type="submit"
            disableElevation
            variant="contained"
            loading={loginLoading}
          >
            Login
          </LoadingButton>
        </Stack>
      </Paper>

      <Divider sx={{ width: "20rem" }}>
        <Typography color="text.secondary">or</Typography>
      </Divider>

      <Button
        startIcon={<Google />}
        variant="outlined"
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </Button>
    </Box>
  );
}

function PendingVerification({ email }: { email: string | null }) {
  const { showError } = useSnackbar();
  const [user] = useAuth();
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);

  const resend = async () => {
    if (!user || resending) return;
    setResending(true);
    try {
      await sendVerificationEmail(user);
      setSent(true);
    } catch (err) {
      showError(errorMessage(err, "Couldn't resend the verification email."));
    } finally {
      setResending(false);
    }
  };

  // emailVerified is baked into the token this tab already holds, so verifying
  // in another tab or on a phone needs an explicit refresh to be noticed.
  const checkAgain = async () => {
    if (!user || checking) return;
    setChecking(true);
    try {
      await user.reload();
      if (!user.emailVerified) {
        showError("Still not verified. Check your inbox and spam folder.");
        return;
      }
      // reload() refreshes the user record but not the cached ID token, and
      // the Firestore rules read email_verified off the token. Without a
      // forced refresh the wallet loads with a stale unverified token and
      // every read is denied.
      await user.getIdToken(true);
      window.location.reload();
    } catch (err) {
      showError(errorMessage(err, "Couldn't check your verification status."));
    } finally {
      setChecking(false);
    }
  };

  return (
    <Box sx={containerStyle}>
      <Paper sx={formStyle} elevation={0}>
        <Typography mb={1} textAlign="center" variant="h5">
          Espresso Wallet <LocalCafe sx={{ mb: -0.5 }} />
        </Typography>

        <Typography textAlign="center" variant="h6">
          Check your email
        </Typography>

        <Typography color="text.secondary" textAlign="center">
          {sent
            ? "Verification email sent again to "
            : "We sent a verification link to "}
          <strong>{email}</strong>. Open it to finish setting up your account,
          then come back here.
        </Typography>

        <Stack direction="row" justifyContent="space-between">
          <LoadingButton onClick={resend} loading={resending}>
            Resend email
          </LoadingButton>

          <LoadingButton
            onClick={checkAgain}
            loading={checking}
            variant="contained"
            disableElevation
          >
            I've verified
          </LoadingButton>
        </Stack>

        <Button onClick={() => logout()} size="small" color="inherit">
          Use a different account
        </Button>
      </Paper>
    </Box>
  );
}

const containerStyle = {
  display: "flex",
  gap: 2,
  flexFlow: "column nowrap",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  boxSizing: "border-box",
  pb: 8,
};

const formStyle = {
  p: 4,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  width: "min(24rem, 90vw)",
  gap: 2,
};
