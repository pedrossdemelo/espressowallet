import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { FilteredExpenses, FilteredIncomes, UserMetadata } from "context";
import { useMode } from "hooks";
import React, { useContext } from "react";
import { calculateRate } from "utils";

export default function ExpenseAndIncome() {
  const { isLight } = useMode();

  const [{ currency }] = useContext(UserMetadata);
  const [expenses] = useContext(FilteredExpenses);
  const [incomes] = useContext(FilteredIncomes);

  const totalExpenses = Number(
    expenses.reduce((acc, curr) => acc + calculateRate(curr), 0)
  ).toFixed(2);

  const totalIncomes = Number(
    incomes.reduce((acc, curr) => acc + calculateRate(curr), 0)
  ).toFixed(2);

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
          <Avatar
            sx={{
              bgcolor: isLight ? "success.light" : "success.dark",
              color: "common.white",
            }}
          >
            <ArrowUpward />
          </Avatar>
        </IconButton>

        <Typography variant="h6" sx={{ lineHeight: 1 }} py={0.5}>
          <Typography variant="caption" component="label">
            Total income:
          </Typography>
          <br />
          {totalIncomes} {currency}
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
          {totalExpenses} {currency}
        </Typography>

        <IconButton edge="end">
          <Avatar
            sx={{
              bgcolor: isLight ? "error.light" : "error.dark",
              color: "common.white",
            }}
          >
            <ArrowDownward />
          </Avatar>
        </IconButton>
      </Box>
    </Box>
  );
}
