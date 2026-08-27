import { Tag, TransactionWithId } from "types";
import TransactionFormDrawer from "./TransactionFormDrawer";

const tagInputs: Tag[] = [
  "Investments",
  "Salary",
  "Gift",
  "Savings",
  "Prize",
  "Sale",
  "Other",
];

interface IncomeFormDrawerProps {
  open: boolean;
  close: () => void;
  toEdit?: TransactionWithId | null;
}

export default function IncomeFormDrawer(props: IncomeFormDrawerProps) {
  return (
    <TransactionFormDrawer
      {...props}
      type="income"
      tagInputs={tagInputs}
      defaultTag="Salary"
      defaultValue={1000}
      borderRadius="12px 12px 0 0"
    />
  );
}
