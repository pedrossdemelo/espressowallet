import { Timestamp } from "firebase/firestore";

const converter = {
  toFirestore(transaction) {
    return {
      ...transaction,
      createdAt: Timestamp.fromDate(transaction.createdAt),
    };
  },
  fromFirestore(snapshot, options) {
    const transaction = snapshot.data(options);
    return {
      ...transaction,
      createdAt: transaction.createdAt.toDate(),
    };
  },
};

export default converter;
