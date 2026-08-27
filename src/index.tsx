import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ErrorBoundary } from "components";
import { SnackbarProvider, ThemeContextProvider } from "context";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import store from "./store";

// Non-null: index.html always has this element.
const root = createRoot(document.getElementById("root")!);

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <ThemeContextProvider>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </LocalizationProvider>
        </Provider>
      </ThemeContextProvider>
    </BrowserRouter>
  </ErrorBoundary>,
);

serviceWorkerRegistration.register();
