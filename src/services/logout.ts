import { signOut } from "firebase/auth";
import { auth } from "services";

export default async function logout() {
  return signOut(auth);
}
