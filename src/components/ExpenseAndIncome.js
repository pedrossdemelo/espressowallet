import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import calculateRate from "../utils/calculateRate";

export default function ExpenseAndIncome() {
  const expenses = useSelector(state => state.wallet.expenses);
  const incomes = useSelector(state => state.wallet.incomes);

  const totalExpenses = expenses
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  const totalIncomes = incomes
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mx: 3.5,
        my: -1,
      }}
    >
      <Box sx={{ display: "flex" }}>
        <IconButton edge="start">
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

      <Box sx={{ display: "flex" }}>
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

        <IconButton edge="end">
          <Avatar sx={{ bgcolor: "error.light" }}>
            <ArrowDownward />
          </Avatar>
        </IconButton>
      </Box>
    </Box>
  );
}
