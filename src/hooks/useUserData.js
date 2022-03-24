import {
  collection,
  orderBy,
  query,
  Timestamp,
  where,
  limit as limitQuery,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { db } from "../services";
import useAuth from "./useAuth";

const transactionConverter = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      id: snapshot.id,
    };
  },
};

export default function useUserData(
  type,
  {
    currentDateFilters = true,
    extraFilters = [],
    order = ["createdAt"],
    limit = null,
    converter = transactionConverter,
  } = {}
) {
  const [user] = useAuth();

  let { start, end } = useSelector(state => state.filter.date);
  start = Timestamp.fromDate(start);
  end = Timestamp.fromDate(end);

  const userData = collection(db, `userData/${user.uid}/${type}`).withConverter(
    converter
  );

  const filters =
    currentDateFilters || extraFilters
      ? [
          ...(currentDateFilters
            ? [where("createdAt", ">=", start), where("createdAt", "<=", end)]
            : []),
          ...extraFilters.map(([field, operator, value]) =>
            where(field, operator, value)
          ),
        ]
      : [];

  const orders = order ? [orderBy(...order)] : [];

  const limits = limit ? [limitQuery(limit)] : [];

  const filteredQuery = query(userData, ...filters, ...orders, ...limits);

  const [expenses, loading, error] = useCollectionData(filteredQuery);

  return [expenses ?? [], loading, error];
}
