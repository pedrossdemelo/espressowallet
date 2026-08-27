import { SetDateFilterAction } from "../store/reducers/filters";
import { DateRange } from "types";

export const setDateFilter = (
  payload: Date | DateRange
): SetDateFilterAction => ({
  type: "filter/setDateFilter",
  payload,
});
