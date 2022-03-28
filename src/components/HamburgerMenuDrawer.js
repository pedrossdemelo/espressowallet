import {
  AccountBalanceWallet,
  AllInbox,
  Code,
  LightModeRounded,
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
import React from "react";

export default function HamburgerMenuDrawer({ open, onClose }) {
  return (
    <SwipeableDrawer open={open} onClose={onClose}>
      <List
        sx={{
          width: "min(90vw, 300px)",
          flexGrow: 1,
          display: "flex",
          flexFlow: "column nowrap",
        }}
      >
        <ListItem sx={{ mt: -0.5 }}>
          <ListItemIcon>
            <AccountBalanceWallet />
          </ListItemIcon>

          <ListItemText primaryTypographyProps={{ variant: "h6" }}>
            Poliwallet
          </ListItemText>
        </ListItem>

        <Divider />

        <ListItemButton
          sx={{
            flexGrow: 0,
            mt: 1,
            bgcolor: "#bed8fd",
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

        <ListItemButton sx={{ flexGrow: 0 }}>
          <ListItemIcon>
            <LightModeRounded />
          </ListItemIcon>
          <ListItemText>Light theme</ListItemText>
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
