import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../store/actions";

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    email: "",
    password: "",
  });
  const { email, password } = state;

  function handleChange(e) {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(login(email));
    history.push("/carteira");
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+\w{2,4}$/g;
  const minPasswordLength = 6;
  const disabled =
    !emailRegex.test(email) || password.length < minPasswordLength;

  return (
    <Box sx={containerStyle}>
      <Paper
        variant="outlined"
        component="form"
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
        />

        <TextField
          name="password"
          type="password"
          label="Password"
          size="small"
          value={password}
          onChange={handleChange}
        />

        <Stack direction="row" justifyContent="space-between">
          <Button disabled={disabled}>Sign up</Button>
          <Button
            disabled={disabled}
            type="submit"
            variant="contained"
            disableElevation
          >
            Login
          </Button>
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
