import {
  createTheme,
  CssBaseline,
  darkScrollbar,
  ThemeProvider,
} from "@mui/material";
import React from "react";

const headingFont = "Montserrat, sans-serif";
const bodyFont = "Inter, sans-serif";

export const ModeContext = React.createContext({
  mode: "light",
  isLight: true,
  setMode: () => {},
  toggleMode: () => {},
  theme: {},
});

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = React.useState("light");

  const isLight = React.useMemo(() => mode === "light", [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          background: {
            default: isLight ? "#EDF0F1" : "#1a1a1a",
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
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }),
            },
            defaultProps: {
              elevation: 0,
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: isLight ? null : darkScrollbar(),
            },
          },
          MuiCard: {
            defaultProps: {
              elevation: 0,
              sx: { borderRadius: 2 },
            },
          },
        },
      }),
    [mode, isLight]
  );

  const modeContextValue = React.useMemo(
    () => ({
      mode,
      isLight: mode === "light",
      setMode,
      toggleMode: () => setMode(mode === "light" ? "dark" : "light"),
      theme,
    }),
    [mode, theme]
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
