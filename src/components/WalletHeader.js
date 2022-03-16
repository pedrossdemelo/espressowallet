import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import {
  ArrowDownward,
  ArrowUpward,
  Menu as MenuIcon,
} from "@mui/icons-material";
import stringAvatar from "../utils/stringAvatar";
import calculateRate from "../utils/calculateRate";

export default function WalletHeader() {
  const expenses = useSelector(state => state.wallet.expenses);
  const incomes = useSelector(state => state.wallet.incomes);
  const email = useSelector(state => state.user.email);
  const isFetching = useSelector(state => state.wallet.isFetching);

  const totalExpenses = expenses
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  const totalIncomes = incomes
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  const totalBalance = totalIncomes - totalExpenses;

  const appbarStyle = {
    borderRadius: "0 0 1rem 1rem",
  };

  return (
    <>
      <AppBar sx={appbarStyle} position="fixed">
        <Toolbar sx={toolbarStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: 58,
            }}
          >
            <IconButton edge="start" size="small" color="inherit">
              <Avatar {...stringAvatar(email, { height: 36, width: 36 })} />
            </IconButton>

            <Typography
              textAlign="center"
              sx={{ lineHeight: 1, mx: "auto" }}
              pb={0.5}
              variant="h6"
            >
              <Typography variant="caption" component="label">
                Balance:
              </Typography>
              <br />
              {isFetching ? (
                <Skeleton type="text" sx={skeletonStyle(totalBalance)} />
              ) : (
                totalBalance
              )}{" "}
              BRL
            </Typography>

            <IconButton edge="end" size="large" color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              pb: 1.75,
            }}
          >
            <Box sx={{ display: "flex" }}>
              <IconButton>
                <Avatar sx={{ bgcolor: "success.light" }}>
                  <ArrowUpward />
                </Avatar>
              </IconButton>

              <Typography variant="h6" sx={{ lineHeight: 1 }} py={0.5}>
                <Typography variant="caption" component="label">
                  Total income:
                </Typography>
                <br />
                {totalIncomes} BRL
              </Typography>
            </Box>

            <Box sx={{ display: "flex", mr: -0.75 }}>
              <Typography
                variant="h6"
                sx={{ lineHeight: 1 }}
                textAlign="right"
                py={0.5}
              >
                <Typography variant="caption" component="label">
                  Total expenses:
                </Typography>
                <br />
                {totalExpenses} BRL
              </Typography>

              <IconButton>
                <Avatar sx={{ bgcolor: "error.light" }}>
                  <ArrowDownward />
                </Avatar>
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

const toolbarStyle = {
  "@media all": { minHeight: 136, pr: 2.5, pl: 1.75 },
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexDirection: "column",
  py: 0,
};

function skeletonStyle(totalExpenses) {
  return {
    display: "inline-block",
    width: `calc(${totalExpenses.toString().length}ch - 0.575ch)`,
    position: "relative",
    height: "1.5em",
    bottom: "0.3em",
    mb: -1.2,
  };
}
