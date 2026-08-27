import { FilteredExpenses } from "context";
import { useContext } from "react";
import TagBreakdownCard from "./TagBreakdownCard";

export default function ExpenseInfo() {
  const [expenses] = useContext(FilteredExpenses);
  return (
    <TagBreakdownCard title="Your expense sources" transactions={expenses} />
  );
}
