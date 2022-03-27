import { doc, increment, writeBatch } from "firebase/firestore";
import { calculateRate } from "utils";
import dateToMMYYYY from "utils/dateToMMYYYY";
import { auth, db } from "./firebase";

export default async function deleteTransaction(transaction) {
  const user = auth?.currentUser;
  if (!user) return;

  const { type: transactionType, id } = transaction;
  const { uid } = user;

  const docToDelete = doc(db, "userData", uid, transactionType + "s", id);

  const metadataToUpdate = doc(db, "userData", uid);

  const batch = writeBatch(db);

  batch.delete(docToDelete);

  // since we are deleting the transaction, the operators are reversed
  const operator = transaction.type === "expense" ? 1 : -1;

  const difference = calculateRate(transaction);

  const MMYYYY = dateToMMYYYY(transaction.createdAt);

  batch.set(
    metadataToUpdate,
    {
      balance: increment(operator * difference),
      [MMYYYY]: {
        balance: increment(operator * difference),
        [transactionType + "s"]: increment(-1),
        [transactionType + "Total"]: increment(-difference),
      },
    },
    { merge: true }
  );

  await batch.commit();
}
