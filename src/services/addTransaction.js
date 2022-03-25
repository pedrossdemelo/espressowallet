import { converter } from "constants";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function addTransaction(newTransaction) {
  const user = auth?.currentUser;
  if (!user) return;

  const { type: transactionType } = newTransaction;
  const { uid } = user;

  const collectionToAdd = collection(
    db,
    "userData",
    uid,
    transactionType + "s"
  ).withConverter(converter);

  addDoc(collectionToAdd, newTransaction);
}
