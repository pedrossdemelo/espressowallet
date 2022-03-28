import { signInWithPopup } from "firebase/auth";
import { auth, gProvider } from "./firebase";

export default async function signInGoogle() {
  try {
    await signInWithPopup(auth, gProvider);
    return { error: null };
  } catch ({ code }) {
    return { error: code };
  }
}
