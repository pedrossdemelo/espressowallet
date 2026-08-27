import { describe, expect, it } from "vitest";
import swipeAction, { swipeThreshold } from "../swipeAction";

const width = 400;

describe("swipeAction", () => {
  it("does nothing for a drag that stays under the threshold", () => {
    expect(swipeAction(width * (swipeThreshold - 0.01), width)).toBeNull();
    expect(swipeAction(-width * (swipeThreshold - 0.01), width)).toBeNull();
    expect(swipeAction(0, width)).toBeNull();
  });

  it("reports the start action once dragged far enough that way", () => {
    expect(swipeAction(width * swipeThreshold, width)).toBe("start");
    expect(swipeAction(width * 0.9, width)).toBe("start");
  });

  it("reports the end action for the opposite direction", () => {
    expect(swipeAction(-width * swipeThreshold, width)).toBe("end");
    expect(swipeAction(-width * 0.9, width)).toBe("end");
  });

  it("scales with the row width rather than using fixed pixels", () => {
    expect(swipeAction(60, 200)).toBe("start");
    expect(swipeAction(60, 1000)).toBeNull();
  });

  // A row can be measured at zero width before layout settles; dividing by it
  // would make every touch look like a full swipe.
  it("refuses to act on an unmeasured row", () => {
    expect(swipeAction(120, 0)).toBeNull();
    expect(swipeAction(120, Number.NaN)).toBeNull();
    expect(swipeAction(Number.NaN, width)).toBeNull();
  });
});
