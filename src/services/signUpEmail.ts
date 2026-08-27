import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";

export default async function signUpEmail(email: string, password: string) {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    sendEmailVerification(credentials.user, {
      url: "http://www.espressowallet.com/",
    });
    return { error: null };
  } catch (err) {
    return { error: err instanceof FirebaseError ? err.code : undefined };
  }
}
