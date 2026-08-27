import { describe, expect, it, vi } from "vitest";
import createSubmissionLock from "../createSubmissionLock";

describe("createSubmissionLock", () => {
  it("ignores repeated submissions until the active one finishes", async () => {
    let finish!: () => void;
    const pending = new Promise<void>(resolve => {
      finish = resolve;
    });
    const operation = vi.fn(() => pending);
    const runOnce = createSubmissionLock();

    const first = runOnce(operation);
    const duplicates = Array.from({ length: 999 }, () => runOnce(operation));

    expect(operation).toHaveBeenCalledOnce();
    await expect(Promise.all(duplicates)).resolves.toEqual(
      Array(999).fill(undefined),
    );

    finish();
    await first;
    await runOnce(operation);

    expect(operation).toHaveBeenCalledTimes(2);
  });
});
