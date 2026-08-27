export interface AuthFieldErrors {
  emailError: string;
  passwordError: string;
}

// A single space keeps MUI's helperText slot occupied so the form doesn't
// jump by a line the first time an error appears.
export const noAuthErrors: AuthFieldErrors = {
  emailError: " ",
  passwordError: " ",
};

const messages: Record<string, string> = {
  "auth/email-already-in-use":
    "That email already has an account. Log in instead.",
  "auth/invalid-email": "That email address isn't valid.",
  "auth/user-disabled": "That account has been disabled.",
  "auth/user-not-found": "No account exists for that email.",
  "auth/wrong-password": "Wrong password.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/too-many-requests":
    "Too many attempts. Wait a moment before trying again.",
  "auth/network-request-failed":
    "Couldn't reach the server. Check your connection.",
  "auth/popup-closed-by-user": "The sign-in window closed before finishing.",
  "auth/popup-blocked": "Your browser blocked the sign-in window.",
  "auth/account-exists-with-different-credential":
    "That email is already registered with a different sign-in method.",
};

// Codes carrying no useful wording of their own still need to say something,
// because a signup that fails silently reads as a broken button.
const fallback = "Something went wrong. Please try again.";

/**
 * Maps a Firebase auth error code onto the login form's two helper texts.
 *
 * The code is whatever the auth services hand back: `auth/<reason>` for a
 * FirebaseError, or `undefined` when the failure wasn't one (a network or
 * programming error). Both must produce a visible message.
 */
export default function authErrorMessage(
  code: string | null | undefined,
): AuthFieldErrors {
  const known = code ? messages[code] : undefined;
  const message = known ?? humanize(code) ?? fallback;

  return /password/i.test(message)
    ? { ...noAuthErrors, passwordError: message }
    : { ...noAuthErrors, emailError: message };
}

// Unmapped codes are still more informative than the generic fallback:
// "auth/quota-exceeded" reads better as "Quota exceeded".
function humanize(code: string | null | undefined): string | undefined {
  if (!code) return undefined;
  const reason = code.includes("/") ? code.slice(code.indexOf("/") + 1) : code;
  const words = reason.replace(/[-_]/g, " ").trim();
  if (!words) return undefined;
  return words.charAt(0).toUpperCase() + words.slice(1);
}
