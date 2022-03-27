import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useUserData } from "hooks";
import React from "react";
import { calculateRate } from "utils";

export default function ExpenseAndIncome() {
  const [expenses] = useUserData("expenses");
  const [incomes] = useUserData("incomes");

  const totalExpenses = expenses
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  const totalIncomes = incomes
    .reduce((acc, curr) => acc + calculateRate(curr), 0)
    .toFixed(2);

  if (totalExpenses === "0.00" && totalIncomes === "0.00") return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mx: 3.5,
        mt: -0.5,
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
