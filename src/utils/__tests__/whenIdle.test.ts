import { afterEach, describe, expect, it, vi } from "vitest";
import whenIdle from "../whenIdle";

const stubWindow = (value: unknown) => {
  vi.stubGlobal("window", value);
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("whenIdle", () => {
  it("hands the work to requestIdleCallback with a timeout", () => {
    const requestIdleCallback = vi.fn();
    stubWindow({ requestIdleCallback, setTimeout: vi.fn() });

    const work = vi.fn();
    whenIdle(work, 2500);

    expect(requestIdleCallback).toHaveBeenCalledWith(work, { timeout: 2500 });
    expect(work).not.toHaveBeenCalled();
  });

  // Safari only shipped requestIdleCallback in 17, and this app is a PWA
  // people install on phones.
  it("falls back to a timer when requestIdleCallback is missing", () => {
    const setTimeout = vi.fn();
    stubWindow({ setTimeout });

    const work = vi.fn();
    whenIdle(work, 4000);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout.mock.calls[0][0]).toBe(work);
    expect(setTimeout.mock.calls[0][1]).toBeLessThanOrEqual(1000);
  });

  it("never runs the work synchronously", () => {
    stubWindow({ setTimeout: vi.fn() });

    const work = vi.fn();
    whenIdle(work);

    expect(work).not.toHaveBeenCalled();
  });
});
