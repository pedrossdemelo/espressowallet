import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";

export default async function signUpEmail(email, password) {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    sendEmailVerification(credentials.user, {
      url: "http://localhost:3000/",
    });
    return { error: null };
  } catch ({ code }) {
    return { error: code };
  }
}
