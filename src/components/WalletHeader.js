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
import { Menu as MenuIcon } from "@mui/icons-material";
import stringAvatar from "../utils/stringAvatar";
import calculateRate from "../utils/calculateRate";
import { useHistory } from "react-router-dom";
import { useAuth, useUserData } from "../hooks";

export default function WalletHeader() {
  const [{ email }] = useAuth();

  const [expenses, expensesLoading] = useUserData("expenses");
  const [incomes, incomesLoading] = useUserData("incomes"); 
  const isFetching = expensesLoading || incomesLoading;

  const history = useHistory();
  const goToUserConfig = () => history.push("/config");

  const totalExpenses = expenses
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  const totalIncomes = incomes
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  const totalBalance = (totalIncomes - totalExpenses).toFixed(2);

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
            <IconButton onClick={goToUserConfig} edge="start" size="small" color="inherit">
              <Avatar {...stringAvatar(email, { height: 36, width: 36 })} />
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
        </Toolbar>
      </AppBar>
    </>
  );
}

const toolbarStyle = {
  "@media all": { pr: 2.5, pl: 1.75 },
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
