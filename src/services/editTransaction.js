import { converter } from "constants";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function editTransaction(updatedTransaction) {
  const user = auth?.currentUser;
  if (!user) return;

  const { type: transactionType, id } = updatedTransaction;
  const { uid } = user;

  const docToUpdate = doc(
    db,
    "userData",
    uid,
    transactionType + "s",
    id
  ).withConverter(converter);

  updateDoc(docToUpdate, updatedTransaction);
}
