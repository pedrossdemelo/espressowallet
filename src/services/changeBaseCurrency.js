import { doc, writeBatch } from "firebase/firestore";
import { auth, db } from "./firebase";

export default async function changeBaseCurrency(oldCurrency, newCurrency) {
  const [user] = auth?.currentUser;
  if (!user) return;

  const { uid } = user;

  const metadataToUpdate = doc(db, "userData", uid);

  const batch = writeBatch(db);
}
