import { Timestamp } from "firebase/firestore";

const converter = {
  toFirestore(transaction) {
    return {
      ...transaction,
      value: Number(transaction.value),
      createdAt: Timestamp.fromDate(transaction.createdAt),
    };
  },
  fromFirestore(snapshot, options) {
    const transaction = snapshot.data(options);
    return {
      ...transaction,
      value: Number(transaction.value),
      createdAt: transaction.createdAt.toDate(),
    };
  },
};

export default converter;
