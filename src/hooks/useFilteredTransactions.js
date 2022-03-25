import {
  FilteredExpenses,
  FilteredIncomes,
} from "components/FilteredUserDataProvider";
import { useContext } from "react";

const defaultSort = (a, b) => b.createdAt - a.createdAt;

export default function useFilteredTransactions({
  sort = defaultSort,
  filter,
} = {}) {
  const [incomes, loadingInc, errorInc] = useContext(FilteredIncomes);
  const [expenses, loadingExp, errorExp] = useContext(FilteredExpenses);

  const loading = loadingInc || loadingExp;
  const error = errorInc || errorExp;

  let transactions = [...incomes, ...expenses];
  transactions.sort(sort);

  if (filter) {
    transactions = transactions.filter(filter);
  }

  return [transactions ?? [], loading, error];
}
