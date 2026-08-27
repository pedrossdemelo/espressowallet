import { describe, expect, it } from "vitest";
import getMonthRange from "../getMonthRange";

describe("getMonthRange", () => {
  it("spans the first to the last millisecond of the month", () => {
    const { start, end } = getMonthRange(new Date(2026, 1, 14, 13, 30));

    expect(start).toEqual(new Date(2026, 1, 1, 0, 0, 0, 0));
    expect(end).toEqual(new Date(2026, 1, 28, 23, 59, 59, 999));
  });

  it("handles a leap February", () => {
    const { end } = getMonthRange(new Date(2024, 1, 10));
    expect(end.getDate()).toBe(29);
  });

  it("handles December without rolling into the wrong year", () => {
    const { start, end } = getMonthRange(new Date(2026, 11, 5));

    expect(start).toEqual(new Date(2026, 11, 1, 0, 0, 0, 0));
    expect(end).toEqual(new Date(2026, 11, 31, 23, 59, 59, 999));
  });

  it("does not mutate the date it is given", () => {
    const input = new Date(2026, 5, 17, 8, 0);
    const snapshot = input.getTime();
    getMonthRange(input);
    expect(input.getTime()).toBe(snapshot);
  });
});
