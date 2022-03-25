import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function deleteTransaction(transaction) {
  const user = auth?.currentUser;
  if (!user) return;

  const { type: transactionType, id } = transaction;
  const { uid } = user;

  console.log(uid);

  const docToDelete = doc(db, "userData", uid, transactionType + "s", id);

  deleteDoc(docToDelete);
}
