import { describe, expect, it } from "vitest";
import authErrorMessage, { noAuthErrors } from "../authErrorMessage";

describe("authErrorMessage", () => {
  it("explains an email that already has an account", () => {
    const { emailError, passwordError } = authErrorMessage(
      "auth/email-already-in-use",
    );

    expect(emailError).toContain("already has an account");
    expect(passwordError).toBe(noAuthErrors.passwordError);
  });

  it("puts password problems under the password field", () => {
    const { emailError, passwordError } =
      authErrorMessage("auth/weak-password");

    expect(passwordError).toContain("6 characters");
    expect(emailError).toBe(noAuthErrors.emailError);
  });

  // The previous implementation did `code.split("/")[1].split("-")`, which
  // threw on any code without a slash and swallowed the whole submit handler.
  it("handles codes with no slash instead of throwing", () => {
    expect(() => authErrorMessage("quota-exceeded")).not.toThrow();
    expect(authErrorMessage("quota-exceeded").emailError).toBe(
      "Quota exceeded",
    );
  });

  // Non-Firebase failures arrive as undefined; showing nothing at all made a
  // failed signup look like a dead button.
  it("always produces a visible message", () => {
    for (const code of [undefined, null, "", "auth/", "auth/unmapped-code"]) {
      const { emailError, passwordError } = authErrorMessage(code);
      const shown = emailError.trim() || passwordError.trim();
      expect(shown.length).toBeGreaterThan(0);
    }
  });
});
