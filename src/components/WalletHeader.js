import {
  AppBar,
  IconButton,
  Skeleton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";

export default function WalletHeader() {
  const expenses = useSelector(state => state.wallet.expenses);
  const isFetching = useSelector(state => state.wallet.isFetching);

  const calculateRate = expense => {
    const { currency, value, exchangeRates } = expense;
    const {
      [currency]: { ask: rate },
    } = exchangeRates;
    return value * rate;
  };

  const totalExpenses = expenses
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open-drawer"
            sx={{ mr: { xs: 0.5, sm: 1.5 } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography mb={-0.1} variant="h6">
            Balance:{" "}
            {isFetching ? (
              <Skeleton
                type="text"
                sx={{
                  display: "inline-block",
                  width: `calc(${totalExpenses.toString().length}ch - 0.315rem)`,
                  position: "relative",
                  bottom: "0.05em"
                }}
              />
            ) : (
              totalExpenses
            )}{" "}
            BRL
          </Typography>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
}

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);
