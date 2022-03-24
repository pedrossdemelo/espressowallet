import { signOut } from "firebase/auth";
import { auth } from "./firebase";


export default async function logout() {
  return signOut(auth);
}
