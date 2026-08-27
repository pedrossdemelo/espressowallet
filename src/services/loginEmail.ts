import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "services";

export default async function loginEmail(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { error: null };
  } catch (err) {
    return { error: err instanceof FirebaseError ? err.code : undefined };
  }
}
