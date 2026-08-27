import { describe, expect, it } from "vitest";
import getWalletDataStatus from "../walletDataStatus";

describe("getWalletDataStatus", () => {
  it("keeps empty results in loading state until every query resolves", () => {
    expect(getWalletDataStatus([false, true, false], [null, null])).toBe(
      "loading",
    );
  });

  it("gives query failures precedence over loading and empty data", () => {
    expect(
      getWalletDataStatus([true, false], [new Error("offline"), null]),
    ).toBe("error");
  });

  it("is ready only after all queries resolve without an error", () => {
    expect(getWalletDataStatus([false, false, false], [null, undefined])).toBe(
      "ready",
    );
  });
});
