import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth, useUserMetadata } from "hooks";
import { useHistory } from "react-router-dom";
import { stringAvatar } from "utils";

export default function WalletHeader() {
  const [{ email }] = useAuth();

  const [metadata, loading] = useUserMetadata();
  const { balance = 0 } = metadata;

  const history = useHistory();
  const goToSettings = () => history.push("/settings");

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={toolbarStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: { xs: 58, sm: 64 },
            }}
          >
            <IconButton edge="start" size="large" color="inherit">
              <MenuIcon />
            </IconButton>

            <Typography
              textAlign="center"
              sx={{ lineHeight: 1, mx: "auto" }}
              pb={{ xs: 0.75, sm: 1 }}
              variant="h6"
            >
              <Typography variant="caption" component="label">
                Balance:
              </Typography>
              <br />
              {loading ? (
                <Skeleton type="text" sx={skeletonStyle(balance)} />
              ) : (
                <span> {balance.toFixed(2)} BRL </span>
              )}
            </Typography>

            <IconButton
              onClick={goToSettings}
              edge="end"
              size="small"
              color="inherit"
            >
              <Avatar {...stringAvatar(email, { height: 36, width: 36 })} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

const toolbarStyle = {
  "@media all": { px: 2 },
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexDirection: "column",
  py: 0,
};

function skeletonStyle(totalExpenses) {
  return {
    display: "inline-block",
    width: `calc(${totalExpenses.toString().length}ch + 4ch)`,
    position: "relative",
    height: "1.5em",
    bottom: "0.3em",
    mb: -1.2,
  };
}
