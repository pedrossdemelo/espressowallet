import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services";

export default function useAuth() {
  const [user, loading, error] = useAuthState(auth);

  return [user, loading, error];
}