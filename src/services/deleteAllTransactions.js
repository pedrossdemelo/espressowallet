import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export default async function deleteAllTransactions() {
  const user = auth?.currentUser;
  if (!user) return;

  const { uid } = user;

  const allExpenses = await getDocs(
    collection(db, "userData", uid, "expenses")
  );
  const allIncomes = await getDocs(collection(db, "userData", uid, "incomes"));

  const metadataToUpdate = doc(db, "userData", uid);

  await setDoc(metadataToUpdate, {
    balance: 0,
  });

  await batchWrapper(allExpenses, "delete");

  await batchWrapper(allIncomes, "delete");

  return;
}

const batchWrapper = async (documentRef, action, update) => {
  const batchArray = [];
  batchArray.push(writeBatch(db));
  let operationCounter = 0;
  let batchIndex = 0;

  documentRef.forEach(doc => {
    console.log("Org cleanup: deleting notifications", doc.id);
    if (action === "delete") {
      batchArray[batchIndex].delete(doc.ref);
    }
    if (action === "update") {
      batchArray[batchIndex].update(doc.ref, update);
    }
    if (action === "set") {
      batchArray[batchIndex].set(doc.ref, update);
    }
    if (action === "setmerge") {
      batchArray[batchIndex].set(doc.ref, update, { merge: true });
    }
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });

  batchArray.forEach(async batch => await batch.commit());
  return;
};
