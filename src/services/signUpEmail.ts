import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import sendVerificationEmail from "./sendVerificationEmail";

export default async function signUpEmail(email: string, password: string) {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    try {
      await sendVerificationEmail(credentials.user);
      return { error: null, verificationError: null };
    } catch (err) {
      return {
        error: null,
        verificationError:
          err instanceof FirebaseError ? err.code : "auth/email-send-failed",
      };
    }
  } catch (err) {
    return {
      error: err instanceof FirebaseError ? err.code : undefined,
      verificationError: null,
    };
  }
}
