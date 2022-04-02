import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

const headingFont = "Montserrat, sans-serif";
const bodyFont = "Inter, sans-serif";

export const ModeContext = React.createContext({
  mode: "light",
  setMode: () => {},
  toggleMode: () => {},
});

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = React.useState("light");

  const modeContextValue = React.useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode(mode === "light" ? "dark" : "light"),
    }),
    [mode]
  );

  const isLight = mode === "light";

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          background: {
            default: isLight ? "#fafafa" : "#1a1a1a",
          },
        },

        shape: {
          borderRadius: 8,
        },

        typography: {
          fontFamily: bodyFont,

          h6: {
            fontFamily: headingFont,
            fontWeight: 600,
          },

          h5: {
            fontFamily: headingFont,
            fontWeight: 600,
          },

          h4: {
            fontFamily: headingFont,
            fontWeight: 600,
          },

          h3: {
            fontFamily: headingFont,
            fontWeight: 600,
          },

          h2: {
            fontFamily: headingFont,
            fontWeight: 600,
          },

          h1: {
            fontFamily: headingFont,
            fontWeight: 600,
          },

          button: {
            fontFamily: headingFont,
            fontWeight: 600,
          },
        },

        components: {
          MuiAppBar: {
            defaultProps: {
              variant: "outlined",
              sx: {
                bgcolor: "background.default",
                color: "text.primary",
                border: "none",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ModeContext.Provider value={modeContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ModeContext.Provider>
  );
}
