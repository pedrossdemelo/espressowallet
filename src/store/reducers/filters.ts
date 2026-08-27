import { DateRange } from "types";
import { getMonthRange } from "../../utils";

const { start, end } = getMonthRange(new Date());

const initialState = {
  date: { start, end } as DateRange,
};

export interface SetDateFilterAction {
  type: "filter/setDateFilter";
  payload: Date | DateRange;
}

export type FilterAction = SetDateFilterAction;

export default function filterReducer(
  state = initialState,
  action: FilterAction
) {
  switch (action.type) {
    case "filter/setDateFilter": {
      const range =
        action.payload instanceof Date
          ? getMonthRange(action.payload)
          : action.payload;

      return {
        ...state,
        date: range,
      };
    }

    default:
      return state;
  }
}
