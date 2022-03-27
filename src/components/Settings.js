import { AttachMoney, LightModeRounded, Logout } from "@mui/icons-material";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import React from "react";
import { logout } from "services";

export default function ProfileMenu({ open, onClose, anchorEl }) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          width: "343px",
          mt: 1.5,
        },
      }}
    >
      <MenuItem>
        <ListItemIcon>
          <AttachMoney />
        </ListItemIcon>
        Currency
      </MenuItem>

      <MenuItem>
        <ListItemIcon>
          <LightModeRounded />
        </ListItemIcon>
        Light theme
      </MenuItem>

      <MenuItem onClick={() => logout()}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
}
