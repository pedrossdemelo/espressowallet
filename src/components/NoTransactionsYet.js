import { HistoryToggleOff } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { FilteredExpenses, FilteredIncomes } from "./FilteredUserDataProvider";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function NoTransactionsYet() {
  const { date } = useSelector(state => state.filter);

  const [expenses] = useContext(FilteredExpenses);
  const [incomes] = useContext(FilteredIncomes);

  const isEmpty = !expenses.length && !incomes.length;

  const filterYear = date.start.getFullYear();

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
        opacity: 0.375,
      }}
    >
      <HistoryToggleOff fontSize="large" />

      <Typography>
        No transactions in {months[Number(date.start.getMonth())]} {filterYear}
      </Typography>
    </div>
  );
}
