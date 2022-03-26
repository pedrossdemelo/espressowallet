import { converter } from "constants";
import { doc, increment, writeBatch } from "firebase/firestore";
import { calculateRate } from "utils";
import dateToMMYYYY from "utils/dateToMMYYY";
import { auth, db } from "./firebase";

export default async function editTransaction(
  oldTransaction,
  updatedTransaction
) {
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

  const metadataToUpdate = doc(db, "userData", uid);

  const batch = writeBatch(db);

  batch.set(docToUpdate, updatedTransaction);

  const operator = updatedTransaction.type === "expense" ? -1 : 1;

  const newTotal = calculateRate(updatedTransaction);
  const oldTotal = calculateRate(oldTransaction);

  const difference = newTotal - oldTotal;

  const newMMYYYY = dateToMMYYYY(updatedTransaction.createdAt);
  const oldMMYYYY = dateToMMYYYY(oldTransaction.createdAt);

  if (newMMYYYY !== oldMMYYYY) {
    batch.set(
      metadataToUpdate,
      {
        balance: increment(operator * difference),
        [newMMYYYY]: {
          balance: increment(operator * newTotal),
          [transactionType + "s"]: increment(1),
          [transactionType + "Total"]: increment(newTotal),
        },
        [oldMMYYYY]: {
          balance: increment(operator * -oldTotal),
          [transactionType + "s"]: increment(-1),
          [transactionType + "Total"]: increment(-oldTotal),
        },
      },
      { merge: true }
    );
  }

  if (newMMYYYY === oldMMYYYY) {
    batch.set(
      metadataToUpdate,
      {
        balance: increment(operator * difference),
        [newMMYYYY]: {
          balance: increment(operator * difference),
          [transactionType + "s"]: increment(1),
          [transactionType + "Total"]: increment(difference),
        },
      },
      { merge: true }
    );
  }

  await batch.commit();
}
