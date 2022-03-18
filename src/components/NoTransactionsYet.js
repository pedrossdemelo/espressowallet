import { HistoryToggleOff } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function NoTransactionsYet() {
  const { expenses, incomes, date } = useSelector(state => state.filter);

  const filterYear = date.start.getFullYear();

  const isEmpty = expenses.length === 0 && incomes.length === 0;

  return (
    <div
      style={{
        display: isEmpty ? "flex" : "none",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "calc(1rem + 56px + 10vh)",
        gap: "0.5rem",
        flexGrow: 1,
        opacity: 0.375
      }}
    >
      <HistoryToggleOff fontSize="large" />

      <Typography>
        No transactions in{" "}
        {date.start.toLocaleString("default", { month: "long" })} {filterYear}
      </Typography>
    </div>
  );
}
