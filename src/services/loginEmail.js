import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";


export default async function loginEmail(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { error: null };
  } catch ({ code }) {
    return { error: code };
  }
}
