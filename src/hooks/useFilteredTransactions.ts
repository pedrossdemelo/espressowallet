import { FilteredExpenses, FilteredIncomes } from "context";
import { useContext } from "react";
import { TransactionWithId } from "types";

const defaultSort = (a: TransactionWithId, b: TransactionWithId) =>
  b.createdAt.getTime() - a.createdAt.getTime();

interface UseFilteredTransactionsOptions {
  sort?: (a: TransactionWithId, b: TransactionWithId) => number;
  filter?: (transaction: TransactionWithId) => boolean;
}

export default function useFilteredTransactions({
  sort = defaultSort,
  filter,
}: UseFilteredTransactionsOptions = {}) {
  const [incomes, loadingInc, errorInc] = useContext(FilteredIncomes);
  const [expenses, loadingExp, errorExp] = useContext(FilteredExpenses);

  const loading = loadingInc || loadingExp;
  const error = errorInc || errorExp;

  let transactions = [...incomes, ...expenses];
  transactions.sort(sort);

  if (filter) {
    transactions = transactions.filter(filter);
  }

  return [transactions ?? [], loading, error] as const;
}
