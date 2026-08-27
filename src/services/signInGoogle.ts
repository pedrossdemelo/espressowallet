import { FirebaseError } from "firebase/app";
import { signInWithPopup } from "firebase/auth";
import { auth, gProvider } from "./firebase";

export default async function signInGoogle() {
  try {
    await signInWithPopup(auth, gProvider);
    return { error: null };
  } catch (err) {
    return { error: err instanceof FirebaseError ? err.code : undefined };
  }
}
