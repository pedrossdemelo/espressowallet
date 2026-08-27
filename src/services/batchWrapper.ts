import {
  DocumentData,
  QuerySnapshot,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

type BatchAction = "delete" | "update" | "set" | "setmerge";

// Overloads: "delete" needs no update payload, but "update"/"set"/"setmerge"
// require one — a caller that forgets it fails to compile instead of
// silently queuing no writes at all.
export default function batchWrapper(
  documentRef: QuerySnapshot<DocumentData>,
  action: "delete",
): Promise<void>;
export default function batchWrapper(
  documentRef: QuerySnapshot<DocumentData>,
  action: "update" | "set" | "setmerge",
  update: Record<string, unknown>,
): Promise<void>;
export default async function batchWrapper(
  documentRef: QuerySnapshot<DocumentData>,
  action: BatchAction,
  update?: Record<string, unknown>,
): Promise<void> {
  const batchArray: WriteBatch[] = [];
  batchArray.push(writeBatch(db));
  let operationCounter = 0;
  let batchIndex = 0;

  documentRef.forEach(doc => {
    if (action === "delete") {
      batchArray[batchIndex].delete(doc.ref);
    }
    if (action === "update" && update) {
      batchArray[batchIndex].update(doc.ref, update);
    }
    if (action === "set" && update) {
      batchArray[batchIndex].set(doc.ref, update);
    }
    if (action === "setmerge" && update) {
      batchArray[batchIndex].set(doc.ref, update, { merge: true });
    }
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(writeBatch(db));
      batchIndex++;
      operationCounter = 0;
    }
  });

  await Promise.all(batchArray.map(batch => batch.commit()));
}
