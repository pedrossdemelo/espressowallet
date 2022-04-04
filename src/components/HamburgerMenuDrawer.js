import {
  AllInbox,
  Code,
  DarkModeRounded,
  GetApp,
  LightModeRounded,
  LocalCafe,
} from "@mui/icons-material";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import { Box } from "@mui/system";
import { useMode } from "hooks";
import React from "react";

const useInstall = () => {
  let defferedPrompt;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    defferedPrompt = e;
  });

  const install = () => {
    if (defferedPrompt) {
      defferedPrompt.prompt();
      defferedPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        defferedPrompt = null;
      });
    }
  };

  const canInstall = defferedPrompt !== undefined;

  return { canInstall, install };
};

export default function HamburgerMenuDrawer({ open, onClose }) {
  const { isLight, toggleMode } = useMode();

  const { canInstall, install } = useInstall();

  return (
    <SwipeableDrawer open={open} onClose={onClose}>
      <List
        sx={{
          width: "min(90vw, 300px)",
          flexGrow: 1,
          display: "flex",
          bgcolor: "background.paper",
          flexFlow: "column nowrap",
        }}
      >
        <ListItem sx={{ mt: -0.5 }}>
          <ListItemIcon>
            <LocalCafe />
          </ListItemIcon>

          <ListItemText primaryTypographyProps={{ variant: "h6" }}>
            Espresso Wallet
          </ListItemText>
        </ListItem>

        <Divider />

        <ListItemButton
          sx={{
            flexGrow: 0,
            mt: 1,
            bgcolor: "background.default",
            borderTopRightRadius: 99,
            borderBottomRightRadius: 99,
            mr: 1,
          }}
        >
          <ListItemIcon>
            <AllInbox />
          </ListItemIcon>
          <ListItemText>Overview</ListItemText>
        </ListItemButton>

        <Box sx={{ flexGrow: 1 }} />

        <ListItemButton onClick={install} sx={{ flexGrow: 0 }}>
          <ListItemIcon>
            <GetApp />
          </ListItemIcon>
          <ListItemText>Install the app</ListItemText>
        </ListItemButton>

        <ListItemButton onClick={toggleMode} sx={{ flexGrow: 0 }}>
          <ListItemIcon>
            {isLight ? <LightModeRounded /> : <DarkModeRounded />}
          </ListItemIcon>
          <ListItemText>{isLight ? "Light" : "Dark"} theme</ListItemText>
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItemButton
          onClick={() => {
            window.open("https://www.pedrosousa.dev/#contact", "_blank");
          }}
          sx={{ flexGrow: 0 }}
        >
          <ListItemIcon>
            <Code />
          </ListItemIcon>
          <ListItemText>Contact developer</ListItemText>
        </ListItemButton>
      </List>
    </SwipeableDrawer>
  );
}
