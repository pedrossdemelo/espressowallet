import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import store from "./store";

const theme = createTheme({
  palette: {
    mode: "light",
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    h6: {
      fontFamily: "Montserrat",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "Montserrat",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Montserrat",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "Montserrat",
      fontWeight: 600,
    },
    h2: {
      fontFamily: "Montserrat",
      fontWeight: 600,
    },
    h1: {
      fontFamily: "Montserrat",
      fontWeight: 600,
    },
    button: {
      fontFamily: "Montserrat",
      fontWeight: 600,
    },
    fontFamily: "Inter",
  },
});

console.log(theme);

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <App />
        </LocalizationProvider>
      </Provider>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
