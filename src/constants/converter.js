import { Timestamp } from "firebase/firestore";

const converter = {
  toFirestore(transaction) {
    return {
      ...transaction,
      createdAt: Timestamp.fromDate(transaction.createdAt),
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
    };
  },
};

export default converter;
