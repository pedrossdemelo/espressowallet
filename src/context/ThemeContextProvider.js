import {
  createTheme,
  CssBaseline,
  darkScrollbar,
  ThemeProvider,
} from "@mui/material";
import { useLocalStorage } from "hooks";
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
  const [mode, setMode] = useLocalStorage("mode", "light");

  const isLight = React.useMemo(() => mode === "light", [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          background: {
            default: isLight ? "#f1f0ed" : "#111111",
            paper: isLight ? "#fafafa" : "#1e1e1e",
          },

          primary: {
            main: isLight ? "#988366" : "#ffb300",
            light: isLight ? "#AC9B84" : "rgb(255, 194, 51)",
            dark: isLight ? "#6A5B47" : "rgb(227, 154, 7)",
          },

          text: {
            primary: isLight ? "#3b332a" : "#efefef",
            secondary: isLight ? "#3b332ac9" : "#efefefc9",
            disabled: isLight ? "#3b332a85" : "#efefef88",
          },

          action: {
            active: isLight ? "#3b332a85" : "#efefef88",
            disabled: isLight ? "#3b332a4a" : "#efefef4b",
            focus: isLight ? "#3b332a20" : "#efefef1f",
            hover: isLight ? "#3b332a13" : "#efefef13",
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

  console.log(theme);

  const modeContextValue = React.useMemo(
    () => ({
      mode,
      isLight: mode === "light",
      setMode,
      toggleMode: () => setMode(mode === "light" ? "dark" : "light"),
      theme,
    }),
    [mode, theme, setMode]
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
