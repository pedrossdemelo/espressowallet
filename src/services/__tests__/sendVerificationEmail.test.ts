import type { User } from "firebase/auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendEmailVerification = vi.hoisted(() => vi.fn());

vi.mock("firebase/auth", () => ({ sendEmailVerification }));

import sendVerificationEmail from "../sendVerificationEmail";

describe("sendVerificationEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("window", {
      location: { origin: "https://wallet.example" },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the origin currently serving the app", async () => {
    const user = {} as User;
    sendEmailVerification.mockResolvedValue(undefined);

    await sendVerificationEmail(user);

    expect(sendEmailVerification).toHaveBeenCalledWith(user, {
      url: "https://wallet.example",
    });
  });

  it("propagates delivery failures to the UI", async () => {
    sendEmailVerification.mockRejectedValue(new Error("rate limited"));

    await expect(sendVerificationEmail({} as User)).rejects.toThrow(
      "rate limited",
    );
  });
});
