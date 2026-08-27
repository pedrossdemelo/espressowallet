import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
  Event,
} from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { Card, FormControl, IconButton, Input, Stack } from "@mui/material";
import { setDateFilter } from "actions";
import { useMode, useUserData } from "hooks";
import { ReactNode, Ref, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTextWidth } from "utils";

// @mui/lab's DatePicker ships its props as `Record<any, any>` (the
// component is deprecated in favor of @mui/x-date-pickers), so renderInput
// gets no real typing from the library — this covers what's used below.
interface DatePickerRenderInputParams {
  inputRef?: Ref<HTMLInputElement>;
  inputProps?: Record<string, unknown>;
  InputProps?: { endAdornment?: ReactNode };
}

const getFirstDateByMonthAndYear = (date1: Date, date2: Date): Date => {
  const month1 = date1.getMonth();
  const month2 = date2.getMonth();
  const year1 = date1.getFullYear();
  const year2 = date2.getFullYear();
  if (month1 === month2 && year1 === year2) return date1;
  if (year1 > year2) return date2;
  if (year1 < year2) return date1;
  if (month1 > month2) return date2;
  if (month1 < month2) return date1;
  return date1;
};

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

export default function OverviewDate() {
  const { theme } = useMode();

  const dispatch = useDispatch();

  const { start } = useSelector(state => state.filter.date);

  const handleChange = (newDate: Date | null) => {
    // Non-null: matches the original, which also dispatched whatever the
    // picker passed without guarding against a cleared (null) date.
    dispatch(setDateFilter(newDate as Date));
  };

  const firstExpense = useUserData("expenses", {
    currentDateFilters: false,
    limit: 1,
  })[0]?.[0];

  const firstIncome = useUserData("incomes", {
    currentDateFilters: false,
    limit: 1,
  })[0]?.[0];

  const dateWidth = useMemo(() => {
    const month = months[start.getMonth()];
    const year = start.getFullYear();
    const result = `${month} ${year}..`;
    // Safari doesn't resolve rem in detached canvas elements, so convert to px explicitly
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const fontSizePx = `${
      parseFloat(String(theme.typography.h6.fontSize)) * rootFontSize
    }px`;
    return getTextWidth(
      result,
      `${fontSizePx} ${theme.typography.h6.fontFamily}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  let firstTransaction: Date;

  if (firstExpense?.createdAt && firstIncome?.createdAt) {
    firstTransaction =
      firstExpense.createdAt < firstIncome.createdAt
        ? firstExpense.createdAt
        : firstIncome.createdAt;
  } else {
    firstTransaction =
      firstExpense?.createdAt || firstIncome?.createdAt || new Date();
  }

  const hasPreviousMonth = useMemo(() => {
    const newDate = new Date(start);
    newDate.setMonth(newDate.getMonth() - 1);
    if (
      getFirstDateByMonthAndYear(firstTransaction, newDate) !== firstTransaction
    )
      return false;
    return true;
  }, [start, firstTransaction]);

  const hasNextMonth = useMemo(() => {
    const newDate = new Date(start);
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate > new Date()) return false;
    return true;
  }, [start]);

  const goToPreviousMonth = () => {
    const newDate = new Date(start);
    newDate.setMonth(newDate.getMonth() - 1);
    if (!hasPreviousMonth) return;
    dispatch(setDateFilter(newDate));
  };

  const goToNextMonth = () => {
    const newDate = new Date(start);
    newDate.setMonth(newDate.getMonth() + 1);
    if (!hasNextMonth) return;
    dispatch(setDateFilter(newDate));
  };

  return (
    <>
      <Card sx={{ mx: 2, borderRadius: 2 }}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          px={2}
          py={0.5}
        >
          <IconButton
            disabled={!hasPreviousMonth}
            onClick={goToPreviousMonth}
            edge="start"
          >
            <ArrowBackIosRounded />
          </IconButton>

          <DatePicker
            views={["year", "month"]}
            autoFocus
            value={start}
            onChange={handleChange}
            minDate={firstTransaction}
            maxDate={new Date()}
            disableFuture
            renderInput={(params: DatePickerRenderInputParams) => (
              <FormControl>
                <Input
                  disableUnderline
                  inputProps={{
                    sx: {
                      ...theme.typography.h6,
                      pointerEvents: "none",
                      width: dateWidth,
                      overflow: "visible",
                      flexShrink: 0,
                    },
                  }}
                  endAdornment={
                    params.InputProps?.endAdornment ?? (
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

          <IconButton
            disabled={!hasNextMonth}
            onClick={goToNextMonth}
            edge="end"
          >
            <ArrowForwardIosRounded />
          </IconButton>
        </Stack>
      </Card>
    </>
  );
}
