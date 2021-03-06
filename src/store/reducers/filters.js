import { getMonthRange } from "../../utils";

const { start, end } = getMonthRange(new Date());

const initialState = {
  date: { start, end },
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case "filter/setDateFilter":
      let range;

      if (action.payload instanceof Date) {
        range = getMonthRange(action.payload);
      } else {
        range = action.payload;
      }

      return {
        ...state,
        date: range,
      };

    default:
      return state;
  }
}
