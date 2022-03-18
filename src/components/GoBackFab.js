import { ArrowBack } from "@mui/icons-material";
import { Fab, Zoom } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDateFilter, updateFilteredResultsThunk } from "../store/actions";

export default function GoBackFab() {
  const dispatch = useDispatch();
  const start = useSelector(state => state.filter.date.start);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filterMonth = start.getMonth();
  const filterYear = start.getFullYear();

  const filterIsOnCurrentMonth =
    currentMonth === filterMonth && currentYear === filterYear;

  const goBackToCurrentMonth = () => {
    dispatch(setDateFilter(new Date()));
    dispatch(updateFilteredResultsThunk());
  };

  return (
    <Zoom in={filterIsOnCurrentMonth === false}>
      <Fab
        sx={{ position: "fixed", bottom: "1rem", left: "1rem" }}
        color="secondary"
        onClick={goBackToCurrentMonth}
        variant="extended"
      >
        <ArrowBack sx={{ mr: 1 }} />
        Go back
      </Fab>
    </Zoom>
  );
}
