import { converter as baseConverter } from "constants";
import { StoredTransaction } from "constants/converter";
import {
  collection,
  FirestoreDataConverter,
  limit as limitQuery,
  orderBy,
  OrderByDirection,
  query,
  Timestamp,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { TransactionCollection, TransactionWithId } from "types";
import { db } from "../services";
import useAuth from "./useAuth";

const transactionConverter: FirestoreDataConverter<TransactionWithId> = {
  // Never actually called — this converter is only ever used for reads.
  toFirestore: baseConverter.toFirestore,
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options) as StoredTransaction;
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      id: snapshot.id,
    };
  },
};

interface UseUserDataOptions {
  currentDateFilters?: boolean;
  extraFilters?: [string, WhereFilterOp, unknown][];
  order?: [string, OrderByDirection?];
  limit?: number | null;
  converter?: FirestoreDataConverter<TransactionWithId>;
}

export default function useUserData(
  type: TransactionCollection,
  {
    currentDateFilters = true,
    extraFilters = [],
    order = ["createdAt"],
    limit = null,
    converter = transactionConverter,
  }: UseUserDataOptions = {}
) {
  const [user] = useAuth();

  const { start, end } = useSelector(state => state.filter.date);
  const startTimestamp = Timestamp.fromDate(start);
  const endTimestamp = Timestamp.fromDate(end);

  // Non-null: matches the original code, which also assumed a signed-in user
  // here without guarding — this hook is only ever used once auth resolves.
  const userData = collection(
    db,
    `userData/${user!.uid}/${type}`
  ).withConverter(converter);

  const filters =
    currentDateFilters || extraFilters
      ? [
          ...(currentDateFilters
            ? [
                where("createdAt", ">=", startTimestamp),
                where("createdAt", "<=", endTimestamp),
              ]
            : []),
          ...extraFilters.map(([field, operator, value]) =>
            where(field, operator, value)
          ),
        ]
      : [];

  const orders = order ? [orderBy(...order)] : [];

  const limits = limit ? [limitQuery(limit)] : [];

  const filteredQuery = query(userData, ...filters, ...orders, ...limits);

  const [data, loading, error] = useCollectionData(filteredQuery);

  return [data ?? [], loading, error] as const;
}
