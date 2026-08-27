import { doc, FirestoreDataConverter } from "firebase/firestore";
import { useAuth } from "hooks";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "services";
import { UserMetadata } from "types";

// `userData/{uid}` is never written through this converter (only read here),
// so this is a passthrough — it exists to give useDocumentData a real type.
const metadataConverter: FirestoreDataConverter<UserMetadata> = {
  toFirestore: data => data,
  fromFirestore: (snapshot, options) => snapshot.data(options),
};

export default function useUserMetadata() {
  const [user] = useAuth();

  // Non-null: matches the original code, which also assumed a signed-in
  // user here without guarding.
  const userData = doc(db, "userData", user!.uid).withConverter(
    metadataConverter
  );

  const [data, loading, error] = useDocumentData(userData);

  return [data ?? {}, loading, error] as const;
}
