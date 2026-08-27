import {
  AllInbox,
  Code,
  DarkModeRounded,
  Favorite,
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

interface HamburgerMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function HamburgerMenuDrawer({
  open,
  onClose,
}: HamburgerMenuDrawerProps) {
  const { isLight, toggleMode } = useMode();

  return (
    <SwipeableDrawer
      open={open}
      onClose={onClose}
      // No-op: matches the original, which never passed this MUI-required
      // prop either — the drawer never opens via edge-swipe, only via the
      // hamburger button's onClick in WalletHeader.
      onOpen={() => {}}
    >
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

        <ListItemButton
          onClick={() => {
            window.open(
              "https://www.vakinha.com.br/vaquinha/manutencao-do-espresso-wallet",
              "_blank"
            );
          }}
          sx={{ flexGrow: 0 }}
        >
          <ListItemIcon>
            <Favorite />
          </ListItemIcon>
          <ListItemText>Keep us running!</ListItemText>
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
