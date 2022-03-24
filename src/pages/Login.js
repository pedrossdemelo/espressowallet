import { LoadingButton } from "@mui/lab";
import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks";
import { loginEmail, signUpEmail } from "../services";

const noErrors = {
  emailError: " ",
  passwordError: " ",
};

const notLoading = {
  loginLoading: false,
  signUpLoading: false,
};

const emptyForm = {
  email: "",
  password: "",
};

export default function Login() {
  const [user, pageLoading] = useAuth();
  const history = useHistory();

  const [loading, setLoading] = useState(notLoading);
  const { loginLoading, signUpLoading } = loading;

  const [form, setForm] = useState(emptyForm);
  const { email, password } = form;

  const [errorState, setErrorState] = useState(noErrors);
  const { emailError, passwordError } = errorState;

  const isSignUp = useRef(false);

  if (pageLoading) return <div>Loading...</div>;
  if (user) {
    history.push("/carteira");
    return null;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorState(noErrors);
    if (isSignUp.current) {
      setLoading({ ...notLoading, signUpLoading: true });
      const { error } = await signUpEmail(email, password);
      if (error) setErrorState(humanErrorParse(error));
    } else {
      setLoading({ ...notLoading, loginLoading: true });
      const { error } = await loginEmail(email, password);
      if (error) setErrorState(humanErrorParse(error));
    }
    isSignUp.current = false;
    setLoading(notLoading);
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+\w{2,4}$/g;
  const minPasswordLength = 6;
  const disabled =
    !emailRegex.test(email) || password.length < minPasswordLength;

  return (
    <Box sx={containerStyle}>
      <Paper
        component="form"
        elevation={2}
        sx={formStyle}
        onSubmit={handleSubmit}
      >
        <Typography mb={2} textAlign="center" fontWeight={600} variant="h5">
          Poliwallet 💼
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
            onClick={() => (isSignUp.current = true)}
            type="submit"
            disabled={disabled || loading !== notLoading}
            loading={signUpLoading}
          >
            Sign up
          </LoadingButton>

          <LoadingButton
            disabled={disabled || loading !== notLoading}
            type="submit"
            variant="contained"
            disableElevation
            loading={loginLoading}
          >
            Login
          </LoadingButton>
        </Stack>
      </Paper>
    </Box>
  );
}

const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  boxSizing: "border-box",
  pb: 8,
  bgcolor: "grey.50",
};

const formStyle = {
  p: 4,
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  width: "20rem",
  m: "auto",
  gap: 2,
};

function humanErrorParse(error) {
  error = error.split("/")[1].split("-").join(" ");
  error = error.charAt(0).toUpperCase() + error.slice(1);
  return /password/g.test(error)
    ? {
        ...noErrors,
        passwordError: error,
      }
    : {
        ...noErrors,
        emailError: error,
      };
}
