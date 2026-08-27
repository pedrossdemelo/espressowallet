import { sendEmailVerification, User } from "firebase/auth";

export default function sendVerificationEmail(user: User) {
  return sendEmailVerification(user, {
    // Keep verification links on whichever authorized origin is serving the
    // app (production, preview, or localhost) instead of baking in a domain.
    url: window.location.origin,
  });
}
