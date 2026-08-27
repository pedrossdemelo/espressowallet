import { describe, expect, it } from "vitest";
import dateToMMYYYY from "../dateToMMYYYY";
import formatLongNumber from "../formatLongNumber";

describe("formatLongNumber", () => {
  it("keeps small numbers at two decimals", () => {
    expect(formatLongNumber(0)).toBe("0.00");
    expect(formatLongNumber(42.567)).toBe("42.57");
  });

  it("abbreviates by magnitude", () => {
    expect(formatLongNumber(2_000_000_000_000)).toBe("2.00T");
    expect(formatLongNumber(2_000_000_000)).toBe("2.00B");
    expect(formatLongNumber(2_000_000)).toBe("2.00M");
    expect(formatLongNumber(200_001)).toBe("200.00K");
  });

  it("does not abbreviate negatives, matching current behavior", () => {
    // Every magnitude branch tests `> 1`, so negatives fall through to toFixed.
    expect(formatLongNumber(-2_000_000)).toBe("-2000000.00");
  });
});

describe("dateToMMYYYY", () => {
  it("builds the month key used for Firestore rollups", () => {
    expect(dateToMMYYYY(new Date(2026, 0, 15))).toBe("1/2026");
    expect(dateToMMYYYY(new Date(2026, 11, 31))).toBe("12/2026");
  });
});
