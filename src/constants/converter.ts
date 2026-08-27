import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { Transaction } from "types";

// The raw document shape as it's actually stored: same as Transaction, but
// createdAt is a Firestore Timestamp until fromFirestore converts it.
type StoredTransaction = Omit<Transaction, "createdAt"> & {
  createdAt: Timestamp;
};

const converter: FirestoreDataConverter<Transaction> = {
  toFirestore(transaction: Transaction) {
    return {
      ...transaction,
      value: Number(transaction.value),
      createdAt: Timestamp.fromDate(transaction.createdAt),
    };
  },
  fromFirestore(snapshot, options) {
    // Raw, unvalidated document data coming off the wire — the cast reflects
    // the same trust the original JS placed in it, just made explicit.
    const transaction = snapshot.data(options) as StoredTransaction;
    return {
      ...transaction,
      value: Number(transaction.value),
      createdAt: transaction.createdAt.toDate(),
    };
  },
};

export default converter;
