import { converter } from "constants";
import { collection, doc, increment, writeBatch } from "firebase/firestore";
import { calculateRate } from "utils";
import dateToMMYYYY from "utils/dateToMMYYY";
import { auth, db } from "./firebase";

export default async function addTransaction(newTransaction) {
  const user = auth?.currentUser;
  if (!user) return;

  const { type: transactionType } = newTransaction;
  const { uid } = user;

  const collectionToAdd = doc(
    collection(db, "userData", uid, transactionType + "s").withConverter(
      converter
    )
  );

  const metadataToUpdate = doc(db, "userData", uid);

  const batch = writeBatch(db);

  batch.set(collectionToAdd, newTransaction);

  const operator = newTransaction.type === "expense" ? -1 : 1;

  const total = calculateRate(newTransaction);

  const MMYYYY = dateToMMYYYY(newTransaction.createdAt);

  batch.set(
    metadataToUpdate,
    {
      balance: increment(operator * total),
      [MMYYYY]: {
        balance: increment(operator * total),
        [transactionType + "s"]: increment(1),
        [transactionType + "Total"]: increment(total)
      },
    },
    { merge: true }
  );

  await batch.commit();
}
