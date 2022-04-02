import {
  createTheme,
  CssBaseline,
  darkScrollbar,
  ThemeProvider,
} from "@mui/material";
import React from "react";

const headingFont = "Poppins, sans-serif";
const headingWeight = 500;
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
            default: isLight ? "#f1f0ed" : "#1a1a1a",
            paper: isLight ? "#fafafa" : "#444444",
          },

          primary: {
            main: "#988366",
            light: "rgb(172, 155, 132)",
            dark: "#2a2a2a",
          },
        },

        shape: {
          borderRadius: 8,
        },

        typography: {
          fontFamily: bodyFont,
          fontWeightBold: 600,

          h6: {
            fontFamily: headingFont,
            fontWeight: headingWeight,
          },

          h5: {
            fontFamily: headingFont,
            fontWeight: headingWeight,
          },

          h4: {
            fontFamily: headingFont,
            fontWeight: headingWeight,
          },

          h3: {
            fontFamily: headingFont,
            fontWeight: headingWeight,
          },

          h2: {
            fontFamily: headingFont,
            fontWeight: headingWeight,
          },

          h1: {
            fontFamily: headingFont,
            fontWeight: headingWeight,
          },

          button: {
            fontFamily: headingFont,
            fontWeight: headingWeight,
            fontSize: "0.975rem",
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

  console.log(theme);

  return (
    <ModeContext.Provider value={modeContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ModeContext.Provider>
  );
}
