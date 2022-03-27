import { writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export default async function batchWrapper(documentRef, action, update) {
  const batchArray = [];
  batchArray.push(writeBatch(db));
  let operationCounter = 0;
  let batchIndex = 0;

  documentRef.forEach(doc => {
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
      batchArray.push(writeBatch(db));
      batchIndex++;
      operationCounter = 0;
    }
  });

  batchArray.forEach(async batch => await batch.commit());
  return;
}
