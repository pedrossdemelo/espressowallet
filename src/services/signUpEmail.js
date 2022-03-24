import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function signUpEmail(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { error: null };
  } catch ({ code }) {
    return { error: code };
  }
}
