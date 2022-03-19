import { Event } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import {
  FormControl,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDateFilter, updateFilteredResultsThunk } from "../store/actions";

export default function OverviewDate() {
  const dispatch = useDispatch();
  const { expenses, incomes } = useSelector(state => state.wallet);
  const { start } = useSelector(state => state.filter.date);
  const handleChange = newDate => {
    dispatch(setDateFilter(newDate));
    // We put the filter method inside a thunk so that
    // a large array of expenses can be filtered without
    // causing the app to freeze.
    dispatch(updateFilteredResultsThunk());
  };

  const [minDate, setMinDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      const combined = [...expenses, ...incomes];
      const minDate = combined.reduce((acc, curr) => {
        if (acc === undefined) return curr.createdAt;
        return curr.createdAt < acc.createdAt ? curr.createdAt : acc.createdAt;
      }, undefined);
      setMinDate(minDate);
    })();
  }, [expenses, incomes]);

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ mx: 3.5, mb: -0.5 }}
      >
        <Typography variant="h6">Overview</Typography>

        <DatePicker
          views={["year", "month"]}
          autoFocus
          value={start}
          onChange={handleChange}
          minDate={minDate}
          maxDate={new Date()}
          renderInput={params => (
            <FormControl style={{ maxWidth: "12em" }}>
              <Input
                disableUnderline
                inputProps={{
                  style: h6Style,
                }}
                endAdornment={
                  params.InputProps.endAdornment ?? (
                    <IconButton edge="end" sx={{ ml: 1 }}>
                      <Event />
                    </IconButton>
                  )
                }
                sx={{ textAlign: "right" }}
                ref={params.inputRef}
                {...params.inputProps}
              />
            </FormControl>
          )}
        />
      </Stack>
    </>
  );
}

const h6Style = {
  textAlign: "right",
  fontWeight: 500,
  fontSize: "1.25rem",
  lineHeight: 1.6,
  letterSpacing: "0.0075em",
};
