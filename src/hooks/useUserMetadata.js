import { doc } from "firebase/firestore";
import { useAuth } from "hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "services";

export default function useUserMetadata() {
  const [user] = useAuth();

  const userData = doc(db, "userData", user.uid);

  const [data, loading, error] = useDocumentData(userData);

  return [data ?? {}, loading, error];
}
