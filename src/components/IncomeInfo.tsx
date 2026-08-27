import { FilteredIncomes } from "context";
import { useContext } from "react";
import TagBreakdownCard from "./TagBreakdownCard";

export default function IncomeInfo() {
  const [incomes] = useContext(FilteredIncomes);
  return (
    <TagBreakdownCard title="Your income sources" transactions={incomes} />
  );
}
